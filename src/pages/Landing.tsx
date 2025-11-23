import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { features, testimonials, faqs } from '@/lib/data';
import { Play, Star, ChevronDown, TrendingUp, Shield, Zap } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import bybitLogo from '@/assets/bybit-logo.jpg';

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-12 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/20" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
              <img src={bybitLogo} alt="Bybit Logo" className="w-8 h-8 object-contain relative z-10" />
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
                Lucros Distribuídos a Cada 6 Horas
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
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { name: 'Iniciante', min: 100, max: 999, daily: 1.5, color: 'secondary' },
                { name: 'Profissional', min: 1000, max: 4999, daily: 2.0, color: 'primary', featured: true },
                { name: 'Premium', min: 5000, max: 999999, daily: 2.5, color: 'primary' }
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
                      <span className="text-4xl font-bold text-primary">{plan.daily}%</span>
                      <span className="text-muted-foreground ml-2">/ dia</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Investimento: R$ {plan.min.toLocaleString('pt-BR')} - R$ {plan.max.toLocaleString('pt-BR')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Retorno mensal: até {(plan.daily * 30).toFixed(1)}%
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

      {/* Floating Admin Button */}
      <Link
        to="/admin"
        className="fixed bottom-8 right-8 z-50 group"
      >
        <div className="relative w-24 h-28 flex items-center justify-center transition-transform hover:scale-110">
          <div 
            className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-amber-600 shadow-gold"
            style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
          />
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-2">
            <span className="text-white font-bold text-xs tracking-wider">BYBIT</span>
            <Shield className="h-5 w-5 text-white/90 mt-1" />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Landing;
