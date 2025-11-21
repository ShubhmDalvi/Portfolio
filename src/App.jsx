import React, { useRef, useEffect, useState, useMemo } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import emailjs from "@emailjs/browser"; 
import "./App.css";

// Icons
import { FiArrowRight, FiSend, FiZap, FiGithub, FiLinkedin, FiFileText, FiCode, FiExternalLink, FiTerminal, FiUser, FiCoffee, FiAward, FiCpu } from "react-icons/fi";
import { FaReact, FaJava, FaPython, FaHtml5, FaCss3Alt, FaGitAlt, FaNodeJs, FaDocker, FaAws, FaSpotify } from "react-icons/fa";
import { SiSpringboot, SiPostgresql, SiMysql, SiPostman, SiGnubash, SiTypescript, SiMongodb, SiRedis, SiGraphql } from "react-icons/si";

gsap.registerPlugin(ScrollTrigger);

// --- Helper: Magnetic Button Component ---
const Magnetic = ({ children }) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if(!element) return;
    
    const xTo = gsap.quickTo(element, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(element, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    const mouseMove = (e) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = element.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      xTo(x * 0.35);
      yTo(y * 0.35);
    };

    const mouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    element.addEventListener("mousemove", mouseMove);
    element.addEventListener("mouseleave", mouseLeave);
    return () => {
      element.removeEventListener("mousemove", mouseMove);
      element.removeEventListener("mouseleave", mouseLeave);
    };
  }, []);

  return React.cloneElement(children, { ref });
};

// --- Helper: Decrypted Text ---
const DecryptedText = ({ text, className = "", animateOnLoad = false, reveal = false }) => {
  const [displayText, setDisplayText] = useState(text);
  const elementRef = useRef(null);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+";

  useGSAP(() => {
    const element = elementRef.current;
    if(!element) return;

    const startAnimation = () => {
      let iteration = 0;
      clearInterval(element.interval); 
      
      element.interval = setInterval(() => {
        setDisplayText(
          text
            .split("")
            .map((letter, index) => {
              if (index < iteration) return text[index];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );
        if (iteration >= text.length) clearInterval(element.interval);
        iteration += 1 / 3; 
      }, 30);
    };

    if (animateOnLoad) {
        if (reveal) {
            startAnimation();
        }
    } else {
        ScrollTrigger.create({
            trigger: element,
            start: "top 85%",
            once: true,
            onEnter: startAnimation
        });
    }

    return () => clearInterval(element.interval);
  }, { scope: elementRef, dependencies: [reveal, animateOnLoad] });

  return <span ref={elementRef} className={className}>{displayText}</span>;
};

// --- Infinite Marquee ---
const Marquee = () => {
  return (
    <div className="marquee-section">
      <div className="marquee-track">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="marquee-text">
            Frontend • Backend • System Architecture • UI/UX • Creative Dev •&nbsp;
          </span>
        ))}
      </div>
    </div>
  );
};

// --- 3D Skill Sphere Component ---
const skillsList = [
  { name: 'Java', icon: <FaJava /> },
  { name: 'Spring', icon: <SiSpringboot /> },
  { name: 'React', icon: <FaReact /> },
  { name: 'Postgres', icon: <SiPostgresql /> },
  { name: 'MySQL', icon: <SiMysql /> },
  { name: 'Python', icon: <FaPython /> },
  { name: 'HTML5', icon: <FaHtml5 /> },
  { name: 'CSS3', icon: <FaCss3Alt /> },
  { name: 'Bash', icon: <SiGnubash /> },
  { name: 'Git', icon: <FaGitAlt /> },
  { name: 'Postman', icon: <SiPostman /> },
  { name: 'Node.js', icon: <FaNodeJs /> },
  { name: 'TypeScript', icon: <SiTypescript /> },
  { name: 'Docker', icon: <FaDocker /> },
  { name: 'AWS', icon: <FaAws /> },
  { name: 'Redis', icon: <SiRedis /> },
  { name: 'GraphQL', icon: <SiGraphql /> },
  { name: 'MongoDB', icon: <SiMongodb /> },
];

const SkillSphere = () => {
  const containerRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });

  // Math to distribute points on a sphere (Fibonacci Sphere)
  const points = useMemo(() => {
    const count = skillsList.length;
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
    
    return skillsList.map((skill, i) => {
      const y = 1 - (i / (count - 1)) * 2; // y goes from 1 to -1
      const radius = Math.sqrt(1 - y * y); // radius at y
      const theta = phi * i; // golden angle increment

      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;

      return { ...skill, vector: { x, y, z } };
    });
  }, []);

  // Animation Loop
  useEffect(() => {
    let animationFrame;
    
    const animate = () => {
      // Constant slow rotation if not dragging
      if (!isDragging) {
        setRotation(prev => ({
          x: prev.x + 0.002,
          y: prev.y + 0.002
        }));
      }
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [isDragging]);

  // Interaction (Mouse)
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const deltaX = e.clientX - lastMouse.x;
      const deltaY = e.clientY - lastMouse.y;
      
      setRotation(prev => ({
        x: prev.x - deltaY * 0.005,
        y: prev.y + deltaX * 0.005
      }));
      
      setLastMouse({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Interaction (Touch - Mobile)
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setLastMouse({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchMove = (e) => {
    if (isDragging) {
      const deltaX = e.touches[0].clientX - lastMouse.x;
      const deltaY = e.touches[0].clientY - lastMouse.y;
      
      setRotation(prev => ({
        x: prev.x - deltaY * 0.005,
        y: prev.y + deltaX * 0.005
      }));
      
      setLastMouse({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  return (
    <div 
      className="skill-sphere-container" 
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      <div className="skill-sphere-wrapper">
        {points.map((pt, i) => {
          // 3D rotation math
          const cosX = Math.cos(rotation.x);
          const sinX = Math.sin(rotation.x);
          const cosY = Math.cos(rotation.y);
          const sinY = Math.sin(rotation.y);

          // Rotate around Y first
          let x = pt.vector.x * cosY - pt.vector.z * sinY;
          let z = pt.vector.z * cosY + pt.vector.x * sinY;
          
          // Rotate around X
          let y = pt.vector.y * cosX - z * sinX;
          z = z * cosX + pt.vector.y * sinX;

          // Project to 2D (Perspective)
          // Radius of sphere in pixels
          const radius = 250; 
          const perspective = 500;
          const scale = perspective / (perspective - z * radius);
          const opacity = Math.max(0.1, (z + 1.5) / 2.5); // simple depth opacity

          return (
            <div
              key={i}
              className="sphere-item"
              style={{
                transform: `translate3d(${x * radius}px, ${y * radius}px, 0) scale(${scale})`,
                opacity: opacity,
                zIndex: Math.floor(z * 100)
              }}
            >
              <div className="sphere-item-icon">{pt.icon}</div>
              <div className="sphere-item-text">{pt.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Terminal Component (Redesigned Immersive MacOS Style) ---
const Terminal = ({ closeTerminal, projects }) => {
  const [isBooting, setIsBooting] = useState(true);
  const [bootLogs, setBootLogs] = useState([]);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const bottomRef = useRef(null);
  const booted = useRef(false);

  // Boot Sequence Data
  const bootSequence = [
    "Initializing PortfolioOS Kernel v2.5.0...",
    "Loading modules: React, GSAP, Three.js...",
    "Verifying user identity... SUCCESS",
    "Mounting filesystem /dev/portfolio...",
    "Starting GUI services... OK",
    "Connecting to host... ESTABLISHED",
    "Type 'help' for available commands."
  ];

  // Boot Animation
  useEffect(() => {
	  
	  if (booted.current) return; // <--- ADD THIS CHECK
    booted.current = true;      // <--- SET TO TRUE
	  
    let delay = 0;
    bootSequence.forEach((log, index) => {
        delay += Math.random() * 300 + 100; // Random delay between lines
        setTimeout(() => {
            setBootLogs(prev => [...prev, log]);
            if(index === bootSequence.length - 1) {
                setTimeout(() => setIsBooting(false), 500);
            }
        }, delay);
    });
  }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    if (!isBooting) inputRef.current?.focus();
  }, [bootLogs, history, isBooting]);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      const newHistory = [...history, { type: 'command', content: input }];
      
      let response = "";
      
      switch(cmd) {
        case 'help':
          response = "Available commands:\n  ls / list - List all projects\n  about     - Who am I?\n  contact   - Display contact info\n  clear     - Clear terminal\n  exit      - Return to GUI mode";
          break;
        case 'ls':
        case 'list':
          response = projects.map(p => `> ${p.title} [${p.tech.join(', ')}]`).join('\n');
          break;
        case 'about':
          response = "Identity: Creative Developer\nMission: Bridging code and design.\nStatus: Open to opportunities.";
          break;
        case 'contact':
          response = "Email: shubhmdalvi@gmail.com\nGitHub: github.com/ShubhmDalvi\nLinkedIn: linkedin.com/in/shubhmdalvi";
          break;
        case 'clear':
          setHistory([]);
          setBootLogs([]); // Clear boot logs too
          setInput("");
          return;
        case 'exit':
          closeTerminal();
          return;
        case '':
          response = "";
          break;
        default:
          response = `zsh: command not found: ${cmd}`;
      }
      
      if (response) {
        newHistory.push({ type: 'response', content: response });
      }
      
      setHistory(newHistory);
      setInput("");
    }
  };

  return (
    // Overlay
    <div className="terminal-overlay terminal-enter" onClick={() => closeTerminal()}>
      {/* Window Container */}
      <div className="terminal-window" onClick={(e) => e.stopPropagation()}>
        
        {/* CRT Scanline Effect */}
        <div className="scanlines"></div>
        
        {/* MacOS Header */}
        <div className="terminal-header">
            <div className="terminal-controls">
                <div className="terminal-dot red" onClick={closeTerminal}></div>
                <div className="terminal-dot yellow"></div>
                <div className="terminal-dot green"></div>
            </div>
            <div className="terminal-title">user@portfolio: ~ (zsh)</div>
        </div>

        {/* Terminal Body */}
        <div className="terminal-content" onClick={() => !isBooting && inputRef.current?.focus()}>
            
            {/* Boot Sequence */}
            {bootLogs.map((log, i) => (
                <div key={`boot-${i}`} className="terminal-line text-muted">
                    <span className="boot-prefix">[OK]</span> {log}
                </div>
            ))}

            {/* Interactive History */}
            {history.map((line, i) => (
                <div key={i} className={line.type === 'command' ? 'terminal-line' : 'terminal-line terminal-response'}>
                    {line.type === 'command' && 
                        <span className="prompt-wrapper">
                            <span className="prompt-user">user</span>
                            <span className="prompt-at">@</span>
                            <span className="prompt-host">portfolio</span>
                            <span className="prompt-dir"> ~ </span>
                            <span className="prompt-arrow">➜</span>
                        </span>
                    }
                    <span className={line.type === 'command' ? 'cmd-text' : ''}>{line.content}</span>
                </div>
            ))}

            {/* Input Line (Only shows after boot) */}
            {!isBooting && (
                <div className="terminal-input-line">
                    <span className="prompt-wrapper">
                        <span className="prompt-user">user</span>
                        <span className="prompt-at">@</span>
                        <span className="prompt-host">portfolio</span>
                        <span className="prompt-dir"> ~ </span>
                        <span className="prompt-arrow">➜</span>
                    </span>
                    <input 
                        ref={inputRef}
                        type="text" 
                        className="cmd-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleCommand}
                        autoFocus
                        spellCheck={false}
                    />
                </div>
            )}
            <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
};

// --- Updated Component: Random Vibe Picker ---
const SpotifyCard = () => {
  // 1. Default State (Fallback if Gist fails)
  const [track, setTrack] = useState({
    name: "Fox on the Run",
    artist: "Sweet",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/7e/8d/b6/7e8db6ce-a4fa-fc10-5901-1e99e336a8bd/23UM1IM21045.rgb.jpg/600x600bb.jpg",
    link: "https://open.spotify.com/track/5dYbeX2B67K7Ybd33t0YfT"
  });

  // 2. Fetch Data & Pick Random Song
  useEffect(() => {
    // PASTE YOUR RAW GIST URL HERE
    const GIST_URL = "https://gist.githubusercontent.com/ShubhmDalvi/be38a59be54d1a780822690c0efe3e30/raw/45125dfad8af927d841e423aee768884b8f7aa96/spotify.json";

    fetch(GIST_URL)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Logic: Pick a random number between 0 and list length
          const randomIndex = Math.floor(Math.random() * data.length);
          setTrack(data[randomIndex]);
        } else if (data.name) {
          // Handle case where Gist only has 1 song object (not an array)
          setTrack(data);
        }
      })
      .catch(err => console.error("Error fetching song:", err));
  }, []);

  return (
    <a 
      href={track.link} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="card spotify-card reveal-up"
    >
      <div className="spotify-bg" style={{ backgroundImage: `url(${track.cover})` }}></div>
      
      <div className="spotify-content">
        <div className="spotify-top">
          <FaSpotify className="spotify-icon" />
          <div className="equalizer">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
        
        <div className="spotify-info">
          <span className="spotify-label">On Repeat</span>
          <h3 className="spotify-title">{track.name}</h3>
          <p className="spotify-artist">{track.artist}</p>
        </div>
      </div>
    </a>
  );
};

// --- Project Data ---
const projectsData = [
  {
    id: "01",
    title: "Kitsu URL Shortener",
    tech: ["Spring Boot", "React", "Tailwind"],
    desc: "A fast, production-ready URL shortener featuring secure code generation, collision handling, and real-time click tracking. The sleek interface offers a drifting blob background, smooth logo animations, and local history storage for a seamless user experience.",
    links: { github: "https://github.com/ShubhmDalvi/kitsu-backend", live: "https://kitsu-url.vercel.app" },
    color: "#4ade80" 
  },
  {
    id: "02",
    title: "grb (Grab) CLI",
    tech: ["GoLang", "CLI", "TUI"],
    desc: "A high-performance, terminal-based clipboard manager for Windows built in Go. Features an interactive TUI with fuzzy search, a background daemon for auto-capturing history, and robust tools to tag, pin, and alias frequently used snippets.",
    links: { github: "https://github.com/ShubhmDalvi/grb", live: "https://grbapp.netlify.app" },
    color: "#60a5fa"
  },
  {
    id: "03",
    title: "QShare Network Transfer",
    tech: ["GoLang", "Networking", "CLI"],
    desc: "A minimal, secure command-line tool for high-speed LAN file transfers. Eliminates manual IP entry with UDP broadcast discovery, utilizing AES-CTR encryption and TCP for reliable, visualized data transmission.",
    links: { github: "https://github.com/ShubhmDalvi/qshare", live: "https://qsharetool.netlify.app" },
    color: "#f472b6"
  },
  {
    id: "04",
    title: "TubeTune Quality Auto-Set",
    tech: ["JavaScript", "Chrome Ext", "DOM"],
    desc: "A lightweight Chrome extension that automates video quality settings for YouTube and YouTube Music. Utilizes injected content scripts and player API event listeners to enforce user preferences (e.g., 1080p) instantly upon video load.",
    links: { github: "https://github.com/ShubhmDalvi/TubeTune", live: "https://tubetune.netlify.app" },
    color: "#a78bfa"
  }
];

const App = () => {
  const containerRef = useRef(null);
  const cursorRef = useRef(null);
  const formRef = useRef(null);

  const [loaderFinished, setLoaderFinished] = useState(false);
  const [counter, setCounter] = useState(0);
  const [formStatus, setFormStatus] = useState("Send Message");
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  // --- 1. Preloader Logic ---
  useEffect(() => {
    const intervalTime = 2; 
    
    // CHANGE: Detect mobile to speed up the counter
    // On mobile, we jump by 5 to prevent performance lag/slowness
    const isMobile = window.innerWidth < 768;
    const increment = isMobile ? 5 : 1; 

    const interval = setInterval(() => {
      setCounter((prev) => {
        const next = prev + increment; // Use the dynamic increment
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    if (counter >= 100) {
      gsap.to(".preloader", {
        yPercent: -100,
        duration: 0.8,
        ease: "power4.inOut",
        onComplete: () => setLoaderFinished(true),
      });
    }
    return () => clearInterval(interval);
  }, [counter]);

  // --- 2. Smooth Scroll (Lenis) ---
  useEffect(() => {
    if (!loaderFinished || isTerminalOpen) return; // Pause scroll logic if terminal is open
    
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, [loaderFinished, isTerminalOpen]);

  // --- 3. Custom Cursor & Interaction ---
  // --- 3. Custom Cursor & Interaction ---
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return; // Guard clause

    // OPTIMIZATION: Use quickTo for high-performance mouse following
    // duration: 0.1 makes it snappy (almost instant), 0.6 was too slow
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power3.out" });

    const moveCursor = (e) => {
      // 1. Move the cursor visual
      xTo(e.clientX);
      yTo(e.clientY);

      // 2. Update Spotlight Effect (Cards)
      const cards = document.getElementsByClassName("skill-item");
      for(const card of cards) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      };
      
      // 3. Update Hero Visual (3D Tilt)
      const heroVisual = document.querySelector('.code-card');
      if (heroVisual) {
        // CHANGE: Swapped the order to (Mouse - Center) instead of (Center - Mouse)
        // This makes the card tilt TOWARDS the mouse instead of away from it.
        const x = (e.clientX - window.innerWidth / 2) / 25;
        const y = (e.clientY - window.innerHeight / 2) / 25;
        
        gsap.to(heroVisual, {
            rotationY: x,
            rotationX: -y, // Added negative sign here to make it look "up" correctly
            duration: 1,
            ease: "power2.out"
        })
      }
    };

    const handleHover = () => gsap.to(cursor, { scale: 2.5, backgroundColor: "#fff", duration: 0.2 }); // Faster hover transition
    const handleLeave = () => gsap.to(cursor, { scale: 1, backgroundColor: "rgba(211, 218, 217, 0.2)", duration: 0.2 });

    window.addEventListener("mousemove", moveCursor);
    
    // Interactive elements
    const interactives = document.querySelectorAll("a, button, input, textarea, .card, .social-btn, .project-card-inner, .cmd-input, .sphere-item, .terminal-toggle-btn");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", handleHover);
      el.addEventListener("mouseleave", handleLeave);
    });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", handleHover);
        el.removeEventListener("mouseleave", handleLeave);
      });
    };
  }, [loaderFinished, isTerminalOpen]);

  // --- 4. Main Animations & Stack Logic ---
  useGSAP(() => {
    if (!loaderFinished || isTerminalOpen) return;

    // Hero & General Reveal
    const tl = gsap.timeline();
    tl.to(".hero-hidden", {
      autoAlpha: 1, y: 0, stagger: 0.1, duration: 1, ease: "power3.out",
    });

    gsap.utils.toArray(".reveal-up").forEach((elem) => {
      gsap.from(elem, {
        scrollTrigger: { trigger: elem, start: "top 85%" },
        y: 60, opacity: 0, duration: 1.2, ease: "power3.out",
      });
    });

    // --- PROJECT STACK ANIMATION ---
    const cards = gsap.utils.toArray(".project-card-wrapper");
    
    cards.forEach((card, index) => {
      const inner = card.querySelector(".project-card-inner");
      
      if (index !== cards.length - 1) {
        ScrollTrigger.create({
          trigger: card,
          start: "top top", 
          end: `bottom top+=100`, 
          scrub: true,
          animation: gsap.to(inner, {
            scale: 0.9,
            opacity: 0.4,
            ease: "linear"
          })
        });
      }
    });

  }, { scope: containerRef, dependencies: [loaderFinished, isTerminalOpen] });

  // 3. EMAIL LOGIC
  const sendEmail = (e) => {
    e.preventDefault();
    setFormStatus("Sending...");
    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setFormStatus("Sent Successfully!");
          gsap.to(".form-status", { color: "#4ade80", scale: 1.1, duration: 0.3, yoyo: true, repeat: 1 });
          e.target.reset(); 
        },
        (error) => {
          console.log("FAILED...", error.text);
          setFormStatus("Failed. Try again.");
          gsap.to(".form-status", { color: "#ff4d4d", scale: 1.1, duration: 0.3, yoyo: true, repeat: 1 });
        }
      );
  };

  return (
    <div ref={containerRef} className="app-wrapper">
      <div className="bg-grid"></div>
      <div ref={cursorRef} className="cursor-follower" />

      {/* Preloader */}
      <div className="preloader">
        <div className="counter-container">
          <div className="counter">{Math.min(100, Math.round(counter))}%</div>
          <div className="counter-label">Loading Experience</div>
        </div>
      </div>
      
      {/* Terminal Toggle */}
      {loaderFinished && (
        <Magnetic>
          <button 
              className="terminal-toggle-btn" 
              onClick={() => setIsTerminalOpen(!isTerminalOpen)}
          >
              <FiTerminal /> {isTerminalOpen ? "GUI Mode" : "/bin/bash"}
          </button>
        </Magnetic>
      )}

      {/* Terminal Overlay */}
      {isTerminalOpen && (
        <Terminal 
            closeTerminal={() => setIsTerminalOpen(false)} 
            projects={projectsData} 
        />
      )}

      {/* Main Content (Hidden from view logic when terminal is open if desired, but keeping in DOM for transition) */}
      <div style={{ opacity: isTerminalOpen ? 0 : 1, transition: 'opacity 0.5s ease', pointerEvents: isTerminalOpen ? 'none' : 'auto' }}>
        
        {/* Hero */}
        <section className="section hero">
            <div className="container hero-content">
            <div className="hero-text">
                <p className="hero-sub hero-hidden" style={{ color: 'var(--accent-1)', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '30px', height: '1px', background: 'var(--accent-1)'}}></span> PORTFOLIO 
                </p>
                <h1 className="hero-char hero-hidden" style={{ marginBottom: '1.5rem' }}>
                <DecryptedText 
                    text="Shubham" 
                    animateOnLoad={true} 
                    reveal={loaderFinished} 
                />
                <br />
                <span style={{ color: 'var(--text-muted)' }}>
                    <DecryptedText 
                    text="Dalvi" 
                    animateOnLoad={true} 
                    reveal={loaderFinished} 
                    />
                </span>
                </h1>
                <p className="hero-sub hero-hidden" style={{ maxWidth: '600px', marginBottom: '2.5rem' }}>
                Building immersive digital experiences with modern technologies.
                </p>
                <div className="hero-hidden" style={{ display: 'flex', flexDirection: 'column', gap: '0', alignItems: 'flex-start' }}>
                <Magnetic>
                    <a href="#projects" className="btn hero-btn">View Projects <FiArrowRight /></a>
                </Magnetic>
                <div className="social-row">
                    <Magnetic><a href="https://www.linkedin.com/in/shubhmdalvi" className="social-btn"><FiLinkedin size={22} /></a></Magnetic>
                    <Magnetic><a href="https://github.com/ShubhmDalvi" className="social-btn"><FiGithub size={22} /></a></Magnetic>
                    <Magnetic><a href="#" className="social-btn"><FiFileText size={22} /></a></Magnetic>
                </div>
                </div>
            </div>
            <div className="hero-visual hero-hidden">
                <div className="code-card">
                <div className="code-header">
                    <div className="dot red"></div>
                    <div className="dot yellow"></div>
                    <div className="dot green"></div>
                </div>
                <div className="code-content">
                    <span className="code-line"><span className="kw">const</span> <span className="fn">developer</span> = <span className="kw">new</span> <span className="fn">Human</span>();</span>
                    <span className="code-line"><span className="fn">developer</span>.<span className="fn">stack</span>([<span className="str">"SpringBoot"</span>, <span className="str">"React"</span>]);</span>
                    <span className="code-line"><span className="fn">developer</span>.<span className="fn">status</span> = <span className="str">"Open to work"</span>;</span>
                    <span className="code-line"><span className="kw">return</span> <span className="str">"Awesome Experiences"</span>;<span className="cursor-blink"></span></span>
                </div>
                </div>
            </div>
            </div>
        </section>

        {/* Infinite Marquee */}
        <Marquee />

        {/* ABOUT ME */}
        <section id="about" className="section about">
            <div className="container">
            <h2 className="reveal-up"><DecryptedText text="About Me" /></h2>
            
            <div className="about-grid" style={{ marginTop: '3rem' }}>
                {/* Main Bio Card */}
                <div className="card about-text-card reveal-up">
                <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--text-main)' }}>
                    <span style={{ color: 'var(--accent-1)', fontWeight: 'bold' }}>Hello!</span> I'm a passionate developer who bridges the gap between functional code and visual art.
                </p>
                <p style={{ marginBottom: '1.5rem' }}>
                    My journey started with a curiosity for how things work on the web, which quickly turned into a career obsession. I specialize in building applications that are not only performant but also provide a unique user interaction. Fueled by curiosity, I create efficient solutions with Java, Spring Boot, and JavaScript.
                </p>
                </div>

                {/* Stat Card 1 */}
                <div className="card about-stat-card reveal-up">
                <FiUser size={30} style={{ color: 'var(--accent-1)', marginBottom: '1rem' }} />
                <h3 className="stat-number">2+</h3>
                <span className="stat-label">Years Exp.</span>
                </div>

                <SpotifyCard />

                {/* Stat Card 3 */}
                <div className="card about-stat-card reveal-up">
                <FiCoffee size={30} style={{ color: 'var(--accent-1)', marginBottom: '1rem' }} />
                <h3 className="stat-number">∞</h3>
                <span className="stat-label">Coffee</span>
                </div>
            </div>
            </div>
        </section>

        {/* Skills Sphere */}
        <section className="section skills">
            <div className="container">
            <h2><DecryptedText text="Technical Arsenal" /></h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Drag the sphere to explore technologies.</p>
            
            {/* NEW: 3D Sphere Component */}
            <div className="reveal-up">
                <SkillSphere />
            </div>
            </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="section projects-section">
            <div className="container">
            <h2 className="reveal-up" style={{ marginBottom: '4rem' }}>
                <DecryptedText text="Selected Works" />
            </h2>
            
            <div className="projects-stack-container">
                {projectsData.map((project, index) => (
                <div key={index} className="project-card-wrapper" style={{ top: `calc(10vh + ${index * 25}px)` }}>
                    <div className="card project-card-inner">
                    <div className="project-card-header">
                        <span className="project-id">{project.id}</span>
                        <div className="project-links">
                        <a href={project.links.github} className="icon-link"><FiGithub /></a>
                        <a href={project.links.live} className="icon-link"><FiExternalLink /></a>
                        </div>
                    </div>
                    
                    <div className="project-card-content">
                        <h3 className="project-title">{project.title}</h3>
                        <p className="project-desc">{project.desc}</p>
                        
                        <div className="project-tech-row">
                        {project.tech.map((t, i) => (
                            <span key={i} className="tech-pill">{t}</span>
                        ))}
                        </div>
                    </div>

                    <div className="project-decoration" style={{ background: `linear-gradient(45deg, ${project.color}22, transparent)` }}></div>
                    </div>
                </div>
                ))}
            </div>
            </div>
        </section>

        {/* Contact */}
        <section className="section contact">
            <div className="container" style={{ maxWidth: '600px' }}>
            <div className="reveal-up card" style={{ borderColor: 'var(--accent-1)' }}>
                <h2 style={{ textAlign: 'center' }}><DecryptedText text="Let's Connect" /></h2>
                
                <form ref={formRef} onSubmit={sendEmail}>
                <div className="input-group">
                    <input type="text" name="user_name" className="input-field" placeholder="Name" required />
                </div>
                <div className="input-group">
                    <input type="email" name="user_email" className="input-field" placeholder="Email" required />
                </div>
                <div className="input-group">
                    <textarea name="message" className="input-field" rows="5" placeholder="Message" required></textarea>
                </div>
                
                <Magnetic>
                    <button type="submit" className="btn" style={{ width: '100%', justifyContent: 'center' }}>
                    <span className="form-status">{formStatus}</span> <FiZap />
                    </button>
                </Magnetic>
                </form>
            </div>
            </div>
        </section>

      </div>
    </div>
  );
};

export default App;