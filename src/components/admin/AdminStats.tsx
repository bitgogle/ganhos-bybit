import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, TrendingDown, DollarSign, Clock } from 'lucide-react';

export const AdminStats = () => {
  const { users, transactions } = useApp();

  const activeUsers = users.filter(u => u.status === 'active').length;
  const pendingUsers = users.filter(u => u.status === 'pending').length;
  const totalDeposits = transactions
    .filter(t => t.type === 'deposit' && t.status === 'approved')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawals = transactions
    .filter(t => t.type === 'withdrawal' && t.status === 'approved')
    .reduce((sum, t) => sum + t.amount, 0);
  const pendingTransactions = transactions.filter(t => t.status === 'pending').length;

  const totalBalance = users.reduce((sum, u) => sum + u.balance, 0);

  const stats = [
    {
      title: 'Active Users',
      value: activeUsers,
      icon: Users,
      description: `${pendingUsers} pending approval`,
      color: 'text-primary'
    },
    {
      title: 'Total Deposits',
      value: `R$ ${totalDeposits.toFixed(2)}`,
      icon: TrendingDown,
      description: 'Approved deposits',
      color: 'text-success'
    },
    {
      title: 'Total Withdrawals',
      value: `R$ ${totalWithdrawals.toFixed(2)}`,
      icon: TrendingUp,
      description: 'Processed withdrawals',
      color: 'text-destructive'
    },
    {
      title: 'Platform Balance',
      value: `R$ ${totalBalance.toFixed(2)}`,
      icon: DollarSign,
      description: 'Total user balances',
      color: 'text-primary'
    },
    {
      title: 'Pending Actions',
      value: pendingTransactions,
      icon: Clock,
      description: 'Awaiting approval',
      color: 'text-warning'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
