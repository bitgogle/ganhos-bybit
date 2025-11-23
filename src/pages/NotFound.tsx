import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="text-center space-y-6 p-8">
        <div className="flex justify-center mb-8">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
            <TrendingUp className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-bold">Página Não Encontrada</h2>
        <p className="text-muted-foreground max-w-md">
          Desculpe, a página que você está procurando não existe ou foi movida.
        </p>
        <Button asChild size="lg" className="gradient-gold">
          <Link to="/">
            <Home className="mr-2 h-5 w-5" />
            Voltar ao Início
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
