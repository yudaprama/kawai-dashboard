'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import Image from 'next/image';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExternalLink, AlertCircle, CheckCircle2, Expand, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { encryptKawaiiSession } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const providerScreenshots = [
  '/kawai-provider/kawai-provider-1.png',
  '/kawai-provider/kawai-provider-2.png',
];

// Helper to get the auth API base URL from env
function getAuthUrl() {
  return process.env.NEXT_AUTH_URL || 'https://auth.getkawai.com';
}

export default function ProviderLogin() {
  const { publicKey, connected, signMessage } = useWallet();
  const [hasTokenAccount, setHasTokenAccount] = useState<boolean | null>(null);
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  const KAWAI_TOKEN_ADDRESS = 'CRonCzMtoLRHE6UsdpUCrm7nm7BwM3NfJU1ssVWAGBL7';

  // Check for existing session on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('kawai_provider_auth_token');
    const storedExpiry = localStorage.getItem('kawai_provider_auth_expiry');
    
    if (storedToken && storedExpiry) {
      const expiryTime = parseInt(storedExpiry);
      if (Date.now() < expiryTime) {
        setAuthToken(storedToken);
        setIsAuthenticated(true);
      } else {
        // Clear expired token
        localStorage.removeItem('kawai_provider_auth_token');
        localStorage.removeItem('kawai_provider_auth_expiry');
      }
    }
  }, []);

  useEffect(() => {
    const checkTokenAccount = async () => {
      if (!publicKey) {
        setHasTokenAccount(null);
        setTokenBalance(0);
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
          setTokenBalance(adjustedBalance);
          setHasTokenAccount(true);
        } else {
          setTokenBalance(0);
          setHasTokenAccount(false);
        }
      } catch (err) {
        console.error('Failed to check KAWAI token account:', err);
        setError('Failed to verify token account. Please try again later.');
        setHasTokenAccount(false);
        setTokenBalance(0);
      } finally {
        setIsLoading(false);
      }
    };

    if (connected && publicKey) {
      checkTokenAccount();
    }
  }, [publicKey, connected]);

  const handleWalletLogin = async () => {
    if (!publicKey || !signMessage) {
      setError('Wallet not properly connected');
      return;
    }

    setIsAuthenticating(true);
    setError(null);

    try {
      // Create authentication message
      const timestamp = Date.now();
      const nonce = Math.random().toString(36).substring(2, 15);
      const message = `Login to KAWAI Provider Dashboard\n\nWallet: ${publicKey.toString()}\nTimestamp: ${timestamp}\nNonce: ${nonce}\nRole: Provider`;
      
      const encodedMessage = new TextEncoder().encode(message);
      const signature = await signMessage(encodedMessage);

      // Convert signature to base64 for storage/transmission
      const signatureBase64 = Buffer.from(signature).toString('base64');
      
      // Create a simple authentication token (in production, this should be validated by backend)
      const authPayload = {
        wallet: publicKey.toString(),
        timestamp,
        nonce,
        signature: signatureBase64,
        role: 'provider'
      };
      
      const token = Buffer.from(JSON.stringify(authPayload)).toString('base64');
      
      // Store authentication token with 24-hour expiry
      const expiryTime = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
      localStorage.setItem('kawai_provider_auth_token', token);
      localStorage.setItem('kawai_provider_auth_expiry', expiryTime.toString());
      
      setAuthToken(token);
      setIsAuthenticated(true);
      
    } catch (err) {
      console.error('Authentication failed:', err);
      setError('Failed to authenticate. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('kawai_provider_auth_token');
    localStorage.removeItem('kawai_provider_auth_expiry');
    setAuthToken(null);
    setIsAuthenticated(false);
  };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      {/* Left side - Cover Carousel - Removed padding, increased max-width */}
      <div className="relative hidden bg-card lg:flex lg:items-center lg:justify-center p-4"> {/* Changed bg-muted to bg-card */}
        <Carousel className="w-full max-w-xl xl:max-w-3xl"> {/* Increased max-width */}
          <CarouselContent>
            {providerScreenshots.map((src, index) => (
              <CarouselItem key={index} className="relative aspect-video group">
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="relative w-full h-full cursor-pointer">
                      <Image
                        src={src}
                        alt={`KAWAI Provider Screenshot ${index + 1}`}
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
                      alt={`KAWAI Provider Screenshot ${index + 1} Full Preview`}
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
         <div className="absolute bottom-4 left-4 right-4 text-center bg-kawai-red text-white p-3 rounded-lg z-10"> {/* Changed from bg-black/60 to bg-kawai-red */}
           <h3 className="text-lg font-bold">KAWAI Provider</h3>
           <p className="text-sm">Launch a node and earn KAWAI tokens by providing computational resources to the network.</p>
         </div>
      </div>

      {/* Right side - Login Logic */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login with Wallet</h1>
            <p className="text-balance text-muted-foreground">
              Connect your wallet and authenticate to launch a KAWAI node and earn rewards
            </p>
          </div>

          {/* Wallet Connection and Authentication Flow */}
          <div className="grid gap-4">
            {!connected ? (
              <div className="flex flex-col items-center gap-4">
                <p className="text-sm text-muted-foreground text-center">
                  Step 1: Connect your Solana wallet
                </p>
                <WalletMultiButton className="w-full wallet-adapter-button-trigger" />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <h3 className="text-lg font-semibold">✅ Wallet Connected</h3>
                <p className="text-sm text-muted-foreground break-all w-full text-center">
                  {publicKey?.toString()}
                </p>

                {isLoading ? (
                  <div className="flex flex-col items-center my-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                    <p className="text-sm text-muted-foreground">Verifying KAWAI token account...</p>
                  </div>
                ) : error ? (
                  <Alert variant="destructive" className="w-full">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : hasTokenAccount === true ? (
                  <>
                    <Alert variant="default" className="w-full bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700">
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <AlertTitle className="text-green-800 dark:text-green-300">✅ KAWAI Token Account Found</AlertTitle>
                      <AlertDescription className="text-green-700 dark:text-green-400">
                        You have a KAWAI token account with {tokenBalance.toLocaleString()} tokens. You can proceed to launch a provider node.
                      </AlertDescription>
                    </Alert>

                    {/* Authentication Step */}
                    {!isAuthenticated ? (
                      <div className="flex flex-col items-center gap-4 w-full">
                        <p className="text-sm text-muted-foreground text-center">
                          Step 2: Sign message to authenticate your wallet ownership
                        </p>
                        <Button 
                          onClick={handleWalletLogin}
                          disabled={isAuthenticating}
                          className="w-full"
                        >
                          {isAuthenticating ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Authenticating...
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <Key className="mr-2 h-4 w-4" />
                              Sign Message to Login
                            </div>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4 w-full">
                        <Alert variant="default" className="w-full bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700">
                          <CheckCircle2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                          <AlertTitle className="text-red-800 dark:text-red-300">🎉 Authentication Successful!</AlertTitle>
                          <AlertDescription className="text-red-700 dark:text-red-400">
                            Welcome! You are now authenticated and can access the Provider Dashboard to launch your node.
                          </AlertDescription>
                        </Alert>
                        
                        <div className="flex flex-col gap-2 w-full">
                          <Link href="/provider-dashboard" className="w-full">
                            <Button className="w-full">Continue to Provider Dashboard</Button>
                          </Link>
                          <Button variant="outline" onClick={handleLogout} className="w-full">
                            Logout
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <Alert variant="destructive" className="w-full">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>No KAWAI Token Account Found</AlertTitle>
                      <AlertDescription>
                        You need to have a KAWAI token account to launch a provider node. Purchase some KAWAI tokens to create your account.
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

