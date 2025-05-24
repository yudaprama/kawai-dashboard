
'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
// We don't need to import Button here unless used elsewhere
// import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const { publicKey, connected } = useWallet();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Solana Wallet Connector</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {/* Remove the 'as' prop and style prop. WalletMultiButton has its own styling. Apply shadcn classes if needed via className */}
          <WalletMultiButton className="w-full" />
          {connected && publicKey && (
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">Connected Wallet:</p>
              <p className="text-lg font-medium break-all">{publicKey.toBase58()}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

