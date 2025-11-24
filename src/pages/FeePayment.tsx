import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Clock, Upload, AlertCircle, CheckCircle, XCircle, Copy, ArrowLeft } from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/lib/format';
import { SystemSettings, FeeRequest } from '@/context/AppContext';
import { toast } from 'sonner';

const FeePayment = () => {
  const { feeId } = useParams();
  const navigate = useNavigate();
  const { profile } = useApp();
  const [feeRequest, setFeeRequest] = useState<FeeRequest | null>(null);
  const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');

  const fetchFeeRequest = useCallback(async () => {
    if (!feeId || !profile) return;

    try {
      const { data, error } = await supabase
        .from('fee_requests')
        .select('*')
        .eq('id', feeId)
        .eq('user_id', profile.id)
        .single();

      if (error) throw error;
      setFeeRequest(data as FeeRequest);
    } catch (err) {
      console.error('Error fetching fee request:', err);
      toast.error('Solicitação de taxa não encontrada.');
      navigate('/dashboard');
    }
  }, [feeId, profile, navigate]);

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

  useEffect(() => {
    fetchFeeRequest();
    fetchSettings();
  }, [fetchFeeRequest]);

  // Timer countdown
  useEffect(() => {
    if (!feeRequest || feeRequest.status !== 'pending') return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(feeRequest.expires_at).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft('EXPIRADO');
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [feeRequest]);

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !feeRequest || !proofFile) {
      toast.error('Por favor, selecione o comprovante de pagamento.');
      return;
    }

    setLoading(true);

    try {
      const fileExt = proofFile.name.split('.').pop();
      const fileName = `fee_${feeRequest.id}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('proofs')
        .upload(fileName, proofFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('proofs').getPublicUrl(fileName);

      const { error } = await supabase
        .from('fee_requests')
        .update({ proof_url: publicUrl })
        .eq('id', feeRequest.id);

      if (error) throw error;

      toast.success('Comprovante enviado com sucesso! Aguarde a aprovação do administrador.');
      fetchFeeRequest();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao enviar comprovante.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado!');
  };

  if (!profile || !feeRequest) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  const isExpired = new Date(feeRequest.expires_at).getTime() < new Date().getTime();
  const canUploadProof = feeRequest.status === 'pending' && !isExpired && !feeRequest.proof_url;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50">
        <div className="container flex h-16 items-center px-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Button>
        </div>
      </header>

      <main className="container max-w-3xl py-8 px-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pagamento de Taxa de Saque</CardTitle>
                <CardDescription>
                  ID da Solicitação: {feeRequest.id.substring(0, 8)}...
                </CardDescription>
              </div>
              <Badge variant={
                feeRequest.status === 'accepted' ? 'default' :
                feeRequest.status === 'rejected' ? 'destructive' :
                feeRequest.status === 'expired' ? 'secondary' :
                'secondary'
              }>
                {feeRequest.status === 'accepted' ? 'Aprovado' :
                 feeRequest.status === 'rejected' ? 'Rejeitado' :
                 feeRequest.status === 'expired' ? 'Expirado' :
                 'Pendente'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Amount */}
            <div className="bg-primary/5 border border-primary/20 p-6 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-2">Valor da Taxa</p>
              <p className="text-3xl font-bold text-primary">{formatCurrency(feeRequest.amount)}</p>
            </div>

            {/* Timer */}
            {feeRequest.status === 'pending' && !isExpired && (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  <strong>Tempo Restante:</strong> {timeLeft}
                </AlertDescription>
              </Alert>
            )}

            {isExpired && feeRequest.status === 'pending' && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  Esta solicitação expirou. Entre em contato com o suporte.
                </AlertDescription>
              </Alert>
            )}

            {/* Payment Info */}
            {systemSettings && canUploadProof && (
              <div className="space-y-3">
                <Label>Informações para Pagamento:</Label>
                
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

            {/* Upload Proof */}
            {canUploadProof && (
              <form onSubmit={handleSubmitProof} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="proof">Comprovante de Pagamento</Label>
                  <Input
                    id="proof"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Envie uma imagem ou PDF do comprovante de pagamento
                  </p>
                </div>

                <Button type="submit" disabled={loading || !proofFile} className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  {loading ? 'Enviando...' : 'Enviar Comprovante'}
                </Button>
              </form>
            )}

            {feeRequest.proof_url && feeRequest.status === 'pending' && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Comprovante enviado! Aguarde a análise do administrador.
                </AlertDescription>
              </Alert>
            )}

            {feeRequest.status === 'accepted' && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Taxa aprovada! Seu saque será processado em breve.
                </AlertDescription>
              </Alert>
            )}

            {feeRequest.status === 'rejected' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Taxa rejeitada. Entre em contato com o suporte para mais informações.
                </AlertDescription>
              </Alert>
            )}

            {/* Info */}
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Criado em: {formatDateTime(feeRequest.created_at)}</p>
              <p>Expira em: {formatDateTime(feeRequest.expires_at)}</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default FeePayment;
