import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getErrorMessage } from '@/lib/utils';
import { useApp } from '@/context/AppContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [waitingForProfile, setWaitingForProfile] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, loading: profileLoading } = useApp();

  // Handle navigation after profile is loaded
  useEffect(() => {
    if (waitingForProfile && !profileLoading && profile) {
      // Profile has loaded, navigate based on status
      if (profile.status === 'active') {
        toast({
          title: 'Login realizado com sucesso!',
          description: 'Redirecionando para o dashboard...',
        });
        navigate('/dashboard');
      } else if (profile.status === 'pending') {
        navigate('/pending-approval');
      } else if (profile.status === 'rejected') {
        navigate('/rejected');
      }
      setWaitingForProfile(false);
    }
  }, [waitingForProfile, profileLoading, profile, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if user is restricted
      if (data.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('restricted')
          .eq('id', data.user.id)
          .single();

        if (profileData?.restricted) {
          await supabase.auth.signOut();
          toast({
            variant: 'destructive',
            title: 'Acesso Negado',
            description: 'Sua conta foi restrita. Entre em contato com o suporte.',
          });
          setLoading(false);
          return;
        }
      }

      if (data.session) {
        // Set flag to wait for profile to load
        // The useEffect above will handle navigation once profile is ready
        setWaitingForProfile(true);
      }
    } catch (error: unknown) {
      toast({
        variant: 'destructive',
        title: 'Erro no login',
        description: getErrorMessage(error) || 'Email ou senha incorretos.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-primary/5 to-background">
      <Card className="w-full max-w-md border-border shadow-gold">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Entrar na Conta</CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full gradient-gold" disabled={loading || waitingForProfile}>
              {loading ? 'Entrando...' : waitingForProfile ? 'Carregando perfil...' : 'Entrar'}
            </Button>
          </form>
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Não tem uma conta?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Cadastre-se
              </Link>
            </p>
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Voltar para o início
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
