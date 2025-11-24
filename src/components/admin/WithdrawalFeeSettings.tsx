import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const WithdrawalFeeSettings = () => {
  const [loading, setLoading] = useState(false);
  const [feeEnabled, setFeeEnabled] = useState(false);
  const [feeAmount, setFeeAmount] = useState('');
  const [feeMode, setFeeMode] = useState<'deduct' | 'deposit'>('deduct');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setFeeEnabled(data.withdrawal_fee_enabled || false);
        setFeeAmount(data.withdrawal_fee_amount?.toString() || '');
        setFeeMode((data.withdrawal_fee_mode as 'deduct' | 'deposit') || 'deduct');
      }
    } catch (err: any) {
      console.error('Error fetching fee settings:', err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const amount = parseFloat(feeAmount);
      if (feeEnabled && (isNaN(amount) || amount <= 0)) {
        toast.error('Por favor, insira um valor de taxa válido.');
        return;
      }

      const { error } = await supabase
        .from('system_settings')
        .update({
          withdrawal_fee_enabled: feeEnabled,
          withdrawal_fee_amount: feeEnabled ? amount : 0,
          withdrawal_fee_mode: feeMode,
        })
        .eq('id', 1);

      if (error) throw error;

      toast.success('Configurações de taxa atualizadas com sucesso!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <CardTitle>Taxa de Saque</CardTitle>
        </div>
        <CardDescription>
          Configure a taxa adicional cobrada nos saques dos usuários
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="fee-enabled">Ativar Taxa de Saque</Label>
            <p className="text-sm text-muted-foreground">
              Exigir pagamento de taxa para processar saques
            </p>
          </div>
          <Switch
            id="fee-enabled"
            checked={feeEnabled}
            onCheckedChange={setFeeEnabled}
          />
        </div>

        {feeEnabled && (
          <>
            <div className="space-y-2">
              <Label htmlFor="fee-amount">Valor da Taxa (R$)</Label>
              <Input
                id="fee-amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="Ex: 10.00"
                value={feeAmount}
                onChange={(e) => setFeeAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fee-mode">Modo de Cobrança</Label>
              <Select value={feeMode} onValueChange={(v) => setFeeMode(v as 'deduct' | 'deposit')}>
                <SelectTrigger id="fee-mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deduct">
                    Deduzir do Saldo - A taxa é descontada do saldo disponível
                  </SelectItem>
                  <SelectItem value="deposit">
                    Depósito Separado - Usuário precisa depositar a taxa separadamente
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        <Button onClick={handleSave} disabled={loading} className="w-full">
          {loading ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </CardContent>
    </Card>
  );
};
