import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  TrendingUp,
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  History,
  LogOut,
  DollarSign,
  BarChart,
  PlusCircle,
  MinusCircle,
  Bell,
  Copy,
  AlertCircle,
  CheckCircle,
  Trash2,
  Clock,
  Percent,
  Star,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/format';
import { Transaction, SystemSettings } from '@/context/AppContext';
import { WithdrawalFeeDialog } from '@/components/withdrawal/WithdrawalFeeDialog';
import { toast } from 'sonner';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}

const Dashboard = () => {
  const { profile, logout, investmentPlans, refreshProfile } = useApp();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  
  // Deposit dialog state
  const [depositOpen, setDepositOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositMethod, setDepositMethod] = useState<'pix' | 'bybit' | 'usdt'>('pix');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null);
  
  // Withdraw dialog state
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'pix' | 'bybit' | 'usdt'>('pix');
  
  // Withdrawal fee dialog state
  const [feeDialogOpen, setFeeDialogOpen] = useState(false);
  const [pendingWithdrawalId, setPendingWithdrawalId] = useState<string>('');
  const [feeAmount, setFeeAmount] = useState(0);

  // Investment dialog state
  const [investOpen, setInvestOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof investmentPlans[0] | null>(null);
  const [investmentDuration, setInvestmentDuration] = useState<number>(1);

  // Notifications
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!profile) {
      navigate('/login');
    } else if (profile.status !== 'active') {
      navigate('/pending-approval');
    }
  }, [profile, navigate]);

  const fetchTransactions = useCallback(async () => {
    if (!profile) return;
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTransactions((data || []) as Transaction[]);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  }, [profile]);

  const fetchNotifications = useCallback(async () => {
    if (!profile) return;
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setNotifications((data || []) as Notification[]);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  }, [profile]);

  useEffect(() => {
    fetchTransactions();
    fetchNotifications();
  }, [fetchTransactions, fetchNotifications]);

  // Realtime subscriptions
  useEffect(() => {
    if (!profile) return;

    const txChannel = supabase
      .channel('user_transactions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${profile.id}` },
        () => {
          fetchTransactions();
          refreshProfile();
        }
      )
      .subscribe();

    const notifChannel = supabase
      .channel('user_notifications')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${profile.id}` },
        () => fetchNotifications()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(txChannel);
      supabase.removeChannel(notifChannel);
    };
  }, [profile, fetchTransactions, fetchNotifications, refreshProfile]);

  const openDepositModal = async () => {
    setDepositOpen(true);
    setProofFile(null);
    const { data } = await supabase.from('system_settings').select('*').maybeSingle();
    if (data) setSystemSettings(data as SystemSettings);
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount < 50) {
      toast.error('O valor mínimo de depósito é R$50,00.');
      return;
    }

    // Check for restrictions
    if (profile.restricted) {
      toast.error('Sua conta está restrita. Entre em contato com o suporte.');
      return;
    }

    if (!proofFile) {
      toast.error('Por favor, envie o comprovante de pagamento.');
      return;
    }

    setLoading(true);

    try {
      const fileExt = proofFile.name.split('.').pop();
      const fileName = `${profile.id}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('proofs')
        .upload(fileName, proofFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('proofs').getPublicUrl(fileName);

      const methodLabel = depositMethod === 'pix' ? 'PIX' : depositMethod === 'bybit' ? 'Bybit UID' : 'USDT (TRC20)';

      const { error } = await supabase.from('transactions').insert({
        user_id: profile.id,
        amount,
        type: 'deposit',
        status: 'pending',
        reference: `Depósito via ${methodLabel}`,
        proof_url: publicUrl
      });

      if (error) throw error;

      toast.success('Solicitação de depósito enviada com sucesso! Aguarde aprovação.');
      setDepositAmount('');
      setProofFile(null);
      setDepositOpen(false);
      fetchTransactions();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao processar depósito.');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Por favor insira um valor válido.');
      return;
    }

    // Check for restrictions
    if (profile.restricted) {
      toast.error('Sua conta está restrita. Entre em contato com o suporte.');
      return;
    }

    if (amount > profile.available_balance) {
      toast.error('Saldo insuficiente.');
      return;
    }

    let destination = '';
    if (withdrawMethod === 'pix') destination = profile.pix_key || '';
    if (withdrawMethod === 'bybit') destination = profile.bybit_uid || '';
    if (withdrawMethod === 'usdt') destination = profile.usdt_address || '';

    if (!destination) {
      toast.error(`Seus detalhes de ${withdrawMethod.toUpperCase()} não estão configurados. Contate o suporte.`);
      return;
    }

    setLoading(true);

    try {
      // Fetch system settings to check for withdrawal fee
      const { data: settings } = await supabase
        .from('system_settings')
        .select('*')
        .maybeSingle();

      const feeEnabled = settings?.withdrawal_fee_enabled || false;
      const feeMode = settings?.withdrawal_fee_mode || 'deduct';
      const fee = settings?.withdrawal_fee_amount || 0;

      let actualAmount = amount;
      
      if (feeEnabled && feeMode === 'deduct') {
        // Deduct fee from balance
        actualAmount = amount + fee;
        
        if (actualAmount > profile.available_balance) {
          toast.error(`Saldo insuficiente. Você precisa de ${formatCurrency(actualAmount)} (incluindo taxa de ${formatCurrency(fee)})`);
          return;
        }
      }

      // Deduct balance
      const newBalance = feeEnabled && feeMode === 'deduct' 
        ? profile.available_balance - actualAmount 
        : profile.available_balance - amount;
        
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ available_balance: newBalance })
        .eq('id', profile.id);

      if (profileError) throw profileError;

      const methodLabel = withdrawMethod === 'pix' ? 'PIX' : withdrawMethod === 'bybit' ? 'Bybit UID' : 'USDT (TRC20)';

      const { data: txData, error: txError } = await supabase
        .from('transactions')
        .insert({
          user_id: profile.id,
          amount,
          type: 'withdrawal',
          status: 'pending',
          reference: `Saque para ${methodLabel}: ${destination}`
        })
        .select()
        .single();

      if (txError) {
        // Rollback balance update
        await supabase.from('profiles').update({ available_balance: profile.available_balance }).eq('id', profile.id);
        throw txError;
      }

      toast.success('Solicitação de saque enviada com sucesso!');
      setWithdrawAmount('');
      setWithdrawOpen(false);
      await refreshProfile();
      fetchTransactions();

      // If fee is enabled and mode is deposit, show fee dialog
      if (feeEnabled && feeMode === 'deposit' && txData) {
        setPendingWithdrawalId(txData.id);
        setFeeAmount(fee);
        setFeeDialogOpen(true);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openInvestModal = (plan: typeof investmentPlans[0]) => {
    setSelectedPlan(plan);
    setInvestmentDuration(1); // Reset to 1 day
    setInvestOpen(true);
  };

  const handleInvest = async () => {
    if (!profile || !selectedPlan) return;

    if (profile.available_balance < selectedPlan.amount) {
      toast.error('Saldo disponível insuficiente para este investimento.');
      return;
    }

    setLoading(true);

    try {
      const newAvailable = profile.available_balance - selectedPlan.amount;
      const newInvested = profile.invested_balance + selectedPlan.amount;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          available_balance: newAvailable,
          invested_balance: newInvested
        })
        .eq('id', profile.id);

      if (profileError) throw profileError;

      const { error: txError } = await supabase.from('transactions').insert({
        user_id: profile.id,
        amount: selectedPlan.amount,
        type: 'investment',
        status: 'completed',
        reference: `Investimento: ${selectedPlan.name} | ${investmentDuration} ${investmentDuration === 1 ? 'dia' : 'dias'}`
      });

      if (txError) {
        // Rollback
        await supabase
          .from('profiles')
          .update({
            available_balance: profile.available_balance,
            invested_balance: profile.invested_balance
          })
          .eq('id', profile.id);
        throw txError;
      }

      toast.success(`Investimento realizado com sucesso no ${selectedPlan.name}!`);
      setInvestOpen(false);
      await refreshProfile();
      fetchTransactions();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id);
    fetchNotifications();
  };

  const deleteNotification = async (id: string) => {
    await supabase.from('notifications').delete().eq('id', id);
    fetchNotifications();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado para área de transferência!');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!profile) return null;

  const pendingTransactions = transactions.filter(t => t.status === 'pending').length;
  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredTransactions = filterType === 'all' 
    ? transactions 
    : transactions.filter(t => t.type === filterType);

  const getPlanStyles = (theme: string) => {
    switch(theme) {
      case 'amber': return 'border-amber-200 bg-amber-50 text-amber-900 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-100 hover:border-amber-400';
      case 'slate': return 'border-slate-200 bg-slate-50 text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 hover:border-slate-400';
      case 'yellow': return 'border-yellow-200 bg-yellow-50 text-yellow-900 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-100 hover:border-yellow-400';
      case 'indigo': return 'border-indigo-200 bg-indigo-50 text-indigo-900 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-100 hover:border-indigo-400';
      default: return 'border-border';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Ganhos Bybit</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Button>
            <span className="text-sm text-muted-foreground hidden md:block">
              Olá, {profile.name}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 px-4">
        {/* Notifications Panel */}
        {showNotifications && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notificações
                </CardTitle>
                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => notifications.forEach(n => deleteNotification(n.id))}
                  >
                    Limpar Tudo
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">Nenhuma notificação.</p>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 rounded-lg border relative ${!notif.read ? 'bg-primary/5 border-primary/20' : 'border-border'}`}
                    >
                      {!notif.read && (
                        <button
                          onClick={() => handleMarkAsRead(notif.id)}
                          className="absolute inset-0 w-full h-full cursor-pointer z-0 opacity-0"
                          title="Marcar como lida"
                        />
                      )}
                      <div className="flex items-start justify-between relative z-10">
                        <div className="flex-1">
                          <h4 className="font-medium">{notif.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">{formatDate(notif.created_at)}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notif.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Welcome Message */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Bem-vindo, {profile.name}!</h1>
          <p className="text-muted-foreground">Gerencie seus ativos e acompanhe seus lucros em tempo real.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Saldo Disponível</CardTitle>
              <DollarSign className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(profile.available_balance)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Disponível para saque</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Saldo Investido</CardTitle>
              <BarChart className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(profile.invested_balance)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Investimentos ativos</p>
              <p className="text-xs text-success mt-1">Trend: +2.5%</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Lucro Atual</CardTitle>
              <ArrowUpCircle className="h-6 w-6 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {formatCurrency(profile.profit_balance)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Lucros acumulados</p>
              <p className="text-xs text-success mt-1">Trend: +12%</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ganhos Totais</CardTitle>
              <TrendingUp className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(profile.profit_balance + profile.invested_balance)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Rendimento total</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={openDepositModal}
                className="flex-1 sm:flex-none flex items-center justify-center"
                variant="default"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Depositar
              </Button>
              <Button
                onClick={() => setWithdrawOpen(true)}
                className="flex-1 sm:flex-none flex items-center justify-center"
                variant="outline"
              >
                <MinusCircle className="mr-2 h-4 w-4" />
                Sacar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Histórico de Transações
                {pendingTransactions > 0 && (
                  <Badge variant="destructive">{pendingTransactions}</Badge>
                )}
              </CardTitle>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="investment">Investimentos</SelectItem>
                  <SelectItem value="deposit">Depósitos</SelectItem>
                  <SelectItem value="withdrawal">Saques</SelectItem>
                  <SelectItem value="profit">Lucros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">Nenhuma transação encontrada</p>
            ) : (
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      {transaction.type === 'deposit' ? (
                        <ArrowDownCircle className="h-5 w-5 text-success" />
                      ) : transaction.type === 'withdrawal' ? (
                        <ArrowUpCircle className="h-5 w-5 text-destructive" />
                      ) : transaction.type === 'investment' ? (
                        <TrendingUp className="h-5 w-5 text-primary" />
                      ) : (
                        <DollarSign className="h-5 w-5 text-success" />
                      )}
                      <div>
                        <p className="font-medium">
                          {transaction.type === 'deposit' ? 'Depósito' : 
                           transaction.type === 'withdrawal' ? 'Saque' :
                           transaction.type === 'investment' ? 'Investimento' : 'Lucro'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(transaction.created_at)}
                        </p>
                        {transaction.reference && (
                          <p className="text-xs text-muted-foreground">{transaction.reference}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(transaction.amount)}</p>
                      <Badge variant={
                        transaction.status === 'approved' || transaction.status === 'completed' ? 'default' :
                        transaction.status === 'pending' ? 'secondary' : 'destructive'
                      }>
                        {transaction.status === 'approved' || transaction.status === 'completed' ? 'Aprovado' :
                         transaction.status === 'pending' ? 'Pendente' : 'Rejeitado'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Investment Plans */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Fazer um Investimento
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Escolha o valor (R$ 200 a R$ 5.000 em incrementos de R$ 100) e duração (1 a 7 dias)
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Quick access featured plans */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground">Planos em Destaque</h3>
                <div className="grid gap-3">
                  {[200, 300, 500, 700, 1000].map((amount) => {
                    const plan = investmentPlans.find(p => p.amount === amount);
                    if (!plan) return null;
                    const profitPer3Hours = (amount / 100) * 20;
                    return (
                      <Card 
                        key={amount} 
                        className={`border cursor-pointer transition-all hover:border-primary hover:shadow-md ${
                          amount === 500 ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                        onClick={() => openInvestModal(plan)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold">{formatCurrency(amount)}</span>
                                {amount === 500 && (
                                  <Badge className="text-xs">
                                    <Star className="h-2.5 w-2.5 mr-1 fill-current" />
                                    Popular
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-success mt-1">
                                {formatCurrency(profitPer3Hours)} a cada 3h
                              </p>
                            </div>
                            <Button 
                              size="sm"
                              disabled={profile.available_balance < amount}
                            >
                              Investir
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Custom amount selector */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground">Valor Personalizado</h3>
                <Card className="border-border">
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="custom-amount">Valor do Investimento</Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                          <Input
                            id="custom-amount"
                            type="number"
                            min="200"
                            max="5000"
                            step="100"
                            placeholder="200"
                            className="pl-10"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const amount = parseInt((e.target as HTMLInputElement).value);
                                if (amount >= 200 && amount <= 5000 && amount % 100 === 0) {
                                  const plan = investmentPlans.find(p => p.amount === amount);
                                  if (plan) openInvestModal(plan);
                                }
                              }
                            }}
                          />
                        </div>
                        <Button
                          onClick={() => {
                            const input = document.getElementById('custom-amount') as HTMLInputElement;
                            const amount = parseInt(input.value);
                            if (amount >= 200 && amount <= 5000 && amount % 100 === 0) {
                              const plan = investmentPlans.find(p => p.amount === amount);
                              if (plan) {
                                openInvestModal(plan);
                                input.value = '';
                              } else {
                                toast.error('Plano não encontrado');
                              }
                            } else {
                              toast.error('Valor deve ser entre R$ 200 e R$ 5.000 em incrementos de R$ 100');
                            }
                          }}
                        >
                          Investir
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Valores de R$ 200 a R$ 5.000 em incrementos de R$ 100
                      </p>
                    </div>
                    <div className="pt-4 border-t space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Percent className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">R$ 20 de lucro para cada R$ 100 investidos</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">Distribuições a cada 3 horas (8 por dia)</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">Duração personalizável: 1 a 7 dias</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Deposit Dialog */}
      <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowDownCircle className="h-5 w-5 text-success" />
              Fazer Depósito
            </DialogTitle>
            <DialogDescription>
              Escolha o método, faça o pagamento e envie o comprovante.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDeposit} className="space-y-4">
            <div className="space-y-2">
              <Label>Método de Pagamento</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={depositMethod === 'pix' ? 'default' : 'outline'}
                  onClick={() => setDepositMethod('pix')}
                  className="w-full"
                >
                  PIX
                </Button>
                <Button
                  type="button"
                  variant={depositMethod === 'bybit' ? 'default' : 'outline'}
                  onClick={() => setDepositMethod('bybit')}
                  className="w-full"
                >
                  Bybit UID
                </Button>
                <Button
                  type="button"
                  variant={depositMethod === 'usdt' ? 'default' : 'outline'}
                  onClick={() => setDepositMethod('usdt')}
                  className="w-full"
                >
                  USDT
                </Button>
              </div>
            </div>

            {systemSettings && (
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Endereço de Destino ({depositMethod.toUpperCase()})</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(
                      depositMethod === 'pix' ? systemSettings.pix_key :
                      depositMethod === 'bybit' ? systemSettings.bybit_uid :
                      systemSettings.usdt_address
                    )}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm font-mono break-all">
                  {depositMethod === 'pix' ? (systemSettings.pix_key || 'Contate o Suporte') :
                   depositMethod === 'bybit' ? (systemSettings.bybit_uid || 'Contate o Suporte') :
                   (systemSettings.usdt_address || 'Contate o Suporte')}
                </p>
                <div className="flex items-start gap-2 text-xs text-muted-foreground mt-2">
                  <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <p>Envie o valor exato para este endereço. O processamento pode levar até 30 minutos.</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount">Valor (BRL)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                <Input
                  id="amount"
                  type="number"
                  min="50"
                  step="0.01"
                  placeholder="100,00"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="proof">Comprovante de Pagamento</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4">
                {proofFile ? (
                  <div className="text-center">
                    <CheckCircle className="w-8 h-8 mb-2 text-success mx-auto" />
                    <p className="text-sm font-medium">{proofFile.name}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setProofFile(null)}
                      className="mt-2"
                    >
                      Alterar arquivo
                    </Button>
                  </div>
                ) : (
                  <label htmlFor="proof-input" className="cursor-pointer flex flex-col items-center">
                    <ArrowUpCircle className="w-8 h-8 mb-3 text-muted-foreground" />
                    <p className="text-sm font-medium">Clique para enviar o comprovante</p>
                    <p className="text-xs text-muted-foreground mt-1">JPG, JPEG ou PNG</p>
                    <Input
                      id="proof-input"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                      className="hidden"
                      required
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setDepositOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? 'Enviando...' : 'Confirmar Depósito'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowUpCircle className="h-5 w-5 text-destructive" />
              Solicitar Saque
            </DialogTitle>
            <DialogDescription>
              Selecione o método e o valor para retirada.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleWithdrawal} className="space-y-4">
            <div className="space-y-2">
              <Label>Método de Saque</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={withdrawMethod === 'pix' ? 'default' : 'outline'}
                  onClick={() => setWithdrawMethod('pix')}
                  className="w-full"
                >
                  PIX
                </Button>
                <Button
                  type="button"
                  variant={withdrawMethod === 'bybit' ? 'default' : 'outline'}
                  onClick={() => setWithdrawMethod('bybit')}
                  className="w-full"
                >
                  Bybit UID
                </Button>
                <Button
                  type="button"
                  variant={withdrawMethod === 'usdt' ? 'default' : 'outline'}
                  onClick={() => setWithdrawMethod('usdt')}
                  className="w-full"
                >
                  USDT
                </Button>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg space-y-2">
              <Label className="text-sm">
                {withdrawMethod === 'pix' ? 'Chave' : withdrawMethod === 'bybit' ? 'UID' : 'Endereço'} Registrado
              </Label>
              {withdrawMethod === 'pix' && (
                profile.pix_key ? (
                  <p className="text-sm font-mono">{profile.pix_key}</p>
                ) : (
                  <p className="text-sm text-destructive">Não configurado</p>
                )
              )}
              {withdrawMethod === 'bybit' && (
                profile.bybit_uid ? (
                  <p className="text-sm font-mono">{profile.bybit_uid}</p>
                ) : (
                  <p className="text-sm text-destructive">Não configurado</p>
                )
              )}
              {withdrawMethod === 'usdt' && (
                profile.usdt_address ? (
                  <p className="text-sm font-mono break-all">{profile.usdt_address}</p>
                ) : (
                  <p className="text-sm text-destructive">Não configurado</p>
                )
              )}
              {((withdrawMethod === 'pix' && !profile.pix_key) ||
                (withdrawMethod === 'bybit' && !profile.bybit_uid) ||
                (withdrawMethod === 'usdt' && !profile.usdt_address)) && (
                <p className="text-xs text-muted-foreground">Contate o suporte para atualizar.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="withdrawAmount">Valor (BRL)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                <Input
                  id="withdrawAmount"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="100,00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Disponível: {formatCurrency(profile.available_balance)}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setWithdrawAmount(profile.available_balance.toString())}
                  className="h-auto py-0 px-2"
                >
                  Máximo
                </Button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setWithdrawOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? 'Processando...' : 'Solicitar Saque'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Investment Dialog */}
      {selectedPlan && (
        <Dialog open={investOpen} onOpenChange={setInvestOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirmar Investimento</DialogTitle>
              <DialogDescription>
                Escolha a duração e revise os detalhes do seu investimento
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold">{selectedPlan.name}</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valor do Aporte:</span>
                  <span className="font-bold">{formatCurrency(selectedPlan.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lucro a cada 3 horas:</span>
                  <span className="font-bold text-success">
                    {formatCurrency((selectedPlan.amount / 100) * 20)}
                  </span>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duração do Investimento:</Label>
                  <Select 
                    value={investmentDuration.toString()} 
                    onValueChange={(value) => setInvestmentDuration(parseInt(value))}
                  >
                    <SelectTrigger id="duration">
                      <SelectValue placeholder="Selecione a duração" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                        <SelectItem key={days} value={days.toString()}>
                          {days} {days === 1 ? 'dia' : 'dias'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-3 bg-muted rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Distribuições por dia:</span>
                    <span className="font-medium">8 (a cada 3 horas)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total de distribuições:</span>
                    <span className="font-medium">{investmentDuration * 8}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lucro Total Estimado:</span>
                    <span className="font-bold text-primary">
                      {formatCurrency((selectedPlan.amount / 100) * 20 * investmentDuration * 8)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setInvestOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  className="flex-1"
                  onClick={handleInvest}
                  disabled={loading || profile.available_balance < selectedPlan.amount}
                >
                  {loading ? 'Processando...' : 'Confirmar'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Withdrawal Fee Dialog */}
      {profile && (
        <WithdrawalFeeDialog
          open={feeDialogOpen}
          onOpenChange={setFeeDialogOpen}
          withdrawalId={pendingWithdrawalId}
          feeAmount={feeAmount}
          userId={profile.id}
        />
      )}
    </div>
  );
};

export default Dashboard;
