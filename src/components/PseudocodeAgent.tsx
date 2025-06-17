'use client';
import React, { useState, useRef } from 'react';
import FlowchartRenderer from './FlowchartRenderer';
import { Select, Button } from './ui';

export default function PseudocodeAgent() {
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('python');
  const [file, setFile] = useState<File | null>(null);
  const [task, setTask] = useState<'code' | 'pseudocode' | 'flowchart'>('code');
  const [result, setResult] = useState('');
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  const recognitionRef = useRef<any>(null);

  const speakText = (text: string) => {
    const u = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(u);
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
        throw new Error('No result');
      }
    } catch {
      const msg = 'Something went wrong. You are safe. This is not your fault. Please try again.';
      setResult(msg);
      if (accessibilityMode) speakText(msg);
    }
  };

  const toggleDictation = () => {
    const SR = (window as any).webkitSpeechRecognition;
    if (!SR) return;
    if (!recognitionRef.current) {
      recognitionRef.current = new SR();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onresult = (e: any) => {
        setInput(e.results[0][0].transcript);
      };
    }
    recognitionRef.current.start();
  };

  return (
    <div className={`min-h-screen p-6 flex flex-col items-center ${accessibilityMode ? 'bg-white text-black text-lg' : 'bg-gradient-to-br from-slate-100 to-slate-300 text-base'}`}>
      <div className="w-full flex justify-end mb-2">
        <Button onClick={() => setAccessibilityMode(!accessibilityMode)}>
          {accessibilityMode ? 'Normal Mode' : 'Accessibility Mode'}
        </Button>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Pseudocode & Flowchart Ninja 🥷</h1>
      <textarea
        className="w-full max-w-2xl h-40 p-2 border rounded"
        placeholder="Paste pseudocode or flowchart text..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      {accessibilityMode && (
        <div className="flex gap-4 my-4">
          <Button onClick={toggleDictation}>🎤 Dictate</Button>
          <Button onClick={() => speakText(input)}>🔊 Read Aloud</Button>
        </div>
      )}
      <div className="flex gap-4 my-4">
        <Select
          label="Programming language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border p-1"
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
          title="Upload image file"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-6">
        <Button onClick={() => { setTask('pseudocode'); handleRunAgent(); }}>✨ Pseudocode</Button>
        <Button onClick={() => { setTask('flowchart'); handleRunAgent(); }}>📊 Flowchart</Button>
        <Button onClick={() => { setTask('code'); handleRunAgent(); }}>🧠 Interpret</Button>
        <Button onClick={handleRunAgent}>👾 Generate</Button>
      </div>
      {result && (
        <div className="w-full max-w-4xl">
          {task === 'flowchart' ? (
            <FlowchartRenderer code={result} />
          ) : (
            <pre className="bg-white p-4 rounded shadow whitespace-pre-wrap">{result}</pre>
          )}
        </div>
      )}
    </div>
  );
}
