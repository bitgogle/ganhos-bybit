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
        toast.error('Please enter a valid fee amount.');
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

      toast.success('Fee settings updated successfully!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-blue-200 bg-white">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-black">Withdrawal Fee</CardTitle>
        </div>
        <CardDescription className="text-gray-500">
          Configure the additional fee charged on user withdrawals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="fee-enabled" className="text-black">Enable Withdrawal Fee</Label>
            <p className="text-sm text-gray-500">
              Require fee payment to process withdrawals
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
              <Label htmlFor="fee-amount" className="text-black">Fee Amount (R$)</Label>
              <Input
                id="fee-amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="Ex: 10.00"
                value={feeAmount}
                onChange={(e) => setFeeAmount(e.target.value)}
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fee-mode" className="text-black">Fee Mode</Label>
              <Select value={feeMode} onValueChange={(v) => setFeeMode(v as 'deduct' | 'deposit')}>
                <SelectTrigger id="fee-mode" className="border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deduct">
                    Deduct from Balance - Fee is deducted from available balance
                  </SelectItem>
                  <SelectItem value="deposit">
                    Separate Deposit - User needs to deposit the fee separately
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        <Button onClick={handleSave} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardContent>
    </Card>
  );
};
