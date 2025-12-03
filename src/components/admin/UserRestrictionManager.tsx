import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { UserX, UserCheck } from 'lucide-react';
import { Profile } from '@/context/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/utils';

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

      // Send notification (in Portuguese for the user)
      await supabase.from('notifications').insert({
        user_id: user.id,
        title: newRestricted ? 'Conta Restrita' : 'Restrição Removida',
        message: newRestricted 
          ? 'Sua conta foi restrita. Entre em contato com o suporte para mais informações.'
          : 'As restrições da sua conta foram removidas. Você já pode realizar transações normalmente.',
        type: newRestricted ? 'error' : 'success'
      });

      toast.success(newRestricted ? 'User restricted successfully!' : 'Restriction removed successfully!');
      setConfirmOpen(false);
      onUpdate();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
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
        className={user.restricted ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
      >
        {user.restricted ? (
          <>
            <UserCheck className="h-4 w-4 mr-2" />
            Remove Restriction
          </>
        ) : (
          <>
            <UserX className="h-4 w-4 mr-2" />
            Restrict
          </>
        )}
      </Button>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-black">
              {user.restricted ? 'Remove Restriction' : 'Restrict User'}
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              {user.restricted 
                ? `Are you sure you want to remove restrictions from ${user.name}? The user will be able to make transactions again.`
                : `Are you sure you want to restrict ${user.name}? The user will not be able to make deposits or withdrawals.`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)} className="text-gray-600">
              Cancel
            </Button>
            <Button
              variant={user.restricted ? 'default' : 'destructive'}
              onClick={handleToggleRestriction}
              disabled={loading}
              className={user.restricted ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
            >
              {loading ? 'Processing...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
