import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  balance: number;
  totalDeposited: number;
  totalWithdrawn: number;
  totalEarnings: number;
  status: 'pending' | 'active' | 'rejected';
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  paymentMethod?: string;
  proofUrl?: string;
}

export interface InvestmentPlan {
  id: string;
  name: string;
  minInvestment: number;
  maxInvestment: number;
  dailyReturn: number;
  duration: number;
  description: string;
}

export interface PlatformSettings {
  pixKey: string;
  pixName: string;
  pixType: string;
  withdrawalFee: number;
  minimumWithdrawal: number;
  minimumDeposit: number;
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  transactions: Transaction[];
  investmentPlans: InvestmentPlan[];
  platformSettings: PlatformSettings;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'balance' | 'totalDeposited' | 'totalWithdrawn' | 'totalEarnings' | 'createdAt' | 'status'>, password: string) => Promise<boolean>;
  updateUser: (userId: string, updates: Partial<User>) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTransaction: (transactionId: string, updates: Partial<Transaction>) => void;
  updatePlatformSettings: (settings: Partial<PlatformSettings>) => void;
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const ADMIN_EMAIL = 'admin@bybit.com';
const ADMIN_PASSWORD = 'admin123';

const defaultInvestmentPlans: InvestmentPlan[] = [
  {
    id: '1',
    name: 'Plano Iniciante',
    minInvestment: 100,
    maxInvestment: 999,
    dailyReturn: 1.5,
    duration: 30,
    description: 'Ideal para quem está começando'
  },
  {
    id: '2',
    name: 'Plano Profissional',
    minInvestment: 1000,
    maxInvestment: 4999,
    dailyReturn: 2.0,
    duration: 30,
    description: 'Para investidores experientes'
  },
  {
    id: '3',
    name: 'Plano Premium',
    minInvestment: 5000,
    maxInvestment: 999999,
    dailyReturn: 2.5,
    duration: 30,
    description: 'Máximo retorno para grandes investidores'
  }
];

const defaultSettings: PlatformSettings = {
  pixKey: '',
  pixName: 'Ganhos Bybit',
  pixType: 'CNPJ',
  withdrawalFee: 2,
  minimumWithdrawal: 50,
  minimumDeposit: 100
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [investmentPlans] = useState<InvestmentPlan[]>(defaultInvestmentPlans);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(defaultSettings);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUsers = localStorage.getItem('bybit_users');
    const storedTransactions = localStorage.getItem('bybit_transactions');
    const storedSettings = localStorage.getItem('bybit_settings');
    const storedCurrentUser = localStorage.getItem('bybit_current_user');
    const storedIsAdmin = localStorage.getItem('bybit_is_admin');

    if (storedUsers) setUsers(JSON.parse(storedUsers));
    if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
    if (storedSettings) setPlatformSettings(JSON.parse(storedSettings));
    if (storedCurrentUser) setCurrentUser(JSON.parse(storedCurrentUser));
    if (storedIsAdmin) setIsAdmin(JSON.parse(storedIsAdmin));
  }, []);

  useEffect(() => {
    localStorage.setItem('bybit_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('bybit_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('bybit_settings', JSON.stringify(platformSettings));
  }, [platformSettings]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('bybit_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('bybit_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('bybit_is_admin', JSON.stringify(isAdmin));
  }, [isAdmin]);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      return true;
    }

    const user = users.find(u => u.email === email && u.status === 'active');
    if (user) {
      setCurrentUser(user);
      setIsAdmin(false);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
  };

  const register = async (userData: Omit<User, 'id' | 'balance' | 'totalDeposited' | 'totalWithdrawn' | 'totalEarnings' | 'createdAt' | 'status'>, password: string): Promise<boolean> => {
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) return false;

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      balance: 0,
      totalDeposited: 0,
      totalWithdrawn: 0,
      totalEarnings: 0,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setUsers([...users, newUser]);
    return true;
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    ));
    
    if (currentUser?.id === userId) {
      setCurrentUser({ ...currentUser, ...updates });
    }
  };

  const approveUser = (userId: string) => {
    updateUser(userId, { status: 'active' });
  };

  const rejectUser = (userId: string) => {
    updateUser(userId, { status: 'rejected' });
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTransactions([...transactions, newTransaction]);
  };

  const updateTransaction = (transactionId: string, updates: Partial<Transaction>) => {
    setTransactions(transactions.map(transaction =>
      transaction.id === transactionId
        ? { ...transaction, ...updates, updatedAt: new Date().toISOString() }
        : transaction
    ));

    if (updates.status === 'approved' && updates.amount) {
      const transaction = transactions.find(t => t.id === transactionId);
      if (transaction) {
        const user = users.find(u => u.id === transaction.userId);
        if (user) {
          if (transaction.type === 'deposit') {
            updateUser(user.id, {
              balance: user.balance + transaction.amount,
              totalDeposited: user.totalDeposited + transaction.amount
            });
          } else if (transaction.type === 'withdrawal') {
            updateUser(user.id, {
              balance: user.balance - transaction.amount,
              totalWithdrawn: user.totalWithdrawn + transaction.amount
            });
          }
        }
      }
    }
  };

  const updatePlatformSettings = (settings: Partial<PlatformSettings>) => {
    setPlatformSettings({ ...platformSettings, ...settings });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        transactions,
        investmentPlans,
        platformSettings,
        isAdmin,
        login,
        logout,
        register,
        updateUser,
        addTransaction,
        updateTransaction,
        updatePlatformSettings,
        approveUser,
        rejectUser
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
