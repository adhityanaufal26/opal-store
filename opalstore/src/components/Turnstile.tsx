"use client";

import { Turnstile } from '@marsidev/react-turnstile';

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onError?: () => void;
}

export default function TurnstileWidget({ onVerify, onError }: TurnstileWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';

  if (!siteKey) {
    // Dev mode: auto-pass
    return null;
  }

  return (
    <div className="flex justify-center">
      <Turnstile
        siteKey={siteKey}
        onSuccess={(token) => onVerify(token)}
        onError={() => onError?.()}
        onExpire={() => onVerify('')}
        options={{
          theme: 'dark',
          size: 'normal',
        }}
      />
    </div>
  );
}
