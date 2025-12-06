import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';

export interface RegisterData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  password: string;
  cpf: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if user is restricted
      if (data.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('restricted')
          .eq('id', data.user.id)
          .single();

        if (profileData?.restricted) {
          await supabase.auth.signOut();
          throw new Error('Sua conta foi restrita. Entre em contato com o suporte.');
        }
      }

    } catch (error: unknown) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      // Extract only digits from phone and CPF
      const phoneDigits = data.phone.trim().replace(/\D/g, '');
      const cpfDigits = data.cpf.trim().replace(/\D/g, '');

      // Create full name from name and surname
      const fullName = `${data.name.trim()} ${data.surname.trim()}`;

      // Register user with Supabase Auth
      // Note: Email confirmation must be disabled in Supabase settings for instant login
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email.trim(),
        password: data.password,
        options: {
          data: {
            name: fullName,
            phone: phoneDigits,
            cpf: cpfDigits,
          },
          emailRedirectTo: undefined, // No email confirmation
        },
      });

      if (authError) throw authError;

      // Check if user was actually created (not just returned existing)
      if (!authData.user) {
        throw new Error('Falha ao criar usuário. Por favor, tente novamente.');
      }

      // Wait a moment for the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Upsert profile to ensure it exists and is active
      // Using upsert to avoid race conditions with the handle_new_user trigger
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(
          {
            id: authData.user.id,
            name: fullName,
            email: data.email.trim(),
            phone: phoneDigits,
            cpf: cpfDigits,
            status: 'active',
            available_balance: 0,
            invested_balance: 0,
            profit_balance: 0,
          },
          { onConflict: 'id' }
        );

      if (profileError) {
        console.error('Profile upsert error:', profileError);
        // Don't throw - user is created, they can still login
      }

      // Sign out after registration so user can log in fresh
      await supabase.auth.signOut();
    } catch (error: unknown) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logout realizado com sucesso!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Erro ao fazer logout');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
