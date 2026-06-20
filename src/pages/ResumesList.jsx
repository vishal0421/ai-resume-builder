import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ResumesList() {
  const [resumes, setResumes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("resumes")) || [];
    setResumes(data);
  }, []);

  const handleDelete = (index) => {
    const updated = resumes.filter((_, i) => i !== index);
    setResumes(updated);
    localStorage.setItem("resumes", JSON.stringify(updated));
  };

  const handlePreview = (index) => {
    const all = JSON.parse(localStorage.getItem("resumes")) || [];
    // Preview ke liye selected resume ko last index pe le jao
    const selected = all[index];
    const rest = all.filter((_, i) => i !== index);
    const reordered = [...rest, selected];
    localStorage.setItem("resumes", JSON.stringify(reordered));
    navigate("/preview");
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#FCFBF8] py-14 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="font-mono text-xs tracking-[0.25em] text-[#B68D40] uppercase mb-3">
            AI Resume Builder
          </p>
          <h1
            className="text-3xl sm:text-4xl font-semibold text-[#161B26]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            My Resumes
          </h1>
          <p className="mt-2 text-sm text-[#9CA1AE]">
            {resumes.length} resume{resumes.length !== 1 ? "s" : ""} saved
          </p>
        </div>

        {/* Empty state */}
        {resumes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <svg
              className="w-12 h-12 text-[#C8C3B5]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
              <path d="M9 13h6M9 17h6" />
            </svg>
            <p
              className="text-xl font-semibold text-[#161B26]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              No resumes yet
            </p>
            <p className="text-sm text-[#9CA1AE]">
              Create your first resume to see it here
            </p>
            <button
              onClick={() => navigate("/resume")}
              className="mt-2 inline-flex items-center gap-2 bg-[#161B26] text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-[#0D1018] transition-colors"
            >
              Create Resume
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {resumes.map((r, i) => {
              const initials = r.name
                ? r.name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase()
                : "?";

              return (
                <div
                  key={i}
                  className="bg-white border border-[#E7E2D6] rounded-xl p-5 sm:p-6 shadow-[0_8px_24px_-12px_rgba(22,27,38,0.12)] hover:shadow-[0_12px_32px_-12px_rgba(22,27,38,0.18)] transition-shadow"
                >
                  <div className="flex items-start gap-4">

                    {/* Initials avatar */}
                    <div
                      className="w-11 h-11 rounded-full bg-[#161B26] text-white flex items-center justify-center text-sm flex-shrink-0"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {initials}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2
                          className="text-lg font-semibold text-[#161B26] truncate"
                          style={{ fontFamily: "Georgia, serif" }}
                        >
                          {r.name || "Unnamed"}
                        </h2>
                        {r.title && (
                          <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#B68D40] bg-[#FBF6EC] px-2 py-0.5 rounded-full border border-[#E8D9B5]">
                            {r.title}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-[#9CA1AE] mt-0.5">{r.email}</p>

                      {r.summary && (
                        <p className="text-sm text-[#5B6172] mt-2 leading-relaxed line-clamp-2">
                          {r.summary}
                        </p>
                      )}

                      {/* Skills preview */}
                      {r.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {r.skills.slice(0, 4).map((s, si) => (
                            <span
                              key={si}
                              className="text-[11px] font-mono px-2 py-0.5 rounded-full border border-[#D6B36A]/40 text-[#16213E] bg-[#FCFBF8]"
                            >
                              {s}
                            </span>
                          ))}
                          {r.skills.length > 4 && (
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full text-[#9CA1AE]">
                              +{r.skills.length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-4 border-t border-[#F0EBE0] flex items-center justify-between flex-wrap gap-3">
                    <p className="font-mono text-[11px] text-[#B0AAA0]">
                      {r.createdAt ? `Created ${formatDate(r.createdAt)}` : ""}
                    </p>

                    <div className="flex items-center gap-2">
                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(i)}
                        className="inline-flex items-center gap-1.5 text-sm text-[#A7ACB8] hover:text-[#B3261E] border border-transparent hover:border-[#B3261E]/30 px-3 py-1.5 rounded-md transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14H6L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4h6v2" />
                        </svg>
                        Delete
                      </button>

                      {/* Preview */}
                      <button
                        onClick={() => handlePreview(i)}
                        className="inline-flex items-center gap-1.5 bg-[#161B26] text-white text-sm px-4 py-1.5 rounded-md hover:bg-[#0D1018] transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        Preview
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        {resumes.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/resume")}
              className="inline-flex items-center gap-2 border border-[#161B26] text-[#161B26] px-6 py-2.5 rounded-md text-sm font-medium hover:bg-[#161B26] hover:text-white transition-colors"
            >
              + Create New Resume
            </button>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap');
        .font-mono { font-family: 'IBM Plex Mono', monospace; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default ResumesList;