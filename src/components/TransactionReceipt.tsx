import { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  TrendingUp, 
  DollarSign, 
  Download, 
  Share2,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/format';
import { Transaction } from '@/context/AppContext';

interface TransactionReceiptProps {
  transaction: Transaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
}

export const TransactionReceipt = ({ 
  transaction, 
  open, 
  onOpenChange,
  userName 
}: TransactionReceiptProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const getTransactionIcon = () => {
    switch (transaction.type) {
      case 'deposit':
        return <ArrowDownCircle className="h-8 w-8 text-success" />;
      case 'withdrawal':
        return <ArrowUpCircle className="h-8 w-8 text-destructive" />;
      case 'investment':
        return <TrendingUp className="h-8 w-8 text-primary" />;
      default:
        return <DollarSign className="h-8 w-8 text-success" />;
    }
  };

  const getTransactionTypeLabel = () => {
    switch (transaction.type) {
      case 'deposit':
        return 'Depósito Recebido';
      case 'withdrawal':
        return 'Saque Enviado';
      case 'investment':
        return 'Investimento';
      default:
        return 'Lucro';
    }
  };

  const getStatusBadge = () => {
    switch (transaction.status) {
      case 'completed':
      case 'approved':
        return (
          <Badge className="bg-success text-success-foreground">
            <CheckCircle className="h-3 w-3 mr-1" />
            Concluído
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Pendente
          </Badge>
        );
      default:
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Rejeitado
          </Badge>
        );
    }
  };

  // Parse sender/recipient details from reference
  const parseTransactionDetails = () => {
    if (!transaction.reference) return null;
    
    const details: Record<string, string> = {};
    
    if (transaction.type === 'deposit' && transaction.reference.includes('PIX Recebido')) {
      const parts = transaction.reference.split(' | ');
      parts.forEach(part => {
        if (part.includes('PIX Recebido de ')) {
          details['Remetente'] = part.replace('PIX Recebido de ', '');
        } else if (part.includes('CPF:')) {
          details['CPF Remetente'] = part.replace('CPF: ', '');
        } else if (part.includes('Banco:')) {
          details['Banco'] = part.replace('Banco: ', '');
        } else if (part.includes('Chave:')) {
          details['Chave PIX'] = part.replace('Chave: ', '');
        }
      });
    } else if (transaction.type === 'withdrawal' && transaction.reference.includes('PIX Enviado')) {
      const parts = transaction.reference.split(' | ');
      parts.forEach(part => {
        if (part.includes('PIX Enviado para ')) {
          details['Destinatário'] = part.replace('PIX Enviado para ', '');
        } else if (part.includes('Chave:')) {
          details['Chave PIX'] = part.replace('Chave: ', '');
        } else if (part.includes('Banco:')) {
          details['Banco'] = part.replace('Banco: ', '');
        }
      });
    }
    
    return Object.keys(details).length > 0 ? details : null;
  };

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;
    
    try {
      // Dynamic import for jspdf and html2canvas
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas')
      ]);
      
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: '#1a1a1a',
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`comprovante-${transaction.id.slice(0, 8)}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback: print the receipt
      window.print();
    }
  };

  const handleShare = async () => {
    if (!receiptRef.current) return;
    
    try {
      const { default: html2canvas } = await import('html2canvas');
      
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: '#1a1a1a',
        logging: false
      });
      
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        const file = new File([blob], `comprovante-${transaction.id.slice(0, 8)}.png`, {
          type: 'image/png'
        });
        
        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Comprovante de Transação',
            text: `Comprovante de ${getTransactionTypeLabel()} - ${formatCurrency(transaction.amount)}`,
            files: [file]
          });
        } else {
          // Fallback: download the image
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `comprovante-${transaction.id.slice(0, 8)}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const details = parseTransactionDetails();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Comprovante de Transação</DialogTitle>
        </DialogHeader>
        
        {/* Receipt Content */}
        <div ref={receiptRef} className="bg-card rounded-lg p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                {getTransactionIcon()}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold">{getTransactionTypeLabel()}</h3>
              <p className="text-3xl font-bold text-primary mt-2">
                {transaction.type === 'withdrawal' ? '-' : '+'}{formatCurrency(transaction.amount)}
              </p>
            </div>
            <div className="flex justify-center">
              {getStatusBadge()}
            </div>
          </div>

          <Separator />

          {/* Transaction Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">ID da Transação</span>
              <span className="font-mono text-xs">{transaction.id.slice(0, 16)}...</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Data e Hora</span>
              <span className="text-sm">{formatDate(transaction.created_at)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {transaction.type === 'withdrawal' ? 'Remetente' : 'Destinatário'}
              </span>
              <span className="text-sm font-medium">{userName}</span>
            </div>

            {details && (
              <>
                <Separator />
                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">
                    {transaction.type === 'deposit' ? 'Dados do Remetente' : 'Dados do Destinatário'}
                  </p>
                  {Object.entries(details).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{key}</span>
                      <span className="text-sm font-medium text-right max-w-[60%] break-all">{value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {transaction.reference && !details && (
              <>
                <Separator />
                <div>
                  <span className="text-sm text-muted-foreground">Referência</span>
                  <p className="text-sm mt-1 break-all">{transaction.reference}</p>
                </div>
              </>
            )}
          </div>

          <Separator />

          {/* Footer */}
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Ganhos Bybit - Plataforma de Investimentos
            </p>
            <p className="text-xs text-muted-foreground">
              Comprovante gerado em {new Date().toLocaleString('pt-BR')}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleDownloadPDF}
          >
            <Download className="h-4 w-4 mr-2" />
            Baixar PDF
          </Button>
          <Button
            className="flex-1 gradient-gold"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
