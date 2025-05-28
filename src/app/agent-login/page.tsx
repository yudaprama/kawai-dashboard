
'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import Image from 'next/image';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExternalLink, AlertCircle, CheckCircle2, Expand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme-toggle";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

const agentScreenshots = [
  '/kawai-agent/kawai-agent-1.png',
  '/kawai-agent/kawai-agent-2.png',
  '/kawai-agent/kawai-agent-3.png',
];

export default function AgentLogin() {
  const { publicKey, connected } = useWallet();
  const [hasEnoughTokens, setHasEnoughTokens] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const KAWAI_TOKEN_ADDRESS = 'CRonCzMtoLRHE6UsdpUCrm7nm7BwM3NfJU1ssVWAGBL7';
  const MINIMUM_TOKENS_REQUIRED = 100;

  useEffect(() => {
    const checkTokenBalance = async () => {
      if (!publicKey) {
        setHasEnoughTokens(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'https://api.mainnet-beta.solana.com';
        const connection = new Connection(rpcUrl, 'confirmed');

        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          { programId: TOKEN_PROGRAM_ID }
        );

        const kawaiTokenAccount = tokenAccounts.value.find(
          account => account.account.data.parsed.info.mint === KAWAI_TOKEN_ADDRESS
        );

        if (kawaiTokenAccount) {
          const balance = Number(kawaiTokenAccount.account.data.parsed.info.tokenAmount.amount);
          const decimals = kawaiTokenAccount.account.data.parsed.info.tokenAmount.decimals;
          const adjustedBalance = balance / Math.pow(10, decimals);
          setHasEnoughTokens(adjustedBalance >= MINIMUM_TOKENS_REQUIRED);
        } else {
          setHasEnoughTokens(false);
        }
      } catch (err) {
        console.error('Failed to fetch KAWAI token balance:', err);
        setError('Failed to verify token balance. Please try again later.');
        setHasEnoughTokens(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (connected && publicKey) {
      checkTokenBalance();
    }
  }, [publicKey, connected]);

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      {/* Left side - Cover Carousel - Removed padding, increased max-width */}
      <div className="relative hidden bg-muted lg:flex lg:items-center lg:justify-center p-4"> {/* Reduced padding */}
        <Carousel className="w-full max-w-xl xl:max-w-3xl"> {/* Increased max-width */}
          <CarouselContent>
            {agentScreenshots.map((src, index) => (
              <CarouselItem key={index} className="relative aspect-video group">
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="relative w-full h-full cursor-pointer">
                      <Image
                        src={src}
                        alt={`KAWAI Agent Screenshot ${index + 1}`}
                        layout="fill"
                        objectFit="contain" // Show full window
                        className="rounded-md"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md">
                        <Expand className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[90vw] h-[90vh] p-0 bg-transparent border-none flex items-center justify-center"> {/* Adjusted modal size */}
                    <Image
                      src={src}
                      alt={`KAWAI Agent Screenshot ${index + 1} Full Preview`}
                      layout="fill"
                      objectFit="contain"
                    />
                  </DialogContent>
                </Dialog>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Adjusted button positioning */}
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
        </Carousel>
         <div className="absolute bottom-4 left-4 right-4 text-center text-white p-3 bg-black/60 rounded-lg z-10"> {/* Adjusted padding/position */}
           <h3 className="text-lg font-bold">KAWAI Agent</h3>
           <p className="text-sm">Access AI agents powered by KAWAI&apos;s decentralized computation network.</p>
         </div>
      </div>

      {/* Right side - Login Logic */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-4 right-4">
           <ModeToggle />
        </div>
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Agent Login</h1>
            <p className="text-balance text-muted-foreground">
              Connect your wallet to access the KAWAI Agent Dashboard
            </p>
          </div>

          {/* Wallet Connection and Status */}
          <div className="grid gap-4">
            {!connected ? (
              <div className="flex flex-col items-center gap-4">
                <WalletMultiButton className="w-full wallet-adapter-button-trigger" />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <h3 className="text-lg font-semibold">Wallet Connected</h3>
                <p className="text-sm text-muted-foreground break-all w-full text-center">
                  {publicKey?.toString()}
                </p>

                {isLoading ? (
                  <div className="flex flex-col items-center my-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                    <p className="text-sm text-muted-foreground">Verifying KAWAI token balance...</p>
                  </div>
                ) : error ? (
                  <Alert variant="destructive" className="w-full">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : hasEnoughTokens === true ? (
                  <>
                    <Alert variant="default" className="w-full bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700">
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <AlertTitle className="text-green-800 dark:text-green-300">Access Granted!</AlertTitle>
                      <AlertDescription className="text-green-700 dark:text-green-400">
                        You have the required KAWAI tokens. Your access token: GRANTED
                      </AlertDescription>
                    </Alert>
                    <Link href="/agent-dashboard" className="w-full">
                      <Button className="w-full">Continue to Agent Dashboard</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Alert variant="destructive" className="w-full">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Insufficient KAWAI Balance</AlertTitle>
                      <AlertDescription>
                        You need at least {MINIMUM_TOKENS_REQUIRED} KAWAI tokens to access the Agent Dashboard.
                      </AlertDescription>
                    </Alert>
                    <div className="flex flex-col space-y-2 w-full">
                      <Button variant="outline" asChild>
                        <a
                          href="https://raydium.io/swap/?inputCurrency=sol&outputCurrency=CRonCzMtoLRHE6UsdpUCrm7nm7BwM3NfJU1ssVWAGBL7"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center"
                        >
                          Buy KAWAI on Raydium
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="outline" asChild>
                        <a
                          href="https://www.orca.so/pools/5x6DLbiMMpioqpyFcCixxD7EY9EabyypjA7Uc7xNvvRk"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center"
                        >
                          Buy KAWAI on Orca
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 text-center text-sm">
            Go back to {" "}
            <Link href="/" className="underline">
              Home Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

