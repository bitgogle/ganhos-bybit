import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, PlusCircle, Wallet } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import { toast } from 'sonner';
import { generateRandomPixSender } from '@/lib/brazilianData';

const AddFunds = () => {
  const { profile, refreshProfile } = useApp();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    const amountValue = parseFloat(amount);
    
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error('Por favor, digite um valor válido maior que zero.');
      return;
    }

    if (amountValue > 1000000) {
      toast.error('Valor máximo permitido é R$ 1.000.000,00');
      return;
    }

    setLoading(true);

    try {
      // Generate random Brazilian PIX sender details
      const senderDetails = generateRandomPixSender();

      // Update user balance
      const newBalance = profile.available_balance + amountValue;
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ available_balance: newBalance })
        .eq('id', profile.id);

      if (profileError) throw profileError;

      // Create transaction record with sender details
      const { error: txError } = await supabase
        .from('transactions')
        .insert({
          user_id: profile.id,
          amount: Math.round(amountValue * 100) / 100,
          type: 'deposit',
          status: 'completed',
          reference: `PIX Recebido de ${senderDetails.name} | CPF: ${senderDetails.cpf} | Banco: ${senderDetails.bank} | Chave: ${senderDetails.pixKey}`
        });

      if (txError) {
        // Rollback balance update
        await supabase
          .from('profiles')
          .update({ available_balance: profile.available_balance })
          .eq('id', profile.id);
        throw txError;
      }

      toast.success(`${formatCurrency(amountValue)} adicionado ao seu saldo com sucesso!`);
      setAmount('');
      await refreshProfile();
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao adicionar fundos');
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
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <Card className="border-border">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <PlusCircle className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Adicionar Fundos</CardTitle>
            <CardDescription>
              Adicione saldo à sua conta instantaneamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Saldo Atual</span>
                </div>
                <span className="text-xl font-bold text-primary">
                  {formatCurrency(profile.available_balance)}
                </span>
              </div>
            </div>

            <form onSubmit={handleAddFunds} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Valor a Adicionar</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                    R$
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0,00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10 text-lg h-12"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Digite o valor que deseja adicionar ao seu saldo
                </p>
              </div>

              {amount && parseFloat(amount) > 0 && (
                <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Novo Saldo</span>
                    <span className="text-lg font-bold text-success">
                      {formatCurrency(profile.available_balance + parseFloat(amount || '0'))}
                    </span>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-lg gradient-gold"
                disabled={loading || !amount || parseFloat(amount) <= 0}
              >
                {loading ? 'Processando...' : 'PROCEED'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddFunds;
