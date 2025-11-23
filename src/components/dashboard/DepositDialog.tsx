import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Copy, Check } from 'lucide-react';

interface DepositDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DepositDialog = ({ open, onOpenChange }: DepositDialogProps) => {
  const { currentUser, addTransaction, platformSettings } = useApp();
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyPix = () => {
    navigator.clipboard.writeText(platformSettings.pixKey);
    setCopied(true);
    toast({
      title: 'Chave PIX copiada!',
      description: 'Cole a chave no seu aplicativo de pagamento.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < platformSettings.minimumDeposit) {
      toast({
        variant: 'destructive',
        title: 'Valor inválido',
        description: `O valor mínimo de depósito é R$ ${platformSettings.minimumDeposit}.`,
      });
      return;
    }

    if (!currentUser) return;

    addTransaction({
      userId: currentUser.id,
      type: 'deposit',
      amount: numAmount,
      status: 'pending',
      paymentMethod: 'PIX'
    });

    toast({
      title: 'Depósito solicitado!',
      description: 'Seu depósito será processado após confirmação do pagamento.',
    });

    setAmount('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Fazer Depósito</DialogTitle>
          <DialogDescription>
            Deposite via PIX para começar a investir
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Valor do Depósito</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={platformSettings.minimumDeposit}
              step="0.01"
              required
            />
            <p className="text-xs text-muted-foreground">
              Valor mínimo: R$ {platformSettings.minimumDeposit.toLocaleString('pt-BR')}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Chave PIX</Label>
            <div className="flex gap-2">
              <Input
                value={platformSettings.pixKey || 'Chave PIX não configurada'}
                readOnly
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleCopyPix}
                disabled={!platformSettings.pixKey}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {platformSettings.pixName} - {platformSettings.pixType}
            </p>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <p className="text-sm font-medium">Instruções:</p>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Copie a chave PIX acima</li>
              <li>Realize o pagamento no seu banco</li>
              <li>Envie o comprovante para nosso suporte</li>
              <li>Aguarde a aprovação (até 24h)</li>
            </ol>
          </div>

          <Button type="submit" className="w-full gradient-gold">
            Solicitar Depósito
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
