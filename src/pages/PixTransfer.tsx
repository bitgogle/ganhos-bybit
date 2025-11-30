import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Send, Wallet, Building2 } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import { toast } from 'sonner';
import { brazilianBanks } from '@/lib/brazilianData';

const PixTransfer = () => {
  const { profile, refreshProfile } = useApp();
  const navigate = useNavigate();
  const [pixKey, setPixKey] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'key' | 'details' | 'confirm'>('key');

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pixKey.trim()) {
      toast.error('Por favor, digite a chave PIX do destinatário.');
      return;
    }
    setStep('details');
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim()) {
      toast.error('Por favor, digite o nome do destinatário.');
      return;
    }
    if (!selectedBank) {
      toast.error('Por favor, selecione o banco/app do destinatário.');
      return;
    }
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error('Por favor, digite um valor válido.');
      return;
    }
    if (amountValue > (profile?.available_balance || 0)) {
      toast.error('Saldo insuficiente para esta transferência.');
      return;
    }
    setStep('confirm');
  };

  const handleTransfer = async () => {
    if (!profile) return;

    const amountValue = parseFloat(amount);
    
    setLoading(true);

    try {
      // Deduct from user balance
      const newBalance = profile.available_balance - amountValue;
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ available_balance: newBalance })
        .eq('id', profile.id);

      if (profileError) throw profileError;

      // Create transaction record
      const { error: txError } = await supabase
        .from('transactions')
        .insert({
          user_id: profile.id,
          amount: Math.round(amountValue * 100) / 100,
          type: 'withdrawal',
          status: 'completed',
          reference: `PIX Enviado para ${recipientName} | Chave: ${pixKey} | Banco: ${selectedBank}`
        });

      if (txError) {
        // Rollback balance update
        await supabase
          .from('profiles')
          .update({ available_balance: profile.available_balance })
          .eq('id', profile.id);
        throw txError;
      }

      toast.success(`Transferência de ${formatCurrency(amountValue)} realizada com sucesso!`);
      await refreshProfile();
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao realizar transferência');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container max-w-md mx-auto">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => step === 'key' ? navigate('/dashboard') : setStep(step === 'confirm' ? 'details' : 'key')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <Card className="border-border">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Send className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Transferência PIX</CardTitle>
            <CardDescription>
              {step === 'key' && 'Digite a chave PIX do destinatário'}
              {step === 'details' && 'Complete os dados da transferência'}
              {step === 'confirm' && 'Confirme os dados da transferência'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Saldo Disponível</span>
                </div>
                <span className="text-xl font-bold text-primary">
                  {formatCurrency(profile.available_balance)}
                </span>
              </div>
            </div>

            {step === 'key' && (
              <form onSubmit={handleKeySubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="pixKey">Chave PIX do Destinatário</Label>
                  <Input
                    id="pixKey"
                    type="text"
                    placeholder="CPF, CNPJ, Email, Telefone ou Chave Aleatória"
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>

                <Button type="submit" className="w-full h-12 gradient-gold">
                  Continuar
                </Button>
              </form>
            )}

            {step === 'details' && (
              <form onSubmit={handleDetailsSubmit} className="space-y-6">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Chave PIX</p>
                  <p className="font-medium">{pixKey}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipientName">Nome do Destinatário</Label>
                  <Input
                    id="recipientName"
                    type="text"
                    placeholder="Digite o nome completo do destinatário"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bank">Banco/App do Destinatário</Label>
                  <Select value={selectedBank} onValueChange={setSelectedBank}>
                    <SelectTrigger id="bank" className="h-12">
                      <SelectValue placeholder="Selecione o banco ou app" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {brazilianBanks.map((bank) => (
                        <SelectItem key={bank} value={bank}>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            {bank}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Valor da Transferência</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                      R$
                    </span>
                    <Input
                      id="amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      max={profile.available_balance}
                      placeholder="0,00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-10 text-lg h-12"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 gradient-gold">
                  Revisar Transferência
                </Button>
              </form>
            )}

            {step === 'confirm' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Destinatário</span>
                      <span className="font-medium">{recipientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Chave PIX</span>
                      <span className="font-mono text-sm">{pixKey}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Banco/App</span>
                      <span className="text-sm">{selectedBank}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between">
                      <span className="text-sm text-muted-foreground">Valor</span>
                      <span className="text-xl font-bold text-primary">
                        {formatCurrency(parseFloat(amount))}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-center">
                      Após confirmar, o valor será debitado do seu saldo imediatamente.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-12"
                    onClick={() => setStep('details')}
                  >
                    Editar
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 h-12 gradient-gold"
                    onClick={handleTransfer}
                    disabled={loading}
                  >
                    {loading ? 'Processando...' : 'Confirmar PIX'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PixTransfer;
