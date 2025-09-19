// =============================================
// FILE: components/ui/logo.tsx
// (Fix: use public/ path; robust fallback; UI-only)
// =============================================
'use client';


import Image from 'next/image';
import { Wallet } from 'lucide-react';
import { useState } from 'react';


interface LogoProps {
size?: number;
showText?: boolean;
className?: string;
}


export function Logo({ size = 28, showText = true, className = '' }: LogoProps) {
// Try multiple filenames placed in /public to avoid path issues
const candidates = ['/re-icon.png', '/RE icon.png', '/remittease-logo.png'];
const [idx, setIdx] = useState(0);
const [failed, setFailed] = useState(false);


const handleError = () => {
if (idx < candidates.length - 1) {
setIdx((i) => i + 1);
} else {
setFailed(true);
}
};


return (
<div className={`flex items-center gap-2 ${className}`}>
{!failed ? (
<Image
src={candidates[idx]}
alt="RemittEase"
width={size}
height={size}
className="select-none"
onError={handleError}
priority
/>
) : (
<div
aria-label="RemittEase logo placeholder"
className="grid place-items-center rounded-lg bg-[hsl(var(--brand-primary))]"
style={{ width: size, height: size }}
>
<Wallet className="h-4 w-4 text-white" />
</div>
)}
{showText && (
<span className="font-semibold tracking-tight text-[hsl(var(--brand-primary))]"></span>
)}
</div>
);
}