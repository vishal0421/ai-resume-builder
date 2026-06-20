import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="relative min-h-screen bg-[#FCFBF8] overflow-hidden">
      {/* subtle paper grain texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(#16213E 0.6px, transparent 0.6px)",
          backgroundSize: "18px 18px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 py-20 lg:py-28 flex flex-col lg:flex-row items-center gap-16 lg:gap-10">
        {/* Left: copy */}
        <div className="flex-1 text-center lg:text-left max-w-xl">
          <p className="reveal d0 font-mono text-xs tracking-[0.25em] text-[#9A7B33] uppercase">
            — AI Resume Builder
          </p>

          <h1 className="reveal d1 mt-5 font-display text-[2.6rem] sm:text-5xl lg:text-[3.4rem] leading-[1.08] font-semibold text-[#161B26]">
            Build a resume that
            <br className="hidden sm:block" /> gets you{" "}
            <span className="text-[#B68D40]">hired</span>.
          </h1>

          <p className="reveal d2 mt-6 text-base sm:text-lg text-[#5B6172] leading-relaxed">
            Create a professional, ATS-ready resume using AI — clear
            structure, the right keywords, no guesswork.
          </p>

          <div className="reveal d3 mt-9 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <Link
              to="/resume"
              className="cta-btn inline-flex items-center gap-2 rounded-md bg-[#161B26] text-white px-7 py-3.5 text-[15px] font-medium tracking-wide transition-colors duration-300 hover:bg-[#0D1018]"
            >
              Create Resume
              <svg
                className="cta-arrow w-4 h-4 transition-transform duration-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>

          <p className="reveal d4 mt-6 font-mono text-xs text-[#9CA1AE] tracking-wide">
            No design skills needed · ATS-friendly format
          </p>
        </div>

        {/* Right: signature element — resume document mockup */}
        <div className="reveal d2 flex-1 flex justify-center lg:justify-end w-full">
          <div className="doc-float relative w-[280px] sm:w-[320px]">
            {/* ATS badge */}
            <div className="absolute -top-4 -right-4 z-20 rotate-[-6deg] bg-[#161B26] text-white rounded-md px-3 py-2 shadow-md flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5 text-[#D6B36A]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span className="font-mono text-[11px] tracking-wide">
                ATS-Ready
              </span>
            </div>

            {/* card */}
            <div className="relative z-10 bg-white border border-[#E7E2D6] rounded-lg shadow-[0_20px_45px_-15px_rgba(22,27,38,0.18)] p-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#16213E] flex items-center justify-center text-white text-xs font-mono">
                  JD
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="h-2.5 w-24 rounded-full bg-[#161B26]/80" />
                  <div className="h-2 w-32 rounded-full bg-[#B68D40]/40" />
                </div>
              </div>

              <div className="mt-5 h-px w-full bg-[#EDE9DD]" />

              <p className="mt-5 font-mono text-[10px] tracking-[0.2em] text-[#9CA1AE] uppercase">
                Experience
              </p>
              <div className="mt-3 space-y-2">
                <div className="h-2 w-full rounded-full bg-[#EFEDE4]" />
                <div className="h-2 w-5/6 rounded-full bg-[#EFEDE4]" />
                <div className="h-2 w-2/3 rounded-full bg-[#EFEDE4]" />
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {["Strategy", "Leadership", "Analytics"].map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono px-2.5 py-1 rounded-full border border-[#D6B36A]/50 text-[#16213E]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .font-display { font-family: 'Fraunces', serif; }
        .font-mono { font-family: 'IBM Plex Mono', monospace; }
        div, p, h1 { font-family: 'Inter', sans-serif; }
        .font-display, .font-mono { font-family: inherit; }
        h1.font-display { font-family: 'Fraunces', serif; }
        p.font-mono, span.font-mono { font-family: 'IBM Plex Mono', monospace; }

        @keyframes revealUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .reveal { opacity: 0; animation: revealUp 0.6s ease-out forwards; }
        .d0 { animation-delay: .02s; }
        .d1 { animation-delay: .1s; }
        .d2 { animation-delay: .2s; }
        .d3 { animation-delay: .3s; }
        .d4 { animation-delay: .4s; }

        @keyframes docFloat {
          0%, 100% { transform: translateY(0) rotate(1.5deg); }
          50% { transform: translateY(-8px) rotate(1.5deg); }
        }
        .doc-float { animation: docFloat 6s ease-in-out infinite; }

        .cta-btn:hover .cta-arrow { transform: translateX(3px); }

        @media (prefers-reduced-motion: reduce) {
          .reveal, .doc-float { animation: none !important; opacity: 1 !important; }
        }
      `}</style>
    </div>
  );
}

export default Home;