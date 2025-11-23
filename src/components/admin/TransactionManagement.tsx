import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Check, X, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

export const TransactionManagement = () => {
  const { transactions, users, updateTransaction } = useApp();
  const { toast } = useToast();

  const handleApprove = (transactionId: string) => {
    updateTransaction(transactionId, { status: 'approved' });
    toast({
      title: 'Transaction approved',
      description: 'The transaction has been processed successfully.',
    });
  };

  const handleReject = (transactionId: string) => {
    updateTransaction(transactionId, { status: 'rejected' });
    toast({
      variant: 'destructive',
      title: 'Transaction rejected',
      description: 'The transaction has been rejected.',
    });
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.name || 'Unknown User';
  };

  const pendingTransactions = transactions.filter(t => t.status === 'pending');
  const completedTransactions = transactions.filter(t => t.status !== 'pending');

  return (
    <div className="space-y-6">
      {/* Pending Transactions */}
      {pendingTransactions.length > 0 && (
        <Card className="border-warning">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Pending Transactions
              <Badge variant="destructive">{pendingTransactions.length}</Badge>
            </CardTitle>
            <CardDescription>Transactions waiting for approval</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Payment Info</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {transaction.type === 'deposit' ? (
                          <ArrowDownCircle className="h-4 w-4 text-success" />
                        ) : (
                          <ArrowUpCircle className="h-4 w-4 text-destructive" />
                        )}
                        <span className="capitalize">{transaction.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{getUserName(transaction.userId)}</TableCell>
                    <TableCell>R$ {transaction.amount.toFixed(2)}</TableCell>
                    <TableCell>{new Date(transaction.createdAt).toLocaleString('pt-BR')}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {transaction.paymentMethod || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleApprove(transaction.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(transaction.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>All completed transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {completedTransactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No transactions yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedTransactions
                  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                  .slice(0, 20)
                  .map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {transaction.type === 'deposit' ? (
                            <ArrowDownCircle className="h-4 w-4 text-success" />
                          ) : (
                            <ArrowUpCircle className="h-4 w-4 text-destructive" />
                          )}
                          <span className="capitalize">{transaction.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getUserName(transaction.userId)}</TableCell>
                      <TableCell>R$ {transaction.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.status === 'approved' ? 'default' : 'destructive'}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(transaction.updatedAt).toLocaleString('pt-BR')}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
