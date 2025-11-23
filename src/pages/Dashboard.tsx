import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  History,
  LogOut,
  DollarSign,
  TrendingDown
} from 'lucide-react';
import { DepositDialog } from '@/components/dashboard/DepositDialog';
import { WithdrawDialog } from '@/components/dashboard/WithdrawDialog';

const Dashboard = () => {
  const { currentUser, logout, transactions, investmentPlans } = useApp();
  const navigate = useNavigate();
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else if (currentUser.status !== 'active') {
      navigate('/pending-approval');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const userTransactions = transactions.filter(t => t.userId === currentUser.id);
  const pendingDeposits = userTransactions.filter(t => t.type === 'deposit' && t.status === 'pending');
  const pendingWithdrawals = userTransactions.filter(t => t.type === 'withdrawal' && t.status === 'pending');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Ganhos Bybit</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:block">
              Olá, {currentUser.name}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 px-4">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                R$ {currentUser.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Disponível para saque
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Depositado</CardTitle>
              <ArrowDownCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {currentUser.totalDeposited.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Investimentos totais
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Sacado</CardTitle>
              <ArrowUpCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {currentUser.totalWithdrawn.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Saques realizados
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Lucros Totais</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                R$ {currentUser.totalEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Rendimentos acumulados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <Card className="border-border hover:border-primary transition-all cursor-pointer" onClick={() => setDepositOpen(true)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowDownCircle className="h-5 w-5 text-success" />
                Depositar
              </CardTitle>
              <CardDescription>
                Adicionar fundos à sua conta
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border hover:border-primary transition-all cursor-pointer" onClick={() => setWithdrawOpen(true)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpCircle className="h-5 w-5 text-destructive" />
                Sacar
              </CardTitle>
              <CardDescription>
                Retirar seus lucros
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="plans" className="space-y-4">
          <TabsList>
            <TabsTrigger value="plans">Planos de Investimento</TabsTrigger>
            <TabsTrigger value="transactions">
              Transações
              {(pendingDeposits.length + pendingWithdrawals.length) > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {pendingDeposits.length + pendingWithdrawals.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plans" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {investmentPlans.map((plan) => (
                <Card key={plan.id} className="border-border">
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-primary">{plan.dailyReturn}%</span>
                      <span className="text-muted-foreground ml-2">/ dia</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">{plan.description}</p>
                      <p>
                        <span className="font-medium">Mínimo:</span> R$ {plan.minInvestment.toLocaleString('pt-BR')}
                      </p>
                      <p>
                        <span className="font-medium">Máximo:</span> R$ {plan.maxInvestment.toLocaleString('pt-BR')}
                      </p>
                      <p>
                        <span className="font-medium">Retorno mensal:</span> até {(plan.dailyReturn * 30).toFixed(1)}%
                      </p>
                    </div>
                    <Button className="w-full gradient-gold" onClick={() => setDepositOpen(true)}>
                      Investir Agora
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            {userTransactions.length === 0 ? (
              <Card className="border-border">
                <CardContent className="py-8 text-center">
                  <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhuma transação ainda</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {userTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((transaction) => (
                  <Card key={transaction.id} className="border-border">
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {transaction.type === 'deposit' ? (
                            <ArrowDownCircle className="h-5 w-5 text-success" />
                          ) : (
                            <ArrowUpCircle className="h-5 w-5 text-destructive" />
                          )}
                          <div>
                            <p className="font-medium">
                              {transaction.type === 'deposit' ? 'Depósito' : 'Saque'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(transaction.createdAt).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">
                            R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                          <Badge variant={
                            transaction.status === 'approved' ? 'default' :
                            transaction.status === 'pending' ? 'secondary' :
                            'destructive'
                          }>
                            {transaction.status === 'approved' ? 'Aprovado' :
                             transaction.status === 'pending' ? 'Pendente' :
                             'Rejeitado'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <DepositDialog open={depositOpen} onOpenChange={setDepositOpen} />
      <WithdrawDialog open={withdrawOpen} onOpenChange={setWithdrawOpen} />
    </div>
  );
};

export default Dashboard;
