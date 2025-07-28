
/**
 * BEHEMOTH WEBASSEMBLY CRYPTO API
 * High-performance cryptographic operations using WebAssembly
 */

import { NextRequest, NextResponse } from 'next/server';
import { createBehemothApiRoute } from '@/lib/behemoth-api-gateway';
import { WebAssemblyEngine } from '@/lib/webassembly-engine';
import { observability } from '@/lib/behemoth-observability';

export const dynamic = 'force-dynamic';

interface CryptoRequest {
  operation: 'hash' | 'encrypt' | 'decrypt';
  data: string; // Base64 encoded data
  key?: string; // Base64 encoded key (for encrypt/decrypt)
  algorithm?: string;
}

async function cryptoHandler(context: any) {
  const spanId = observability.startSpan('wasm_crypto_operation');
  
  try {
    const body: CryptoRequest = await context.request.json();
    
    if (!body.operation || !body.data) {
      return NextResponse.json({
        error: 'Missing required fields: operation and data',
      }, { status: 400 });
    }
    
    // Validate operation
    if (!['hash', 'encrypt', 'decrypt'].includes(body.operation)) {
      return NextResponse.json({
        error: 'Invalid operation. Supported: hash, encrypt, decrypt',
      }, { status: 400 });
    }
    
    // Decode input data
    let inputData: Uint8Array;
    try {
      inputData = new Uint8Array(Buffer.from(body.data, 'base64'));
    } catch (error) {
      return NextResponse.json({
        error: 'Invalid base64 data',
      }, { status: 400 });
    }
    
    // Decode key if provided
    let keyData: Uint8Array | undefined;
    if (body.key) {
      try {
        keyData = new Uint8Array(Buffer.from(body.key, 'base64'));
      } catch (error) {
        return NextResponse.json({
          error: 'Invalid base64 key',
        }, { status: 400 });
      }
    }
    
    // Perform cryptographic operation using WebAssembly
    const startTime = performance.now();
    let result: Uint8Array;
    
    try {
      result = await WebAssemblyEngine.performCryptoOperation(
        body.operation,
        inputData,
        keyData,
        body.algorithm
      );
    } catch (error) {
      observability.finishSpan(spanId, 'error', {
        'crypto.operation': body.operation,
        'error': error instanceof Error ? error.message : 'Unknown error',
      });
      
      return NextResponse.json({
        error: 'Cryptographic operation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      }, { status: 500 });
    }
    
    const operationTime = performance.now() - startTime;
    
    // Record metrics
    observability.recordMetric('wasm_crypto_operations_total', 1, 'counter', {
      operation: body.operation,
      success: 'true',
    });
    
    observability.recordMetric('wasm_crypto_operation_duration', operationTime, 'histogram', {
      operation: body.operation,
    }, 'ms');
    
    // Finish tracing
    observability.finishSpan(spanId, 'success', {
      'crypto.operation': body.operation,
      'crypto.data_size': inputData.length,
      'crypto.result_size': result.length,
      'crypto.duration_ms': operationTime,
    });
    
    // Encode result as base64
    const resultBase64 = Buffer.from(result).toString('base64');
    
    return NextResponse.json({
      success: true,
      operation: body.operation,
      result: resultBase64,
      metadata: {
        inputSize: inputData.length,
        outputSize: result.length,
        operationTime: `${operationTime.toFixed(2)}ms`,
        algorithm: body.algorithm || 'default',
        timestamp: new Date().toISOString(),
      },
    });
    
  } catch (error) {
    observability.finishSpan(spanId, 'error', {
      'error': error instanceof Error ? error.message : 'Unknown error',
    });
    
    // Record error metrics
    observability.recordMetric('wasm_crypto_operations_total', 1, 'counter', {
      operation: 'unknown',
      success: 'false',
    });
    
    console.error('WASM crypto operation failed:', error);
    
    return NextResponse.json({
      error: 'Internal server error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

// Create API route with authentication and specific permissions
export const POST = createBehemothApiRoute(
  {
    requireAuth: true,
    requireTenant: true,
    permissions: ['crypto_operations', 'wasm_access'],
    allowCors: true,
    enableMetrics: true,
    enableTracing: true,
    enableAudit: true,
    rateLimit: {
      requests: 100,
      window: 300, // 100 crypto operations per 5 minutes
    },
    widgetContext: true, // Enable widget communication context
  },
  cryptoHandler
);

// GET endpoint for supported operations
export const GET = createBehemothApiRoute(
  {
    requireAuth: true,
    requireTenant: false,
    allowCors: true,
    enableMetrics: false,
    enableTracing: false,
    rateLimit: {
      requests: 1000,
      window: 300,
    },
  },
  async () => {
    return NextResponse.json({
      supportedOperations: [
        {
          name: 'hash',
          description: 'Compute cryptographic hash of data',
          requiredFields: ['data'],
          optionalFields: ['algorithm'],
          supportedAlgorithms: ['sha256', 'sha512'],
        },
        {
          name: 'encrypt',
          description: 'Encrypt data using symmetric encryption',
          requiredFields: ['data', 'key'],
          optionalFields: ['algorithm'],
          supportedAlgorithms: ['aes-256-gcm', 'aes-128-gcm'],
        },
        {
          name: 'decrypt',
          description: 'Decrypt data using symmetric encryption',
          requiredFields: ['data', 'key'],
          optionalFields: ['algorithm'],
          supportedAlgorithms: ['aes-256-gcm', 'aes-128-gcm'],
        },
      ],
      usage: {
        dataFormat: 'base64',
        keyFormat: 'base64',
        responseFormat: 'base64',
      },
      performance: {
        wasmEnabled: true,
        expectedLatency: '< 100ms for typical operations',
        maxDataSize: '10MB',
      },
    });
  }
);
