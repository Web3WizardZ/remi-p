// app/account/components/account-information-card.tsx
'use client';

import * as React from 'react';
import { Mail, Phone, User, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AccountInformationCardProps {
  userEmail?: string;
  userPhone?: string;
  isLoadingProfiles: boolean;
}

export const AccountInformationCard = React.memo<AccountInformationCardProps>(
  ({ userEmail, userPhone, isLoadingProfiles }) => {
    const hasAnyProfile = React.useMemo(
      () => Boolean(userEmail || userPhone),
      [userEmail, userPhone]
    );

    if (isLoadingProfiles) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <User className="size-5" />
              Account Information
            </span>
            {!hasAnyProfile && (
              <Button variant="outline" size="sm" className="gap-1">
                <Plus className="size-4" />
                Add Profile
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {userEmail && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="size-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                <Mail className="size-5 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Email Address</p>
                <p className="text-sm font-medium truncate">{userEmail}</p>
              </div>
            </div>
          )}

          {userPhone && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="size-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                <Phone className="size-5 text-green-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Phone Number</p>
                <p className="text-sm font-medium">{userPhone}</p>
              </div>
            </div>
          )}

          {!hasAnyProfile && (
            <div className="text-center py-8">
              <User className="size-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">No account information</p>
              <p className="text-xs text-muted-foreground mb-4">
                Add your email or phone for better account security
              </p>
              <Button variant="outline" size="sm" className="gap-1">
                <Plus className="size-4" />
                Add Profile
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);

AccountInformationCard.displayName = 'AccountInformationCard';

