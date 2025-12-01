import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { features, testimonials, faqs, showcaseImages } from '@/lib/data';
import { Play, Star, ChevronDown, TrendingUp, Shield, Zap, X } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import bybitLogo from '@/assets/bybit-logo-circular.png';
import bybitCeo from '@/assets/bybit-ceo.jpeg';
import bybitStandard from '@/assets/bybit-standard.jpeg';
import bybitPlatform from '@/assets/bybit-platform.jpeg';
import bybitTradfi from '@/assets/bybit-tradfi.jpeg';
import bybitFeatureUpgrade from '@/assets/bybit-feature-upgrade.jpeg';
import bybitOptions from '@/assets/bybit-options.jpeg';
import bybitVsBinance from '@/assets/bybit-vs-binance.jpeg';
import bybitPay from '@/assets/bybit-pay.jpeg';
import bybitCard from '@/assets/bybit-card.jpeg';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Landing = () => {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const imageMap: Record<string, string> = {
    'bybit-ceo.jpeg': bybitCeo,
    'bybit-standard.jpeg': bybitStandard,
    'bybit-platform.jpeg': bybitPlatform,
    'bybit-tradfi.jpeg': bybitTradfi,
    'bybit-feature-upgrade.jpeg': bybitFeatureUpgrade,
    'bybit-options.jpeg': bybitOptions,
    'bybit-vs-binance.jpeg': bybitVsBinance,
    'bybit-pay.jpeg': bybitPay,
    'bybit-card.jpeg': bybitCard,
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if admin credentials already exist (stored in localStorage)
      const savedAdminCredentials = localStorage.getItem('admin_credentials');
      
      if (savedAdminCredentials) {
        // Validate against saved credentials
        const { email: savedEmail, password: savedPassword } = JSON.parse(savedAdminCredentials);
        
        if (adminEmail === savedEmail && adminPassword === savedPassword) {
          // Credentials match - grant access
          setIsAdminOpen(false);
          toast.success('Admin login successful!');
          setTimeout(() => {
            navigate('/admin');
          }, 100);
        } else {
          // Credentials don't match - deny access
          throw new Error('Access denied. Invalid admin credentials.');
        }
      } else {
        // First-time login - save credentials and grant access
        const credentials = {
          email: adminEmail,
          password: adminPassword
        };
        localStorage.setItem('admin_credentials', JSON.stringify(credentials));
        
        setIsAdminOpen(false);
        toast.success('Admin account created successfully! These credentials are now permanent.');
        setTimeout(() => {
          navigate('/admin');
        }, 100);
      }
    } catch (error: any) {
      toast.error(error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <img src={bybitLogo} alt="Bybit Logo" className="w-10 h-10 object-contain rounded-full" />
            </div>
            <span className="text-xl font-bold">Ganhos Bybit</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Recursos
            </a>
            <a href="#plans" className="text-sm font-medium hover:text-primary transition-colors">
              Planos
            </a>
            <a href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
              Depoimentos
            </a>
            <a href="#faq" className="text-sm font-medium hover:text-primary transition-colors">
              FAQ
            </a>
          </nav>
          <div className="flex gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Entrar</Link>
            </Button>
            <Button asChild className="gradient-gold">
              <Link to="/register">Começar Agora</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-40">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background -z-10" />
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-8">
              <Badge variant="secondary" className="px-4 py-2">
                <Zap className="mr-2 h-4 w-4" />
                Lucros Distribuídos a Cada 3 Horas
              </Badge>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl">
                Alcance Seus <span className="text-primary">Objetivos Financeiros</span> Conosco
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl max-w-2xl">
                A plataforma Ganhos Bybit oferece uma maneira segura e automatizada de investir em criptomoedas, com lucros distribuídos automaticamente.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="gradient-gold shadow-gold">
                  <Link to="/register">
                    Começar a Investir
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-primary hover:bg-primary/10">
                  <Play className="mr-2 h-5 w-5" />
                  Ver Demonstração
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12 w-full max-w-3xl">
                <div className="flex flex-col items-center">
                  <h3 className="text-3xl font-bold text-primary">50+</h3>
                  <p className="text-muted-foreground">Países Ativos</p>
                </div>
                <div className="flex flex-col items-center">
                  <h3 className="text-3xl font-bold text-primary">R$ 2.5M+</h3>
                  <p className="text-muted-foreground">Lucros Distribuídos</p>
                </div>
                <div className="flex flex-col items-center">
                  <h3 className="text-3xl font-bold text-primary">15.000+</h3>
                  <p className="text-muted-foreground">Investidores Ativos</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="h-8 w-8 text-muted-foreground" />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-16 md:py-24 bg-card/50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Investimento Rentável e Seguro
              </h2>
              <p className="mt-4 text-muted-foreground md:text-lg max-w-2xl mx-auto">
                Oferecemos a melhor experiência para você investir seu dinheiro com tranquilidade e obter os melhores rendimentos do mercado.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} className="border-border hover:border-primary transition-all hover:shadow-gold">
                  <CardHeader>
                    <feature.icon className="h-10 w-10 text-primary mb-2" />
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Investment Plans */}
        <section id="plans" className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Escolha Seu Plano de Investimento
              </h2>
              <p className="mt-4 text-muted-foreground md:text-lg max-w-2xl mx-auto">
                Planos flexíveis para todos os perfis de investidores
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
              {[
                { name: 'Básico', amount: 200, profit: 40 },
                { name: 'Intermediário', amount: 300, profit: 60 },
                { name: 'Profissional', amount: 500, profit: 100, featured: true },
                { name: 'Avançado', amount: 700, profit: 140 },
                { name: 'Premium', amount: 1000, profit: 200 }
              ].map((plan, index) => (
                <Card key={index} className={`relative ${plan.featured ? 'border-primary shadow-gold scale-105' : 'border-border'}`}>
                  {plan.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="gradient-gold">Mais Popular</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-primary">R$ {plan.amount}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Investimento: R$ {plan.amount.toLocaleString('pt-BR')}
                      </p>
                      <p className="text-sm font-semibold text-primary">
                        Lucro: R$ {plan.profit.toLocaleString('pt-BR')} a cada 3 horas
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Escolha duração: 1 a 7 dias
                      </p>
                    </div>
                    <Button className="w-full" variant={plan.featured ? 'default' : 'outline'} asChild>
                      <Link to="/register">Começar Agora</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Showcase Images */}
        <section className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Excelência e Inovação Bybit
              </h2>
              <p className="mt-4 text-muted-foreground md:text-lg max-w-2xl mx-auto">
                Descubra a plataforma que está transformando o mercado de criptomoedas globalmente
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {showcaseImages.map((image, index) => (
                <Card key={index} className="border-border overflow-hidden hover:border-primary transition-all hover:shadow-gold">
                  <div className="aspect-video w-full overflow-hidden bg-card">
                    <img 
                      src={imageMap[image.src]} 
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{image.title}</CardTitle>
                    </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {image.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="w-full py-16 md:py-24 bg-card/50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                O Que Nossos Investidores Dizem
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-border">
                  <CardHeader>
                    <div className="flex gap-1 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{testimonial.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Perguntas Frequentes
              </h2>
            </div>
            <Accordion type="single" collapsible className="max-w-3xl mx-auto">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Download App Section */}
        <section className="w-full py-16 md:py-24 bg-gradient-to-b from-background to-card/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto animate-fade-in">
              <Badge variant="secondary" className="px-6 py-2 text-sm">
                <Zap className="mr-2 h-4 w-4" />
                Baixe Agora
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Tenha a Bybit na Palma da Sua Mão
              </h2>
              <p className="text-muted-foreground md:text-lg max-w-2xl">
                Baixe o aplicativo oficial da Bybit Wallet e gerencie seus investimentos onde estiver. Disponível para Android e iOS.
              </p>
              <Button 
                size="lg" 
                className="gradient-gold shadow-gold text-lg px-12 py-6 hover:scale-105 transition-transform"
                onClick={() => window.open('https://play.google.com/store/apps/details?id=com.bybit.app', '_blank')}
              >
                DOWNLOAD
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Clique no link para baixar o aplicativo Bybit Wallet na Play Store
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-8 w-full">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1 mb-2">
                    <h3 className="text-2xl font-bold text-primary">4.8</h3>
                    <Star className="h-5 w-5 fill-primary text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">Avaliação na Play Store</p>
                </div>
                <div className="flex flex-col items-center">
                  <h3 className="text-2xl font-bold text-primary">50M+</h3>
                  <p className="text-sm text-muted-foreground">Downloads</p>
                </div>
                <div className="flex flex-col items-center">
                  <h3 className="text-2xl font-bold text-primary">24/7</h3>
                  <p className="text-sm text-muted-foreground">Acesso Total</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full py-16 md:py-24 bg-primary/10">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl max-w-2xl">
                Pronto Para Começar a Investir?
              </h2>
              <p className="text-muted-foreground md:text-lg max-w-xl">
                Junte-se a milhares de investidores que já estão lucrando com a Ganhos Bybit
              </p>
              <Button size="lg" asChild className="gradient-gold shadow-gold">
                <Link to="/register">Criar Conta Gratuita</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="font-bold">Ganhos Bybit</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Ganhos Bybit. Todos os direitos reservados.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Termos
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacidade
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Suporte
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Admin Portal Button */}
      <button
        onClick={() => setIsAdminOpen(true)}
        className="fixed bottom-4 left-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-2xl transition-transform hover:scale-110"
        title="Admin Portal"
      >
        <Shield className="w-5 h-5" />
      </button>

      {/* Admin Login Dialog */}
      <Dialog open={isAdminOpen} onOpenChange={setIsAdminOpen}>
        <DialogContent className="sm:max-w-md">
          <button
            onClick={() => setIsAdminOpen(false)}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl">Admin Access</DialogTitle>
            <DialogDescription className="text-center">
              Restricted area for system management.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdminLogin} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Admin Email</Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@system.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="bg-background"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Access Key</Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="bg-background"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Verifying...' : 'Enter Dashboard'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Landing;
