#!/bin/bash

# RemittEase Update Script - For existing remi-p project
# Run this from inside your remi-p folder

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Ì≤∏ Updating to RemittEase Branding${NC}"
echo -e "${BLUE}=================================${NC}"

# Check if we're in the right place
if [ ! -f "pnpm-workspace.yaml" ]; then
    echo -e "${YELLOW}‚ö†Ô∏è  Warning: Doesn't look like we're in the project root${NC}"
    echo "Please run this from your remi-p folder"
    exit 1
fi

# Step 1: Add logo placeholder reminder
echo -e "${YELLOW}Ì≥∏ Creating logo reminder...${NC}"
if [ ! -f "RE icon.png" ]; then
    echo -e "${YELLOW}‚ö†Ô∏è  IMPORTANT: Add your 'RE icon.png' file to this folder${NC}"
    echo -e "${YELLOW}   Then copy it to the public folder with:${NC}"
    echo -e "${BLUE}   cp 'RE icon.png' apps/example-app/public/${NC}"
fi

# Step 2: Copy logo if it exists
if [ -f "RE icon.png" ]; then
    echo -e "${GREEN}‚úÖ Found RE icon.png, copying to public folder...${NC}"
    cp "RE icon.png" apps/example-app/public/
else
    # Create a placeholder file
    touch apps/example-app/public/PLACE_RE_ICON_HERE.txt
    echo "Place your 'RE icon.png' file here" > apps/example-app/public/PLACE_RE_ICON_HERE.txt
fi

# Step 3: Update environment variables
echo -e "${BLUE}Ì¥ê Updating environment variables...${NC}"
if ! grep -q "NEXT_PUBLIC_APP_NAME" apps/example-app/.env.local 2>/dev/null; then
    echo "" >> apps/example-app/.env.local
    echo "# RemittEase Branding" >> apps/example-app/.env.local
    echo "NEXT_PUBLIC_APP_NAME=RemittEase" >> apps/example-app/.env.local
    echo "NEXT_PUBLIC_APP_DESCRIPTION='Send money globally with ease'" >> apps/example-app/.env.local
fi

# Step 4: Update layout.tsx for RemittEase
echo -e "${BLUE}Ì≥ù Updating layout.tsx...${NC}"
cat > apps/example-app/src/app/layout.tsx << 'EOF'
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset } from '@/components/ui/sidebar';
import { Providers } from '../components/providers';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'RemittEase - Seamless Cross-Border Payments',
  description: 'Send money globally with ease using blockchain technology',
  icons: {
    icon: '/RE icon.png',
    shortcut: '/RE icon.png',
    apple: '/RE icon.png',
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <SidebarInset className="flex flex-col">
              <AppHeader />
              <main className="text-primary flex-1 overflow-auto">
                {children}
              </main>
            </SidebarInset>
          </div>
        </Providers>
      </body>
    </html>
  );
}
EOF

# Step 5: Create Logo component
echo -e "${BLUE}Ìæ® Creating Logo component...${NC}"
mkdir -p apps/example-app/src/components/ui
cat > apps/example-app/src/components/ui/logo.tsx << 'EOF'
'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Wallet } from 'lucide-react';

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 32, showText = true, className = '' }: LogoProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {!imageError ? (
        <Image
          src="/RE icon.png"
          alt="RemittEase Logo"
          width={size}
          height={size}
          className="rounded-md"
          onError={() => setImageError(true)}
          priority
        />
      ) : (
        <div 
          className="rounded-md bg-gradient-to-br from-blue-500 to-purple-500 p-2"
          style={{ width: size, height: size }}
        >
          <Wallet className="w-full h-full text-white" />
        </div>
      )}
      {showText && (
        <div className="flex flex-col">
          <span className="font-bold text-base">RemittEase</span>
          <span className="text-xs text-muted-foreground">Global Payments</span>
        </div>
      )}
    </div>
  );
}
EOF

# Step 6: Update app-sidebar.tsx
echo -e "${BLUE}Ìæ® Updating sidebar with RemittEase branding...${NC}"
cat > apps/example-app/src/components/app-sidebar.tsx << 'EOF'
'use client';

import { Send, Users, Receipt, Settings, HelpCircle, Home, CreditCard } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@/components/ui/sidebar';
import { Logo } from './ui/logo';

const data = {
  navMain: [
    {
      title: 'Main',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: Home,
          isActive: false
        },
        {
          title: 'Send Money',
          url: '/send',
          icon: Send,
          isActive: false
        },
        {
          title: 'Account',
          url: '/account',
          icon: Users,
          isActive: true
        },
        {
          title: 'Transactions',
          url: '/transactions',
          icon: Receipt,
          isActive: false
        },
        {
          title: 'Payment Methods',
          url: '/payment-methods',
          icon: CreditCard,
          isActive: false
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          title: 'Settings',
          url: '/settings',
          icon: Settings,
          isActive: false
        },
        {
          title: 'Help Center',
          url: 'https://help.remittease.com',
          icon: HelpCircle,
          isActive: false
        }
      ]
    }
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-2">
              <Link href="/">
                <Logo size={32} showText={true} />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isExternal = item.url.startsWith('http');
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={item.isActive}>
                        {isExternal ? (
                          <a
                            href={item.url}
                            className="flex items-center gap-2"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <item.icon className="size-4" />
                            {item.title}
                          </a>
                        ) : (
                          <Link
                            href={item.url}
                            className="flex items-center gap-2"
                          >
                            <item.icon className="size-4" />
                            {item.title}
                          </Link>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
EOF

# Step 7: Update app-header.tsx
echo -e "${BLUE}Ì≥ù Updating header...${NC}"
cat > apps/example-app/src/components/app-header.tsx << 'EOF'
'use client';

import { usePathname } from 'next/navigation';
import { ConnectButton, useActiveAccount } from 'panna-sdk';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Typography } from './ui/typography';

const navigationData = {
  '/': 'Dashboard',
  '/send': 'Send Money',
  '/account': 'Account',
  '/transactions': 'Transactions',
  '/payment-methods': 'Payment Methods',
  '/settings': 'Settings'
};

export function AppHeader() {
  const activeAccount = useActiveAccount();
  const isConnected = !!activeAccount;
  const pathname = usePathname();

  const currentRoute =
    navigationData[pathname as keyof typeof navigationData] ||
    'Dashboard';

  return (
    <header className="bg-sidebar text-sidebar-foreground border-sidebar-border flex h-16 shrink-0 items-center justify-between gap-4 border-b px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="text-sidebar-foreground/70 -ml-1" />
        <Separator
          orientation="vertical"
          className="bg-sidebar-border mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sidebar-foreground font-medium">
                {currentRoute}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <aside className="flex items-center gap-4">
        {!isConnected && pathname !== '/' && (
          <Typography variant="muted" className="text-sidebar-foreground/70 hidden md:block">
            Connect to start sending money globally
          </Typography>
        )}
        <ConnectButton />
      </aside>
    </header>
  );
}
EOF

# Step 8: Create Typography component if it doesn't exist
if [ ! -f "apps/example-app/src/components/ui/typography.tsx" ]; then
    echo -e "${BLUE}Ì≥ù Creating Typography component...${NC}"
    cat > apps/example-app/src/components/ui/typography.tsx << 'EOF'
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
      h2: 'scroll-m-20 text-3xl font-semibold tracking-tight',
      h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
      p: 'leading-7',
      lead: 'text-xl text-muted-foreground',
      large: 'text-lg font-semibold',
      small: 'text-sm font-medium leading-none',
      muted: 'text-sm text-muted-foreground',
    },
  },
  defaultVariants: {
    variant: 'p',
  },
});

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: keyof JSX.IntrinsicElements;
}

export function Typography({
  className,
  variant,
  as,
  ...props
}: TypographyProps) {
  const Comp = as || (variant?.startsWith('h') ? variant : 'p') || 'p';
  
  return (
    <Comp
      className={cn(typographyVariants({ variant, className }))}
      {...props}
    />
  );
}
EOF
fi

# Step 9: Install class-variance-authority if needed
echo -e "${BLUE}Ì≥¶ Checking dependencies...${NC}"
cd apps/example-app
if ! grep -q "class-variance-authority" package.json; then
    echo -e "${BLUE}Installing class-variance-authority...${NC}"
    pnpm add class-variance-authority
fi
cd ../..

echo ""
echo -e "${GREEN}‚ú® RemittEase branding update complete!${NC}"
echo ""
echo -e "${YELLOW}Ì≥ã Next Steps:${NC}"
echo ""
echo -e "${YELLOW}1. Add your logo:${NC}"
if [ ! -f "apps/example-app/public/RE icon.png" ]; then
    echo -e "   ${BLUE}cp 'RE icon.png' apps/example-app/public/${NC}"
    echo ""
fi
echo -e "${YELLOW}2. Run the application:${NC}"
echo -e "   ${BLUE}pnpm dev${NC}"
echo ""
echo -e "${GREEN}‚úÖ Your app is now branded as RemittEase!${NC}"
echo -e "${GREEN}Ìºê Open http://localhost:3000 to see your app${NC}"
