import { NextResponse } from 'next/server';

export async function GET() {
  // Base value
  const baseValue = 18764;
  
  // Time-based growth (starting from Jan 1, 2024)
  const baseDate = new Date('2024-01-01').getTime();
  const now = new Date().getTime();
  
  // Calculate days since base date (more stable than hours)
  const daysSinceBase = Math.floor((now - baseDate) / (1000 * 60 * 60 * 24));
  
  // Apply a moderate daily growth rate (5-10 hours per day)
  const dailyGrowthRate = 7;
  const timeBasedGrowth = daysSinceBase * dailyGrowthRate;
  
  // Add a small random variation (-5 to +15)
  const randomVariation = Math.floor(Math.random() * 20) - 5;
  
  // Calculate final hours value
  const totalHours = baseValue + timeBasedGrowth + randomVariation;
  
  // Create the response
  const response = NextResponse.json({
    hours: totalHours
  });
  
  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', 'https://getkawai.com');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  
  return response;
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', 'https://getkawai.com');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
} 