import { NextRequest, NextResponse } from 'next/server';
import { processCVs } from '@/app/actions/cv-processing';

export const maxDuration = 60; // Set max duration to 60 seconds

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const filesData = formData.getAll('files') as File[];
    const provider = formData.get('provider') as 'openai' | 'gemini';
    
    if (!filesData || filesData.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }
    
    if (!provider || (provider !== 'openai' && provider !== 'gemini')) {
      return NextResponse.json(
        { error: 'Invalid or missing provider' },
        { status: 400 }
      );
    }
    
    const results = await processCVs(filesData, provider);
    
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error processing CVs:', error);
    return NextResponse.json(
      { error: `Failed to process CVs: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}