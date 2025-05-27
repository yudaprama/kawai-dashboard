'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-black text-white">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
        {/* Header with logo */}
        <div className="mb-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">KAWAI</h1>
        </div>
        
        {/* Main heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">The Bitcoin of AI Computation</h2>
        
        {/* Subheading */}
        <p className="text-lg text-gray-400 mb-12 text-center">
          Choose your path in the KAWAI ecosystem
        </p>
        
        {/* Mascot image */}
        <div className="relative w-48 h-48 mb-12">
          <Image 
            src="/kawai-mascot.png" 
            alt="KAWAI Mascot" 
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
        
        {/* Cards for Agent and Provider */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          {/* Agent Card */}
          <div className="bg-[#1a1f2e] rounded-lg overflow-hidden border border-[#2a3042] hover:border-blue-500 transition-all duration-300">
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
              <p className="text-gray-400 mb-6">
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
          <div className="bg-[#1a1f2e] rounded-lg overflow-hidden border border-[#2a3042] hover:border-orange-500 transition-all duration-300">
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
              <p className="text-gray-400 mb-6">
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
