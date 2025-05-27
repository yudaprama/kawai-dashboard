'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from "lucide-react";

export default function ProviderDashboard() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-black text-white">
      <div className="w-full max-w-6xl mx-auto">
        {/* Back button */}
        <div className="mb-8">
          <Link href="/provider-login" className="flex items-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Link>
        </div>
        
        {/* Header with logo */}
        <div className="mb-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">KAWAI</h1>
        </div>
        
        {/* Main heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Provider Dashboard</h2>
        
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
            
            <div className="text-center text-gray-400">
              <p>Dashboard functionality coming soon.</p>
              <p>Your access token has been verified.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
