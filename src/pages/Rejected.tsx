import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, LogOut, TrendingUp } from 'lucide-react';

const Rejected = () => {
  const { profile, logout } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile) {
      navigate('/login');
    } else if (profile.status === 'active') {
      navigate('/dashboard');
    } else if (profile.status === 'pending') {
      navigate('/pending-approval');
    }
  }, [profile, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-primary/5 to-background">
      <Card className="w-full max-w-md border-destructive shadow-gold">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl">Cadastro Não Aprovado</CardTitle>
          <CardDescription>
            Sua solicitação de cadastro foi recusada
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3 text-center">
            <p className="text-muted-foreground">
              Olá, <span className="font-medium text-foreground">{profile.name}</span>.
            </p>
            <p className="text-sm text-muted-foreground">
              Infelizmente, não foi possível aprovar seu cadastro neste momento.
            </p>
            <p className="text-sm text-muted-foreground">
              Entre em contato com nosso suporte para mais informações.
            </p>
          </div>

          <div className="bg-destructive/10 p-4 rounded-lg">
            <p className="text-sm text-center">
              Email de suporte: <span className="font-medium">suporte@ganhosbybit.com</span>
            </p>
          </div>

          <div className="pt-4 border-t border-border space-y-3">
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => navigate('/')}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Voltar ao Início
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Rejected;
