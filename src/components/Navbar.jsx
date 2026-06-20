import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar-reveal sticky top-0 z-50 bg-[#FCFBF8]/90 backdrop-blur-md border-b border-[#E7E2D6] px-6 sm:px-10 py-4 flex items-center justify-between">
      <h1 className="font-display text-lg sm:text-xl font-semibold text-[#161B26] tracking-tight">
        <span className="text-[#B68D40]">AI</span> Resume Builder
      </h1>

      <div className="flex items-center gap-5 sm:gap-8">
        <Link to="/" className="nav-link text-sm sm:text-[15px] text-[#161B26]/80 hover:text-[#161B26] transition-colors">
          Home
        </Link>
         <Link
          to="/resumes"
          className="nav-link text-sm sm:text-[15px] text-[#161B26]/80 hover:text-[#161B26] transition-colors"
        >
          My Resumes
        </Link>

        <Link
          to="/resume"
          className="nav-cta inline-flex items-center rounded-md bg-[#161B26] text-white px-4 sm:px-5 py-2 text-sm font-medium tracking-wide transition-colors duration-300 hover:bg-[#0D1018]"
        >
          Create Resume
        </Link>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .font-display { font-family: 'Fraunces', serif; }
        nav { font-family: 'Inter', sans-serif; }

        .nav-link {
          position: relative;
          padding-bottom: 2px;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 0%;
          height: 1px;
          background: #B68D40;
          transition: width 0.3s ease;
        }
        .nav-link:hover::after { width: 100%; }

        @keyframes navSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .navbar-reveal { animation: navSlideDown 0.5s ease-out; }

        @media (prefers-reduced-motion: reduce) {
          .navbar-reveal { animation: none; }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;