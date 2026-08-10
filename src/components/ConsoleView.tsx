import React, { useState, useRef, useEffect } from 'react';
import { Student, ClassStatistics, StorageType } from '../types';
import {
  Terminal,
  Play,
  RotateCcw,
  CornerDownLeft,
  Search,
  Plus,
  BarChart2,
  List,
  Trash2,
  HelpCircle,
  Code
} from 'lucide-react';

interface ConsoleViewProps {
  students: Student[];
  stats: ClassStatistics;
  storageType: StorageType;
  onAddStudent: () => void;
  onSearchById: (id: string) => void;
  onRemoveStudent: (id: string) => void;
}

interface TerminalLog {
  id: string;
  type: 'OUTPUT' | 'INPUT' | 'SYSTEM' | 'ERROR' | 'SUCCESS';
  text: string;
  timestamp?: string;
}

export const ConsoleView: React.FC<ConsoleViewProps> = ({
  students,
  stats,
  storageType,
  onAddStudent,
  onSearchById,
  onRemoveStudent,
}) => {
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [inputVal, setInputVal] = useState<string>('');
  const [activeStep, setActiveStep] = useState<'IDLE' | 'AWAITING_SEARCH_ID' | 'AWAITING_REMOVE_ID'>('IDLE');
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Initialize Terminal Banner
  useEffect(() => {
    printInitialBanner();
  }, [storageType]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const printInitialBanner = () => {
    const dsLabel = storageType === 'ARRAY_LIST' ? 'ArrayList<Student>' : 'Fixed Array (Student[100])';
    setLogs([
      {
        id: '1',
        type: 'SYSTEM',
        text: `[JVM Process Started] Running StudentGradeManager.class with ${dsLabel}...`,
      },
      {
        id: '2',
        type: 'OUTPUT',
        text: `===========================================================================`,
      },
      {
        id: '3',
        type: 'OUTPUT',
        text: `            STUDENT GRADE MANAGEMENT SYSTEM (Java Scanner CLI)            `,
      },
      {
        id: '4',
        type: 'OUTPUT',
        text: `===========================================================================`,
      },
      {
        id: '5',
        type: 'OUTPUT',
        text: ` 1. Add New Student`,
      },
      {
        id: '6',
        type: 'OUTPUT',
        text: ` 2. Display Summary Report`,
      },
      {
        id: '7',
        type: 'OUTPUT',
        text: ` 3. Search Student by ID`,
      },
      {
        id: '8',
        type: 'OUTPUT',
        text: ` 4. Calculate Statistics (Avg, Max, Min)`,
      },
      {
        id: '9',
        type: 'OUTPUT',
        text: ` 5. Remove Student by ID`,
      },
      {
        id: '10',
        type: 'OUTPUT',
        text: ` 6. Help / Clear Terminal`,
      },
      {
        id: '11',
        type: 'OUTPUT',
        text: `===========================================================================`,
      },
      {
        id: '12',
        type: 'SYSTEM',
        text: `Enter menu option (1-6) or click quick action buttons below:`,
      },
    ]);
  };

  const appendLog = (type: TerminalLog['type'], text: string) => {
    setLogs((prev) => [...prev, { id: `${Date.now()}-${prev.length + 1}`, type, text }]);
  };

  const handleCommandSubmit = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    appendLog('INPUT', `javaApp> ${trimmed}`);
    setInputVal('');

    // Handle states if awaiting specific input
    if (activeStep === 'AWAITING_SEARCH_ID') {
      executeSearch(trimmed);
      setActiveStep('IDLE');
      return;
    }

    if (activeStep === 'AWAITING_REMOVE_ID') {
      executeRemove(trimmed);
      setActiveStep('IDLE');
      return;
    }

    // Process Menu Options
    switch (trimmed.toLowerCase()) {
      case '1':
      case 'add':
        appendLog('SYSTEM', 'Opening Add Student Interface...');
        onAddStudent();
        break;

      case '2':
      case 'summary':
      case 'report':
        displaySummaryReport();
        break;

      case '3':
      case 'search':
        appendLog('OUTPUT', 'Enter Student ID to search (e.g., 101, 103):');
        setActiveStep('AWAITING_SEARCH_ID');
        break;

      case '4':
      case 'stats':
        displayStats();
        break;

      case '5':
      case 'remove':
      case 'delete':
        appendLog('OUTPUT', 'Enter Student ID to remove:');
        setActiveStep('AWAITING_REMOVE_ID');
        break;

      case '6':
      case 'help':
        printInitialBanner();
        break;

      case 'clear':
      case 'cls':
        setLogs([]);
        break;

      default:
        // Try direct shortcut if user typed e.g. "search 103"
        if (trimmed.toLowerCase().startsWith('search ')) {
          const targetId = trimmed.substring(7).trim();
          executeSearch(targetId);
        } else if (trimmed.toLowerCase().startsWith('remove ')) {
          const targetId = trimmed.substring(7).trim();
          executeRemove(targetId);
        } else {
          appendLog('ERROR', `Invalid choice '${trimmed}'. Enter 1-6 or type 'help'.`);
        }
        break;
    }
  };

  const executeSearch = (id: string) => {
    appendLog('SYSTEM', `Executing linear search for student ID '${id}' in Java memory...`);
    const target = students.find((s) => s.id.equalsIgnoreCase ? s.id.equalsIgnoreCase(id) : s.id.toLowerCase() === id.toLowerCase());

    if (target) {
      appendLog('SUCCESS', `\n[RECORD FOUND]`);
      appendLog('OUTPUT', `Student ID:   ${target.id}`);
      appendLog('OUTPUT', `Name:         ${target.name}`);
      appendLog('OUTPUT', `Department:   ${target.department || 'N/A'}`);
      appendLog('OUTPUT', `Average:      ${target.overallScore.toFixed(2)} pts`);
      appendLog('OUTPUT', `Grade:        ${target.letterGrade} (${target.status})`);
      appendLog('OUTPUT', `Grades:       ${target.grades.map(g => `${g.subject}:${g.score}`).join(', ')}`);
      onSearchById(id);
    } else {
      appendLog('ERROR', `\n[NOT FOUND] Student with ID '${id}' was not found in the record list.`);
    }
  };

  const executeRemove = (id: string) => {
    const target = students.find((s) => s.id.toLowerCase() === id.toLowerCase());
    if (target) {
      onRemoveStudent(target.id);
      appendLog('SUCCESS', `Successfully removed student '${target.name}' (ID: ${id}) from Java storage.`);
    } else {
      appendLog('ERROR', `Error: Student ID '${id}' not found.`);
    }
  };

  const displaySummaryReport = () => {
    appendLog('OUTPUT', '\n===========================================================================');
    appendLog('OUTPUT', '                             STUDENT SUMMARY REPORT                        ');
    appendLog('OUTPUT', '===========================================================================');
    appendLog('OUTPUT', sprintf('%-10s %-25s %-10s %-8s %-8s', 'ID', 'Name', 'Score', 'Grade', 'Status'));
    appendLog('OUTPUT', '---------------------------------------------------------------------------');

    students.forEach((s) => {
      appendLog(
        'OUTPUT',
        sprintf('%-10s %-25s %-10.2f %-8s %-8s', s.id, s.name, s.overallScore, s.letterGrade, s.status)
      );
    });

    appendLog('OUTPUT', '---------------------------------------------------------------------------');
    appendLog('SUCCESS', `Total Enrolled Students: ${students.length}`);
  };

  const displayStats = () => {
    appendLog('OUTPUT', '\n==================================================');
    appendLog('OUTPUT', '               CLASS PERFORMANCE STATS            ');
    appendLog('OUTPUT', '==================================================');
    appendLog('OUTPUT', `Total Students:   ${stats.totalStudents}`);
    appendLog('OUTPUT', `Average Score:    ${stats.averageScore.toFixed(2)}`);
    appendLog('OUTPUT', `Highest Score:    ${stats.highestScore.toFixed(2)} (${stats.highestStudent?.name || 'N/A'})`);
    appendLog('OUTPUT', `Lowest Score:     ${stats.lowestScore.toFixed(2)} (${stats.lowestStudent?.name || 'N/A'})`);
    appendLog('OUTPUT', `Pass Rate:        ${stats.passRate}% (${stats.passCount} Passed, ${stats.failCount} Failed)`);
    appendLog('OUTPUT', '==================================================');
  };

  // Helper for text formatting
  function sprintf(format: string, ...args: any[]) {
    let i = 0;
    return format.replace(/%(-?\d+)?(\.\d+)?([sfd])/g, (match, widthStr, precisionStr, specifier) => {
      let val = args[i++];
      if (val === undefined) return '';

      let strVal = String(val);
      if (specifier === 'f' && precisionStr) {
        const decimals = parseInt(precisionStr.substring(1));
        strVal = Number(val).toFixed(decimals);
      }

      if (widthStr) {
        const width = Math.abs(parseInt(widthStr));
        const leftAlign = widthStr.startsWith('-');
        if (leftAlign) {
          strVal = strVal.padEnd(width, ' ');
        } else {
          strVal = strVal.padStart(width, ' ');
        }
      }
      return strVal;
    });
  }

  return (
    <div className="space-y-4">
      {/* Interactive Terminal Card */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl font-mono text-xs flex flex-col h-[520px]">
        {/* Terminal Window Header */}
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            </div>
            <span className="text-slate-400 font-bold ml-2 text-xs flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-amber-400" />
              java -cp . StudentGradeManager (Interactive Console)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => printInitialBanner()}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] flex items-center gap-1 transition-colors"
              title="Restart Terminal Session"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Quick Action Command Shortcuts Toolbar */}
        <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-500 uppercase tracking-wider font-semibold text-[10px] shrink-0">
            Quick Actions:
          </span>
          <button
            onClick={() => handleCommandSubmit('1')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded border border-slate-700 flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3 h-3" />
            <span>[1] Add Student</span>
          </button>
          <button
            onClick={() => handleCommandSubmit('2')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded border border-slate-700 flex items-center gap-1 shrink-0"
          >
            <List className="w-3 h-3" />
            <span>[2] Display Summary</span>
          </button>
          <button
            onClick={() => handleCommandSubmit('3')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded border border-slate-700 flex items-center gap-1 shrink-0"
          >
            <Search className="w-3 h-3" />
            <span>[3] Search ID</span>
          </button>
          <button
            onClick={() => handleCommandSubmit('4')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded border border-slate-700 flex items-center gap-1 shrink-0"
          >
            <BarChart2 className="w-3 h-3" />
            <span>[4] Calculate Stats</span>
          </button>
          <button
            onClick={() => handleCommandSubmit('5')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-rose-300 rounded border border-slate-700 flex items-center gap-1 shrink-0"
          >
            <Trash2 className="w-3 h-3" />
            <span>[5] Remove Student</span>
          </button>
        </div>

        {/* Log Terminal Screen Output */}
        <div className="flex-1 p-4 overflow-y-auto space-y-1.5 whitespace-pre-wrap selection:bg-amber-500/30">
          {logs.map((log) => (
            <div
              key={log.id}
              className={`${
                log.type === 'INPUT'
                  ? 'text-amber-400 font-bold'
                  : log.type === 'SYSTEM'
                  ? 'text-slate-500 italic'
                  : log.type === 'SUCCESS'
                  ? 'text-emerald-400 font-semibold'
                  : log.type === 'ERROR'
                  ? 'text-rose-400 font-semibold'
                  : 'text-slate-200'
              }`}
            >
              {log.text}
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>

        {/* Console Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCommandSubmit(inputVal);
          }}
          className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
        >
          <span className="text-amber-400 font-bold select-none">&gt;</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={
              activeStep === 'AWAITING_SEARCH_ID'
                ? 'Type Student ID to search (e.g. 101) and press Enter...'
                : activeStep === 'AWAITING_REMOVE_ID'
                ? 'Type Student ID to remove and press Enter...'
                : 'Enter option 1-6 or command...'
            }
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none font-mono text-xs"
            autoFocus
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 transition-all"
          >
            <span>Run</span>
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Code Explanation Card */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-start gap-3">
        <Code className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-200 block mb-1">How this console simulation executes Java code:</strong>
          This terminal emulates Java standard input (`java.util.Scanner`) reading from `System.in`.
          It executes average, min, and max algorithms on the stored {storageType === 'ARRAY_LIST' ? 'ArrayList<Student>' : 'Student[] array'} collection and renders formatted console output using `System.out.printf()`.
        </div>
      </div>
    </div>
  );
};
