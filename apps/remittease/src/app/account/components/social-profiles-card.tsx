// app/account/components/social-profiles-card.tsx
'use client';

import * as React from 'react';
import { Share2, CheckCircle, AlertCircle, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SocialProfile {
  type: string;
  name?: string;
  avatar?: string;
  username?: string;
}

interface SocialProfilesCardProps {
  socialProfiles?: SocialProfile[];
  isLoadingSocialProfiles: boolean;
}

export const SocialProfilesCard = React.memo<SocialProfilesCardProps>(
  ({ socialProfiles, isLoadingSocialProfiles }) => {
    const profileCount = React.useMemo(
      () => socialProfiles?.length ?? 0,
      [socialProfiles]
    );

    const getProfileIcon = React.useCallback((type: string) => {
      const iconClass = "size-5 text-gray-400";
      switch (type.toLowerCase()) {
        case 'farcaster':
        case 'lens':
        case 'ens':
          return <Share2 className={iconClass} />;
        default:
          return <User className={iconClass} />;
      }
    }, []);

    if (isLoadingSocialProfiles) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Social Profiles</CardTitle>
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
              <Share2 className="size-5" />
              Social Profiles
            </span>
            {profileCount > 0 && (
              <Badge variant="secondary">
                {profileCount} connected
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {profileCount > 0 ? (
            <div className="space-y-3">
              {socialProfiles!.map((profile, index) => (
                <div
                  key={`${profile.type}-${index}`}
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile.name || profile.type}
                      className="size-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="size-10 rounded-full bg-muted flex items-center justify-center">
                      {getProfileIcon(profile.type)}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {profile.name || profile.username || profile.type}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {profile.type}
                    </p>
                  </div>
                  
                  <CheckCircle className="size-5 text-green-500 shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="size-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">No social profiles connected</p>
              <p className="text-xs text-muted-foreground">
                Connect your social accounts to enhance your profile
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);

SocialProfilesCard.displayName = 'SocialProfilesCard';

