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

interface WithdrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WithdrawDialog = ({ open, onOpenChange }: WithdrawDialogProps) => {
  const { currentUser, addTransaction, platformSettings } = useApp();
  const [amount, setAmount] = useState('');
  const [pixKey, setPixKey] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;

    const numAmount = parseFloat(amount);
    const fee = (numAmount * platformSettings.withdrawalFee) / 100;
    const totalAmount = numAmount + fee;

    if (isNaN(numAmount) || numAmount < platformSettings.minimumWithdrawal) {
      toast({
        variant: 'destructive',
        title: 'Valor inválido',
        description: `O valor mínimo de saque é R$ ${platformSettings.minimumWithdrawal}.`,
      });
      return;
    }

    if (totalAmount > currentUser.balance) {
      toast({
        variant: 'destructive',
        title: 'Saldo insuficiente',
        description: `Você precisa de R$ ${totalAmount.toFixed(2)} (incluindo taxa de ${platformSettings.withdrawalFee}%).`,
      });
      return;
    }

    if (!pixKey.trim()) {
      toast({
        variant: 'destructive',
        title: 'Chave PIX obrigatória',
        description: 'Informe sua chave PIX para receber o saque.',
      });
      return;
    }

    addTransaction({
      userId: currentUser.id,
      type: 'withdrawal',
      amount: numAmount,
      status: 'pending',
      paymentMethod: pixKey
    });

    toast({
      title: 'Saque solicitado!',
      description: 'Seu saque será processado em até 24 horas.',
    });

    setAmount('');
    setPixKey('');
    onOpenChange(false);
  };

  const calculateTotal = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return 0;
    const fee = (numAmount * platformSettings.withdrawalFee) / 100;
    return numAmount + fee;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Solicitar Saque</DialogTitle>
          <DialogDescription>
            Retire seus lucros via PIX
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="withdraw-amount">Valor do Saque</Label>
            <Input
              id="withdraw-amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={platformSettings.minimumWithdrawal}
              step="0.01"
              required
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Saldo disponível: R$ {currentUser?.balance.toFixed(2)}</span>
              <span>Mínimo: R$ {platformSettings.minimumWithdrawal}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pix-key">Sua Chave PIX</Label>
            <Input
              id="pix-key"
              placeholder="CPF, Email, Telefone ou Chave Aleatória"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              required
            />
          </div>

          {amount && (
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Valor solicitado:</span>
                <span>R$ {parseFloat(amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Taxa ({platformSettings.withdrawalFee}%):</span>
                <span>R$ {((parseFloat(amount) * platformSettings.withdrawalFee) / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t border-border">
                <span>Total a deduzir:</span>
                <span>R$ {calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="bg-warning/10 p-3 rounded-lg">
            <p className="text-xs text-warning-foreground">
              O saque será processado em até 24 horas úteis. Certifique-se de que sua chave PIX está correta.
            </p>
          </div>

          <Button type="submit" className="w-full gradient-gold">
            Solicitar Saque
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
