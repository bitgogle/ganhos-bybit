import { useRef, useState } from 'react';
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
  XCircle,
  Loader2
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/format';
import { Transaction } from '@/context/AppContext';
import { toast } from 'sonner';

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
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

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

  // Capture the receipt as a high-quality image
  const captureReceiptAsImage = async (): Promise<HTMLCanvasElement | null> => {
    if (!receiptRef.current) return null;
    
    const { default: html2canvas } = await import('html2canvas');
    
    // Capture the receipt with high quality settings
    const canvas = await html2canvas(receiptRef.current, {
      scale: 3, // High resolution for clear image
      backgroundColor: '#1a1a1a',
      logging: false,
      useCORS: true,
      allowTaint: true,
      width: receiptRef.current.scrollWidth,
      height: receiptRef.current.scrollHeight,
    });
    
    return canvas;
  };

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;
    
    setIsGeneratingPDF(true);
    
    try {
      const { default: jsPDF } = await import('jspdf');
      
      // Capture receipt as image
      const canvas = await captureReceiptAsImage();
      if (!canvas) {
        throw new Error('Failed to capture receipt');
      }
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Calculate dimensions to fit the receipt image in PDF
      // A4 dimensions: 210mm x 297mm
      const pdfWidth = 210;
      const pdfHeight = 297;
      const margin = 10;
      const availableWidth = pdfWidth - (margin * 2);
      const availableHeight = pdfHeight - (margin * 2);
      
      // Calculate the image dimensions maintaining aspect ratio
      const imgAspectRatio = canvas.width / canvas.height;
      let imgWidth = availableWidth;
      let imgHeight = imgWidth / imgAspectRatio;
      
      // If height exceeds available height, scale down
      if (imgHeight > availableHeight) {
        imgHeight = availableHeight;
        imgWidth = imgHeight * imgAspectRatio;
      }
      
      // Center the image horizontally
      const xOffset = margin + (availableWidth - imgWidth) / 2;
      
      // Create PDF with the receipt image
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add the receipt image to PDF (full receipt as image, not text)
      pdf.addImage(imgData, 'PNG', xOffset, margin, imgWidth, imgHeight);
      
      // Save the PDF
      pdf.save(`comprovante-${transaction.id.slice(0, 8)}.pdf`);
      
      toast.success('PDF do comprovante baixado com sucesso!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleShare = async () => {
    if (!receiptRef.current) return;
    
    setIsSharing(true);
    
    try {
      // Capture receipt as image
      const canvas = await captureReceiptAsImage();
      if (!canvas) {
        throw new Error('Failed to capture receipt');
      }
      
      // Convert canvas to blob
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), 'image/png', 1.0);
      });
      
      if (!blob) {
        throw new Error('Failed to create image blob');
      }
      
      const fileName = `comprovante-${transaction.id.slice(0, 8)}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });
      
      // Try native share API first
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Comprovante de Transação - Ganhos Bybit',
          text: `Comprovante de ${getTransactionTypeLabel()} - ${formatCurrency(transaction.amount)}`,
          files: [file]
        });
        toast.success('Comprovante compartilhado!');
      } else {
        // Fallback: download the image directly
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success('Imagem do comprovante baixada!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Erro ao compartilhar. Tente novamente.');
    } finally {
      setIsSharing(false);
    }
  };

  const details = parseTransactionDetails();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Comprovante de Transação</DialogTitle>
        </DialogHeader>
        
        {/* Receipt Content - This entire div is captured as an image for PDF */}
        <div 
          ref={receiptRef} 
          className="bg-[#1a1a1a] rounded-lg p-6 space-y-6 border border-border"
          style={{ backgroundColor: '#1a1a1a' }}
        >
          {/* Header with Logo */}
          <div className="text-center space-y-1 pb-2">
            <h2 className="text-lg font-bold text-primary">Ganhos Bybit</h2>
            <p className="text-xs text-muted-foreground">Comprovante de Transação</p>
          </div>

          <Separator />

          {/* Transaction Type Icon and Amount */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                {getTransactionIcon()}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{getTransactionTypeLabel()}</h3>
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
              <span className="font-mono text-xs text-white">{transaction.id}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Data e Hora</span>
              <span className="text-sm text-white">{formatDate(transaction.created_at)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {transaction.type === 'withdrawal' ? 'Remetente' : 'Destinatário'}
              </span>
              <span className="text-sm font-medium text-white">{userName}</span>
            </div>

            {details && (
              <>
                <Separator />
                <div className="space-y-3">
                  <p className="text-sm font-medium text-primary">
                    {transaction.type === 'deposit' ? 'Dados do Remetente' : 'Dados do Destinatário'}
                  </p>
                  {Object.entries(details).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-start">
                      <span className="text-sm text-muted-foreground">{key}</span>
                      <span className="text-sm font-medium text-white text-right max-w-[60%] break-all">{value}</span>
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
                  <p className="text-sm mt-1 break-all text-white">{transaction.reference}</p>
                </div>
              </>
            )}
          </div>

          <Separator />

          {/* Footer */}
          <div className="text-center space-y-2 pt-2">
            <p className="text-xs text-muted-foreground">
              Ganhos Bybit - Plataforma de Investimentos
            </p>
            <p className="text-xs text-muted-foreground">
              Comprovante gerado em {new Date().toLocaleString('pt-BR')}
            </p>
            <p className="text-xs text-primary font-medium">
              www.ganhosbybit.com
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            {isGeneratingPDF ? 'Gerando...' : 'Baixar PDF'}
          </Button>
          <Button
            className="flex-1 gradient-gold"
            onClick={handleShare}
            disabled={isSharing}
          >
            {isSharing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Share2 className="h-4 w-4 mr-2" />
            )}
            {isSharing ? 'Compartilhando...' : 'Compartilhar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
