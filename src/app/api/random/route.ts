import { NextResponse } from 'next/server';

export async function GET() {
  // Generate a random number between 15 and 49 (inclusive)
  const min = 15;
  const max = 49;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  
  // Return the random number as JSON
  return NextResponse.json({ 
    hours: randomNumber 
  });
} 