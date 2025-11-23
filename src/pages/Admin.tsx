import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  TrendingUp,
  LogOut,
  Users,
  DollarSign,
  ArrowUpCircle,
  ArrowDownCircle,
  CheckCircle,
  XCircle,
  Settings,
  Eye,
  UserCheck,
  UserX,
  Activity,
} from 'lucide-react';
import { Profile, Transaction, SystemSettings } from '@/context/AppContext';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/format';
import { toast } from 'sonner';

const Admin = () => {
  const { isAdmin, logout } = useApp();
  const navigate = useNavigate();
  const [users, setUsers] = useState<Profile[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(false);

  // Settings form
  const [pixKey, setPixKey] = useState('');
  const [bybitUid, setBybitUid] = useState('');
  const [usdtAddress, setUsdtAddress] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

  const fetchData = useCallback(async () => {
    try {
      const [profilesRes, txRes, settingsRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('transactions').select('*').order('created_at', { ascending: false }),
        supabase.from('system_settings').select('*').maybeSingle(),
      ]);

      setUsers((profilesRes.data || []) as Profile[]);
      setTransactions((txRes.data || []) as Transaction[]);
      
      // Fetch user names for transactions
      if (txRes.data) {
        const enrichedTx = await Promise.all(
          txRes.data.map(async (tx: any) => {
            const { data: userData } = await supabase
              .from('profiles')
              .select('name, email')
              .eq('id', tx.user_id)
              .single();
            return { ...tx, profiles: userData };
          })
        );
        setTransactions(enrichedTx as Transaction[]);
      }
      
      if (settingsRes.data) {
        const settings = settingsRes.data as SystemSettings;
        setSystemSettings(settings);
        setPixKey(settings.pix_key || '');
        setBybitUid(settings.bybit_uid || '');
        setUsdtAddress(settings.usdt_address || '');
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) fetchData();
  }, [isAdmin, fetchData]);

  // Realtime subscriptions
  useEffect(() => {
    if (!isAdmin) return;

    const profilesChannel = supabase
      .channel('admin_profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => fetchData())
      .subscribe();

    const txChannel = supabase
      .channel('admin_transactions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(txChannel);
    };
  }, [isAdmin, fetchData]);

  const handleApproveUser = async (userId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'active' })
        .eq('id', userId);

      if (error) throw error;

      // Send notification
      await supabase.from('notifications').insert({
        user_id: userId,
        title: 'Conta Aprovada',
        message: 'Sua conta foi aprovada! Você já pode começar a investir.',
        type: 'success'
      });

      toast.success('Usuário aprovado com sucesso!');
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectUser = async (userId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'rejected' })
        .eq('id', userId);

      if (error) throw error;

      // Send notification
      await supabase.from('notifications').insert({
        user_id: userId,
        title: 'Conta Rejeitada',
        message: 'Infelizmente sua conta não foi aprovada. Entre em contato com o suporte para mais informações.',
        type: 'error'
      });

      toast.success('Usuário rejeitado.');
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveTransaction = async (txId: string, tx: Transaction) => {
    setLoading(true);
    try {
      if (tx.type === 'deposit') {
        // Update transaction
        const { error: txError } = await supabase
          .from('transactions')
          .update({ status: 'approved' })
          .eq('id', txId);

        if (txError) throw txError;

        // Update user balance
        const user = users.find(u => u.id === tx.user_id);
        if (user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ available_balance: user.available_balance + tx.amount })
            .eq('id', tx.user_id);

          if (profileError) throw profileError;
        }

        // Send notification
        await supabase.from('notifications').insert({
          user_id: tx.user_id,
          title: 'Depósito Aprovado',
          message: `Seu depósito de ${formatCurrency(tx.amount)} foi aprovado e creditado na sua conta.`,
          type: 'success'
        });
      } else if (tx.type === 'withdrawal') {
        // Just update status (balance already deducted)
        const { error: txError } = await supabase
          .from('transactions')
          .update({ status: 'approved' })
          .eq('id', txId);

        if (txError) throw txError;

        // Send notification
        await supabase.from('notifications').insert({
          user_id: tx.user_id,
          title: 'Saque Aprovado',
          message: `Seu saque de ${formatCurrency(tx.amount)} foi aprovado e será processado em breve.`,
          type: 'success'
        });
      }

      toast.success('Transação aprovada!');
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectTransaction = async (txId: string, tx: Transaction) => {
    setLoading(true);
    try {
      // Update transaction
      const { error: txError } = await supabase
        .from('transactions')
        .update({ status: 'rejected' })
        .eq('id', txId);

      if (txError) throw txError;

      // If withdrawal, refund the balance
      if (tx.type === 'withdrawal') {
        const user = users.find(u => u.id === tx.user_id);
        if (user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ available_balance: user.available_balance + tx.amount })
            .eq('id', tx.user_id);

          if (profileError) throw profileError;
        }
      }

      // Send notification
      await supabase.from('notifications').insert({
        user_id: tx.user_id,
        title: 'Transação Rejeitada',
        message: `Sua transação de ${formatCurrency(tx.amount)} foi rejeitada. Entre em contato com o suporte.`,
        type: 'error'
      });

      toast.success('Transação rejeitada.');
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('system_settings')
        .update({
          pix_key: pixKey,
          bybit_uid: bybitUid,
          usdt_address: usdtAddress,
        })
        .eq('id', 1);

      if (error) throw error;

      toast.success('Configurações atualizadas com sucesso!');
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!isAdmin) return null;

  const pendingUsers = users.filter(u => u.status === 'pending');
  const activeUsers = users.filter(u => u.status === 'active');
  const rejectedUsers = users.filter(u => u.status === 'rejected');
  const pendingTransactions = transactions.filter(t => t.status === 'pending');
  const totalDeposits = transactions
    .filter(t => t.type === 'deposit' && t.status === 'approved')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawals = transactions
    .filter(t => t.type === 'withdrawal' && t.status === 'approved')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-background">
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
          <p className="text-muted-foreground">Gerencie usuários, transações e configurações da plataforma</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {activeUsers.length} ativos, {pendingUsers.length} pendentes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Transações Pendentes</CardTitle>
              <Activity className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{pendingTransactions.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Requerem atenção
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Depositado</CardTitle>
              <ArrowDownCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{formatCurrency(totalDeposits)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Depósitos aprovados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Sacado</CardTitle>
              <ArrowUpCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{formatCurrency(totalWithdrawals)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Saques aprovados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">
              Gerenciar Usuários
              {pendingUsers.length > 0 && (
                <Badge variant="destructive" className="ml-2">{pendingUsers.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="transactions">
              Transações
              {pendingTransactions.length > 0 && (
                <Badge variant="destructive" className="ml-2">{pendingTransactions.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Saldo</TableHead>
                      <TableHead>Cadastro</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          Nenhum usuário encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell className="font-mono text-sm">{user.cpf}</TableCell>
                          <TableCell>
                            <Badge variant={
                              user.status === 'active' ? 'default' :
                              user.status === 'pending' ? 'secondary' :
                              'destructive'
                            }>
                              {user.status === 'active' ? 'Ativo' :
                               user.status === 'pending' ? 'Pendente' :
                               'Rejeitado'}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatCurrency(user.available_balance)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(user.created_at)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedUser(user)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {user.status === 'pending' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleApproveUser(user.id)}
                                    disabled={loading}
                                  >
                                    <UserCheck className="h-4 w-4 text-success" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRejectUser(user.id)}
                                    disabled={loading}
                                  >
                                    <UserX className="h-4 w-4 text-destructive" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transaction Management Tab */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Transações</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Detalhes</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          Nenhuma transação encontrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{tx.profiles?.name}</p>
                              <p className="text-xs text-muted-foreground">{tx.profiles?.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {tx.type === 'deposit' ? (
                                <ArrowDownCircle className="h-4 w-4 text-success" />
                              ) : tx.type === 'withdrawal' ? (
                                <ArrowUpCircle className="h-4 w-4 text-destructive" />
                              ) : tx.type === 'investment' ? (
                                <TrendingUp className="h-4 w-4 text-primary" />
                              ) : (
                                <DollarSign className="h-4 w-4 text-success" />
                              )}
                              <span className="capitalize">{tx.type}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-bold">{formatCurrency(tx.amount)}</TableCell>
                          <TableCell>
                            <Badge variant={
                              tx.status === 'approved' || tx.status === 'completed' ? 'default' :
                              tx.status === 'pending' ? 'secondary' :
                              'destructive'
                            }>
                              {tx.status === 'approved' || tx.status === 'completed' ? 'Aprovado' :
                               tx.status === 'pending' ? 'Pendente' :
                               'Rejeitado'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDateTime(tx.created_at)}
                          </TableCell>
                          <TableCell className="text-sm max-w-xs truncate">
                            {tx.reference}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {tx.proof_url && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(tx.proof_url, '_blank')}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              )}
                              {tx.status === 'pending' && (tx.type === 'deposit' || tx.type === 'withdrawal') && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleApproveTransaction(tx.id, tx)}
                                    disabled={loading}
                                  >
                                    <CheckCircle className="h-4 w-4 text-success" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRejectTransaction(tx.id, tx)}
                                    disabled={loading}
                                  >
                                    <XCircle className="h-4 w-4 text-destructive" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configurações da Plataforma</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateSettings} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="pix_key">Chave PIX para Depósitos</Label>
                    <Input
                      id="pix_key"
                      type="text"
                      placeholder="Digite a chave PIX"
                      value={pixKey}
                      onChange={(e) => setPixKey(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Esta chave será exibida para os usuários ao fazer depósitos via PIX
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bybit_uid">Bybit UID para Depósitos</Label>
                    <Input
                      id="bybit_uid"
                      type="text"
                      placeholder="Digite o Bybit UID"
                      value={bybitUid}
                      onChange={(e) => setBybitUid(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Este UID será exibido para os usuários ao fazer depósitos via Bybit
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="usdt_address">Endereço USDT (TRC20) para Depósitos</Label>
                    <Input
                      id="usdt_address"
                      type="text"
                      placeholder="Digite o endereço USDT"
                      value={usdtAddress}
                      onChange={(e) => setUsdtAddress(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Este endereço será exibido para os usuários ao fazer depósitos via USDT
                    </p>
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar Configurações'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* User Details Dialog */}
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes do Usuário</DialogTitle>
              <DialogDescription>
                Informações completas do usuário
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Nome</Label>
                  <p className="font-medium">{selectedUser.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Telefone</Label>
                  <p className="font-medium">{selectedUser.phone || 'Não informado'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">CPF</Label>
                  <p className="font-medium font-mono">{selectedUser.cpf}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground">Saldo Disponível</Label>
                  <p className="font-bold text-primary">{formatCurrency(selectedUser.available_balance)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Saldo Investido</Label>
                  <p className="font-bold">{formatCurrency(selectedUser.invested_balance)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Lucros</Label>
                  <p className="font-bold text-success">{formatCurrency(selectedUser.profit_balance)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Chave PIX</Label>
                  <p className="font-medium text-sm">{selectedUser.pix_key || 'Não configurado'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge variant={
                    selectedUser.status === 'active' ? 'default' :
                    selectedUser.status === 'pending' ? 'secondary' :
                    'destructive'
                  }>
                    {selectedUser.status === 'active' ? 'Ativo' :
                     selectedUser.status === 'pending' ? 'Pendente' :
                     'Rejeitado'}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Data de Cadastro</Label>
                  <p className="text-sm">{formatDateTime(selectedUser.created_at)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Última Atualização</Label>
                  <p className="text-sm">{formatDateTime(selectedUser.updated_at)}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Admin;
