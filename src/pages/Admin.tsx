import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, LogOut, Badge } from 'lucide-react';
import { Profile, Transaction } from '@/context/AppContext';

const Admin = () => {
  const { isAdmin, logout } = useApp();
  const navigate = useNavigate();
  const [users, setUsers] = useState<Profile[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: profilesData } = await supabase.from('profiles').select('*');
      const { data: txData } = await supabase.from('transactions').select('*');
      setUsers(profilesData || []);
      setTransactions(txData || []);
    };
    if (isAdmin) fetchData();
  }, [isAdmin]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!isAdmin) return null;

  const pendingUsers = users.filter(u => u.status === 'pending').length;
  const pendingTransactions = transactions.filter(t => t.status === 'pending').length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Ganhos Bybit - Admin</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total de Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-sm text-muted-foreground">
                {pendingUsers} aguardando aprovação
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactions.length}</div>
              <p className="text-sm text-muted-foreground">
                {pendingTransactions} pendentes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usuários Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.status === 'active').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gerenciamento completo em desenvolvimento</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Use a interface do Cloud para gerenciar usuários e transações por enquanto.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
