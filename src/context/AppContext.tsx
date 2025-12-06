import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  pix_key?: string;
  bybit_uid?: string;
  usdt_address?: string;
  status: 'pending' | 'active' | 'rejected';
  available_balance: number;
  invested_balance: number;
  profit_balance: number;
  role: 'user' | 'admin';
  restricted?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'profit';
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  amount: number;
  reference?: string;
  proof_url?: string;
  processed_by?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    name: string;
    email: string;
  };
}

export interface InvestmentPlan {
  id: string;
  name: string;
  amount: number;
  daily_return_rate: number;
  duration_days: number;
  description: string;
  theme: string;
  recommended: boolean;
}

export interface SystemSettings {
  id: number;
  pix_key: string;
  pix_name?: string;
  pix_bank?: string;
  bybit_uid: string;
  usdt_address: string;
  withdrawal_fee_enabled?: boolean;
  withdrawal_fee_amount?: number;
  withdrawal_fee_mode?: 'deduct' | 'deposit';
}

export interface FeeRequest {
  id: string;
  user_id: string;
  related_withdrawal_id?: string;
  amount: number;
  proof_url?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  created_at: string;
  updated_at: string;
  expires_at: string;
  profiles?: {
    name: string;
    email: string;
  };
}

interface AppContextType {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  investmentPlans: InvestmentPlan[];
  refreshProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Generate investment plans from R$ 200 to R$ 5,000 in R$ 100 increments
// Profit: R$ 20 for every R$ 100 invested (distributed every 3 hours)
export const generateInvestmentPlans = (): InvestmentPlan[] => {
  const plans: InvestmentPlan[] = [];
  for (let amount = 200; amount <= 5000; amount += 100) {
    plans.push({
      id: `plan-${amount}`,
      name: `Plano R$ ${amount}`,
      amount,
      daily_return_rate: 0, // Not used anymore, profit is R$ 20 per R$ 100 every 3 hours
      duration_days: 1, // User selects 1-7 days
      description: `Investimento de ${amount} reais`,
      theme: amount === 500 ? 'slate' : 'amber',
      recommended: amount === 500
    });
  }
  return plans;
};

export const investmentPlans: InvestmentPlan[] = generateInvestmentPlans();

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchProfile = useCallback(async (currentSession: Session) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentSession.user.id)
        .single();

      if (error) {
        console.error('Error fetching profile from Supabase:', error);
        throw error;
      }

      if (data) {
        // Check role from user_roles table (secure)
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', currentSession.user.id)
          .single();

        if (roleError) {
          console.error('Error fetching user role from Supabase:', roleError);
          // Continue with default 'user' role if role fetch fails
          // This ensures users can still access the app even if role table has issues
        }

        setProfile({ ...data, role: roleData?.role || 'user' } as Profile);
        setIsAdmin(roleData?.role === 'admin');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Show generic error message as it could be various types of errors
      toast.error('Erro ao carregar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (session) {
      await fetchProfile(session);
    }
  }, [session, fetchProfile]);

  useEffect(() => {
    // Initial session check with error handling
    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting Supabase session:', error);
          toast.error('Erro ao conectar. Tente novamente.');
          setLoading(false);
          return;
        }
        
        setSession(session);
        if (session) {
          fetchProfile(session);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to get Supabase session:', error);
        toast.error('Erro ao iniciar sessão. Recarregue a página.');
        setLoading(false);
      }
    };
    
    initSession();

    // Auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session);
      } else {
        setProfile(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  // Realtime subscription for profile changes
  useEffect(() => {
    if (!session) return;

    const channel = supabase
      .channel('profile_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${session.user.id}`,
        },
        () => {
          console.log('Profile updated in realtime, refreshing...');
          fetchProfile(session);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, fetchProfile]);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logout realizado com sucesso!');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  return (
    <AppContext.Provider
      value={{
        session,
        profile,
        loading,
        isAdmin,
        investmentPlans,
        refreshProfile,
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
