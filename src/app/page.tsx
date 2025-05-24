
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExternalLink } from 'lucide-react';

const KAWAI_TOKEN_MINT = new PublicKey('CRonCzMtoLRHE6UsdpUCrm7nm7BwM3NfJU1ssVWAGBL7');
const REQUIRED_KAWAI_AMOUNT_UI = 100;
const KAWAI_DECIMALS = 9;

export default function Home() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [kawaiBalance, setKawaiBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasSufficientKawai = useMemo(() => {
    if (kawaiBalance === null) return false;
    return kawaiBalance >= REQUIRED_KAWAI_AMOUNT_UI;
  }, [kawaiBalance]);

  useEffect(() => {
    if (!connected || !publicKey || !connection) {
      setKawaiBalance(null);
      setError(null);
      return;
    }

    const checkKawaiBalance = async () => {
      setIsLoading(true);
      setError(null);
      setKawaiBalance(null);
      try {
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          {
            programId: TOKEN_PROGRAM_ID,
          },
          'confirmed'
        );

        let foundBalance = 0;
        for (const { account } of tokenAccounts.value) {
          const parsedAccountInfo = account.data.parsed.info;
          if (parsedAccountInfo.mint === KAWAI_TOKEN_MINT.toBase58()) {
            foundBalance = parsedAccountInfo.tokenAmount.uiAmountNumber || (parseInt(parsedAccountInfo.tokenAmount.amount) / Math.pow(10, KAWAI_DECIMALS));
            break;
          }
        }
        setKawaiBalance(foundBalance);
      } catch (err: unknown) {
        console.error("Error fetching token balance:", err);
        if (err instanceof Error) {
            setError(`Failed to fetch KAWAI token balance: ${err.message}`);
        } else {
            setError('Failed to fetch KAWAI token balance due to an unknown error.');
        }
        setKawaiBalance(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Run both checks
    checkKawaiBalance();

  }, [connected, publicKey, connection]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">KAWAI Token Gate</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          <WalletMultiButton className="w-full" />

          {connected && publicKey && (
            <div className="w-full text-center space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Connected Wallet:</p>
                <p className="text-lg font-medium break-all">{publicKey.toBase58()}</p>
              </div>

              {isLoading && (
                <p className="text-sm text-muted-foreground">Checking KAWAI token balance...</p>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Token Balance Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {!isLoading && !error && kawaiBalance !== null && (
                <>
                  {hasSufficientKawai ? (
                    <Alert variant="default">
                      <AlertTitle>Access Granted!</AlertTitle>
                      <AlertDescription>
                        You hold {kawaiBalance.toFixed(2)} $KAWII.
                        <br />
                        <span className="font-mono text-sm bg-muted p-1 rounded">Dummy Access Token: GRANTED</span>
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert>
                      <AlertTitle>Insufficient KAWAI Balance</AlertTitle>
                      <AlertDescription>
                        You hold {kawaiBalance.toFixed(2)} $KAWAI. You need at least {REQUIRED_KAWAI_AMOUNT_UI} $KAWAI to proceed.
                        <div className="mt-3 flex flex-col sm:flex-row justify-center gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href="https://raydium.io/swap/?inputCurrency=sol&outputCurrency=CRonCzMtoLRHE6UsdpUCrm7nm7BwM3NfJU1ssVWAGBL7" target="_blank" rel="noopener noreferrer">
                              Buy on Raydium <ExternalLink className="ml-1 h-4 w-4" />
                            </a>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <a href="https://www.orca.so/pools/5x6DLbiMMpioqpyFcCixxD7EY9EabyypjA7Uc7xNvvRk" target="_blank" rel="noopener noreferrer">
                              Buy on Orca <ExternalLink className="ml-1 h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

