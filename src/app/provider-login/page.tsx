'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExternalLink, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ProviderLogin() {
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
        // Use custom RPC URL if provided in env, otherwise use default
        const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'https://api.mainnet-beta.solana.com';
        const connection = new Connection(rpcUrl, 'confirmed');
        
        // Get all token accounts owned by the user
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          { programId: TOKEN_PROGRAM_ID }
        );
        
        // Find KAWAI token account
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
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-black text-white">
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
        {/* Back button */}
        <div className="self-start mb-8">
          <Link href="/" className="flex items-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>
        
        {/* Header with logo */}
        <div className="mb-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">KAWAI</h1>
        </div>
        
        {/* Main heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Provider Login</h2>
        
        {/* Subheading */}
        <p className="text-lg text-gray-400 mb-12 text-center">
          Connect your wallet to provide computational resources
        </p>
        
        {/* Mascot image */}
        <div className="relative w-32 h-32 mb-8">
          <Image 
            src="/kawai-mascot.png" 
            alt="KAWAI Mascot" 
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
        
        {/* Login Card */}
        <Card className="w-full bg-[#1a1f2e] border border-[#2a3042] p-8">
          <div className="flex flex-col items-center">
            {!connected ? (
              <>
                <h3 className="text-xl font-semibold mb-6">Connect your Solana wallet</h3>
                <p className="text-gray-400 mb-8 text-center">
                  You need to connect your wallet to verify KAWAI token ownership
                </p>
                <div className="wallet-adapter-button-container">
                  <WalletMultiButton className="wallet-adapter-button" />
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-4">Wallet Connected</h3>
                <p className="text-gray-400 mb-6 text-center break-all">
                  {publicKey?.toString()}
                </p>
                
                {isLoading ? (
                  <div className="flex flex-col items-center my-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4"></div>
                    <p>Verifying KAWAI token balance...</p>
                  </div>
                ) : error ? (
                  <Alert variant="destructive" className="mb-6 bg-red-900/20 border-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : hasEnoughTokens === true ? (
                  <>
                    <Alert className="mb-6 bg-green-900/20 border-green-800">
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertTitle>Access Granted!</AlertTitle>
                      <AlertDescription>
                        You have the required KAWAI tokens. Your access token: GRANTED
                      </AlertDescription>
                    </Alert>
                    
                    <Link 
                      href="/provider-dashboard" 
                      className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md text-center transition-colors duration-300"
                    >
                      Continue to Provider Dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <Alert className="mb-6 bg-amber-900/20 border-amber-800">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Insufficient KAWAI Balance</AlertTitle>
                      <AlertDescription>
                        You need at least {MINIMUM_TOKENS_REQUIRED} KAWAI tokens to access the Provider Dashboard.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="flex flex-col space-y-4 w-full">
                      <a 
                        href="https://raydium.io/swap/?inputCurrency=sol&outputCurrency=CRonCzMtoLRHE6UsdpUCrm7nm7BwM3NfJU1ssVWAGBL7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md text-center transition-colors duration-300 flex items-center justify-center"
                      >
                        Buy KAWAI on Raydium
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                      
                      <a 
                        href="https://www.orca.so/pools/5x6DLbiMMpioqpyFcCixxD7EY9EabyypjA7Uc7xNvvRk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-md text-center transition-colors duration-300 flex items-center justify-center"
                      >
                        Buy KAWAI on Orca
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}
