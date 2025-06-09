'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, LogOut, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AuthPayload {
  wallet: string;
  timestamp: number;
  nonce: string;
  signature: string;
  role: string;
}

export default function ProviderDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userWallet, setUserWallet] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthentication = () => {
      const storedToken = localStorage.getItem('kawai_provider_auth_token');
      const storedExpiry = localStorage.getItem('kawai_provider_auth_expiry');
      
      if (storedToken && storedExpiry) {
        const expiryTime = parseInt(storedExpiry);
        if (Date.now() < expiryTime) {
          try {
            // Decode the token to get user info
            const authPayload: AuthPayload = JSON.parse(Buffer.from(storedToken, 'base64').toString());
            setUserWallet(authPayload.wallet);
            setIsAuthenticated(true);
          } catch (err) {
            console.error('Invalid token format:', err);
            handleLogout();
          }
        } else {
          // Token expired
          handleLogout();
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('kawai_provider_auth_token');
    localStorage.removeItem('kawai_provider_auth_expiry');
    setUserWallet(null);
    setIsAuthenticated(false);
  };

  // Loading state
  if (isAuthenticated === null) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-black text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="text-gray-400">Verifying authentication...</p>
        </div>
      </main>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-black text-white">
        <div className="w-full max-w-md mx-auto text-center">
          <Alert variant="destructive" className="mb-6">
            <Shield className="h-4 w-4" />
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription>
              You need to authenticate with your wallet to access the Provider Dashboard.
            </AlertDescription>
          </Alert>
          
          <Link href="/provider-login">
            <Button className="w-full">
              Go to Login
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  // Authenticated provider dashboard
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-black text-white">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header with back button and user info */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link href="/provider-login" className="flex items-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Link>
          
          {/* User info and logout */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Wallet:</span>
              <span className="font-mono text-xs">
                {userWallet ? `${userWallet.slice(0, 4)}...${userWallet.slice(-4)}` : ''}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
        
        {/* Header with logo */}
        <div className="mb-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">KAWAI</h1>
        </div>
        
        {/* Main heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Provider Dashboard</h2>
        
        {/* Welcome message */}
        <div className="mb-8 text-center">
          <Alert variant="default" className="bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 max-w-2xl mx-auto">
            <Shield className="h-4 w-4 text-red-600 dark:text-red-400" />
            <AlertTitle className="text-red-800 dark:text-red-300">🎉 Successfully Authenticated!</AlertTitle>
            <AlertDescription className="text-red-700 dark:text-red-400">
              Welcome to your KAWAI Provider Dashboard. Your wallet authentication has been verified.
            </AlertDescription>
          </Alert>
        </div>
        
        {/* Dashboard content */}
        <div className="mt-8 bg-[#1a1f2e] border border-[#2a3042] rounded-lg p-8">
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-full h-64 md:h-96 mb-6">
              <Image 
                src="/kawai-provider/kawai-provider-1.png" 
                alt="KAWAI Provider Interface" 
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
            
            <h3 className="text-2xl font-bold mb-4 text-center">Welcome to KAWAI Provider</h3>
            <p className="text-gray-400 mb-8 text-center max-w-2xl">
              Earn KAWAI tokens by providing computational resources to the network.
              This dashboard will allow you to monitor your contributions and earnings.
            </p>
            
            <div className="text-center text-gray-400 space-y-2">
              <p>🚀 Provider dashboard functionality coming soon.</p>
              <p>🔐 Your authentication token is valid for 24 hours.</p>
              <p>💰 Node deployment and earnings tracking will be available here.</p>
              <p>📊 Real-time monitoring of your computational contributions.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
