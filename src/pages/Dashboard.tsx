import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, LogOut, Wallet, BarChart, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import { Transaction } from '@/context/AppContext';

const Dashboard = () => {
  const { profile, logout, investmentPlans } = useApp();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!profile) {
      navigate('/login');
    } else if (profile.status !== 'active') {
      navigate('/pending-approval');
    }
  }, [profile, navigate]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!profile) return;
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });
      setTransactions((data || []) as Transaction[]);
    };
    fetchTransactions();
  }, [profile]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Ganhos Bybit</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container py-8 px-4">
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Saldo Disponível
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(profile.available_balance)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                Saldo Investido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(profile.invested_balance)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Lucros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {formatCurrency(profile.profit_balance)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Planos de Investimento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {investmentPlans.map((plan) => (
                <Card key={plan.id} className="border-border">
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <div className="text-2xl font-bold text-primary">
                      {(plan.daily_return_rate * 100).toFixed(1)}%
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">{plan.description}</p>
                    <p className="text-sm font-medium">{formatCurrency(plan.amount)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
