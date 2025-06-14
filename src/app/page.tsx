'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-background text-foreground">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
        {/* Cards for Agent and Provider */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          {/* Agent Card */}
          <div className="bg-card rounded-lg overflow-hidden border border-border hover:border-blue-500 transition-all duration-300">
            <div className="p-6 flex flex-col items-center text-center">
              <div className="relative w-full h-48 mb-6">
                <Image 
                  src="/kawai-agent/kawai-agent-1.png" 
                  alt="KAWAI Agent Interface" 
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <h3 className="text-2xl font-bold mb-2">KAWAI Agent</h3>
              <p className="text-muted-foreground mb-6">
                Access AI agents powered by KAWAI&apos;s decentralized computation network
              </p>
              <Link 
                href="/agent-login" 
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-center transition-colors duration-300"
              >
                Login as Agent User
              </Link>
            </div>
          </div>
          
          {/* Provider Card */}
          <div className="bg-card rounded-lg overflow-hidden border border-border hover:border-orange-500 transition-all duration-300">
            <div className="p-6 flex flex-col items-center text-center">
              <div className="relative w-full h-48 mb-6">
                <Image 
                  src="/kawai-provider/kawai-provider-1.png" 
                  alt="KAWAI Provider Interface" 
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <h3 className="text-2xl font-bold mb-2">KAWAI Provider</h3>
              <p className="text-muted-foreground mb-6">
                Earn KAWAI tokens by providing computational resources to the network
              </p>
              <Link 
                href="/provider-login" 
                className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md text-center transition-colors duration-300"
              >
                Login as Provider
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
