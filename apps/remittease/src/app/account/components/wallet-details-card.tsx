// app/account/components/wallet-details-card.tsx
'use client';

import * as React from 'react';
import { Copy, ExternalLink, Check, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface WalletDetailsCardProps {
  address: string;
  networkName: string;
  accountBalance: any;
  isLoadingBalance: boolean;
}

export const WalletDetailsCard = React.memo<WalletDetailsCardProps>(
  ({ address, networkName, accountBalance, isLoadingBalance }) => {
    const [copied, setCopied] = React.useState(false);

    const truncatedAddress = React.useMemo(
      () => `${address.slice(0, 6)}...${address.slice(-4)}`,
      [address]
    );

    const formattedUSD = React.useMemo(() => {
      if (isLoadingBalance) return null;
      if (!accountBalance) return '$0.00';
      
      const value = 
        accountBalance.fiatBalance?.amount ?? 
        accountBalance.fiat?.usd ?? 
        accountBalance.usdValue ?? 
        accountBalance.fiatValue ??
        accountBalance.totalValue?.amount ??
        0;
      
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(value));
    }, [accountBalance, isLoadingBalance]);

    const tokenBalance = React.useMemo(() => {
      if (!accountBalance) return '0 LSK';
      const display = accountBalance.displayValue ?? accountBalance.value ?? '0';
      const symbol = accountBalance.symbol ?? 'LSK';
      return `${display} ${symbol}`;
    }, [accountBalance]);

    const copyToClipboard = React.useCallback(async () => {
      try {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    }, [address]);

    const openInExplorer = React.useCallback(() => {
      window.open(`https://blockscout.lisk.com/address/${address}`, '_blank');
    }, [address]);

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="size-5" />
            Wallet Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Address</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm bg-muted px-3 py-2 rounded font-mono">
                {truncatedAddress}
              </code>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={copyToClipboard}
                title={copied ? 'Copied!' : 'Copy address'}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={openInExplorer}
                title="View in explorer"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Balance</p>
            {isLoadingBalance ? (
              <div className="space-y-2">
                <div className="h-7 w-24 bg-muted animate-pulse rounded" />
                <div className="h-5 w-32 bg-muted animate-pulse rounded" />
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-xl font-bold">{formattedUSD || '$0.00'}</p>
                <p className="text-sm text-muted-foreground font-mono">
                  {tokenBalance}
                </p>
              </div>
            )}
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Network</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{networkName}</span>
              <Badge variant="outline" className="gap-1">
                <span className="size-2 bg-green-500 rounded-full animate-pulse" />
                Connected
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

WalletDetailsCard.displayName = 'WalletDetailsCard';
