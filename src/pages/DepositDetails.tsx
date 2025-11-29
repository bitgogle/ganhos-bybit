import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Copy, Upload, Clock, ArrowLeft, Building } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import { getErrorMessage } from '@/lib/utils';
import { toast } from 'sonner';
import { SystemSettings } from '@/context/AppContext';

const DepositDetails = () => {
  const { method } = useParams<{ method: 'pix' | 'bybit' | 'usdt' }>();
  const { profile } = useApp();
  const navigate = useNavigate();
  const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds

  useEffect(() => {
    if (!profile) {
      navigate('/login');
      return;
    }
    fetchSettings();
  }, [profile, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from('system_settings').select('*').maybeSingle();
    if (data) setSystemSettings(data as SystemSettings);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado!`);
  };

  const handleSubmit = async () => {
    if (!profile || !depositAmount || !proofFile) {
      toast.error('Por favor, preencha todos os campos e envie o comprovante.');
      return;
    }

    const amount = parseFloat(depositAmount);
    if (amount < 50) {
      toast.error('Valor mínimo de depósito é R$ 50');
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

      const methodLabel = method === 'pix' ? 'PIX' : method === 'bybit' ? 'Bybit UID' : 'USDT (TRC20)';
      const roundedAmount = Math.round(amount * 100) / 100;

      const { error } = await supabase.from('transactions').insert({
        user_id: profile.id,
        amount: roundedAmount,
        type: 'deposit',
        status: 'pending',
        reference: `Depósito via ${methodLabel}`,
        proof_url: publicUrl
      });

      if (error) throw error;

      toast.success('Depósito marcado como pago! Aguarde aprovação.');
      navigate('/dashboard');
    } catch (err: unknown) {
      toast.error(getErrorMessage(err) || 'Erro ao processar depósito.');
    } finally {
      setLoading(false);
    }
  };

  if (!profile || !systemSettings || !method) return null;

  const getTitle = () => {
    switch(method) {
      case 'pix': return 'Pix-Deposit';
      case 'bybit': return 'BYBIT UID Deposit';
      case 'usdt': return 'Crypto-Deposit';
      default: return 'Deposit';
    }
  };

  const getInstructions = () => {
    switch(method) {
      case 'pix':
        return [
          '1. Open your bank app.',
          "3. Use the 'Pix Copia e Cola' option.",
          '4. Paste the Pix Key.',
          '5. Confirm : Pix Key.',
          '6. Complete ho payment.',
          '6. Take ito the screenshot of he receipto.',
          '8. Upload the screenshot above.',
          "9. Click 'MARK AS PAID.",
        ];
      case 'usdt':
        return [
          '1. Open your exchange (e. g), Bybit) or wallet.',
          '2. Select UST , TRC20 network.',
          '3. Copy a Wallet Address above.',
          '4. Enter amount',
          '5. Complete transfer.',
          '7. Take ito the screenshot of he receipto.',
          '8. Upload the screenshot below.',
          "9. Click 'MARK AS PAID.",
        ];
      case 'bybit':
        return [
          '1. Open your  BYBIT',
          '2. Select UST, "Internal Transfer."',
          '',
          '3. Upload the screenshot of he receipto.',
          "4. Click 'MARK AS PAID.",
          '',
          'Instructions:',
          'STRICTLY FOR BYBIT APP TRANSFERS ONLY. USE',
          'USE THIS BYBIT UID WITHIN YOUR BYBIT APP',
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <Card className="bg-card border-border">
          <CardContent className="p-6 space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Building className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">{getTitle()}</h1>
              </div>
            </div>

            {/* Time Limit */}
            <div className="flex items-center justify-center gap-4">
              <h2 className="text-5xl font-bold">{formatTime(timeLeft)}</h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-5 w-5" />
                <span className="text-lg">TIME LIMIT</span>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-3">
              {method === 'pix' && (
                <>
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">Pix key</p>
                      <p className="font-mono text-sm">{"*".repeat(20)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(systemSettings.pix_key || '', 'Pix Key')}
                    >
                      <Copy className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">Name</p>
                      <p className="font-mono text-sm">{"*".repeat(15)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(systemSettings.pix_name || '', 'Name')}
                    >
                      <Copy className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">Bank</p>
                      <p className="font-mono text-sm">{"*".repeat(15)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(systemSettings.pix_bank || '', 'Bank')}
                    >
                      <Copy className="h-5 w-5" />
                    </Button>
                  </div>
                </>
              )}

              {method === 'usdt' && (
                <>
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">Coin</p>
                      <Badge variant="secondary" className="mt-1">USDT</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">Network</p>
                      <Badge variant="secondary" className="mt-1">TRC20</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">Wallet Address</p>
                      <p className="font-mono text-xs break-all">{"*".repeat(30)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(systemSettings.usdt_address || '', 'Wallet Address')}
                    >
                      <Copy className="h-5 w-5" />
                    </Button>
                  </div>
                </>
              )}

              {method === 'bybit' && (
                <>
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">Coin</p>
                      <Badge variant="secondary" className="mt-1">USDT</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">BYBIT UID</p>
                      <p className="font-mono text-sm">{"*".repeat(15)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(systemSettings.bybit_uid || '', 'BYBIT UID')}
                    >
                      <Copy className="h-5 w-5" />
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Deposit Amount */}
            <div>
              <h3 className="text-xl font-bold mb-2">Deposit Amount:</h3>
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Digite o valor"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="text-lg"
                />
                {depositAmount && (
                  <p className="text-2xl font-bold">
                    Deposit Amount: {formatCurrency(parseFloat(depositAmount) || 0)}
                  </p>
                )}
              </div>
            </div>

            {/* Upload Proof */}
            <div>
              <h3 className="text-xl font-bold mb-3">Upload Payment Proof</h3>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="proof-upload"
                  accept="image/*"
                  onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <label
                  htmlFor="proof-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {proofFile ? proofFile.name : 'Drag & drop files here or click to upload'}
                  </span>
                </label>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-2">
              {getInstructions().map((instruction, index) => (
                <p key={index} className="text-sm">
                  {instruction}
                </p>
              ))}
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={loading || !depositAmount || !proofFile}
              className="w-full gradient-gold shadow-gold text-lg py-6 font-bold"
            >
              {loading ? 'PROCESSANDO...' : 'MARK AS PAID'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DepositDetails;
