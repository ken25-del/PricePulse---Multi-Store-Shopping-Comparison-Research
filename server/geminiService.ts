import { GoogleGenAI, GenerateContentParameters, GenerateContentResponse } from '@google/genai';

/**
 * Cleanly formats a Gemini API error to avoid noisy multi-line stack traces in server logs.
 */
export function formatGeminiErrorMessage(err: unknown): string {
  if (!err) return 'Unknown error';
  if (typeof err === 'string') return err;
  
  const errObj = err as any;
  if (errObj.message) {
    // If message is a JSON string from ApiError
    try {
      const parsed = JSON.parse(errObj.message);
      if (parsed.error && parsed.error.message) {
        return `[Code ${parsed.error.code || errObj.status || 'API'}] ${parsed.error.message}`;
      }
    } catch {
      // Not JSON, return message directly
      return errObj.message;
    }
  }
  
  if (errObj.statusText || errObj.status) {
    return `Status ${errObj.status}: ${errObj.statusText || 'Error'}`;
  }
  
  return String(err);
}

/**
 * Safe Gemini content generation with multi-model fallback and transient error handling.
 */
export async function safeGenerateContent(
  apiKey: string,
  params: GenerateContentParameters,
  options?: {
    fallbackModels?: string[];
    enableSearchRetryWithoutTools?: boolean;
    operationName?: string;
  }
): Promise<GenerateContentResponse | null> {
  if (!apiKey) return null;

  const operation = options?.operationName || 'GeminiRequest';
  const modelsToTry = [
    params.model || 'gemini-3.7-flash',
    ...(options?.fallbackModels || ['gemini-2.5-flash', 'gemini-3.1-flash-lite'])
  ];

  // Remove duplicates while preserving order
  const uniqueModels = Array.from(new Set(modelsToTry));

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });

  for (let mIdx = 0; mIdx < uniqueModels.length; mIdx++) {
    const currentModel = uniqueModels[mIdx];
    
    // First attempt with given config
    try {
      const currentParams: GenerateContentParameters = {
        ...params,
        model: currentModel
      };

      const response = await ai.models.generateContent(currentParams);
      if (response && response.text) {
        return response;
      }
    } catch (err: any) {
      const isLastModel = mIdx === uniqueModels.length - 1;
      const formatted = formatGeminiErrorMessage(err);
      const isQuotaOrUnavailable = 
        formatted.includes('429') || 
        formatted.includes('503') || 
        formatted.includes('RESOURCE_EXHAUSTED') || 
        formatted.includes('UNAVAILABLE') ||
        formatted.includes('high demand');

      // If search grounding tools caused rate limit or failure, retry without tools
      if (params.config?.tools && options?.enableSearchRetryWithoutTools) {
        try {
          const strippedConfig = { ...params.config };
          delete strippedConfig.tools;

          const retryResponse = await ai.models.generateContent({
            ...params,
            model: currentModel,
            config: strippedConfig
          });

          if (retryResponse && retryResponse.text) {
            return retryResponse;
          }
        } catch {
          // Ignore tool retry failure and proceed to next model
        }
      }

      if (isLastModel) {
        console.warn(`[${operation}] AI service notice (${formatted.slice(0, 100)}); engaging instant verified fallback.`);
      }
    }
  }

  return null;
}
