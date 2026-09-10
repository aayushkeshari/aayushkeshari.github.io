"use client";

import {
  BriefcaseBusiness,
  ChevronRight,
  CircleHelp,
  Code2,
  Command,
  Download,
  ExternalLink,
  FileText,
  FolderOpen,
  GitFork as Github,
  GraduationCap,
  Link2 as Linkedin,
  Mail,
  Monitor,
  Printer,
  Trash2,
  UserRound,
  Volume2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type WindowId = "welcome" | "about" | "experience" | "projects" | "skills" | "resume" | "contact";

type WindowState = {
  open: boolean;
  x: number;
  y: number;
  z: number;
};

const windowMeta: Record<WindowId, { title: string; width: number; className?: string }> = {
  welcome: { title: "Welcome to Aayush’s Macintosh", width: 700, className: "welcome-window" },
  about: { title: "About Aayush", width: 590 },
  experience: { title: "Work Experience", width: 680 },
  projects: { title: "Projects", width: 720 },
  skills: { title: "Skills & Tools", width: 620 },
  resume: { title: "Aayush Keshari — Résumé", width: 680 },
  contact: { title: "Contact Aayush", width: 520 },
};

const initialWindows: Record<WindowId, WindowState> = {
  welcome: { open: true, x: 300, y: 120, z: 2 },
  about: { open: false, x: 150, y: 95, z: 1 },
  experience: { open: false, x: 220, y: 80, z: 1 },
  projects: { open: false, x: 260, y: 70, z: 1 },
  skills: { open: false, x: 360, y: 110, z: 1 },
  resume: { open: false, x: 190, y: 55, z: 1 },
  contact: { open: false, x: 390, y: 150, z: 1 },
};

const projects = [
  {
    name: "AquaCoach",
    stack: "Swift · SwiftUI · HealthKit · Combine",
    description:
      "A native iOS hydration coach with personalized goals, one-touch beverage logging, reminders, streaks, analytics, and Apple Health integration.",
    href: "https://github.com/aayushkeshari/AquaCoach",
  },
  {
    name: "Project Stream",
    stack: "Python · Streamlit · SEC filings · NLP",
    description:
      "An equity-research workspace that compares company filings, surfaces material language changes, and turns retrieval signals into focused analyst questions.",
    href: "https://github.com/aayushkeshari/project-stream",
  },
  {
    name: "AR Knick-Knack",
    stack: "Augmented Reality · Mobile Development",
    description:
      "An augmented-reality experience that lets users place, inspect, and interact with virtual objects inside their physical environment.",
    href: "https://github.com/aayushkeshari/AR-Knick-Knack",
  },
  {
    name: "TCP/IP Client–Server System",
    stack: "Java · Python · Sockets · Networking",
    description:
      "A cross-language client–server system with a structured application protocol, message validation, connection lifecycle management, and failure handling.",
    href: "https://github.com/aayushkeshari/client-server-networking-system",
  },
];

const resumeHref = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/Aayush_Keshari_Resume.pdf`;
const resumePreviewHref = `${resumeHref}#view=FitH&toolbar=0&navpanes=0`;
const profileHref = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/Aayush_Keshari_Profile.jpg`;

const experiences = [
  {
    company: "The AES Corporation",
    role: "Data Science Intern",
    dates: "Aug 2024 – Jan 2025",
    details:
      "Built Python and SQL pipelines across 1M+ operational records, reducing reporting latency by 30%. Developed PyTorch asset-failure models that improved accuracy by 17% over the baseline.",
  },
  {
    company: "Great American Insurance Group",
    role: "Software Development Intern",
    dates: "May 2024 – Jul 2024",
    details:
      "Supported an ecosystem of 900+ applications, improved diagnostics and maintainability, and identified 12,880 high-risk dependencies for prioritized remediation.",
  },
  {
    company: "UC Cryptocurrency Club",
    role: "Software Developer",
    dates: "Sep 2023 – Present",
    details:
      "Develop backend features for the organization’s research blog, attendance tracker, governance dashboard, and events platform.",
  },
  {
    company: "University of Cincinnati",
    role: "Engineering Teaching Assistant",
    dates: "2023 – Present",
    details:
      "Lead weekly technical sessions for 72 first-year students covering Python, LabVIEW, debugging, and engineering problem-solving.",
  },
];

function MacButton({ children, onClick, className = "" }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button type="button" className={`mac-button ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}

function FinderRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="finder-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function DesktopIcon({ label, icon, onOpen }: { label: string; icon: React.ReactNode; onOpen: () => void }) {
  return (
    <button
      type="button"
      className="desktop-icon"
      onDoubleClick={onOpen}
      onClick={(event) => {
        if (window.matchMedia("(max-width: 760px)").matches || event.detail === 1) onOpen();
      }}
      aria-label={`Open ${label}`}
    >
      <span className="desktop-icon-picture">{icon}</span>
      <span className="desktop-icon-label">{label}</span>
    </button>
  );
}

function MacWindow({
  id,
  state,
  active,
  children,
  onClose,
  onFocus,
  onMove,
}: {
  id: WindowId;
  state: WindowState;
  active: boolean;
  children: React.ReactNode;
  onClose: () => void;
  onFocus: () => void;
  onMove: (x: number, y: number) => void;
}) {
  const meta = windowMeta[id];

  const beginDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button")) return;
    onFocus();
    const startX = event.clientX;
    const startY = event.clientY;
    const originX = state.x;
    const originY = state.y;

    const move = (moveEvent: PointerEvent) => {
      const maxX = Math.max(8, window.innerWidth - Math.min(meta.width, window.innerWidth - 16) - 8);
      const maxY = Math.max(40, window.innerHeight - 180);
      onMove(
        Math.max(8, Math.min(maxX, originX + moveEvent.clientX - startX)),
        Math.max(36, Math.min(maxY, originY + moveEvent.clientY - startY)),
      );
    };

    const end = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      document.documentElement.classList.remove("dragging-window");
    };

    document.documentElement.classList.add("dragging-window");
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end, { once: true });
  };

  return (
    <section
      className={`mac-window ${active ? "is-active" : ""} ${meta.className ?? ""}`}
      style={{ left: state.x, top: state.y, width: `min(${meta.width}px, calc(100vw - 24px))`, zIndex: state.z }}
      onPointerDown={onFocus}
      aria-label={meta.title}
    >
      <div className="window-titlebar" onPointerDown={beginDrag}>
        <button type="button" className="window-close" onClick={onClose} aria-label={`Close ${meta.title}`}>
          <X size={12} strokeWidth={3} />
        </button>
        <span className="window-title">{meta.title}</span>
        <span className="window-zoom" aria-hidden="true" />
      </div>
      <div className="window-content">{children}</div>
      <div className="window-resize" aria-hidden="true" />
    </section>
  );
}

export default function Home() {
  const [windows, setWindows] = useState(initialWindows);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [assistantVisible, setAssistantVisible] = useState(true);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const initialTick = window.setTimeout(() => setNow(new Date()), 0);
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => {
      window.clearTimeout(initialTick);
      window.clearInterval(timer);
    };
  }, []);

  const topZ = useMemo(() => Math.max(...Object.values(windows).map((item) => item.z)), [windows]);
  const activeWindow = useMemo(
    () => (Object.entries(windows) as [WindowId, WindowState][]).filter(([, state]) => state.open).sort((a, b) => b[1].z - a[1].z)[0]?.[0],
    [windows],
  );

  const focusWindow = (id: WindowId) => {
    setWindows((current) => ({ ...current, [id]: { ...current[id], z: Math.max(...Object.values(current).map((item) => item.z)) + 1 } }));
    setActiveMenu(null);
  };

  const openWindow = (id: WindowId) => {
    setWindows((current) => ({
      ...current,
      [id]: { ...current[id], open: true, z: Math.max(...Object.values(current).map((item) => item.z)) + 1 },
    }));
    setActiveMenu(null);
  };

  const closeWindow = (id: WindowId) => {
    setWindows((current) => ({ ...current, [id]: { ...current[id], open: false } }));
  };

  const moveWindow = (id: WindowId, x: number, y: number) => {
    setWindows((current) => ({ ...current, [id]: { ...current[id], x, y } }));
  };

  const menuWindows: { id: WindowId; label: string }[] = [
    { id: "about", label: "About Aayush" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "resume", label: "Résumé" },
    { id: "contact", label: "Contact" },
  ];

  const content: Record<WindowId, React.ReactNode> = {
    welcome: (
      <div className="welcome-panel">
        <div className="welcome-kicker">WELCOME TO MY HOMEPAGE</div>
        <div className="welcome-identity">
<<<<<<< Updated upstream
        <div className="ak-mark">
            <img
              src="/Aayush_Keshari_Profile.jpg"
              alt="Aayush Keshari"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 30%",
                borderRadius: "inherit",
              }}
            />
=======
          <div className="ak-mark">
            <img src={profileHref} alt="Aayush Keshari" />
>>>>>>> Stashed changes
          </div>
          <div>
            <h1>Aayush Keshari</h1>
            <p className="welcome-role">Software Engineer · Data & iOS Systems</p>
            <p className="welcome-location">Computer Science @ University of Cincinnati</p>
          </div>
        </div>
        <div className="availability">OPEN TO 2027 NEW-GRAD SOFTWARE ENGINEERING ROLES</div>
        <div className="rainbow-rule" aria-hidden="true" />
        <p className="welcome-copy">
          I build reliable software across data platforms, developer tooling, and native iOS. My work has processed over one million operational records, improved ML model accuracy, and made large application portfolios easier to secure and maintain.
        </p>
        <div className="welcome-actions">
          <MacButton onClick={() => openWindow("projects")}>View my work</MacButton>
          <MacButton onClick={() => openWindow("experience")}>Experience</MacButton>
          <MacButton onClick={() => openWindow("resume")}>Open résumé</MacButton>
          <MacButton onClick={() => openWindow("contact")}>Contact me</MacButton>
        </div>
        <div className="quick-links">
          <a href="https://github.com/aayushkeshari" target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a>
          <a href="https://www.linkedin.com/in/aayushkeshari" target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn</a>
        </div>
      </div>
    ),
    about: (
      <div className="about-layout">
        <div className="computer-card" aria-hidden="true">
          <div className="computer-screen"><span>AK</span></div>
          <div className="computer-base" />
        </div>
        <div>
          <h2>About this developer</h2>
          <p>
            I’m a Computer Science student at the University of Cincinnati, graduating in April 2027. I enjoy the point where software, data, and real-world systems meet—especially when the result is measurable and genuinely useful.
          </p>
          <p>
            Outside of code, I’m an automobile enthusiast, an avid Real Madrid supporter, and a traveler who has explored 15 U.S. states and nine countries.
          </p>
          <div className="info-box">
            <FinderRow label="Location" value="Cincinnati, Ohio" />
            <FinderRow label="Degree" value="B.S. Computer Science" />
            <FinderRow label="Graduation" value="April 2027" />
            <FinderRow label="GPA" value="3.7 / 4.0" />
          </div>
        </div>
      </div>
    ),
    experience: (
      <div className="document-view">
        <div className="window-toolbar"><span>4 items</span><span>Experience Folder</span></div>
        <div className="experience-list">
          {experiences.map((experience) => (
            <article className="experience-item" key={experience.company + experience.role}>
              <div className="experience-icon"><BriefcaseBusiness size={22} /></div>
              <div>
                <div className="item-heading">
                  <h3>{experience.company}</h3>
                  <span>{experience.dates}</span>
                </div>
                <p className="role-line">{experience.role}</p>
                <p>{experience.details}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    ),
    projects: (
      <div className="document-view">
        <div className="window-toolbar"><span>{projects.length} items</span><span>Portfolio HD</span></div>
        <div className="project-grid">
          {projects.map((project, index) => (
            <article className="project-card" key={project.name}>
              <div className={`project-icon project-icon-${index + 1}`}><FolderOpen size={27} /></div>
              <div>
                <div className="item-heading">
                  <h3>{project.name}</h3>
                  {project.href ? <a href={project.href} target="_blank" rel="noreferrer" aria-label={`Open ${project.name} on GitHub`}><ExternalLink size={16} /></a> : null}
                </div>
                <p className="project-stack">{project.stack}</p>
                <p>{project.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    ),
    skills: (
      <div className="skills-layout">
        <div className="skills-intro">
          <Code2 size={34} />
          <div><h2>Skills & Tools</h2><p>Technologies I’ve used to build, test, and ship software.</p></div>
        </div>
        <div className="skill-groups">
          <section><h3>Languages</h3><div className="skill-chips">{["Python", "Java", "SQL", "Swift", "C++", "C#", "JavaScript", "MATLAB"].map((skill) => <span key={skill}>{skill}</span>)}</div></section>
          <section><h3>Frameworks & Data</h3><div className="skill-chips">{["SwiftUI", "HealthKit", "PyTorch", "Node.js", ".NET", "Snowflake", "Azure", "Tableau"].map((skill) => <span key={skill}>{skill}</span>)}</div></section>
          <section><h3>Systems</h3><div className="skill-chips">{["Git", "TCP/IP", "Unix", "RHEL", "Windows Server", "REST APIs", "CI/CD"].map((skill) => <span key={skill}>{skill}</span>)}</div></section>
        </div>
      </div>
    ),
    resume: (
      <div className="resume-view">
        <div className="resume-controls">
<<<<<<< Updated upstream
  <span>Résumé preview</span>

  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "flex-end",
      gap: 8,
    }}
  >
    <a
      className="mac-button"
      href="/Aayush_Keshari_Resume.pdf"
      target="_blank"
      rel="noreferrer"
    >
      <ExternalLink size={15} /> View PDF
    </a>

    <a
      className="mac-button"
      href="/Aayush_Keshari_Resume.pdf"
      download="Aayush_Keshari_Resume.pdf"
    >
      <FileText size={15} /> Download PDF
    </a>

    <MacButton onClick={() => window.print()}>
      <Printer size={15} /> Print preview
    </MacButton>
  </div>
</div>
        <div className="resume-paper">
          <header><h2>Aayush Keshari</h2><p>Software Engineer · Cincinnati, OH</p></header>
          <section><h3>Education</h3><p><strong>University of Cincinnati</strong> — B.S. Computer Science, April 2027 · GPA: 3.7</p></section>
          <section><h3>Experience</h3>{experiences.slice(0, 3).map((item) => <p key={item.company}><strong>{item.company}</strong> · {item.role}<br /><span>{item.details}</span></p>)}</section>
          <section><h3>Selected Projects</h3><p><strong>AquaCoach</strong> — Native SwiftUI hydration coach with HealthKit integration.</p><p><strong>Project Stream</strong> — SEC filing analysis and research-lead workspace.</p></section>
          <section><h3>Technical Skills</h3><p>Python, SQL, Java, Swift, C++, C#, JavaScript · PyTorch, SwiftUI, Snowflake, Azure, Git</p></section>
=======
          <span>Résumé preview</span>
          <div className="resume-actions">
            <a className="mac-button" href={resumeHref} target="_blank" rel="noreferrer"><ExternalLink size={15} /> View PDF</a>
            <a className="mac-button" href={resumeHref} download="Aayush_Keshari_Resume.pdf"><Download size={15} /> Download PDF</a>
            <MacButton onClick={() => window.print()}><Printer size={15} /> Print preview</MacButton>
          </div>
        </div>
        <div className="resume-document">
          <iframe
            className="resume-pdf"
            src={resumePreviewHref}
            title="Aayush Keshari résumé PDF preview"
          />
          <p className="resume-fallback">
            If the preview does not appear, <a href={resumeHref} target="_blank" rel="noreferrer">open the résumé PDF</a>.
          </p>
>>>>>>> Stashed changes
        </div>
      </div>
    ),
    contact: (
      <div className="contact-layout">
        <div className="contact-stamp"><Mail size={38} /></div>
        <div>
          <h2>Let’s build something useful.</h2>
          <p>I’m interested in full-time software engineering opportunities beginning after my April 2027 graduation.</p>
          <div className="contact-buttons">
            <a className="mac-button" href="https://www.linkedin.com/in/aayushkeshari" target="_blank" rel="noreferrer"><Linkedin size={16} /> Connect on LinkedIn</a>
            <a className="mac-button" href="https://github.com/aayushkeshari" target="_blank" rel="noreferrer"><Github size={16} /> View GitHub</a>
          </div>
          <p className="contact-note">The fastest way to reach me is through LinkedIn.</p>
        </div>
      </div>
    ),
  };

  return (
    <main className="desktop" onClick={() => activeMenu && setActiveMenu(null)}>
      <header className="menu-bar" onClick={(event) => event.stopPropagation()}>
        <div className="menu-left">
          <button className="apple-menu-button" type="button" onClick={() => setActiveMenu(activeMenu === "apple" ? null : "apple")} aria-label="Apple menu"></button>
          {[["File", "file"], ["Go", "go"], ["Window", "window"], ["Help", "help"]].map(([label, key]) => (
            <button key={key} className={activeMenu === key ? "menu-active" : ""} type="button" onClick={() => setActiveMenu(activeMenu === key ? null : key)}>{label}</button>
          ))}
        </div>
        <div className="menu-right"><Volume2 size={15} /><span>{now ? now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : ""}</span><strong>Aayush’s iMac</strong></div>
        {activeMenu && (
          <div className={`dropdown-menu dropdown-${activeMenu}`}>
            {activeMenu === "apple" && <><button onClick={() => openWindow("about")}>About This Developer…</button><div className="menu-separator" /><button onClick={() => openWindow("welcome")}>Aayush’s Homepage</button></>}
            {activeMenu === "file" && <><button onClick={() => openWindow("resume")}>Open Résumé…</button><button onClick={() => window.print()}>Print…</button></>}
            {activeMenu === "go" && menuWindows.map((item) => <button key={item.id} onClick={() => openWindow(item.id)}>{item.label}<ChevronRight size={13} /></button>)}
            {activeMenu === "window" && (Object.entries(windows) as [WindowId, WindowState][]).filter(([, state]) => state.open).map(([id]) => <button key={id} onClick={() => focusWindow(id)}>{activeWindow === id ? "✓ " : ""}{windowMeta[id].title}</button>)}
            {activeMenu === "help" && <><button onClick={() => setAssistantVisible(true)}>Show Apple Guide</button><button onClick={() => openWindow("contact")}>Contact help</button></>}
          </div>
        )}
      </header>

      <div className="desktop-icons">
        <DesktopIcon label="About Me" icon={<UserRound />} onOpen={() => openWindow("about")} />
        <DesktopIcon label="Experience" icon={<BriefcaseBusiness />} onOpen={() => openWindow("experience")} />
        <DesktopIcon label="Projects" icon={<FolderOpen />} onOpen={() => openWindow("projects")} />
        <DesktopIcon label="Skills" icon={<Code2 />} onOpen={() => openWindow("skills")} />
        <DesktopIcon label="Résumé" icon={<FileText />} onOpen={() => openWindow("resume")} />
        <DesktopIcon label="Contact" icon={<Mail />} onOpen={() => openWindow("contact")} />
        <DesktopIcon label="Macintosh HD" icon={<Monitor />} onOpen={() => openWindow("welcome")} />
        <DesktopIcon label="Trash" icon={<Trash2 />} onOpen={() => setAssistantVisible(true)} />
      </div>

      {(Object.entries(windows) as [WindowId, WindowState][]).map(([id, state]) =>
        state.open ? (
          <MacWindow key={id} id={id} state={state} active={state.z === topZ} onClose={() => closeWindow(id)} onFocus={() => focusWindow(id)} onMove={(x, y) => moveWindow(id, x, y)}>
            {content[id]}
          </MacWindow>
        ) : null,
      )}

      {assistantVisible && (
        <aside className="apple-guide" aria-label="Portfolio guide">
          <button className="guide-close" type="button" onClick={() => setAssistantVisible(false)} aria-label="Close portfolio guide"><X size={14} /></button>
          <div className="guide-bulb"><CircleHelp size={28} /></div>
          <p><strong>Looking for a software engineer?</strong></p>
          <p>I’m Aayush—a CS student who builds reliable data, mobile, and backend systems.</p>
          <button onClick={() => openWindow("projects")}>Show me his work</button>
          <button onClick={() => openWindow("resume")}>Is he available?</button>
          <button onClick={() => openWindow("contact")}>How do I reach him?</button>
        </aside>
      )}

      <footer className="control-strip" aria-label="Control Strip">
        <div className="control-handle"><span /><span /><span /></div>
        <button type="button" aria-label="Computer"><Monitor size={17} /></button>
        <button type="button" aria-label="Sound"><Volume2 size={17} /></button>
        <button type="button" aria-label="Command"><Command size={17} /></button>
        <div className="control-divider" />
        <span className="control-status"><GraduationCap size={16} /> UC · CS ’27</span>
        <div className="control-spacer" />
        <span className="control-clock">{now ? now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : ""}</span>
      </footer>
    </main>
  );
}
