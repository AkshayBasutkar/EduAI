import React, { useState } from 'react';
import { EvaluationForm } from './components/EvaluationForm';
import { LoadingScreen } from './components/LoadingScreen';
import { ResultsDisplay } from './components/ResultsDisplay';
import { ErrorDisplay } from './components/ErrorDisplay';
import { evaluateScript } from './services/api';
import { EvaluationRequest, EvaluationResult } from './types';

type AppState = 'form' | 'loading' | 'results' | 'error';

function App() {
  const [state, setState] = useState<AppState>('form');
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<{ message: string; traceback?: string } | null>(null);
  const [lastRequest, setLastRequest] = useState<EvaluationRequest | null>(null);

  const handleSubmit = async (request: EvaluationRequest) => {
    setState('loading');
    setLastRequest(request);
    setError(null);

    try {
      const response = await evaluateScript(request);
      
      if (response.success && response.result) {
        setResult(response.result);
        setState('results');
      } else {
        setError({
          message: response.error || 'Unknown error occurred',
          traceback: response.traceback
        });
        setState('error');
      }
    } catch (err: any) {
      setError({
        message: err.response?.data?.error || err.message || 'Network error occurred',
        traceback: err.response?.data?.traceback
      });
      setState('error');
    }
  };

  const handleRetry = () => {
    if (lastRequest) {
      handleSubmit(lastRequest);
    }
  };

  const handleReset = () => {
    setState('form');
    setResult(null);
    setError(null);
    setLastRequest(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {state === 'form' && (
        <div className="py-8">
          <EvaluationForm onSubmit={handleSubmit} isLoading={false} />
        </div>
      )}
      
      {state === 'loading' && <LoadingScreen />}
      
      {state === 'results' && result && (
        <ResultsDisplay result={result} onReset={handleReset} />
      )}
      
      {state === 'error' && error && (
        <ErrorDisplay
          error={error.message}
          traceback={error.traceback}
          onRetry={handleRetry}
          onReset={handleReset}
        />
      )}
    </div>
  );
}

export default App;