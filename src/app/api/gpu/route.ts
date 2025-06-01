import { NextResponse } from 'next/server';

export async function GET() {
  // Use a base value that's more reasonable
  const baseValue = 18764;
  
  // Generate a random variation between 15 and 49
  const min = 15;
  const max = 49;
  const randomVariation = Math.floor(Math.random() * (max - min + 1)) + min;
  
  // Create the response with a more reasonable value (base + small random variation)
  const response = NextResponse.json({
    hours: baseValue + randomVariation
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