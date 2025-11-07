// app/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Moon, Sun } from "lucide-react";

// 🔹 Include "certificates" in the nav order
const SECTION_IDS = ["about", "projects", "certificates", "skills", "experience", "education", "contact"] as const;
type SectionId = (typeof SECTION_IDS)[number];

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xyzdbayk";

type Toast = { kind: "success" | "error"; text: string } | null;
type FormspreeError = { message?: string; field?: string; code?: string };
type FormspreeResponse = { errors?: FormspreeError[] };

/* -------------------- Data -------------------- */
type Cert = {
  title: string;
  issuer?: string;
  year?: string;
  file?: string;    // optional PDF path in /public
  image?: string;   // optional preview image path in /public
  verify?: string;  // optional verification URL
};

// PDFs live in /public/assets/certificates ; images in /public/images/certificates
const CERTS: Cert[] = [
  // 👇 This one uses only an IMAGE (its own tile)
  {
    title: "MCP Certificate (Preview)",
    issuer: "Microsoft",
    year: "—",
    image: "/images/certificates/mcp.webp",
    // file: undefined,
  },
  // 👇 These use PDFs (and could also have an image if you add one later)
  {
    title: "LangChain Academy — Deep Research with LangGraph",
    issuer: "LangChain",
    year: "2025",
    file: "/assets/certificates/langchain-academy-deep-research-langgraph.pdf",
  },
  {
    title: "LangSmith Fundamentals",
    issuer: "LangChain",
    year: "2025",
    file: "/assets/certificates/langsmith.pdf",
  },
  {
    title: "Docker Essentials",
    issuer: "Docker",
    year: "2025",
    file: "/assets/certificates/docker_certificate.pdf",
  },
];

const PROJECTS = {
  research: [
    {
      name: "AI-FAPS: Multi-Modal · Multi-View · Multi-Task Pipeline",
      desc: "Deep learning pipeline for quality monitoring in industrial manufacturing.",
      link: "https://github.com/uddipan77/AI-FAPS-Multi-Modal-View-Task-Pipeline",
    },
    {
      name: "Self/Semi-Supervised Image Classification (Industrial Inspection)",
      desc: "Comparative assessment of self-, semi-, and combined learning approaches.",
      link: "https://github.com/uddipan77/ai-faps-self-semi-combined-dl-pipeline-industrial-inspection",
    },
  ],
  applied: [
    {
      name: "OCR → Machine Translation for Inventory Documents",
      desc: "Reorders OCR text and translates to Chinese; evaluates with BLEU.",
      link: "https://github.com/uddipan77/OCR-to-Machine-Translation",
    },
    {
      name: "Generative AI Cold-Email Generator",
      desc: "Llama 3.1, LangChain, ChromaDB, Streamlit, Groq Cloud.",
      link: "https://github.com/uddipan77/generate_email_with_llm",
    },
    {
      name: "Local LLM-based RAG System for Your Personal Documents",
      desc:
        "Private, fully local RAG for Germany’s paperwork pain: convert docs to PDFs, OCR text, store embeddings in OpenSearch, and query with Ollama—secure and offline.",
      link: "https://github.com/uddipan77/local_rag_talk_with_your_docs/tree/main",
    },
    {
      name: "Fullstack Customer Churn Prediction App",
      desc:
        "FastAPI + React; batch & single predictions; multiple models (KNN, SVM, RF, LR, DT, AdaBoost).",
      link: "https://github.com/uddipan77/fullstack_customer_churn",
    },
  ],
} as const;
/* --------------------------------------------- */

const Section = ({ id, title, children }: { id: SectionId; title: string; children: React.ReactNode }) => (
  <section id={id} className="max-w-[1400px] mx-auto px-6 md:px-12 py-24 scroll-mt-24">
    <h2 className="relative inline-block text-5xl md:text-6xl font-semibold mb-12">
      {title}
      <span className="absolute left-0 -bottom-2 block h-[3px] w-full rounded-full bg-gradient-to-r from-pink-500 via-purple-400 to-blue-400" />
    </h2>
    <div className="space-y-6 text-lg md:text-xl leading-8">{children}</div>
  </section>
);

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block rounded-full border px-3 py-1 text-sm">{children}</span>
);

/** Theme toggle — avoids hydration mismatch and persists preference */
function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setMounted(true);
    const stored = (typeof window !== "undefined" && localStorage.getItem("theme")) as "light" | "dark" | null;
    const prefersDark =
      typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const initial = stored ?? (prefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
    document.body.classList.toggle("dark", initial === "dark");
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (typeof window !== "undefined") localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
    document.body.classList.toggle("dark", next === "dark");
  };

  return (
    <button
      onClick={toggle}
      className="ml-auto p-2 rounded-full border text-base hover:bg-black/5 dark:hover:bg-white/10"
      aria-label="Toggle theme"
      suppressHydrationWarning
      title={mounted ? (theme === "dark" ? "Switch to light" : "Switch to dark") : "Toggle theme"}
    >
      {mounted ? (theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />) : <span className="inline-block w-5 h-5" />}
    </button>
  );
}

/* ---------- Projects tab UI ---------- */
function ProjectsTabbed() {
  const [tab, setTab] = useState<"research" | "applied">("research");
  const tabs = [
    { key: "research", label: "Research Projects" },
    { key: "applied", label: "Applied & Industry Projects" },
  ] as const;

  return (
    <div>
      <div className="inline-flex rounded-full border p-1 mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-full text-sm md:text-base transition ${
              tab === t.key ? "bg-black/5 dark:bg-white/10 font-medium" : "opacity-75 hover:opacity-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {PROJECTS[tab].map((p) => (
          <a
            key={p.name}
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-2xl border p-7 md:p-8 hover:bg-black/5 dark:hover:bg-white/5"
          >
            <h3 className="text-xl md:text-2xl font-semibold">{p.name}</h3>
            <p className="mt-3 opacity-90">{p.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  const [active, setActive] = useState<SectionId>("about");

  // 👇 Base prefix ONLY when deployed to GH Pages
  const BASE = process.env.NODE_ENV === "production" ? "/portfolio_Uddipan" : "";

  const offsetsRef = useRef<Partial<Record<SectionId, number>>>({});

  useEffect(() => {
    const computeOffsets = () => {
      const m: Partial<Record<SectionId, number>> = {};
      SECTION_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (el) m[id] = el.getBoundingClientRect().top + window.scrollY;
      });
      offsetsRef.current = m;
    };

    const onScroll = () => {
      // ✅ use actual header height so the active link switches exactly when a section hits the top
      const headerH =
        (document.querySelector("header") as HTMLElement | null)?.getBoundingClientRect().height ?? 0;
      const y = window.scrollY + headerH + 10; // small buffer

      const doc = document.documentElement;
      const atBottom = Math.ceil(window.scrollY + window.innerHeight) >= doc.scrollHeight - 2;
      if (atBottom) {
        setActive("contact");
        return;
      }
      let current: SectionId = "about";
      for (const id of SECTION_IDS) {
        const off = offsetsRef.current[id];
        if (typeof off === "number" && y >= off) current = id;
        else break;
      }
      setActive(current);
    };

    computeOffsets();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", computeOffsets);
    window.addEventListener("load", computeOffsets);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", computeOffsets);
      window.removeEventListener("load", computeOffsets);
    };
  }, []);

  const navLinks = useMemo(
    () => SECTION_IDS.map((id) => ({ id, label: id.charAt(0).toUpperCase() + id.slice(1) })),
    []
  );

  const linkBase =
    "relative pb-2 transition-colors hover:opacity-90 after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:rounded-full after:bg-gradient-to-r after:from-pink-500 after:via-purple-400 after:to-blue-400 after:transition-all after:duration-300";

  // ---------- Contact form (Formspree) state ----------
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        form.reset();
        setToast({ kind: "success", text: "Message sent! I’ll get back to you soon." });
      } else {
        const j = (await res.json().catch(() => ({}))) as FormspreeResponse;
        const msg =
          j.errors?.map((x) => x.message).filter(Boolean).join(", ") ??
          "Could not send message. Please try again.";
        setToast({ kind: "error", text: msg });
      }
    } catch {
      setToast({ kind: "error", text: "Network error. Please try again." });
    } finally {
      setSending(false);
      setTimeout(() => setToast(null), 4000);
    }
  };
  // ----------------------------------------------------

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-50 backdrop-blur bg-white/75 dark:bg-black/50 border-b border-black/10 dark:border-white/10">
        <nav className="max-w-[1400px] mx-auto px-6 md:px-12 py-3 md:py-4 flex items-center gap-7 text-base md:text-lg">
          {navLinks.map(({ id, label }) => {
            const isActive = active === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                className={[
                  linkBase,
                  isActive
                    ? "font-semibold text-black dark:text-white after:w-full"
                    : "opacity-75 after:w-0 hover:after:w-full",
                ].join(" ")}
              >
                {label}
              </a>
            );
          })}
          <ThemeToggle />
        </nav>
      </header>

      {/* HERO */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 min-h-[55vh] md:min-h-[60vh] flex flex-col items-center justify-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-extrabold tracking-tight"
        >
          Uddipan Basu Bir
        </motion.h1>

        <p className="mt-4 text-2xl md:text-3xl opacity-90">Data Scientist · Applied AI Engineer</p>

        <div className="mt-6 flex items-center justify-center gap-4">
          <a
            className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-base md:text-lg font-medium hover:bg-black/5 dark:hover:bg-white/10"
            href={`${BASE}/assets/files/ResumeUddipan.pdf`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download Resume
          </a>
        </div>

        <div className="mt-5 flex items-center justify-center gap-4">
          <Link
            href="https://www.linkedin.com/in/uddipan-basu-bir/"
            target="_blank"
            className="p-2 rounded-full border"
            rel="noopener noreferrer"
          >
            <Linkedin className="w-5 h-5" />
          </Link>
          <Link
            href="https://github.com/uddipan77"
            target="_blank"
            className="p-2 rounded-full border"
            rel="noopener noreferrer"
          >
            <Github className="w-5 h-5" />
          </Link>
          <Link href="mailto:uddipanbb95@gmail.com" className="p-2 rounded-full border">
            <Mail className="w-5 h-5" />
          </Link>
        </div>

        <p className="mt-3 text-sm opacity-70">Erlangen, Germany</p>
      </section>

      {/* ABOUT */}
      <Section id="about" title="About">
        <div className="grid md:grid-cols-[1fr,360px] items-center gap-12">
          <div>
            <p className="opacity-90">
              I’m a Data Science M.Sc. student (AI & ML) at Friedrich-Alexander-Universität Erlangen-Nürnberg, with
              hands-on experience building ML/AI applications and agents. I enjoy turning messy data into useful products
              and crafting reproducible pipelines—from modeling and evaluation to deployment.
            </p>
            <ul className="list-disc pl-6 opacity-90 mt-5">
              <li>Currently exploring Vision-Language Models for structured text extraction (Master’s thesis).</li>
              <li>Building multi AI agents for question-answering directly over multiple data sources (Working Student @ Siemens AG).</li>
            </ul>
          </div>
          <div className="flex justify-center md:justify-end">
            {/* ✅ Use BASE so GH Pages gets /portfolio_Uddipan/images/profile.png */}
            <Image
              src={`${BASE}/images/profile.png`}
              alt="Uddipan Basu Bir"
              width={288}
              height={288}
              priority
              className="w-48 h-48 md:w-72 md:h-72 rounded-full object-cover ring-2 ring-black/10 dark:ring-white/20"
            />
          </div>
        </div>
      </Section>

      {/* PROJECTS */}
      <Section id="projects" title="Projects">
        <ProjectsTabbed />
      </Section>

      {/* CERTIFICATES */}
      <Section id="certificates" title="Certificates & Credentials">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {CERTS.map((c) => (
            <div key={c.title} className="rounded-2xl border p-7 md:p-8 hover:bg-black/5 dark:hover:bg-white/5">
              {/* Optional top preview image */}
              {c.image && (
                <a href={`${BASE}${c.image}`} target="_blank" rel="noopener noreferrer" className="block mb-4">
                  <Image
                    src={`${BASE}${c.image}`}
                    alt={c.title}
                    width={800}
                    height={400}
                    className="w-full h-36 md:h-40 object-cover rounded-lg ring-1 ring-white/15"
                    priority={false}
                  />
                </a>
              )}

              <h3 className="text-lg md:text-xl font-semibold">{c.title}</h3>
              {(c.issuer || c.year) && (
                <p className="opacity-80 text-sm mt-1">
                  {c.issuer ?? ""}{c.issuer && c.year ? " • " : ""}{c.year ?? ""}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-3">
                {c.image && (
                  <a
                    href={`${BASE}${c.image}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    View Image
                  </a>
                )}
                {c.file && (
                  <a
                    href={`${BASE}${c.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    Download PDF
                  </a>
                )}
                {c.verify && (
                  <a
                    href={c.verify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    Verify
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* SKILLS */}
      <Section id="skills" title="Skills">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-medium mb-3 text-lg md:text-xl">Programming & Data</h4>
            <div className="flex flex-wrap gap-2">
              {["Python", "SQL", "PySpark", "Airflow", "TypeScript", "Unix Shell Scripting", "Pydantic", "ONNX"].map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3 text-lg md:text-xl">ML/DL & NLP</h4>
            <div className="flex flex-wrap gap-2">
              {[
                "PyTorch",
                "PyTorch Lightning",
                "scikit-learn",
                "XGBoost",
                "statsmodels",
                "spaCy",
                "NLTK",
                "HF Transformers",
                "LangChain",
                "LangGraph",
                "vLLM",
              ].map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3 text-lg md:text-xl">MLOps & Experimentation</h4>
            <div className="flex flex-wrap gap-2">
              {["MLflow", "Weights & Biases", "TensorBoard", "Optuna", "ZenML", "Docker", "GitHub Actions"].map(
                (s) => (
                  <Chip key={s}>{s}</Chip>
                )
              )}
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3 text-lg md:text-xl">Cloud & BI</h4>
            <div className="flex flex-wrap gap-2">
              {[
                "Azure ML",
                "Azure AI Foundry",
                "Azure OpenAI",
                "Azure Blob Storage",
                "HPC",
                "Power BI",
                "Power Automate",
                "Power Apps",
              ].map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* EXPERIENCE */}
      <Section id="experience" title="Experience">
        <div className="space-y-8">
          {[
            {
              role: "Working Student — Applied AI Engineer",
              org: "Siemens AG, Germany",
              time: "May 2025 — Present",
              bullets: [
                "Developing AI agents for question-answering over multiple data sources and integrate in MS Teams.",
                "Azure ML, Azure OpenAI, LangChain, PyTorch, Azure AI Search, Postman Collection.",
              ],
            },
            {
              role: "Working Student — Data Analyst",
              org: "Schaeffler, Germany",
              time: "Sep 2021 — Jun 2022",
              bullets: [
                "Built interactive Power BI dashboards; data wrangling & modeling.",
                "Automations with Microsoft 365 & Power Platform.",
              ],
            },
            {
              role: "Data Engineer / Data Analyst",
              org: "Tata Consultancy Services, Kolkata, India",
              time: "Sep 2018 — Aug 2021",
              bullets: [
                "ETL pipelines in Ab-initio, Autosys job orchestration.",
                "Migration to PySpark and Airflow.",
                "Optimized SQL for data integration, financial analytics (MRR/ARR/P&L).",
              ],
            },
          ].map((x) => (
            <div key={x.role} className="rounded-2xl border p-7 md:p-8">
              <h3 className="text-xl md:text-2xl font-semibold">{x.role}</h3>
              <p className="opacity-90">
                {x.org} • {x.time}
              </p>
              <ul className="list-disc pl-6 mt-2 opacity-90">
                {x.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* EDUCATION */}
      <Section id="education" title="Education">
        <div className="space-y-8">
          <div className="rounded-2xl border p-7 md:p-8">
            <h3 className="text-xl md:text-2xl font-semibold">M.Sc. in Data Science (AI & ML)</h3>
            <p className="opacity-90">Friedrich-Alexander-Universität Erlangen-Nürnberg — Erlangen, Germany</p>
            <p className="opacity-75">2022 — Present</p>
          </div>
          <div className="rounded-2xl border p-7 md:p-8">
            <h3 className="text-xl md:text-2xl font-semibold">B.Tech. in Computer Science & Engineering</h3>
            <p className="opacity-90">Maulana Abul Kalam Azad University of Technology — Kolkata, India</p>
            <p className="opacity-75">2014 — 2018</p>
          </div>
        </div>
      </Section>

      {/* CONTACT */}
      <Section id="contact" title="Contact">
        <form className="max-w-2xl" onSubmit={handleContactSubmit} noValidate>
          {/* Honeypot to reduce spam */}
          <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />
          {/* Optional subject line */}
          <input type="hidden" name="_subject" value="New message from portfolio site" />

          <label className="block mb-2 text-sm">Name</label>
          <input
            name="name"
            type="text"
            required
            className="w-full mb-4 rounded-lg bg-neutral-100 dark:bg-neutral-900 border p-3"
            placeholder="Your name"
          />

          <label className="block mb-2 text-sm">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full mb-4 rounded-lg bg-neutral-100 dark:bg-neutral-900 border p-3"
            placeholder="you@example.com"
          />

          <label className="block mb-2 text-sm">Message</label>
          <textarea
            name="message"
            rows={5}
            required
            className="w-full mb-4 rounded-lg bg-neutral-100 dark:bg-neutral-900 border p-3"
            placeholder="Say hello…"
          />

          <button
            disabled={sending}
            className="rounded-full border px-5 py-2.5 text-base font-medium hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-60"
          >
            {sending ? "Sending…" : "Submit"}
          </button>
        </form>

        <p className="opacity-70 text-sm mt-8">
          © {new Date().getFullYear()} Uddipan. Built with Next.js, Tailwind CSS, Framer Motion, and hosted on GitHub
          Pages.
        </p>
      </Section>

      {/* Bottom toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className={[
            "fixed left-1/2 -translate-x-1/2 bottom-6 z-[60] px-4 py-3 rounded-full border shadow-lg",
            toast.kind === "success"
              ? "bg-green-500/10 border-green-400 text-green-300"
              : "bg-red-500/10 border-red-400 text-red-300",
          ].join(" ")}
          aria-live="polite"
        >
          {toast.text}
        </motion.div>
      )}
    </main>
  );
}
