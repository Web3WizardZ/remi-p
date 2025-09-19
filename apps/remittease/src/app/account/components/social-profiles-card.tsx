'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SocialProfilesCardProps {
  userProfiles?: any;
  socialProfiles?: any;
  isLoadingProfiles?: boolean;
  isLoadingSocialProfiles?: boolean;
}

export function SocialProfilesCard({
  userProfiles,
  socialProfiles,
  isLoadingProfiles,
  isLoadingSocialProfiles
}: SocialProfilesCardProps) {
  const isLoading = isLoadingProfiles || isLoadingSocialProfiles;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Profiles</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          </div>
        ) : (
          <div className="space-y-2">
            {userProfiles?.email && (
              <div className="flex items-center gap-2">
                <Badge variant="outline">Email</Badge>
                <span className="text-sm">{userProfiles.email}</span>
              </div>
            )}
            {userProfiles?.phone && (
              <div className="flex items-center gap-2">
                <Badge variant="outline">Phone</Badge>
                <span className="text-sm">{userProfiles.phone}</span>
              </div>
            )}
            {!userProfiles?.email && !userProfiles?.phone && (
              <p className="text-sm text-muted-foreground">
                No profiles connected
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}