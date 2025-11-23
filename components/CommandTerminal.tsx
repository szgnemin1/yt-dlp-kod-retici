import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface CommandTerminalProps {
  command: string;
}

export const CommandTerminal: React.FC<CommandTerminalProps> = ({ command }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full">
      <div className="bg-[#1e1e1e] rounded-xl border border-gray-800 shadow-2xl overflow-hidden">
        {/* Terminal Header */}
        <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="ml-3 text-xs text-gray-400 font-mono flex items-center gap-1">
              <Terminal className="w-3 h-3" /> bash — yt-dlp
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-gray-300 hover:bg-white/10 rounded transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Kopyalandı!' : 'Kopyala'}
            </button>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="p-6 font-mono text-sm relative group">
          <div className="text-green-400 break-all whitespace-pre-wrap leading-relaxed">
            <span className="text-blue-400 select-none">$ </span>
            {command}
          </div>
        </div>
      </div>
    </div>
  );
};