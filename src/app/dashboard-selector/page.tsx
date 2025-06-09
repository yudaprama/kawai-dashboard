'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Bot, Server, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardSelector() {
  const { publicKey, connected } = useWallet();
  const [hasTokenAccount, setHasTokenAccount] = useState<boolean | null>(null);
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const KAWAI_TOKEN_ADDRESS = 'CRonCzMtoLRHE6UsdpUCrm7nm7BwM3NfJU1ssVWAGBL7';

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

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">KAWAI</h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Choose Your Dashboard</h2>
          <p className="text-muted-foreground">
            Access AI services or provide computational resources to earn rewards
          </p>
        </div>

        {/* Wallet Connection */}
        {!connected ? (
          <div className="flex flex-col items-center gap-4 mb-8">
            <p className="text-muted-foreground">Connect your wallet to see available options</p>
            <WalletMultiButton className="wallet-adapter-button-trigger" />
          </div>
        ) : (
          <div className="mb-8">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">✅ Wallet Connected</h3>
              <p className="text-sm text-muted-foreground font-mono">
                {publicKey?.toString()}
              </p>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center my-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                <p className="text-sm text-muted-foreground">Checking KAWAI token account...</p>
              </div>
            ) : error ? (
              <Alert variant="destructive" className="mb-8">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : hasTokenAccount ? (
              <div className="space-y-6">
                {/* Token Account Status */}
                <Alert variant="default" className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <AlertTitle className="text-blue-800 dark:text-blue-300">✅ KAWAI Token Account Found</AlertTitle>
                  <AlertDescription className="text-blue-700 dark:text-blue-400">
                    You have a KAWAI token account with {tokenBalance.toLocaleString()} tokens. You can access both dashboards!
                  </AlertDescription>
                </Alert>

                {/* Dashboard Options */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Agent Dashboard Card */}
                  <Card className="relative transition-all hover:shadow-lg cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Bot className="h-6 w-6 text-blue-600" />
                        <CardTitle>Agent Dashboard</CardTitle>
                      </div>
                      <CardDescription>
                        Access AI agents powered by KAWAI&apos;s decentralized network
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Requirement:</span>
                          <span className="font-semibold">KAWAI Token Account ✅</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Your Balance:</span>
                          <span className="font-semibold">{tokenBalance.toLocaleString()} KAWAI</span>
                        </div>
                        
                        <Link href="/agent-login" className="block">
                          <Button className="w-full">
                            Access Agent Dashboard
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Provider Dashboard Card */}
                  <Card className="relative transition-all hover:shadow-lg cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Server className="h-6 w-6 text-red-600" />
                        <CardTitle>Provider Dashboard</CardTitle>
                      </div>
                      <CardDescription>
                        Earn KAWAI tokens by providing computational resources
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Requirement:</span>
                          <span className="font-semibold">KAWAI Token Account ✅</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Your Balance:</span>
                          <span className="font-semibold">{tokenBalance.toLocaleString()} KAWAI</span>
                        </div>
                        
                        <Link href="/provider-login" className="block">
                          <Button className="w-full">
                            Access Provider Dashboard
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* No Token Account Found */}
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No KAWAI Token Account Found</AlertTitle>
                  <AlertDescription>
                    You need to have a KAWAI token account to access the dashboards. Purchase some KAWAI tokens to create your account and unlock access.
                  </AlertDescription>
                </Alert>

                {/* Disabled Dashboard Options */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Agent Dashboard Card - Disabled */}
                  <Card className="relative transition-all opacity-50">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Bot className="h-6 w-6 text-blue-600" />
                        <CardTitle>Agent Dashboard</CardTitle>
                      </div>
                      <CardDescription>
                        Access AI agents powered by KAWAI&apos;s decentralized network
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Requirement:</span>
                          <span className="font-semibold text-red-600">KAWAI Token Account ❌</span>
                        </div>
                        <Button disabled className="w-full">
                          Buy KAWAI Tokens First
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Provider Dashboard Card - Disabled */}
                  <Card className="relative transition-all opacity-50">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Server className="h-6 w-6 text-red-600" />
                        <CardTitle>Provider Dashboard</CardTitle>
                      </div>
                      <CardDescription>
                        Earn KAWAI tokens by providing computational resources
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Requirement:</span>
                          <span className="font-semibold text-red-600">KAWAI Token Account ❌</span>
                        </div>
                        <Button disabled className="w-full">
                          Buy KAWAI Tokens First
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Purchase KAWAI Tokens */}
                <div className="mt-8">
                  <Alert variant="default" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Get Started with KAWAI</AlertTitle>
                    <AlertDescription>
                      Purchase KAWAI tokens to create your token account and unlock access to both dashboards
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="outline" asChild>
                      <a
                        href="https://raydium.io/swap/?inputCurrency=sol&outputCurrency=CRonCzMtoLRHE6UsdpUCrm7nm7BwM3NfJU1ssVWAGBL7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center"
                      >
                        Buy KAWAI on Raydium
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a
                        href="https://www.orca.so/pools/5x6DLbiMMpioqpyFcCixxD7EY9EabyypjA7Uc7xNvvRk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center"
                      >
                        Buy KAWAI on Orca
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 