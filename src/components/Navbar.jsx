import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#FCFBF8] border-t border-[#E7E2D6] mt-20">

      {/* Main footer */}
      <div className="max-w-6xl mx-auto px-6 sm:px-10 py-14 grid grid-cols-1 sm:grid-cols-3 gap-12">

        {/* Brand */}
        <div>
          <h2 className="font-display text-xl font-semibold text-[#161B26] tracking-tight">
            <span className="text-[#B68D40]">AI</span> Resume Builder
          </h2>
          <p className="mt-3 text-sm text-[#5B6172] leading-relaxed">
            Create professional, ATS-optimized resumes using AI — clear structure, the right keywords, no guesswork.
          </p>

          {/* Badges */}
          <div className="mt-5 flex flex-wrap gap-2">
            {[
              { icon: <path d="M20 6L9 17l-5-5" />, label: "ATS-Friendly" },
              { icon: <path d="M12 2l1.8 5.6L19 9l-5.2 1.4L12 16l-1.8-5.6L5 9l5.2-1.4L12 2z" />, label: "AI Powered" },
              { icon: <><path d="M12 3v12m0 0l-4-4m4 4l4-4" /><path d="M5 19h14" strokeLinecap="round" /></>, label: "Free PDF Export" },
            ].map((badge) => (
              <span
                key={badge.label}
                className="inline-flex items-center gap-1.5 bg-white border border-[#E7E2D6] text-[#5B6172] text-[11px] px-3 py-1.5 rounded-full"
                style={{ fontFamily: "IBM Plex Mono, monospace" }}
              >
                <svg className="w-3 h-3 text-[#B68D40]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  {badge.icon}
                </svg>
                {badge.label}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <p className="mb-4 text-[#9A7B33] text-xs tracking-[0.2em] uppercase" style={{ fontFamily: "IBM Plex Mono, monospace" }}>
            Quick Links
          </p>
          <ul className="space-y-3">
            {[
              { to: "/", label: "Home" },
              { to: "/resume", label: "Create Resume" },
              { to: "/resumes", label: "My Resumes" },
              { to: "/preview", label: "Preview Resume" },
            ].map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="group inline-flex items-center gap-2 text-sm text-[#5B6172] hover:text-[#B68D40] transition-colors"
                >
                  <svg
                    className="w-3 h-3 text-[#C8C3B5] group-hover:text-[#B68D40] transition-colors"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* How it works */}
        <div>
          <p className="mb-4 text-[#9A7B33] text-xs tracking-[0.2em] uppercase" style={{ fontFamily: "IBM Plex Mono, monospace" }}>
            How It Works
          </p>
          <ol className="space-y-3">
            {[
              "Fill in your personal details",
              "Add your skills and experience",
              "Generate an AI-powered summary",
              "Check your ATS score",
              "Download your resume as PDF",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[#5B6172]">
                <span
                  className="shrink-0 w-5 h-5 rounded-full border border-[#D6B36A]/50 bg-white flex items-center justify-center text-[#B68D40] text-[10px]"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#E7E2D6]" />

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto px-6 sm:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-[#9CA1AE]" style={{ fontFamily: "IBM Plex Mono, monospace" }}>
          © {new Date().getFullYear()} AI Resume Builder — All rights reserved
        </p>

        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1D9E75] animate-pulse" />
          <p className="text-xs text-[#9CA1AE]" style={{ fontFamily: "IBM Plex Mono, monospace" }}>
            Powered by OpenRouter AI
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        footer, footer p, footer li, footer span { font-family: 'Inter', sans-serif; }
      `}</style>
    </footer>
  );
}

export default Footer;