'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WalletDetailsCardProps {
  walletType?: string;
  isConnected: boolean;
}

export function WalletDetailsCard({ walletType, isConnected }: WalletDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Connection Status</p>
          <Badge variant={isConnected ? 'default' : 'secondary'}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
        </div>
        
        {walletType && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">Wallet Type</p>
            <p className="capitalize">{walletType}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}