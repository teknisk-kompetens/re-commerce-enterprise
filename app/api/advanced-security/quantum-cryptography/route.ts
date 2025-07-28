
/**
 * Quantum-Resistant Cryptography API
 */

import { NextRequest, NextResponse } from 'next/server';
import { QuantumResistantCryptography } from '@/lib/quantum-resistant-cryptography';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { action, ...params } = await request.json();

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      );
    }

    let result;
    switch (action) {
      case 'generateKeyPair':
        result = await QuantumResistantCryptography.generateQuantumResistantKeyPair(
          params.algorithm,
          params.purpose
        );
        break;
      case 'encrypt':
        result = await QuantumResistantCryptography.encryptQuantumResistant(
          params.data,
          params.publicKey,
          params.algorithm
        );
        break;
      case 'decrypt':
        result = await QuantumResistantCryptography.decryptQuantumResistant(
          params.encryptedData,
          params.privateKey,
          params.algorithm
        );
        break;
      case 'homomorphicEncrypt':
        result = await QuantumResistantCryptography.homomorphicEncrypt(
          params.data,
          params.scheme
        );
        break;
      case 'homomorphicCompute':
        result = await QuantumResistantCryptography.homomorphicCompute(
          params.encryptedData1,
          params.encryptedData2,
          params.operation,
          params.publicKey,
          params.scheme
        );
        break;
      case 'tokenize':
        result = await QuantumResistantCryptography.advancedTokenization(
          params.sensitiveData,
          params.tokenizationType
        );
        break;
      case 'smpc':
        result = await QuantumResistantCryptography.secureMultiPartyComputation(
          params.parties,
          params.computation,
          params.inputs
        );
        break;
      case 'differentialPrivacy':
        result = await QuantumResistantCryptography.differentialPrivacyAnalytics(
          params.data,
          params.query,
          params.epsilon,
          params.delta
        );
        break;
      default:
        return NextResponse.json(
          { error: 'Unknown action' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Quantum cryptography error:', error);
    return NextResponse.json(
      { error: 'Failed to perform quantum cryptography operation' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const status = await QuantumResistantCryptography.getQuantumCryptographyStatus();
    return NextResponse.json(status);
  } catch (error) {
    console.error('Error getting quantum cryptography status:', error);
    return NextResponse.json(
      { error: 'Failed to get quantum cryptography status' },
      { status: 500 }
    );
  }
}
