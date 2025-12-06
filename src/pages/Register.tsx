import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { z } from 'zod';
import { getErrorMessage } from '@/lib/utils';

// Custom validation for digit count only (not format)
const validateDigitCount = (value: string, count: number) => {
  const digits = value.replace(/\D/g, '');
  return digits.length === count;
};

const registerSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  surname: z.string().trim().min(1, 'Sobrenome é obrigatório').max(100, 'Sobrenome muito longo'),
  email: z.string().trim().email('Email inválido').max(255, 'Email muito longo'),
  phone: z.string().refine((val) => validateDigitCount(val, 11), {
    message: 'Telefone deve conter exatamente 11 dígitos',
  }),
  cpf: z.string().optional().refine((val) => !val || validateDigitCount(val, 11), {
    message: 'CPF deve conter exatamente 11 dígitos',
  }),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    cpf: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form data
    try {
      registerSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast({
          variant: 'destructive',
          title: 'Erro de validação',
          description: 'Por favor, corrija os campos destacados',
        });
        return;
      }
    }

    setLoading(true);

    try {
      // Register user through AuthContext
      await register({
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        cpf: formData.cpf || undefined,
      });

      // User is automatically logged in and redirected by AuthContext
      // Navigate to dashboard immediately
      navigate('/dashboard');
    } catch (error: unknown) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: getErrorMessage(error) || 'Ocorreu um erro ao criar sua conta.',
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
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Criar Conta</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para começar a investir
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                placeholder="João"
                value={formData.name}
                onChange={handleChange}
                required
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="surname">Sobrenome</Label>
              <Input
                id="surname"
                name="surname"
                placeholder="Silva"
                value={formData.surname}
                onChange={handleChange}
                required
                className={errors.surname ? 'border-destructive' : ''}
              />
              {errors.surname && <p className="text-sm text-destructive">{errors.surname}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="11912345678 ou (11) 91234-5678"
                value={formData.phone}
                onChange={handleChange}
                required
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
                required
                className={errors.password ? 'border-destructive' : ''}
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Digite a senha novamente"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={errors.confirmPassword ? 'border-destructive' : ''}
              />
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF (opcional)</Label>
              <Input
                id="cpf"
                name="cpf"
                placeholder="12345678910 ou 123.456.789-10"
                value={formData.cpf}
                onChange={handleChange}
                className={errors.cpf ? 'border-destructive' : ''}
              />
              {errors.cpf && <p className="text-sm text-destructive">{errors.cpf}</p>}
            </div>
            <Button type="submit" className="w-full gradient-gold" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Criar Conta'}
            </Button>
          </form>
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Entrar
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

export default Register;
