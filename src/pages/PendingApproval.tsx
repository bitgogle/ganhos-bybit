import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Clock, LogOut, TrendingUp } from 'lucide-react';

const PendingApproval = () => {
  const { profile, logout, loading: profileLoading } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't redirect while profile is still loading
    if (profileLoading) return;
    
    if (!profile) {
      navigate('/login');
    } else if (profile.status === 'active') {
      navigate('/dashboard');
    } else if (profile.status === 'rejected') {
      navigate('/rejected');
    }
  }, [profile, profileLoading, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Show loading state while profile is being fetched
  if (profileLoading || !profile) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-primary/5 to-background">
      <Card className="w-full max-w-md border-border shadow-gold">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-warning/10 flex items-center justify-center">
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </div>
          <CardTitle className="text-2xl">Cadastro em Análise</CardTitle>
          <CardDescription>
            Sua conta está sendo analisada pela nossa equipe
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3 text-center">
            <p className="text-muted-foreground">
              Olá, <span className="font-medium text-foreground">{profile.name}</span>!
            </p>
            <p className="text-sm text-muted-foreground">
              Seu cadastro foi recebido com sucesso e está em análise. 
              Você receberá um email assim que sua conta for aprovada.
            </p>
            <p className="text-sm text-muted-foreground">
              Este processo geralmente leva até 24 horas.
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

export default PendingApproval;
