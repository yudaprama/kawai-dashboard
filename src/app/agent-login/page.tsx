'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExternalLink, ArrowLeft, CheckCircle2 } from 'lucide-react';

const KAWAI_TOKEN_MINT = new PublicKey('CRonCzMtoLRHE6UsdpUCrm7nm7BwM3NfJU1ssVWAGBL7');
const REQUIRED_KAWAI_AMOUNT_UI = 100;
const KAWAI_DECIMALS = 9;

export default function AgentLogin() {
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

    checkKawaiBalance();
  }, [connected, publicKey, connection]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-black text-white">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">KAWAI Agent</h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left side - Mascot and info */}
          <div className="flex-1">
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 h-full">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="relative w-48 h-48 mb-4">
                  <Image 
                    src="/kawai-mascot.png" 
                    alt="KAWAI Mascot" 
                    fill
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                </div>
                <h2 className="text-xl font-bold mb-4">Welcome to KAWAI Agent</h2>
                <p className="text-gray-400 mb-6 text-center">
                  Access powerful AI agents powered by KAWAI's decentralized computation network.
                </p>
                <div className="bg-gray-800 p-4 rounded-lg w-full">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Requirements:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2" />
                      <span>Solana wallet connection</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2" />
                      <span>Minimum {REQUIRED_KAWAI_AMOUNT_UI} $KAWAI tokens</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right side - Wallet connection */}
          <div className="flex-1">
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-center">Connect Your Wallet</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-6">
                <div className="relative w-full h-32 mb-2">
                  <Image 
                    src="/kawai-agent/kawai-agent-1.png" 
                    alt="KAWAI Agent Interface" 
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                
                <WalletMultiButton className="w-full bg-blue-600 hover:bg-blue-700" />

                {connected && publicKey && (
                  <div className="w-full text-center space-y-4">
                    <div>
                      <p className="text-sm text-gray-400">Connected Wallet:</p>
                      <p className="text-sm font-medium break-all bg-gray-800 p-2 rounded">{publicKey.toBase58()}</p>
                    </div>

                    {isLoading && (
                      <p className="text-sm text-gray-400">Checking KAWAI token balance...</p>
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
                          <Alert className="bg-blue-900/30 border-blue-500 text-white">
                            <AlertTitle className="flex items-center">
                              <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2" />
                              Access Granted!
                            </AlertTitle>
                            <AlertDescription>
                              You hold {kawaiBalance.toFixed(2)} $KAWAI.
                              <div className="mt-4">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                                  <Link href="/agent-dashboard">
                                    Enter KAWAI Agent
                                  </Link>
                                </Button>
                              </div>
                            </AlertDescription>
                          </Alert>
                        ) : (
                          <Alert className="bg-gray-800 border-orange-500 text-white">
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
              <CardFooter className="flex justify-center pt-0">
                <p className="text-xs text-gray-500">
                  Powered by the KAWAI decentralized AI computation network
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
