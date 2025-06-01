import { NextResponse } from 'next/server';

export async function GET() {
  // Base value as of a specific date (e.g., January 1, 2023)
  const baseValue = 18764; // Starting value: 18,764
  const baseDate = new Date('2024-01-01').getTime(); // Base timestamp
  const now = new Date().getTime(); // Current timestamp
  
  // Calculate time difference in hours
  const hoursSinceBase = Math.floor((now - baseDate) / (1000 * 60 * 60));

  // Generate a random number between 15 and 49 (inclusive)
  const min = 15;
  const max = 49;
  const growthRate = Math.floor(Math.random() * (max - min + 1)) + min;

  // Calculate additional hours using API data
  const additionalHours = hoursSinceBase * growthRate;
  
  // Return the random number as JSON
  return NextResponse.json({
    hours: baseValue + additionalHours 
  });
} 