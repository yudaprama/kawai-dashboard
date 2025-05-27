'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/card";

export default function AgentDashboard() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-black text-white">
      <div className="w-full max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6">KAWAI Agent Dashboard</h1>
        <p className="text-xl mb-8">Agent dashboard coming soon!</p>
        <div className="relative w-full h-64 mb-8">
          <Image 
            src="/kawai-agent/kawai-agent-1.png" 
            alt="KAWAI Agent Interface" 
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
        <Link href="/" className="text-blue-500 hover:text-blue-400">
          Return to Home
        </Link>
      </div>
    </main>
  );
}
