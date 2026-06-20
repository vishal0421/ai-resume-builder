import { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";

function getATSScore(resume) {
  let score = 0;
  const suggestions = [];

  // Name (10)
  if (resume.name?.trim()) score += 10;
  else suggestions.push("Full name add karo");

  // Email (10)
  if (resume.email?.trim()) score += 10;
  else suggestions.push("Email address add karo");

  // Phone (5)
  if (resume.phone?.trim()) score += 5;
  else suggestions.push("Phone number add karo");

  // Location (5)
  if (resume.location?.trim()) score += 5;
  else suggestions.push("Location add karo");

  // Skills (20) — 4 points per skill, max 20
  const skillScore = Math.min((resume.skills?.length || 0) * 4, 20);
  score += skillScore;
  if ((resume.skills?.length || 0) < 5)
    suggestions.push(`Add more skills(currently ${resume.skills?.length || 0} , minimum 5 require)`);

  // Experience (20)
  if ((resume.experiences?.length || 0) > 0) {
    score += 10;
    const hasDesc = resume.experiences.some(e => e.description?.trim());
    if (hasDesc) score += 10;
    else suggestions.push("Experience mein description/achievements add karo");
  } else {
    suggestions.push("Kam se kam ek experience add karo");
  }

  // Summary (15)
  if (resume.summary?.trim()) {
    score += 15;
  } else {
    suggestions.push("AI Summary generate karo — ATS ke liye bahut zaroori hai");
  }

  // Education (10)
  if (resume.education?.trim()) score += 10;
  else suggestions.push("Education details add karo");

  // LinkedIn (5)
  if (resume.linkedin?.trim()) score += 5;
  else suggestions.push("LinkedIn URL add karo (optional but helpful)");

  return { score: Math.min(score, 100), suggestions };
}

function ScoreMeter({ score }) {
  const color =
    score >= 80 ? "#1D9E75" :
    score >= 60 ? "#B68D40" :
    "#B3261E";

  const label =
    score >= 80 ? "Excellent" :
    score >= 60 ? "Good" :
    score >= 40 ? "Fair" : "Needs Work";

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#EDE9DD" strokeWidth="10" />
          <circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-[#161B26]" style={{ fontFamily: "Georgia, serif" }}>
            {score}
          </span>
          <span className="text-[10px] font-mono text-[#9CA1AE] tracking-wide">/100</span>
        </div>
      </div>
      <span
        className="mt-2 text-sm font-medium px-3 py-1 rounded-full"
        style={{
          background: color + "20",
          color: color,
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: "11px",
          letterSpacing: "0.1em"
        }}
      >
        {label}
      </span>
    </div>
  );
}

function Preview() {
  const [resume, setResume] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [showATS, setShowATS] = useState(false);

  useEffect(() => {
    const allResumes = JSON.parse(localStorage.getItem("resumes")) || [];
    const latest = allResumes[allResumes.length - 1] || null;
    setResume(latest);
    // Score animate karne ke liye thodi delay
    setTimeout(() => setShowATS(true), 300);
  }, []);

  const downloadPDF = async () => {
    const element = document.getElementById("resume");
    if (!element) return;
    setDownloading(true);
    try {
      const fileName = resume?.name
        ? `${resume.name.trim().replace(/\s+/g, "_")}_resume.pdf`
        : "resume.pdf";
      const options = {
        margin: 0,
        filename: fileName,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, allowTaint: true, backgroundColor: "#ffffff" },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] }
      };
      await html2pdf().set(options).from(element).save();
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Could not generate PDF: " + (err?.message || "Unknown error."));
    } finally {
      setDownloading(false);
    }
  };

  if (!resume) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#FCFBF8] gap-4">
        <svg className="w-10 h-10 text-[#A7ACB8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" /><path d="M9 13h6M9 17h6" />
        </svg>
        <p className="text-xl font-semibold text-[#161B26]" style={{ fontFamily: "Georgia, serif" }}>
          No resume found
        </p>
      </div>
    );
  }

  const initials = resume.name
    ? resume.name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "";

  const displayTitle = resume.title ||
    (resume.experiences?.length > 0 ? resume.experiences[resume.experiences.length - 1].role : "");

  const { score, suggestions } = getATSScore(resume);

  return (
    <div className="min-h-screen bg-[#FCFBF8] py-10 px-4 sm:px-6">

      {/* TOP BAR */}
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-6">
        <div>
          <p className="font-mono text-xs tracking-[0.25em] text-[#B68D40] uppercase mb-1">
            AI Resume Builder
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#161B26]" style={{ fontFamily: "Georgia, serif" }}>
            Resume Preview
          </h1>
        </div>
        <button
          onClick={downloadPDF}
          disabled={downloading}
          className={`inline-flex items-center gap-2 bg-[#161B26] text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-[#0D1018] transition-colors shadow-sm ${downloading ? "opacity-70 cursor-wait" : ""}`}
        >
          {downloading ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-90" d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3v12m0 0l-4-4m4 4l4-4" />
                <path d="M5 19h14" strokeLinecap="round" />
              </svg>
              Download PDF
            </>
          )}
        </button>
      </div>

      {/* ATS SCORE CARD */}
      {showATS && (
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-white border border-[#E7E2D6] rounded-xl p-6 shadow-[0_8px_24px_-12px_rgba(22,27,38,0.12)]">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

              {/* Score circle */}
              <div className="shrink-0">
                <ScoreMeter score={score} />
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px bg-[#EDE9DD] self-stretch" />

              {/* Suggestions */}
              <div className="flex-1 w-full">
                <div className="flex items-center gap-2 mb-3">
                  <p className="font-mono text-xs tracking-[0.2em] uppercase text-[#9A7B33]">
                    ATS Score Analysis
                  </p>
                  <span className="font-mono text-[10px] text-[#9CA1AE]">
                    — recruiter software compatibility
                  </span>
                </div>

                {suggestions.length === 0 ? (
                  <div className="flex items-center gap-2 text-[#1D9E75]">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <p className="text-sm font-medium">Resume ATS ke liye fully optimized hai!</p>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {suggestions.map((s, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-[#4B5160]">
                        <span className="mt-1 w-4 h-4 rounded-full bg-[#FBF6EC] border border-[#E8D9B5] flex items-center justify-center shrink-0">
                          <svg className="w-2.5 h-2.5 text-[#B68D40]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </span>
                        {s}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Score bar breakdown */}
                <div className="mt-4 pt-4 border-t border-[#F0EBE0]">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-[#EDE9DD] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${score}%`,
                          background: score >= 80 ? "#1D9E75" : score >= 60 ? "#B68D40" : "#B3261E"
                        }}
                      />
                    </div>
                    <span className="font-mono text-xs text-[#9CA1AE] shrink-0">{score}/100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESUME DOCUMENT */}
      <div
        id="resume"
        className="max-w-4xl mx-auto bg-white shadow-[0_25px_60px_-20px_rgba(22,27,38,0.2)] rounded-xl overflow-hidden border border-[#E7E2D6]"
        style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}
      >
        {/* HEADER */}
        <div className="relative px-8 sm:px-14 pt-10 sm:pt-12 pb-8 border-b-2 border-[#161B26]">
          {initials && (
            <div
              className="absolute top-10 right-8 sm:right-14 w-14 h-14 rounded-full border-2 border-[#161B26] flex items-center justify-center text-lg text-[#161B26] bg-[#FCFBF8]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {initials}
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl font-semibold text-[#161B26] tracking-tight pr-20" style={{ fontFamily: "Georgia, serif" }}>
            {resume.name || "No Name"}
          </h1>

          {displayTitle && (
            <p className="mt-1.5 font-mono text-xs tracking-[0.2em] uppercase text-[#B68D40]">
              {displayTitle}
            </p>
          )}

          <div className="mt-5 h-px w-16 bg-[#B68D40]" />

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#5B6172]">
            {resume.email && (
              <span className="inline-flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#B68D40]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16v16H4z" /><path d="m4 7 8 6 8-6" />
                </svg>
                {resume.email}
              </span>
            )}
            {resume.phone && (
              <span className="inline-flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#B68D40]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.36 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                {resume.phone}
              </span>
            )}
            {resume.location && (
              <span className="inline-flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#B68D40]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {resume.location}
              </span>
            )}
            {resume.linkedin && (
              <span className="inline-flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#B68D40]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                {resume.linkedin}
              </span>
            )}
            {resume.portfolio && (
              <span className="inline-flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#B68D40]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z" />
                </svg>
                {resume.portfolio}
              </span>
            )}
          </div>
        </div>

        {/* BODY */}
        <div className="grid sm:grid-cols-[1fr_2fr] gap-10 px-8 sm:px-14 py-10">

          {/* LEFT COLUMN */}
          <div className="sm:border-r sm:border-[#E7E2D6] sm:pr-8 space-y-8">
            <div>
              <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-[#9A7B33] mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {resume.skills?.length > 0 ? (
                  resume.skills.map((skill, i) => (
                    <span key={i} className="bg-[#FCFBF8] border text-[#161B26] px-2.5 py-1 rounded-full text-xs" style={{ borderColor: "rgba(182,141,64,0.4)" }}>
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-[#9CA1AE] text-xs">No skills added</p>
                )}
              </div>
            </div>

            {resume.certifications?.length > 0 && (
              <div>
                <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-[#9A7B33] mb-3">Certifications</h2>
                <ul className="space-y-1.5">
                  {resume.certifications.map((cert, i) => (
                    <li key={i} className="text-sm text-[#4B5160] flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-[#B68D40] shrink-0" />
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-[#9A7B33] mb-3">Education</h2>
              <p className="text-sm text-[#4B5160] leading-relaxed whitespace-pre-line">
                {resume.education || "No education added"}
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-8">
            <div>
              <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-[#9A7B33] mb-3">Profile</h2>
              <p className="text-[15px] text-[#4B5160] leading-relaxed">
                {resume.summary || "No summary generated"}
              </p>
            </div>

            {/* EXPERIENCE */}
            <div>
              <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-[#9A7B33] mb-4">Experience</h2>
              {resume.experiences?.length > 0 ? (
                <div className="relative pl-6 border-l border-[#E7E2D6] space-y-7">
                  {resume.experiences.map((exp, i) => (
                    <div key={i} className="relative">
                      <span className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#B68D40] border-4 border-white" />
                      <div className="flex flex-wrap justify-between items-baseline gap-x-3">
                        <p className="font-semibold text-[#161B26]" style={{ fontFamily: "Georgia, serif" }}>
                          {exp.role}
                        </p>
                        <p className="font-mono text-xs text-[#9CA1AE]">{exp.duration}</p>
                      </div>
                      <p className="text-sm text-[#B68D40] mt-0.5">{exp.company}</p>
                      {exp.description && (
                        <ul className="mt-2.5 space-y-1.5">
                          {exp.description.split("\n").filter(l => l.trim()).map((line, li) => (
                            <li key={li} className="flex items-start gap-2 text-[14px] text-[#4B5160] leading-relaxed">
                              <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#B68D40] shrink-0" />
                              {line.replace(/^[•\-\*]\s*/, "")}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#9CA1AE] text-sm">No experience added</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .font-mono { font-family: 'IBM Plex Mono', 'SFMono-Regular', Consolas, monospace; }
      `}</style>
    </div>
  );
}

export default Preview;