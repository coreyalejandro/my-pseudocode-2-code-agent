// src/components/PseudocodeAgent.tsx
'use client';

import React, { useState, useRef } from 'react';
import FlowchartRenderer from './FlowchartRenderer';
import { Select, Button } from './ui';

export default function PseudocodeAgent() {
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState<'python'|'javascript'|'typescript'|'java'|'csharp'>('python');
  const [file, setFile] = useState<File | null>(null);
  const [task, setTask] = useState<'code' | 'pseudocode' | 'flowchart'>('code');
  const [result, setResult] = useState('');
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  const recognitionRef = useRef<any>(null);

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  const toggleDictation = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onresult = (event: any) => {
        setInput(event.results[0][0].transcript);
      };
    }
    recognitionRef.current.start();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const handleRunAgent = async () => {
    try {
      const form = new FormData();
      form.append('input', input);
      form.append('language', language);
      form.append('task', task);
      if (file) form.append('image', file);

      const res = await fetch('/api/agent', { method: 'POST', body: form });
      const data = await res.json();

      if (data.result) {
        setResult(data.result);
        if (accessibilityMode) speakText(data.result);
      } else {
        throw new Error('No result returned');
      }
    } catch {
      const msg = 'Something went wrong. You are safe. This is not your fault. Please try again.';
      setResult(msg);
      if (accessibilityMode) speakText(msg);
    }
  };

  return (
    <div className={`min-h-screen p-6 flex flex-col items-center transition-colors ${
      accessibilityMode
        ? 'bg-white text-black text-lg'
        : 'bg-gradient-to-br from-slate-100 to-slate-300 text-base'
    }`}>
      {/* Accessibility Toggle */}
      <div className="w-full flex justify-end mb-4">
        <Button
          onClick={() => setAccessibilityMode(!accessibilityMode)}
          aria-label="Toggle accessibility mode"
        >
          {accessibilityMode ? 'Normal Mode' : 'Accessibility Mode'}
        </Button>
      </div>

      {/* Header */}
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
        Pseudocode & Flowchart Ninja 🥷
      </h1>

      {/* Input Area */}
      <textarea
        className="w-full max-w-2xl h-40 p-3 border rounded-md mb-4"
        placeholder="Paste pseudocode, flowchart text, or describe the logic..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        aria-label="Pseudocode input"
      />

      {/* Voice Controls */}
      {accessibilityMode && (
        <div className="flex gap-4 mb-4">
          <Button onClick={toggleDictation} aria-label="Start voice dictation">
            🎤 Dictate
          </Button>
          <Button onClick={() => speakText(input)} aria-label="Read input aloud">
            🔊 Read Aloud
          </Button>
        </div>
      )}

      {/* Language & File Upload */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <Select
          label="Choose output language"
          value={language}
          onChange={(e) => setLanguage(e.target.value as any)}
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="java">Java</option>
          <option value="csharp">C#</option>
        </Select>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="border p-2 rounded-md"
          aria-label="Upload flowchart image"
        />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-8 w-full max-w-2xl">
        <Button onClick={() => { setTask('pseudocode'); handleRunAgent(); }}>
          ✨ Pseudocode
        </Button>
        <Button onClick={() => { setTask('flowchart'); handleRunAgent(); }}>
          📊 Flowchart
        </Button>
        <Button onClick={() => { setTask('code'); handleRunAgent(); }}>
          🧠 Interpret
        </Button>
        <Button onClick={handleRunAgent}>
          👾 Generate
        </Button>
      </div>

      {/* Output */}
      {result && (
        <div className="w-full max-w-4xl">
          {task === 'flowchart' ? (
            <FlowchartRenderer code={result} />
          ) : (
            <pre className="bg-white p-4 rounded-md shadow whitespace-pre-wrap">
              {result}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
