import React from "react";

const EditorialsComingSoon = () => {
  return (
    <div className="relative min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex items-center justify-center px-6 py-10 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Matrix rain */}
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute text-cyan-400 text-xs animate-[fall_6s_linear_infinite]"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              top: "-20px",
            }}
          >
            {Math.random() > 0.5 ? "1" : "0"}
          </div>
        ))}

        {/* Glow circles */}
        <div className="absolute w-72 h-72 bg-cyan-600/10 rounded-full blur-2xl top-10 left-10 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-purple-600/10 rounded-full blur-2xl bottom-10 right-10 animate-pulse delay-1000"></div>
      </div>

      {/* Main Card */}
      <div className="relative max-w-lg w-full bg-black/70 border border-cyan-500/30 rounded-2xl p-10 text-center shadow-[0_0_25px_rgba(6,182,212,0.4)] backdrop-blur-lg">
        {/* Cyberpunk corners */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400"></div>
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400"></div>
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400"></div>
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400"></div>

        {/* Text */}
        <h1
          className="text-5xl font-bold mb-4 text-white drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]"
          style={{ fontFamily: "Goldman, sans-serif" }}
        >
          COMING SOON
        </h1>
        <p className="text-gray-300 font-mono text-lg">
          The <span className="text-cyan-400">Editorials</span> page is under
          construction.
        </p>

        {/* Terminal-style cursor */}
        <div className="flex justify-center items-center mt-6">
          <span className="text-cyan-400 font-mono text-lg">$~</span>
          <div className="w-2 h-6 bg-cyan-400 ml-2 animate-blink"></div>
        </div>
      </div>
    </div>
  );
};

export default EditorialsComingSoon;
