import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { UserX, UserCheck } from 'lucide-react';
import { Profile } from '@/context/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserRestrictionManagerProps {
  user: Profile;
  onUpdate: () => void;
}

export const UserRestrictionManager = ({ user, onUpdate }: UserRestrictionManagerProps) => {
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleToggleRestriction = async () => {
    setLoading(true);
    try {
      const newRestricted = !user.restricted;
      
      const { error } = await supabase
        .from('profiles')
        .update({ restricted: newRestricted })
        .eq('id', user.id);

      if (error) throw error;

      // Send notification
      await supabase.from('notifications').insert({
        user_id: user.id,
        title: newRestricted ? 'Conta Restrita' : 'Restrição Removida',
        message: newRestricted 
          ? 'Sua conta foi restrita. Entre em contato com o suporte para mais informações.'
          : 'As restrições da sua conta foram removidas. Você já pode realizar transações normalmente.',
        type: newRestricted ? 'error' : 'success'
      });

      toast.success(newRestricted ? 'Usuário restrito com sucesso!' : 'Restrição removida com sucesso!');
      setConfirmOpen(false);
      onUpdate();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar restrição.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant={user.restricted ? 'default' : 'destructive'}
        size="sm"
        onClick={() => setConfirmOpen(true)}
      >
        {user.restricted ? (
          <>
            <UserCheck className="h-4 w-4 mr-2" />
            Remover Restrição
          </>
        ) : (
          <>
            <UserX className="h-4 w-4 mr-2" />
            Restringir
          </>
        )}
      </Button>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {user.restricted ? 'Remover Restrição' : 'Restringir Usuário'}
            </DialogTitle>
            <DialogDescription>
              {user.restricted 
                ? `Tem certeza que deseja remover as restrições de ${user.name}? O usuário poderá voltar a realizar transações.`
                : `Tem certeza que deseja restringir ${user.name}? O usuário não poderá realizar depósitos ou saques.`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant={user.restricted ? 'default' : 'destructive'}
              onClick={handleToggleRestriction}
              disabled={loading}
            >
              {loading ? 'Processando...' : 'Confirmar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
