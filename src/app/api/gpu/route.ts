import { NextResponse } from 'next/server';

export async function GET() {
  // Base values
  const baseGpuHours = 18764;
  const baseNodes = 15;
  
  // Time-based growth (starting from Jan 1, 2024)
  const baseDate = new Date('2024-01-01').getTime();
  const now = new Date().getTime();
  
  // Calculate time periods
  const daysSinceBase = Math.floor((now - baseDate) / (1000 * 60 * 60 * 24));
  const monthsSinceBase = Math.floor(daysSinceBase / 30);
  
  // GPU Hours calculation
  const dailyGrowthRate = 7;
  const timeBasedHoursGrowth = daysSinceBase * dailyGrowthRate;
  const hoursRandomVariation = Math.floor(Math.random() * 20) - 5;
  const totalGpuHours = baseGpuHours + timeBasedHoursGrowth + hoursRandomVariation;
  
  // Active Nodes calculation
  const monthlyNodesGrowthRate = 2;
  const timeBasedNodesGrowth = monthsSinceBase * monthlyNodesGrowthRate;
  const nodesRandomVariation = Math.floor(Math.random() * 31) - 15;
  const totalActiveNodes = Math.max(5, baseNodes + timeBasedNodesGrowth + nodesRandomVariation);
  
  // Create the response with both metrics
  const response = NextResponse.json({
    gpuHours: totalGpuHours,
    activeNodes: totalActiveNodes
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