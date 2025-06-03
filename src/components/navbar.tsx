"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Stop propagation for the menu itself
  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold flex items-center text-white">
            <Image 
              src="/kawai-red.png" 
              alt="KAWAI Logo" 
              width={48} 
              height={48} 
              className="animate-pulse h-12 mr-3" 
            />
            <span className="animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500">
              KAWAI
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/docs" 
              className="text-white hover:text-cyan-200 flex items-center" 
              aria-label="KAWAI Documentation"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
              <span className="ml-1">Documentation</span>
            </Link>
            <Link 
              href="https://app.getkawai.com" 
              target="_blank" 
              className="px-4 py-2 bg-kawai-red hover:bg-kawai-red-dark text-white rounded-lg transition flex items-center"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-1" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>Launch App</span>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }} 
              className="text-white hover:text-cyan-200 focus:outline-none"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div 
          onClick={handleMenuClick}
          className="md:hidden bg-gray-800 py-2 px-4 absolute w-full z-50"
        >
          <div className="flex flex-col space-y-3">
            <Link 
              href="/docs" 
              className="text-white hover:text-cyan-200 py-2 flex items-center"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
              <span>Documentation</span>
            </Link>
            <Link 
              href="https://app.getkawai.com" 
              className="bg-kawai-red hover:bg-kawai-red-dark text-white py-2 px-4 rounded-lg transition w-full text-center mt-2 flex items-center justify-center"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>Launch App</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
} 