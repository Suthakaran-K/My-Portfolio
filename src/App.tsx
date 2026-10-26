/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { Github, Linkedin, Mail, Phone, MapPin, ExternalLink, Download, ChevronRight, Moon, Sun, LogIn, LogOut, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { initAuth, googleSignIn, logout, sendVisitEmail } from "./auth";
import { User } from "firebase/auth";

const PROJECTS = [
  {
    title: "Automatic Certificate Generator",
    description: "A certificate-management application processing participant details from spreadsheets with automated email delivery.",
    tech: ["Python", "SQL", "Automation"],
    image: "/src/assets/images/project_certificate_1793019587719.jpg",
    link: "https://github.com/Suthakaran-K/Automatic_Certificate_GEN",
  },
  {
    title: "Hospital Management System",
    description: "A comprehensive digital solution for managing hospital operations, patient records, and scheduling.",
    tech: ["React.js", "Node.js", "Database"],
    image: "/src/assets/images/project_swiggy_1793019588305.jpg",
    link: "https://github.com/Suthakaran-K/Hospital-Management-System",
  },
  {
    title: "AgriversionAI",
    description: "An AI-powered platform designed to provide intelligent insights and automation for modern agricultural practices.",
    tech: ["AI/ML", "Python", "Agricultural Tech"],
    image: "/src/assets/images/project_social_ai_1793019587813.jpg",
    link: "https://github.com/Suthakaran-K/AgriversionAI",
  },
  {
    title: "Swiggy Interface Redesign",
    description: "A modern food-ordering interface focused on clear navigation and enhanced user-friendly browsing experience.",
    tech: ["HTML", "CSS", "React.js"],
    image: "/src/assets/images/project_food_web_1793019588440.jpg",
    link: "#",
  },
];

const SKILLS = {
  Programming: ["C", "C++", "Python", "JavaScript"],
  Web: ["HTML", "CSS", "React.js", "Tailwind CSS"],
  Database: ["SQL"],
  "Automation & AI": ["Automation Anywhere", "AI Agents", "Workflow Automation"],
};

const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/in/suthakaran-kar-825bb6375",
  github: "https://github.com/Suthakaran-K",
  email: "mailto:suthakarankaran45@gmail.com",
};

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hasSentEmail, setHasSentEmail] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setUser(user);
        setToken(token);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const toggleTheme = () => setIsDark(!isDark);

  const handleSignIn = async () => {
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        
        // Automatically send email on first sign in
        if (!hasSentEmail) {
          setIsSending(true);
          await sendVisitEmail(result.accessToken, result.user.email || 'Unknown', result.user.displayName || 'Visitor');
          setHasSentEmail(true);
          setIsSending(false);
        }
      }
    } catch (error) {
      console.error("Sign in failed:", error);
      setIsSending(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setToken(null);
  };

  return (
    <div className="min-h-screen bg-[#FCFCFC] dark:bg-[#0A0A0A] text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-900 dark:selection:text-indigo-100 transition-colors duration-300">
      {/* Top Bar Contract */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          <a href="#" className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0">
            SUTHAKARAN K
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500 dark:text-slate-400">
            {["About", "Projects", "Skills", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div
                    key="sun"
                    initial={{ opacity: 0, rotate: -45 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 45 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-5 h-5 text-amber-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ opacity: 0, rotate: -45 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 45 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-5 h-5 text-slate-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
            
            {user ? (
              <div className="flex items-center gap-3">
                <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-slate-200" />
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

            <a
              href="/public/assets/aistudio/Suthakaran_K_Job_Ready_Resume_91fef3b9.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Resume</span>
            </a>
          </div>
        </div>
      </header>

      <main className="pt-16">
        {/* Notification Banner */}
        <AnimatePresence>
          {hasSentEmail && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-100 dark:border-emerald-800/30 py-3"
            >
              <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-400 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Thanks for visiting! I've been notified of your visit via Gmail.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section - Split Layout */}
        <section id="about" className="max-w-7xl mx-auto px-6 py-12 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-indigo-600 dark:text-indigo-400 font-semibold text-sm tracking-widest uppercase mb-4">
              Aspiring Software Developer
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]">
              Crafting Digital <br />
              <span className="text-indigo-600 dark:text-indigo-400">Experiences</span> with Code.
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-xl leading-relaxed">
              ECE student at Government College of Engineering, Salem. Passionate about building robust web applications and automated AI workflows.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#projects"
                className="px-6 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-all flex items-center gap-2 group"
              >
                View My Work
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
              {!user && (
                <button
                  onClick={handleSignIn}
                  className="px-6 py-3 border border-slate-200 dark:border-slate-800 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-900 transition-all flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Say Hi (Sign In)
                </button>
              )}
              <div className="flex items-center gap-4 px-2">
                <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href={SOCIAL_LINKS.email} className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative aspect-square rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-2xl"
          >
            <img
              src="/public/assets/aistudio/image_ac71ce1f.png"
              alt="Suthakaran K"
              className="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </section>

        {/* Stats / Key Highlights Row */}
        <div className="border-y border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Location", value: "Salem, TN" },
              { label: "Education", value: "B.E. ECE" },
              { label: "Projects", value: "05+ Completed" },
              { label: "Interest", value: "AI Automation" },
            ].map((stat, i) => (
              <div key={i} className="text-center md:text-left">
                <div className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-semibold mb-1">{stat.label}</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects Section - Bento Grid */}
        <section id="projects" className="max-w-7xl mx-auto px-6 py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">Latest Projects</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-md">A selection of my recent works in web development and automation.</p>
            </div>
            <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 group">
              View all work <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            {PROJECTS.map((project, idx) => {
              const isLarge = idx === 0 || idx === 1;
              return (
                <motion.div
                  key={idx}
                  className={`relative group rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500 ${
                    isLarge ? "lg:col-span-3" : "lg:col-span-2"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold mb-3">
                      {project.tech.map((t, i) => (
                        <span key={i}>{t} {i < project.tech.length - 1 && "·"}</span>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{project.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{project.description}</p>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700">
                      View Repository <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="bg-slate-900 dark:bg-black text-white py-24 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold tracking-tight mb-16 text-center md:text-left">Technical Expertise</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
              {Object.entries(SKILLS).map(([category, items], idx) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <h3 className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">{category}</h3>
                  <ul className="space-y-4">
                    {items.map((skill, i) => (
                      <li key={i} className="text-lg font-medium text-slate-300 flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="max-w-3xl mx-auto px-6 py-24 text-center">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">Let's build something together.</h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-10">
            I'm currently looking for new opportunities and collaborations. Whether you have a question or just want to say hi, my inbox is always open!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            {!user ? (
              <button
                onClick={handleSignIn}
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Sign in to say Hi
              </button>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-6 h-6" />
                  <span>Notification Sent!</span>
                </div>
                <p className="text-sm text-slate-500">I've received your visit alert on my Gmail.</p>
              </div>
            )}
            <div className="flex flex-wrap items-center justify-center gap-6 text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">+91 98652 83314</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-slate-200 dark:bg-slate-800" />
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Salem, India</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-slate-200 dark:bg-slate-800" />
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href={SOCIAL_LINKS.email} className="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 underline decoration-indigo-200 underline-offset-4">
                  suthakarankaran45@gmail.com
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-black py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} Suthakaran K. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Privacy</a>
            <a href={SOCIAL_LINKS.linkedin} className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">LinkedIn</a>
            <a href={SOCIAL_LINKS.github} className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
