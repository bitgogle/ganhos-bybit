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
  Shield,
  FileText,
} from 'lucide-react';
import { UserRestrictionManager } from '@/components/admin/UserRestrictionManager';
import { WithdrawalFeeSettings } from '@/components/admin/WithdrawalFeeSettings';
import { Profile, Transaction, SystemSettings } from '@/context/AppContext';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/format';
import { toast } from 'sonner';

const Admin = () => {
  const { logout } = useApp();
  const navigate = useNavigate();
  const [users, setUsers] = useState<Profile[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Balance editing state
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [editAvailableBalance, setEditAvailableBalance] = useState('');
  const [editInvestedBalance, setEditInvestedBalance] = useState('');
  const [editProfitBalance, setEditProfitBalance] = useState('');

  // Settings form
  const [pixKey, setPixKey] = useState('');
  const [pixName, setPixName] = useState('');
  const [pixBank, setPixBank] = useState('');
  const [bybitUid, setBybitUid] = useState('');
  const [usdtAddress, setUsdtAddress] = useState('');

  // Check for admin credentials in localStorage
  const hasAdminAccess = () => {
    const savedCredentials = localStorage.getItem('admin_credentials');
    return !!savedCredentials;
  };

  useEffect(() => {
    if (!hasAdminAccess()) {
      navigate('/');
    }
  }, [navigate]);

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
        setPixName(settings.pix_name || '');
        setPixBank(settings.pix_bank || '');
        setBybitUid(settings.bybit_uid || '');
        setUsdtAddress(settings.usdt_address || '');
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  }, []);

  useEffect(() => {
    if (hasAdminAccess()) fetchData();
  }, [fetchData]);

  // Realtime subscriptions
  useEffect(() => {
    if (!hasAdminAccess()) return;

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
  }, [fetchData]);

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
          pix_name: pixName,
          pix_bank: pixBank,
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

  const handleEditBalance = (user: Profile) => {
    setIsEditingBalance(true);
    setEditAvailableBalance(user.available_balance.toString());
    setEditInvestedBalance(user.invested_balance.toString());
    setEditProfitBalance(user.profit_balance.toString());
  };

  const handleSaveBalance = async () => {
    if (!selectedUser) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          available_balance: parseFloat(editAvailableBalance),
          invested_balance: parseFloat(editInvestedBalance),
          profit_balance: parseFloat(editProfitBalance),
        })
        .eq('id', selectedUser.id);

      if (error) throw error;

      // Send notification to user
      await supabase.from('notifications').insert({
        user_id: selectedUser.id,
        title: 'Saldos Atualizados',
        message: 'Seus saldos foram atualizados pelo administrador.',
        type: 'info'
      });

      toast.success('Saldos atualizados com sucesso!');
      setIsEditingBalance(false);
      fetchData();
      setSelectedUser(null);
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

  if (!hasAdminAccess()) return null;

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
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-blue-600">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-white" />
            <span className="text-xl font-bold text-white">Ganhos Bybit</span>
            <Badge className="ml-2 bg-white text-blue-600">Admin</Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:bg-blue-700">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container py-8 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-black">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, transactions and platform settings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-blue-200 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-black">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">{users.length}</div>
              <p className="text-xs text-gray-500 mt-1">
                {activeUsers.length} active, {pendingUsers.length} pending
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-black">Pending Transactions</CardTitle>
              <Activity className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{pendingTransactions.length}</div>
              <p className="text-xs text-gray-500 mt-1">
                Require attention
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-black">Total Deposited</CardTitle>
              <ArrowDownCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{formatCurrency(totalDeposits)}</div>
              <p className="text-xs text-gray-500 mt-1">
                Approved deposits
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-black">Total Withdrawn</CardTitle>
              <ArrowUpCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{formatCurrency(totalWithdrawals)}</div>
              <p className="text-xs text-gray-500 mt-1">
                Approved withdrawals
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="bg-blue-100">
            <TabsTrigger value="users" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Manage Users
              {pendingUsers.length > 0 && (
                <Badge variant="destructive" className="ml-2">{pendingUsers.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Transactions
              {pendingTransactions.length > 0 && (
                <Badge variant="destructive" className="ml-2">{pendingTransactions.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          <TabsContent value="users">
            <Card className="border-blue-200 bg-white">
              <CardHeader>
                <CardTitle className="text-black">User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-black">Name</TableHead>
                      <TableHead className="text-black">Email</TableHead>
                      <TableHead className="text-black">CPF</TableHead>
                      <TableHead className="text-black">Status</TableHead>
                      <TableHead className="text-black">Restriction</TableHead>
                      <TableHead className="text-black">Balance</TableHead>
                      <TableHead className="text-black">Registered</TableHead>
                      <TableHead className="text-right text-black">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium text-black">{user.name}</TableCell>
                          <TableCell className="text-black">{user.email}</TableCell>
                          <TableCell className="font-mono text-sm text-black">{user.cpf}</TableCell>
                          <TableCell>
                            <Badge variant={
                              user.status === 'active' ? 'default' :
                              user.status === 'pending' ? 'secondary' :
                              'destructive'
                            } className={user.status === 'active' ? 'bg-green-500' : ''}>
                              {user.status === 'active' ? 'Active' :
                               user.status === 'pending' ? 'Pending' :
                               'Rejected'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.restricted ? (
                              <Badge variant="destructive">
                                <Shield className="h-3 w-3 mr-1" />
                                Restricted
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-black border-gray-300">Normal</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-black">{formatCurrency(user.available_balance)}</TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {formatDate(user.created_at)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedUser(user)}
                                className="text-blue-600 hover:bg-blue-100"
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
                                    className="text-green-600 hover:bg-green-100"
                                  >
                                    <UserCheck className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRejectUser(user.id)}
                                    disabled={loading}
                                    className="text-red-600 hover:bg-red-100"
                                  >
                                    <UserX className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              {user.status === 'active' && (
                                <UserRestrictionManager user={user} onUpdate={fetchData} />
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
            <Card className="border-blue-200 bg-white">
              <CardHeader>
                <CardTitle className="text-black">Transaction Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-black">User</TableHead>
                      <TableHead className="text-black">Type</TableHead>
                      <TableHead className="text-black">Amount</TableHead>
                      <TableHead className="text-black">Status</TableHead>
                      <TableHead className="text-black">Date</TableHead>
                      <TableHead className="text-black">Details</TableHead>
                      <TableHead className="text-right text-black">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No transactions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-black">{tx.profiles?.name}</p>
                              <p className="text-xs text-gray-500">{tx.profiles?.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {tx.type === 'deposit' ? (
                                <ArrowDownCircle className="h-4 w-4 text-green-500" />
                              ) : tx.type === 'withdrawal' ? (
                                <ArrowUpCircle className="h-4 w-4 text-red-500" />
                              ) : tx.type === 'investment' ? (
                                <TrendingUp className="h-4 w-4 text-blue-600" />
                              ) : (
                                <DollarSign className="h-4 w-4 text-green-500" />
                              )}
                              <span className="capitalize text-black">{tx.type}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-bold text-black">{formatCurrency(tx.amount)}</TableCell>
                          <TableCell>
                            <Badge variant={
                              tx.status === 'approved' || tx.status === 'completed' ? 'default' :
                              tx.status === 'pending' ? 'secondary' :
                              'destructive'
                            } className={tx.status === 'approved' || tx.status === 'completed' ? 'bg-green-500' : ''}>
                              {tx.status === 'approved' || tx.status === 'completed' ? 'Approved' :
                               tx.status === 'pending' ? 'Pending' :
                               'Rejected'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {formatDateTime(tx.created_at)}
                          </TableCell>
                          <TableCell className="text-sm max-w-xs truncate text-black">
                            {tx.reference}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {tx.proof_url && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(tx.proof_url, '_blank')}
                                  className="text-blue-600 hover:bg-blue-100"
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
                                    className="text-green-600 hover:bg-green-100"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRejectTransaction(tx.id, tx)}
                                    disabled={loading}
                                    className="text-red-600 hover:bg-red-100"
                                  >
                                    <XCircle className="h-4 w-4" />
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
          <TabsContent value="settings" className="space-y-6">
            <Card className="border-blue-200 bg-white">
              <CardHeader>
                <CardTitle className="text-black">Platform Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateSettings} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="pix_key" className="text-black">PIX Key for Deposits</Label>
                    <Input
                      id="pix_key"
                      type="text"
                      placeholder="Enter PIX key"
                      value={pixKey}
                      onChange={(e) => setPixKey(e.target.value)}
                      className="border-gray-300"
                    />
                    <p className="text-sm text-gray-500">
                      This key will be shown to users when making PIX deposits
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pix_name" className="text-black">PIX Account Name</Label>
                    <Input
                      id="pix_name"
                      type="text"
                      placeholder="Enter full name"
                      value={pixName}
                      onChange={(e) => setPixName(e.target.value)}
                      className="border-gray-300"
                    />
                    <p className="text-sm text-gray-500">
                      PIX account holder name
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pix_bank" className="text-black">PIX Bank</Label>
                    <Input
                      id="pix_bank"
                      type="text"
                      placeholder="Enter bank name"
                      value={pixBank}
                      onChange={(e) => setPixBank(e.target.value)}
                      className="border-gray-300"
                    />
                    <p className="text-sm text-gray-500">
                      PIX account bank name
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bybit_uid" className="text-black">Bybit UID for Deposits</Label>
                    <Input
                      id="bybit_uid"
                      type="text"
                      placeholder="Enter Bybit UID"
                      value={bybitUid}
                      onChange={(e) => setBybitUid(e.target.value)}
                      className="border-gray-300"
                    />
                    <p className="text-sm text-gray-500">
                      This UID will be shown to users when making Bybit deposits
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="usdt_address" className="text-black">USDT Address (TRC20) for Deposits</Label>
                    <Input
                      id="usdt_address"
                      type="text"
                      placeholder="Enter USDT address"
                      value={usdtAddress}
                      onChange={(e) => setUsdtAddress(e.target.value)}
                      className="border-gray-300"
                    />
                    <p className="text-sm text-gray-500">
                      This address will be shown to users when making USDT deposits
                    </p>
                  </div>

                  <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {loading ? 'Saving...' : 'Save Settings'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <WithdrawalFeeSettings />
          </TabsContent>
        </Tabs>
      </main>

      {/* User Details Dialog */}
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={() => {
          setSelectedUser(null);
          setIsEditingBalance(false);
        }}>
          <DialogContent className="max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle className="text-black">User Details</DialogTitle>
              <DialogDescription className="text-gray-500">
                Complete user information
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Name</Label>
                  <p className="font-medium text-black">{selectedUser.name}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Email</Label>
                  <p className="font-medium text-black">{selectedUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Phone</Label>
                  <p className="font-medium text-black">{selectedUser.phone || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-gray-500">CPF</Label>
                  <p className="font-medium font-mono text-black">{selectedUser.cpf}</p>
                </div>
              </div>
              
              {/* Balance Section - Editable */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-base font-semibold text-black">Balances</Label>
                  {!isEditingBalance ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditBalance(selectedUser)}
                      className="border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      <DollarSign className="h-4 w-4 mr-1" />
                      Edit Balances
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsEditingBalance(false)}
                        disabled={loading}
                        className="text-gray-600"
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm"
                        onClick={handleSaveBalance}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Save
                      </Button>
                    </div>
                  )}
                </div>
                
                {!isEditingBalance ? (
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-gray-500">Available Balance</Label>
                      <p className="font-bold text-blue-600">{formatCurrency(selectedUser.available_balance)}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Invested Balance</Label>
                      <p className="font-bold text-black">{formatCurrency(selectedUser.invested_balance)}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Profits</Label>
                      <p className="font-bold text-green-500">{formatCurrency(selectedUser.profit_balance)}</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="available_balance" className="text-black">Available Balance</Label>
                      <Input
                        id="available_balance"
                        type="number"
                        step="0.01"
                        value={editAvailableBalance}
                        onChange={(e) => setEditAvailableBalance(e.target.value)}
                        className="border-gray-300"
                      />
                    </div>
                    <div>
                      <Label htmlFor="invested_balance" className="text-black">Invested Balance</Label>
                      <Input
                        id="invested_balance"
                        type="number"
                        step="0.01"
                        value={editInvestedBalance}
                        onChange={(e) => setEditInvestedBalance(e.target.value)}
                        className="border-gray-300"
                      />
                    </div>
                    <div>
                      <Label htmlFor="profit_balance" className="text-black">Profits</Label>
                      <Input
                        id="profit_balance"
                        type="number"
                        step="0.01"
                        value={editProfitBalance}
                        onChange={(e) => setEditProfitBalance(e.target.value)}
                        className="border-gray-300"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">PIX Key</Label>
                  <p className="font-medium text-sm text-black">{selectedUser.pix_key || 'Not configured'}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Status</Label>
                  <Badge variant={
                    selectedUser.status === 'active' ? 'default' :
                    selectedUser.status === 'pending' ? 'secondary' :
                    'destructive'
                  } className={selectedUser.status === 'active' ? 'bg-green-500' : ''}>
                    {selectedUser.status === 'active' ? 'Active' :
                     selectedUser.status === 'pending' ? 'Pending' :
                     'Rejected'}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Registration Date</Label>
                  <p className="text-sm text-black">{formatDateTime(selectedUser.created_at)}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Last Updated</Label>
                  <p className="text-sm text-black">{formatDateTime(selectedUser.updated_at)}</p>
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
