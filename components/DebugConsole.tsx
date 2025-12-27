import React, { useState, useEffect } from 'react';

interface LogMessage {
  id: number;
  timestamp: string;
  type: 'info' | 'warn' | 'error';
  text: string;
}

// Global logger helper
export const logger = {
  log: (text: string) => dispatchLog('info', text),
  warn: (text: string) => dispatchLog('warn', text),
  error: (text: string) => dispatchLog('error', text),
};

const listeners: ((msg: LogMessage) => void)[] = [];

function dispatchLog(type: 'info' | 'warn' | 'error', text: string) {
  const msg: LogMessage = {
    id: Date.now() + Math.random(),
    timestamp: new Date().toISOString().split('T')[1].slice(0, 8),
    type,
    text,
  };
  console.log(`[UI-LOG][${type}] ${text}`); // Also log to real console
  listeners.forEach(l => l(msg));
}

const DebugConsole: React.FC = () => {
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handler = (msg: LogMessage) => {
      setLogs(prev => [msg, ...prev].slice(0, 50)); // Keep last 50
    };
    listeners.push(handler);
    return () => {
      const idx = listeners.indexOf(handler);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }, []);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-[9999] bg-black/70 text-white text-xs px-2 py-1 rounded-md opacity-50 hover:opacity-100"
      >
        Show Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 w-full h-1/3 bg-black/90 text-green-400 font-mono text-xs z-[9999] opacity-95 flex flex-col pointer-events-auto">
      <div className="flex justify-between items-center bg-gray-800 px-2 py-1 border-b border-gray-700">
        <span className="font-bold text-white">Debug Console</span>
        <div className="flex gap-2">
            <button onClick={() => setLogs([])} className="text-gray-300 hover:text-white px-2">Clear</button>
            <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white px-2">Hide</button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-2 space-y-1">
        {logs.length === 0 && <span className="text-gray-500 opacity-50 italic">Waiting for logs...</span>}
        {logs.map(log => (
          <div key={log.id} className="break-all border-b border-gray-800 pb-0.5">
            <span className="text-gray-500 mr-2">[{log.timestamp}]</span>
            <span className={log.type === 'error' ? 'text-red-400 font-bold' : log.type === 'warn' ? 'text-yellow-400' : 'text-green-300'}>
              {log.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DebugConsole;
