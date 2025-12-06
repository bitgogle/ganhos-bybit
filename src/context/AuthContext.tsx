import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface RegisterData {
  name: string;
  surname: string;
  phone: string;
  email: string;
  password: string;
  cpf?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
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
        email: email.trim(),
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

      toast.success('Login realizado com sucesso!');
    } catch (error: unknown) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      // Extract only digits from phone and CPF for validation and storage
      const phoneDigits = data.phone.replace(/\D/g, '');
      const cpfDigits = data.cpf ? data.cpf.replace(/\D/g, '') : '';

      // Validate phone has exactly 11 digits
      if (phoneDigits.length !== 11) {
        throw new Error('Telefone deve conter exatamente 11 dígitos');
      }

      // Validate CPF has exactly 11 digits if provided
      if (data.cpf && cpfDigits.length !== 11) {
        throw new Error('CPF deve conter exatamente 11 dígitos');
      }

      // Validate name and surname are not empty after trimming
      const trimmedName = data.name.trim();
      const trimmedSurname = data.surname.trim();
      if (!trimmedName || !trimmedSurname) {
        throw new Error('Nome e sobrenome são obrigatórios');
      }

      // Create full name from name and surname
      const fullName = `${trimmedName} ${trimmedSurname}`;

      // Register user with Supabase Auth
      // autoConfirm is handled by Supabase settings - no email confirmation required
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email.trim(),
        password: data.password,
        options: {
          data: {
            name: fullName,
            phone: phoneDigits,
            cpf: cpfDigits,
          },
        },
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Erro ao criar conta');
      }

      // User is automatically created with 'active' status via database trigger
      // Session is automatically established, user is logged in
      toast.success('Conta criada com sucesso! Bem-vindo ao Ganhos Bybit!');
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
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
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
