import React, { useState } from 'react';
import { StorageType } from '../types';
import { JAVA_ARRAYLIST_CODE, JAVA_ARRAY_CODE } from '../data/javaCodeTemplates';
import {
  Copy,
  Check,
  Download,
  Terminal,
  FileCode,
  Layers,
  Cpu,
  BookOpen
} from 'lucide-react';

interface JavaCodeViewProps {
  storageType: StorageType;
  setStorageType: (type: StorageType) => void;
}

export const JavaCodeView: React.FC<JavaCodeViewProps> = ({
  storageType,
  setStorageType,
}) => {
  const [copied, setCopied] = useState(false);

  const activeCode = storageType === 'ARRAY_LIST' ? JAVA_ARRAYLIST_CODE : JAVA_ARRAY_CODE;
  const filename = storageType === 'ARRAY_LIST' ? 'StudentGradeManager.java' : 'StudentGradeManagerArray.java';

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([activeCode], { type: 'text/x-java-source;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Code Header Bar & Data Structure Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 font-mono">
              {filename}
            </h2>
            <p className="text-xs text-slate-400">
              Complete, production-ready, compilable Java source code file
            </p>
          </div>
        </div>

        {/* Data Structure Toggle & Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setStorageType('ARRAY_LIST')}
              className={`px-3 py-1.5 rounded-lg font-mono font-medium transition-all ${
                storageType === 'ARRAY_LIST'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ArrayList Implementation
            </button>
            <button
              onClick={() => setStorageType('FIXED_ARRAY')}
              className={`px-3 py-1.5 rounded-lg font-mono font-medium transition-all ${
                storageType === 'FIXED_ARRAY'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Array[] Implementation
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copy Java</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shrink-0 shadow-lg shadow-amber-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Download .java</span>
          </button>
        </div>
      </div>

      {/* Code Viewer Container */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            Clean Standard Library
          </span>
          <span>{activeCode.split('\n').length} Lines</span>
        </div>

        <pre className="p-6 text-xs text-slate-200 font-mono overflow-x-auto max-h-[600px] leading-relaxed select-all">
          <code>{activeCode}</code>
        </pre>
      </div>

      {/* Compilation & Data Structure Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Compilation instructions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-xs text-slate-300 space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-100 uppercase tracking-wider text-xs">
            <Terminal className="w-4 h-4 text-amber-400" />
            How to Compile & Run on Your Local Machine
          </div>
          <ol className="list-decimal list-inside space-y-2 text-slate-400 font-mono">
            <li>
              Save code as <strong className="text-amber-300">{filename}</strong>
            </li>
            <li>
              Open terminal & compile: <br />
              <code className="bg-slate-950 px-2 py-1 rounded text-emerald-400 border border-slate-800 inline-block mt-1">
                javac {filename}
              </code>
            </li>
            <li>
              Execute program: <br />
              <code className="bg-slate-950 px-2 py-1 rounded text-emerald-400 border border-slate-800 inline-block mt-1">
                java {filename.replace('.java', '')}
              </code>
            </li>
          </ol>
        </div>

        {/* Tradeoff comparison */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-xs text-slate-300 space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-100 uppercase tracking-wider text-xs">
            <Cpu className="w-4 h-4 text-amber-400" />
            Java Data Structure Analysis
          </div>
          <div className="space-y-2 text-slate-400">
            {storageType === 'ARRAY_LIST' ? (
              <>
                <p>
                  <strong className="text-amber-300 font-mono">ArrayList&lt;Student&gt;:</strong> Uses dynamic array resizing under the hood. Automatically grows capacity when adding new students.
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-400 font-mono">
                  <li>Insertion: Amortized O(1) time</li>
                  <li>Search by ID: O(N) linear search</li>
                  <li>Removal: O(N) shifts remaining elements</li>
                </ul>
              </>
            ) : (
              <>
                <p>
                  <strong className="text-amber-300 font-mono">Student[] Fixed Array:</strong> Uses primitive fixed-size memory allocation (`new Student[100]`) with an index tracker `count`.
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-400 font-mono">
                  <li>Fixed maximum capacity limit</li>
                  <li>Memory overhead is fixed upfront</li>
                  <li>Direct index access in O(1) time</li>
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
