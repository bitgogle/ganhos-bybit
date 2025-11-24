import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Clock, Copy, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import { supabase } from '@/integrations/supabase/client';
import { SystemSettings } from '@/context/AppContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface WithdrawalFeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  withdrawalId: string;
  feeAmount: number;
  userId: string;
}

export const WithdrawalFeeDialog = ({ open, onOpenChange, withdrawalId, feeAmount, userId }: WithdrawalFeeDialogProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null);

  useEffect(() => {
    if (open) {
      fetchSettings();
    }
  }, [open]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      if (data) setSystemSettings(data as SystemSettings);
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  const handleProceedToPayment = async () => {
    setLoading(true);
    try {
      // Create fee request
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 3);

      const { data, error } = await supabase
        .from('fee_requests')
        .insert({
          user_id: userId,
          related_withdrawal_id: withdrawalId,
          amount: feeAmount,
          status: 'pending',
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Solicitação de taxa criada! Você será redirecionado para a página de pagamento.');
      onOpenChange(false);
      
      // Navigate to fee payment page
      navigate(`/fee-payment/${data.id}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado!');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            Taxa de Saque Requerida
          </DialogTitle>
          <DialogDescription>
            Para processar seu saque, é necessário pagar uma taxa administrativa.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Você terá 3 horas para realizar o pagamento da taxa após iniciar o processo.
            </AlertDescription>
          </Alert>

          <div className="bg-muted p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Valor da Taxa:</span>
              <span className="text-lg font-bold text-primary">{formatCurrency(feeAmount)}</span>
            </div>
          </div>

          {systemSettings && (
            <div className="space-y-3 text-sm">
              <p className="font-medium">Informações para Pagamento:</p>
              
              {systemSettings.pix_key && (
                <div className="flex items-center justify-between p-3 bg-background border rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Chave PIX</p>
                    <p className="font-mono">{systemSettings.pix_key}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(systemSettings.pix_key || '')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {systemSettings.bybit_uid && (
                <div className="flex items-center justify-between p-3 bg-background border rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Bybit UID</p>
                    <p className="font-mono">{systemSettings.bybit_uid}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(systemSettings.bybit_uid || '')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {systemSettings.usdt_address && (
                <div className="flex items-center justify-between p-3 bg-background border rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">USDT (TRC20)</p>
                    <p className="font-mono text-xs break-all">{systemSettings.usdt_address}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(systemSettings.usdt_address || '')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Seu saque será processado somente após a confirmação do pagamento da taxa pelo administrador.
            </AlertDescription>
          </Alert>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancelar
          </Button>
          <Button onClick={handleProceedToPayment} disabled={loading} className="flex-1">
            {loading ? 'Processando...' : 'Prosseguir com Pagamento'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
