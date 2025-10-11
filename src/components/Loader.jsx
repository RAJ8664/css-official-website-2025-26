import React from 'react';

const TerminalLoader = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-cyan-400 font-mono text-sm">Loading...</span>
    </div>
  );
};

export default TerminalLoader;