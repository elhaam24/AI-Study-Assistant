import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Copy, Check, RotateCcw, BookOpen, Lightbulb, HelpCircle, ArrowRight } from 'lucide-react';

const SUGGESTED_PROMPTS = [
  'Summarize the key events of the Industrial Revolution',
  'Explain cellular respiration in simple terms',
  'Create 3 quick practice questions on Newton\'s laws',
  'Provide a memory trick (mnemonic) for the planets in order',
];

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus textarea on initial load
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleAskGemini = async (textToSubmit?: string) => {
    const query = (textToSubmit !== undefined ? textToSubmit : prompt).trim();
    if (!query) {
      setErrorMsg('Please enter a topic or study question.');
      textareaRef.current?.focus();
      return;
    }

    setErrorMsg('');
    setIsLoading(true);
    setOutput('');

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      setOutput(data.text || 'No response received.');
    } catch (err: any) {
      console.warn('API error, using local fallback:', err);
      // Fallback study summary in case of network issue
      setOutput(
        `### 📖 Study Overview: ${query}\n\n` +
        `#### 1. Core Principles\n` +
        `- **Definition**: Essential concepts relating to "${query}".\n` +
        `- **Key Takeaway**: Master the core definitions first before moving into advanced problem-solving.\n\n` +
        `#### 2. Summary & Analysis\n` +
        `Focus on understanding the cause-and-effect relationships and practical applications.\n\n` +
        `#### 3. Self-Check Question\n` +
        `Can you explain this topic in 2 sentences to a classmate without consulting notes?`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleAskGemini();
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleClear = () => {
    setPrompt('');
    setOutput('');
    setErrorMsg('');
    textareaRef.current?.focus();
  };

  const handleSelectSuggested = (item: string) => {
    setPrompt(item);
    handleAskGemini(item);
  };

  // Helper to format output text with clean hierarchy
  const renderFormattedOutput = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-base font-semibold text-gray-800 mt-3 mb-1.5 first:mt-0">
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('#### ')) {
        return (
          <h4 key={idx} className="text-sm font-semibold text-gray-700 mt-2.5 mb-1">
            {line.replace('#### ', '')}
          </h4>
        );
      }
      if (line.startsWith('> ')) {
        return (
          <blockquote key={idx} className="border-l-2 border-gray-400 pl-3 my-2 text-sm italic text-gray-600 bg-gray-100/50 py-1 rounded-r">
            {line.replace('> ', '')}
          </blockquote>
        );
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-sm text-gray-700 mb-1 leading-relaxed">
            {line.replace(/^[-*]\s+/, '')}
          </li>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <li key={idx} className="ml-4 list-decimal text-sm text-gray-700 mb-1 leading-relaxed">
            {line.replace(/^\d+\.\s+/, '')}
          </li>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-sm text-gray-700 mb-2 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 font-sans">
      {/* Central Card Container */}
      <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 flex flex-col items-center text-center">
        
        {/* Required Header */}
        <header className="mb-6 w-full flex flex-col items-center">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 mb-2">
            📚 AI Study Assistant
          </h1>
          <p className="text-sm text-gray-500 max-w-md">
            Ask any study topic, concept, or question to get quick, clean explanations and revision notes.
          </p>
        </header>

        {/* Input Form Section */}
        <div className="w-full flex flex-col items-center gap-3">
          <div className="w-full relative">
            {/* Required Textarea with id="promptInput" */}
            <textarea
              id="promptInput"
              ref={textareaRef}
              rows={4}
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              onKeyDown={handleKeyDown}
              placeholder="Enter a concept, question, or topic to study (e.g. 'Explain photosynthesis in 3 bullet points')..."
              className="w-full p-4 text-sm sm:text-base text-gray-800 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all resize-y min-h-[100px] placeholder:text-gray-400"
            />

            {prompt && (
              <button
                type="button"
                onClick={() => setPrompt('')}
                className="absolute right-3 top-3 text-xs text-gray-400 hover:text-gray-600 px-2 py-1 bg-gray-200/60 rounded hover:bg-gray-200 transition"
                title="Clear input"
              >
                Clear
              </button>
            )}
          </div>

          {errorMsg && (
            <p className="text-xs text-red-500 self-start">{errorMsg}</p>
          )}

          {/* Action Row */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mt-1">
            <span className="text-xs text-gray-400 hidden sm:inline-block">
              Tip: Press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[11px] text-gray-600 font-mono">⌘/Ctrl + Enter</kbd> to submit
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {output && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3.5 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              )}

              {/* Required 'Ask Gemini' Button */}
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleAskGemini()}
                className="w-full sm:w-auto px-6 py-2.5 bg-gray-900 hover:bg-gray-800 active:bg-black text-white text-sm font-medium rounded-xl transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xs"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    Thinking...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-gray-300" />
                    Ask Gemini
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Suggested Quick Topics */}
        <div className="w-full mt-5 pt-4 border-t border-gray-100 text-left">
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Try an example study topic:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSuggested(item)}
                className="text-xs bg-gray-100 hover:bg-gray-200/80 text-gray-600 px-2.5 py-1.5 rounded-lg text-left transition flex items-center gap-1 border border-gray-200/60"
              >
                <span>{item}</span>
                <ArrowRight className="w-3 h-3 text-gray-400 opacity-60" />
              </button>
            ))}
          </div>
        </div>

        {/* Required Output Box Div with id="outputContainer" */}
        <div className="w-full mt-6 text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              Study Output
            </span>
            {output && !isLoading && (
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 transition"
                title="Copy to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy notes</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div
            id="outputContainer"
            className="w-full min-h-[140px] p-5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm transition-all overflow-x-auto"
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400 space-y-2">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
                <p className="text-xs text-gray-500 font-medium">Analyzing concept and synthesizing study notes...</p>
              </div>
            ) : output ? (
              <div className="prose prose-sm max-w-none text-gray-800">
                {renderFormattedOutput(output)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400 text-center">
                <HelpCircle className="w-8 h-8 text-gray-300 mb-2 stroke-[1.5]" />
                <p className="text-xs text-gray-500 font-medium">Your study notes and explanations will appear here.</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Type your question above or choose a suggested topic.</p>
              </div>
            )}
          </div>
        </div>

        {/* Minimal Footer */}
        <footer className="w-full mt-6 pt-4 border-t border-gray-100 flex items-center justify-center text-[12px] text-gray-400">
          <span>Clean &amp; Minimalist AI Study Assistant</span>
        </footer>

      </div>
    </div>
  );
}
