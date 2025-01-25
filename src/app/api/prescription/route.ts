import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(req: Request): Promise<Response> {
  try {
    const { imageUrl } = await req.json();
    const pythonPath = path.join(process.cwd(), 'newenv', 'Scripts', 'python.exe');

    return new Promise<Response>((resolve) => {
      const pythonProcess = spawn(pythonPath, [
        path.join(process.cwd(), 'prescription', 'main.py'),
        '--image',
        imageUrl
      ]);

      let result = '';
      let errorOutput = '';

      pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
        console.error(`Python Error: ${data}`);
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          resolve(NextResponse.json({ 
            error: 'Processing failed', 
            details: errorOutput 
          }, { status: 500 }));
        } else {
          resolve(NextResponse.json({ result }, { status: 200 }));
        }
      });

      pythonProcess.on('error', (error) => {
        resolve(NextResponse.json({ 
          error: 'Failed to start Python process',
          details: error.message 
        }, { status: 500 }));
      });
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Invalid request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
}
