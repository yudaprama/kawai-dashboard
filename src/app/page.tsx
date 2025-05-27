'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-black text-white">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header with logo */}
        <div className="flex justify-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">KAWAI</h1>
        </div>
        
        {/* Main content */}
        <div className="flex flex-col items-center">
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">The Bitcoin of AI Computation</h2>
            <p className="text-lg text-gray-400 max-w-2xl">
              Choose your path in the KAWAI ecosystem
            </p>
          </div>
          
          {/* Mascot image */}
          <div className="relative w-48 h-48 mb-8">
            <Image 
              src="/kawai-mascot.png" 
              alt="KAWAI Mascot" 
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
          
          {/* Cards for Agent and Provider */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            {/* Agent Card */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 hover:border-blue-500 transition-all duration-300 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-full h-48 mb-4">
                    <Image 
                      src="/kawai-agent/kawai-agent-1.png" 
                      alt="KAWAI Agent Interface" 
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2">KAWAI Agent</h3>
                  <p className="text-gray-400 mb-6">
                    Access AI agents powered by KAWAI's decentralized computation network
                  </p>
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                    <Link href="/agent-login">
                      Login as Agent User
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Provider Card */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 hover:border-orange-500 transition-all duration-300 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-full h-48 mb-4">
                    <Image 
                      src="/kawai-provider/kawai-provider-1.png" 
                      alt="KAWAI Provider Interface" 
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2">KAWAI Provider</h3>
                  <p className="text-gray-400 mb-6">
                    Earn KAWAI tokens by providing computational resources to the network
                  </p>
                  <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
                    <Link href="/provider-login">
                      Login as Provider
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
