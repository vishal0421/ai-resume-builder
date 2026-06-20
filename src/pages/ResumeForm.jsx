import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateSummary } from "../services/ai";

function ResumeForm() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [title, setTitle] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [portfolio, setPortfolio] = useState("");
    const [education, setEducation] = useState("");

    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState("");

    const [certifications, setCertifications] = useState([]);
    const [certInput, setCertInput] = useState("");

    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [duration, setDuration] = useState("");
    const [description, setDescription] = useState("");
    const [experiences, setExperiences] = useState([]);

    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);

    // ✅ Validation errors
    const [errors, setErrors] = useState({});
    const [expErrors, setExpErrors] = useState({});

    const setError = (field, msg) =>
        setErrors((prev) => ({ ...prev, [field]: msg }));

    const clearError = (field) =>
        setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });

    // Skills
    const addSkill = () => {
        if (!skillInput.trim()) return;
        setSkills([...skills, skillInput.trim()]);
        setSkillInput("");
    };
    const removeSkill = (i) => setSkills(skills.filter((_, idx) => idx !== i));

    // Certifications
    const addCertification = () => {
        if (!certInput.trim()) return;
        setCertifications([...certifications, certInput.trim()]);
        setCertInput("");
    };
    const removeCertification = (i) => setCertifications(certifications.filter((_, idx) => idx !== i));

    // Experience
    const addExperience = () => {
        const errs = {};
        if (!company.trim()) errs.company = "Company zaroori hai";
        if (!role.trim()) errs.role = "Role zaroori hai";
        if (!duration.trim()) errs.duration = "Duration zaroori hai";
        if (Object.keys(errs).length > 0) { setExpErrors(errs); return; }
        setExpErrors({});
        setExperiences([...experiences, { company, role, duration, description }]);
        setCompany(""); setRole(""); setDuration(""); setDescription("");
    };

    // AI Summary
    const handleGenerateSummary = async () => {
        if (skills.length === 0) {
            setError("skills", "Summary generate karne ke liye pehle skills add karo");
            return;
        }
        clearError("skills");
        setLoading(true);
        try {
            const experienceText = experiences
                .map(exp => `${exp.role} at ${exp.company} (${exp.duration})`)
                .join(", ");
            const result = await generateSummary(skills.join(", "), experienceText);
            setSummary(result);
        } catch (error) {
            console.log(error);
            setSummary("Failed to generate summary.");
        } finally {
            setLoading(false);
        }
    };

    // Submit
    const handleSubmit = () => {
        const errs = {};
        if (!name.trim()) errs.name = "Full name zaroori hai";
        if (!email.trim()) {
            errs.email = "Email zaroori hai";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errs.email = "Valid email daalo (e.g. name@gmail.com)";
        }
        if (skills.length === 0) errs.skills = "Kam se kam ek skill add karo";

        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            // Scroll to first error
            const firstErrField = Object.keys(errs)[0];
            document.getElementById(firstErrField)?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        const resumeData = {
            name, title, email, phone, location,
            linkedin, portfolio, education,
            skills, certifications, experiences,
            summary, createdAt: new Date().toISOString()
        };
        const old = JSON.parse(localStorage.getItem("resumes")) || [];
        old.push(resumeData);
        localStorage.setItem("resumes", JSON.stringify(old));
        navigate("/preview");
    };

    // Input class — red border on error
    const inputClass = (field) =>
        `w-full rounded-md border bg-white px-4 py-3 text-[15px] text-[#161B26] placeholder:text-[#A7ACB8] focus:outline-none focus:ring-2 transition-colors ${
            errors[field]
                ? "border-[#B3261E] focus:ring-[#B3261E]/20 focus:border-[#B3261E]"
                : "border-[#E2DDD0] focus:ring-[#B68D40]/30 focus:border-[#B68D40]"
        }`;

    const expInputClass = (field) =>
        `w-full rounded-md border bg-white px-4 py-3 text-[15px] text-[#161B26] placeholder:text-[#A7ACB8] focus:outline-none focus:ring-2 transition-colors ${
            expErrors[field]
                ? "border-[#B3261E] focus:ring-[#B3261E]/20 focus:border-[#B3261E]"
                : "border-[#E2DDD0] focus:ring-[#B68D40]/30 focus:border-[#B68D40]"
        }`;

    const baseInputClass =
        "w-full rounded-md border border-[#E2DDD0] bg-white px-4 py-3 text-[15px] text-[#161B26] placeholder:text-[#A7ACB8] focus:outline-none focus:ring-2 focus:ring-[#B68D40]/30 focus:border-[#B68D40] transition-colors";

    const sectionLabelClass = "font-mono text-xs tracking-[0.2em] uppercase text-[#9A7B33] mb-3";
    const cardClass = "bg-white border border-[#E7E2D6] rounded-lg p-6 sm:p-7 shadow-[0_10px_30px_-15px_rgba(22,27,38,0.12)]";

    // Error message component
    const ErrMsg = ({ field }) =>
        errors[field] ? (
            <p className="mt-1.5 text-xs text-[#B3261E] flex items-center gap-1">
                <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                </svg>
                {errors[field]}
            </p>
        ) : null;

    const ExpErrMsg = ({ field }) =>
        expErrors[field] ? (
            <p className="mt-1 text-xs text-[#B3261E] flex items-center gap-1">
                <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                </svg>
                {expErrors[field]}
            </p>
        ) : null;

    return (
        <div className="min-h-screen bg-[#FCFBF8] py-14 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">

                <div className="reveal d0 text-center mb-10">
                    <p className="font-mono text-xs tracking-[0.25em] text-[#B68D40] uppercase mb-3">
                        AI Resume Builder
                    </p>
                    <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#161B26]">
                        Tell us about yourself
                    </h1>
                </div>

                <div className="space-y-6">

                    {/* Personal Details */}
                    <div className={`${cardClass} reveal d1`}>
                        <p className={sectionLabelClass}>Personal Details</p>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Full Name *"
                                    value={name}
                                    onChange={(e) => { setName(e.target.value); clearError("name"); }}
                                    className={inputClass("name")}
                                />
                                <ErrMsg field="name" />
                            </div>
                            <input
                                type="text"
                                placeholder="Professional Title (e.g. Software Engineer)"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className={baseInputClass}
                            />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4 mt-4">
                            <div>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Email *"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
                                    className={inputClass("email")}
                                />
                                <ErrMsg field="email" />
                            </div>
                            <input
                                type="text"
                                placeholder="Phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className={baseInputClass}
                            />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4 mt-4">
                            <input
                                type="text"
                                placeholder="Location (e.g. Bangalore, India)"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className={baseInputClass}
                            />
                            <input
                                type="text"
                                placeholder="LinkedIn URL (optional)"
                                value={linkedin}
                                onChange={(e) => setLinkedin(e.target.value)}
                                className={baseInputClass}
                            />
                        </div>

                        <input
                            type="text"
                            placeholder="Portfolio / GitHub URL (optional)"
                            value={portfolio}
                            onChange={(e) => setPortfolio(e.target.value)}
                            className={`${baseInputClass} mt-4`}
                        />

                        <textarea
                            placeholder="Education (e.g. B.Tech CSE, IIT Delhi, 2020)"
                            value={education}
                            onChange={(e) => setEducation(e.target.value)}
                            rows="4"
                            className={`${baseInputClass} mt-4 resize-none`}
                        />
                    </div>

                    {/* Skills */}
                    <div className={`${cardClass} reveal d2`} id="skills">
                        <p className={sectionLabelClass}>Skills</p>

                        <div className="flex gap-3">
                            <input
                                type="text"
                                placeholder="Add Skill (Enter dabao ya Add click karo)"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && addSkill()}
                                className={baseInputClass}
                            />
                            <button
                                onClick={addSkill}
                                className="shrink-0 bg-[#161B26] text-white px-5 rounded-md text-sm font-medium hover:bg-[#0D1018] transition-colors"
                            >
                                Add
                            </button>
                        </div>

                        {errors.skills && (
                            <p className="mt-2 text-xs text-[#B3261E] flex items-center gap-1">
                                <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                                </svg>
                                {errors.skills}
                            </p>
                        )}

                        <div className="flex flex-wrap gap-2 mt-4">
                            {skills.map((skill, index) => (
                                <div key={index} className="bg-[#FCFBF8] border border-[#E7E2D6] px-3 py-1.5 rounded-full flex items-center gap-2 text-sm text-[#161B26]">
                                    <span>{skill}</span>
                                    <button onClick={() => removeSkill(index)} className="text-[#A7ACB8] hover:text-[#B3261E] transition-colors leading-none">✕</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Certifications */}
                    <div className={`${cardClass} reveal d3`}>
                        <p className={sectionLabelClass}>Certifications (optional)</p>

                        <div className="flex gap-3">
                            <input
                                type="text"
                                placeholder="Add Certification"
                                value={certInput}
                                onChange={(e) => setCertInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && addCertification()}
                                className={baseInputClass}
                            />
                            <button
                                onClick={addCertification}
                                className="shrink-0 bg-[#161B26] text-white px-5 rounded-md text-sm font-medium hover:bg-[#0D1018] transition-colors"
                            >
                                Add
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                            {certifications.map((cert, index) => (
                                <div key={index} className="bg-[#FCFBF8] border border-[#E7E2D6] px-3 py-1.5 rounded-full flex items-center gap-2 text-sm text-[#161B26]">
                                    <span>{cert}</span>
                                    <button onClick={() => removeCertification(index)} className="text-[#A7ACB8] hover:text-[#B3261E] transition-colors leading-none">✕</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Experience */}
                    <div className={`${cardClass} reveal d4`}>
                        <p className={sectionLabelClass}>Experience</p>

                        <div className="grid sm:grid-cols-3 gap-3">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Company"
                                    value={company}
                                    onChange={(e) => { setCompany(e.target.value); setExpErrors(p => ({ ...p, company: "" })); }}
                                    className={expInputClass("company")}
                                />
                                <ExpErrMsg field="company" />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Role"
                                    value={role}
                                    onChange={(e) => { setRole(e.target.value); setExpErrors(p => ({ ...p, role: "" })); }}
                                    className={expInputClass("role")}
                                />
                                <ExpErrMsg field="role" />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Duration (e.g. Jan 2022 – Mar 2024)"
                                    value={duration}
                                    onChange={(e) => { setDuration(e.target.value); setExpErrors(p => ({ ...p, duration: "" })); }}
                                    className={expInputClass("duration")}
                                />
                                <ExpErrMsg field="duration" />
                            </div>
                        </div>

                        <textarea
                            placeholder={`Key achievements & responsibilities\n• Increased sales by 30%\n• Led a team of 5 engineers`}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="4"
                            className={`${baseInputClass} mt-3 resize-none`}
                        />
                        <p className="font-mono text-[11px] text-[#9CA1AE] mt-1.5">
                            Tip: add a bullets on all lines 
                        </p>

                        <button
                            onClick={addExperience}
                            className="mt-4 border border-[#161B26] text-[#161B26] px-5 py-2.5 rounded-md text-sm font-medium hover:bg-[#161B26] hover:text-white transition-colors"
                        >
                            Add Experience
                        </button>

                        <div className="mt-5 space-y-3">
                            {experiences.map((exp, index) => (
                                <div key={index} className="border border-[#E7E2D6] rounded-md p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-[#161B26]" style={{ fontFamily: "Georgia, serif" }}>
                                                {exp.role}
                                            </h3>
                                            <p className="text-sm text-[#B68D40] mt-0.5">{exp.company}</p>
                                            <p className="font-mono text-xs text-[#9CA1AE] mt-1">{exp.duration}</p>
                                            {exp.description && (
                                                <ul className="mt-2 space-y-1">
                                                    {exp.description.split("\n").filter(l => l.trim()).map((line, li) => (
                                                        <li key={li} className="flex items-start gap-2 text-sm text-[#5B6172]">
                                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#B68D40] shrink-0" />
                                                            {line.replace(/^[•\-\*]\s*/, "")}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => setExperiences(experiences.filter((_, i) => i !== index))}
                                            className="text-[#A7ACB8] hover:text-[#B3261E] transition-colors mt-0.5"
                                        >
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M18 6L6 18M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI Summary */}
                    <div className={`${cardClass} reveal d5`}>
                        <p className={sectionLabelClass}>AI Summary</p>

                        <button
                            onClick={handleGenerateSummary}
                            disabled={loading}
                            className={`w-full inline-flex items-center justify-center gap-2 bg-[#161B26] text-white py-3.5 rounded-md text-[15px] font-medium hover:bg-[#0D1018] transition-colors ${loading ? "opacity-70 cursor-wait" : ""}`}
                        >
                            {loading ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                        <path className="opacity-90" d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                    </svg>
                                    Generating Summary...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 text-[#D6B36A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 2l1.8 5.6L19 9l-5.2 1.4L12 16l-1.8-5.6L5 9l5.2-1.4L12 2z" />
                                    </svg>
                                    Generate AI Summary
                                </>
                            )}
                        </button>

                        <textarea
                            placeholder="Generated Summary"
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            rows="8"
                            className={`${baseInputClass} mt-4 resize-none`}
                        />
                    </div>

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        className="w-full inline-flex items-center justify-center gap-2 bg-[#161B26] text-white py-4 rounded-md text-[15px] font-medium tracking-wide hover:bg-[#0D1018] transition-colors group"
                    >
                        Preview Resume
                        <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                    </button>

                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap');
                .font-display { font-family: 'Fraunces', serif; }
                .font-mono { font-family: 'IBM Plex Mono', monospace; }
                div, p, h1, h3, input, textarea, button { font-family: 'Inter', sans-serif; }
                @keyframes revealUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .reveal { opacity: 0; animation: revealUp 0.6s ease-out forwards; }
                .d0 { animation-delay: .02s; }
                .d1 { animation-delay: .1s; }
                .d2 { animation-delay: .16s; }
                .d3 { animation-delay: .22s; }
                .d4 { animation-delay: .28s; }
                .d5 { animation-delay: .34s; }
                @media (prefers-reduced-motion: reduce) {
                    .reveal { animation: none !important; opacity: 1 !important; }
                }
            `}</style>
        </div>
    );
}

export default ResumeForm;