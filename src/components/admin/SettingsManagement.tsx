import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Settings, Save } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const SettingsManagement = () => {
  const { platformSettings, updatePlatformSettings } = useApp();
  const { toast } = useToast();
  const [settings, setSettings] = useState(platformSettings);

  useEffect(() => {
    setSettings(platformSettings);
  }, [platformSettings]);

  const handleChange = (field: string, value: string | number) => {
    setSettings({
      ...settings,
      [field]: value
    });
  };

  const handleSave = () => {
    updatePlatformSettings(settings);
    toast({
      title: 'Settings saved',
      description: 'Platform settings have been updated successfully.',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Platform Settings
          </CardTitle>
          <CardDescription>Configure global platform parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* PIX Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">PIX Payment Configuration</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pixKey">PIX Key</Label>
                <Input
                  id="pixKey"
                  value={settings.pixKey}
                  onChange={(e) => handleChange('pixKey', e.target.value)}
                  placeholder="Enter PIX key"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pixName">Account Name</Label>
                <Input
                  id="pixName"
                  value={settings.pixName}
                  onChange={(e) => handleChange('pixName', e.target.value)}
                  placeholder="Account holder name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pixType">PIX Key Type</Label>
                <Select
                  value={settings.pixType}
                  onValueChange={(value) => handleChange('pixType', value)}
                >
                  <SelectTrigger id="pixType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CPF">CPF</SelectItem>
                    <SelectItem value="CNPJ">CNPJ</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Phone">Phone</SelectItem>
                    <SelectItem value="Random">Random Key</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Transaction Limits */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Transaction Limits</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="minimumDeposit">Minimum Deposit (R$)</Label>
                <Input
                  id="minimumDeposit"
                  type="number"
                  step="0.01"
                  value={settings.minimumDeposit}
                  onChange={(e) => handleChange('minimumDeposit', parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minimumWithdrawal">Minimum Withdrawal (R$)</Label>
                <Input
                  id="minimumWithdrawal"
                  type="number"
                  step="0.01"
                  value={settings.minimumWithdrawal}
                  onChange={(e) => handleChange('minimumWithdrawal', parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="withdrawalFee">Withdrawal Fee (%)</Label>
                <Input
                  id="withdrawalFee"
                  type="number"
                  step="0.01"
                  value={settings.withdrawalFee}
                  onChange={(e) => handleChange('withdrawalFee', parseFloat(e.target.value))}
                />
              </div>
            </div>
          </div>

          <Button onClick={handleSave} className="w-full gradient-gold">
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Current Configuration</CardTitle>
          <CardDescription>Preview of current platform settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">PIX Key:</span>
              <span className="font-medium">{settings.pixKey || 'Not configured'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account Name:</span>
              <span className="font-medium">{settings.pixName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">PIX Type:</span>
              <span className="font-medium">{settings.pixType}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 mt-2">
              <span className="text-muted-foreground">Min. Deposit:</span>
              <span className="font-medium">R$ {settings.minimumDeposit.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Min. Withdrawal:</span>
              <span className="font-medium">R$ {settings.minimumWithdrawal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Withdrawal Fee:</span>
              <span className="font-medium">{settings.withdrawalFee}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
