'use client';

import { Copy, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AccountInformationCardProps {
  address: string;
  balance?: string;
  isLoadingBalance?: boolean;
}

export function AccountInformationCard({
  address,
  balance,
  isLoadingBalance
}: AccountInformationCardProps) {
  const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
  };

  const openInExplorer = () => {
    window.open(`https://blockscout.lisk.com/address/${address}`, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Address</p>
          <div className="flex items-center gap-2">
            <code className="text-sm bg-muted px-2 py-1 rounded">
              {truncatedAddress}
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={copyToClipboard}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={openInExplorer}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-1">Balance</p>
          {isLoadingBalance ? (
            <div className="h-6 w-24 bg-muted animate-pulse rounded" />
          ) : (
            <p className="font-mono">{balance || '0'} LSK</p>
          )}
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-1">Network</p>
          <Badge variant="secondary">Lisk</Badge>
        </div>
      </CardContent>
    </Card>
  );
}