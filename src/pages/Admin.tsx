import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut, TrendingUp } from 'lucide-react';
import { UserManagement } from '@/components/admin/UserManagement';
import { TransactionManagement } from '@/components/admin/TransactionManagement';
import { SettingsManagement } from '@/components/admin/SettingsManagement';
import { AdminStats } from '@/components/admin/AdminStats';
import { Badge } from '@/components/ui/badge';

const Admin = () => {
  const { isAdmin, logout, users, transactions } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

  const pendingUsers = users.filter(u => u.status === 'pending').length;
  const pendingTransactions = transactions.filter(t => t.status === 'pending').length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Ganhos Bybit</span>
            <Badge variant="secondary" className="ml-2">Admin</Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container py-8 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, transactions, and platform settings</p>
        </div>

        <AdminStats />

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">
              User Management
              {pendingUsers > 0 && (
                <Badge variant="destructive" className="ml-2">{pendingUsers}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="transactions">
              Transactions
              {pendingTransactions > 0 && (
                <Badge variant="destructive" className="ml-2">{pendingTransactions}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings">Platform Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionManagement />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
