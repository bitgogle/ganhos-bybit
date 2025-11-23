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
  bybit_uid: string;
  usdt_address: string;
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

export const investmentPlans: InvestmentPlan[] = [
  {
    id: 'bronze',
    name: 'Plano Bronze',
    amount: 100,
    daily_return_rate: 0.015,
    duration_days: 30,
    description: 'Ideal para quem está começando',
    theme: 'amber',
    recommended: false
  },
  {
    id: 'silver',
    name: 'Plano Prata',
    amount: 500,
    daily_return_rate: 0.020,
    duration_days: 45,
    description: 'Para investidores intermediários',
    theme: 'slate',
    recommended: true
  },
  {
    id: 'gold',
    name: 'Plano Ouro',
    amount: 1000,
    daily_return_rate: 0.025,
    duration_days: 60,
    description: 'Para investidores experientes',
    theme: 'yellow',
    recommended: false
  },
  {
    id: 'platinum',
    name: 'Plano Platina',
    amount: 5000,
    daily_return_rate: 0.032,
    duration_days: 90,
    description: 'Máximo retorno para grandes investidores',
    theme: 'indigo',
    recommended: false
  }
];

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

      if (error) throw error;

      if (data) {
        // Check role from user_roles table (secure)
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', currentSession.user.id)
          .single();

        setProfile({ ...data, role: roleData?.role || 'user' } as Profile);
        setIsAdmin(roleData?.role === 'admin');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
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
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session);
      } else {
        setLoading(false);
      }
    });

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
