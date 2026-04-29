import { useState, useEffect, useRef, useMemo, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Facebook, Twitter, Instagram, Diamond, Sparkles, Sword, Gem, ArrowRight, Compass, Skull, Eye, Settings, Menu, X } from 'lucide-react';

type EffectsLevel = 'high' | 'low' | 'off';
const EffectsContext = createContext<{
  level: EffectsLevel;
  setLevel: (l: EffectsLevel) => void;
}>({ level: 'high', setLevel: () => {} });

function EffectsToggle() {
  const { level, setLevel } = useContext(EffectsContext);
  
  return (
    <div className="fixed bottom-6 right-6 z-[9000]">
      <button 
        onClick={() => setLevel(level === 'high' ? 'low' : level === 'low' ? 'off' : 'high')}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-mystic-500/30 bg-mystic-900/60 backdrop-blur hover:bg-mystic-800/80 transition-colors text-mystic-200 group cursor-pointer"
        style={{ cursor: 'none' }}
      >
        <Settings size={14} className={`group-hover:rotate-90 transition-transform duration-500 ${level === 'high' ? 'text-mystic-300' : 'text-mystic-600'}`} />
        <span className="font-mono text-xs tracking-widest">VFX: {level.toUpperCase()}</span>
      </button>
    </div>
  );
}

function HolographicGrid() {
  const { level } = useContext(EffectsContext);
  const [mouse, setMouse] = useState({ x: -1000, y: -1000 });
  const [windowSize, setWindowSize] = useState({ w: 1000, h: 1000 });

  const nodes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 35; i++) {
       arr.push({
         id: i,
         xp: Math.random(),
         yp: Math.random(),
         seed: Math.random()
       });
    }
    return arr;
  }, []);

  useEffect(() => {
    if (level === 'off') return;
    setWindowSize({ w: window.innerWidth, h: window.innerHeight });

    let raf: number;
    let target = { x: -1000, y: -1000 };
    let current = { x: -1000, y: -1000 };

    const handleMouse = (e: MouseEvent) => {
      target = { x: e.clientX, y: e.clientY };
    };

    const handleResize = () => {
      setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    };

    const loop = () => {
      current.x += (target.x - current.x) * (level === 'low' ? 0.05 : 0.15);
      current.y += (target.y - current.y) * (level === 'low' ? 0.05 : 0.15);
      setMouse({ x: current.x, y: current.y });
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('resize', handleResize);
    loop();

    return () => {
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(raf);
    };
  }, [level]);

  if (level === 'off') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[4] overflow-hidden mix-blend-screen opacity-70">
       <svg className="w-full h-full">
         <defs>
           <radialGradient id="holoNodeGlow" cx="50%" cy="50%" r="50%">
             <stop offset="0%" stopColor="rgba(188,156,255,0.2)" />
             <stop offset="100%" stopColor="transparent" />
           </radialGradient>
         </defs>

         {nodes.slice(0, level === 'low' ? 10 : 35).map(node => {
           const cx = node.xp * windowSize.w;
           const cy = node.yp * windowSize.h;
           const dx = mouse.x - cx;
           const dy = mouse.y - cy;
           const dist = Math.sqrt(dx * dx + dy * dy);
           const radius = 250;
           
           const isNear = dist < radius;
           const intensity = isNear ? (radius - dist) / radius : 0;
           
           const shiftX = isNear ? (dx / dist) * intensity * -30 : 0;
           const shiftY = isNear ? (dy / dist) * intensity * -30 : 0;
           
           const scale = 1 + intensity * 0.8;
           const opacity = 0.1 + intensity * 0.8;

           return (
             <g 
               key={node.id} 
               style={{ 
                 transform: `translate(${cx + shiftX}px, ${cy + shiftY}px) scale(${scale})`,
                 opacity: opacity
               }}
             >
                <circle r="40" fill="url(#holoNodeGlow)" />
                <path d="M-10,0 L10,0 M0,-10 L0,10" stroke="rgba(188,156,255,0.6)" strokeWidth="1" />
                <circle r="15" fill="none" stroke="rgba(123,82,217,0.5)" strokeWidth="1" strokeDasharray="3,3" />
                
                {isNear && (
                  <circle 
                    cx="0" cy="0"
                    r={20 + intensity * 15} 
                    fill="none" 
                    stroke="rgba(188,156,255,0.4)" 
                    strokeWidth="0.5" 
                    strokeDasharray="2,6" 
                    transform={`rotate(${mouse.x * 0.2 + node.seed * 360})`} 
                  />
                )}
                
                <text x="12" y="-12" fill="rgba(188,156,255,0.7)" fontSize="8" fontFamily="monospace" letterSpacing="1">
                   {node.id.toString(16).padStart(2, '0').toUpperCase()}
                </text>
             </g>
           );
         })}
       </svg>
    </div>
  );
}

function CinematicHUD() {
  const { level } = useContext(EffectsContext);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (level === 'off') return;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [level]);

  if (level === 'off') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[3] overflow-hidden mix-blend-screen opacity-30">
      <motion.div 
        className="absolute top-16 left-16 w-64 h-64 border border-mystic-500/20 rounded-full flex flex-col items-center justify-center opacity-40 lg:opacity-100"
        animate={{ 
           x: mousePos.x * -0.02, 
           y: mousePos.y * -0.02,
           rotate: mousePos.x * 0.05
        }}
        transition={{ type: "spring", stiffness: 40, damping: 20 }}
      >
         <div className="absolute inset-0 border border-mystic-400/20 rounded-full border-dashed animate-spin-slow" />
         <div className="absolute inset-8 border border-mystic-300/20 rounded-full border-dotted animate-spin-slow-reverse" />
         <div className="w-[120%] h-px bg-mystic-500/20 absolute" />
         <div className="h-[120%] w-px bg-mystic-500/20 absolute" />
      </motion.div>

      <motion.div 
        className="absolute bottom-16 right-16 flex flex-col items-end gap-1 font-mono text-[10px] text-mystic-300 opacity-60 lg:opacity-100"
        animate={{ 
           x: (mousePos.x - (typeof window !== 'undefined' ? window.innerWidth : 1000)) * 0.03, 
           y: (mousePos.y - (typeof window !== 'undefined' ? window.innerHeight : 1000)) * 0.03 
        }}
        transition={{ type: "spring", stiffness: 30, damping: 15 }}
      >
         <div className="w-[150px] h-[1px] bg-gradient-to-r from-transparent to-mystic-400/50 mb-3" />
         {[...Array(6)].map((_, i) => (
           <div key={i} className="flex gap-4">
             <span className="opacity-40">SYS_{1000 + i * 42}</span>
             <motion.span 
               animate={{ opacity: [0.3, 1, 0.3] }} 
               transition={{ duration: 1.5 + Math.random() * 2, repeat: Infinity }}
             >
               {Math.random().toString(16).substring(2, 10).toUpperCase()}
             </motion.span>
           </div>
         ))}
      </motion.div>
    </div>
  )
}

function MagicCursor() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isCursed, setIsCursed] = useState(false);

  useEffect(() => {
    const updateMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      const isPointer = window.getComputedStyle(target).cursor === 'none' && (
                        target.tagName.toLowerCase() === 'a' || 
                        target.tagName.toLowerCase() === 'button' ||
                        target.closest('a') !== null ||
                        target.closest('button') !== null);
      
      const cursedElement = target.closest('[data-cursed]');
      setIsCursed(cursedElement !== null);
      setIsHovering(isPointer);
    };
    window.addEventListener('mousemove', updateMouse);
    return () => window.removeEventListener('mousemove', updateMouse);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Core Star */}
      <motion.div
        className={`absolute w-2 h-2 rounded-full mix-blend-screen -ml-1 -mt-1 ${isCursed ? 'bg-red-500 shadow-[0_0_10px_2px_red]' : 'bg-white shadow-[0_0_10px_2px_#bc9cff]'}`}
        animate={{ x: mousePos.x, y: mousePos.y }}
        transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
      />
      {/* Outer Glow / Aura */}
      <motion.div
        className={`absolute rounded-full border flex items-center justify-center -ml-6 -mt-6 transition-colors ${
          isCursed 
            ? 'w-20 h-20 -ml-10 -mt-10 bg-red-900/40 border-red-500 shadow-[0_0_30px_red] rotate-45 scale-110' 
            : isHovering 
            ? 'w-16 h-16 -ml-8 -mt-8 bg-mystic-500/20 border-mystic-400/50 rotate-45 scale-110 shadow-[0_0_20px_#7b52d9]' 
            : 'w-12 h-12 rotate-0 scale-100 border-mystic-400/50'
        }`}
        animate={{ x: mousePos.x, y: mousePos.y }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.2 }}
      >
        {isCursed ? <Skull size={16} className="text-red-500 animate-pulse" /> : 
         isHovering ? <Diamond size={12} className="text-mystic-300 animate-pulse" /> : null}
      </motion.div>
    </div>
  );
}

function FloatingRunes() {
  const { level } = useContext(EffectsContext);
  const runes = ['ᚢ', 'ᚨ', 'ᚦ', 'ᚫ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚻ'];
  const [runeInstances] = useState(() => Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    char: runes[Math.floor(Math.random() * runes.length)],
    startX: `${Math.random() * 100}vw`,
    endX: `${Math.random() * 100}vw`,
    delay: Math.random() * 20,
    duration: 20 + Math.random() * 30,
  })));

  if (level === 'off') return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5 mix-blend-screen">
       {runeInstances.slice(0, level === 'low' ? 5 : 15).map((rune) => (
         <motion.div
           key={rune.id}
           className="absolute text-mystic-400 font-serif text-3xl md:text-5xl"
           initial={{ y: '100vh', x: rune.startX, rotate: 0 }}
           animate={{ 
             y: '-20vh', 
             rotate: 360,
             x: rune.endX
           }}
           transition={{ 
             duration: rune.duration, 
             repeat: Infinity, 
             ease: "linear",
             delay: rune.delay
           }}
         >
           {rune.char}
         </motion.div>
       ))}
    </div>
  );
}

function MysticParticles() {
  const { level } = useContext(EffectsContext);
  const [particles] = useState(() => Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 15}s`,
    duration: `${10 + Math.random() * 20}s`,
    size: `${Math.random() * 3 + 1}px`,
    opacity: Math.random() * 0.5 + 0.2,
  })));

  if (level === 'off') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.slice(0, level === 'low' ? 10 : 30).map((p) => (
        <div
          key={p.id}
          className="absolute bottom-[-10px] bg-mystic-300 rounded-full animate-particle mix-blend-screen shadow-[0_0_8px_#bc9cff]"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}

function GlobalBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[800px] h-[800px] bg-mystic-600/10 rounded-full blur-[150px]" />
      
      <motion.div
        className="absolute w-[600px] h-[600px] bg-mystic-500/15 rounded-full blur-[120px] z-0"
        animate={{
          x: mousePos.x - 300,
          y: mousePos.y - 300,
        }}
        transition={{ type: "tween", ease: "easeOut", duration: 0.5 }}
      />

      <MysticParticles />
      
      <div className="absolute inset-0 bg-gradient-to-t from-[#030108] via-[#030108]/80 to-transparent z-10 top-1/2" />
    </div>
  );
}

function Navigation() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { to: "/", label: "HOME" },
    { to: "/lore", label: "LORE" },
    { to: "/gallery", label: "GALLERY" },
    { to: "/relics", label: "RELICS" },
    { to: "/entities", label: "ENTITIES" },
    { to: "/rituals", label: "RITUALS" },
    { to: "/grimoire", label: "GRIMOIRE" },
    { to: "/games", label: "GAMES" }
  ];
  
  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#030108]/80 backdrop-blur-md border-b border-mystic-900' : 'bg-transparent'} py-6`}>
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 cursor-pointer group relative z-50">
            <div className="absolute -inset-4 bg-mystic-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative w-8 h-8 flex items-center justify-center text-mystic-400 group-hover:text-mystic-200 transition-colors">
              <Diamond size={24} className="absolute" />
              <div className="absolute w-12 h-12 bg-mystic-500/20 rounded-full blur-md" />
            </div>
            <span className="font-serif text-2xl tracking-widest text-white/90 text-glow">Mystic</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm tracking-[0.15em] font-medium text-white/70">
            {links.map(l => <NavLink key={l.to} to={l.to} current={location.pathname === l.to}>{l.label}</NavLink>)}
          </div>

          <div className="hidden md:flex items-center gap-6 text-white/60">
            <a href="#" className="hover:text-mystic-300 hover:drop-shadow-[0_0_10px_#bc9cff] transition-all"><Facebook size={18} /></a>
            <a href="#" className="hover:text-mystic-300 hover:drop-shadow-[0_0_10px_#bc9cff] transition-all"><Twitter size={18} /></a>
            <a href="#" className="hover:text-mystic-300 hover:drop-shadow-[0_0_10px_#bc9cff] transition-all"><Instagram size={18} /></a>
          </div>

          <button 
            className="md:hidden text-mystic-300 relative z-50 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#030108]/95 backdrop-blur-xl flex justify-center items-center flex-col pt-20"
          >
            <div className="flex flex-col items-center gap-8 text-lg tracking-[0.2em] font-medium text-white/80 pb-12">
               {links.map(l => (
                 <Link 
                   key={l.to} 
                   to={l.to} 
                   className={location.pathname === l.to ? 'text-mystic-300 text-glow' : 'hover:text-mystic-300'}
                   onClick={() => setIsMobileMenuOpen(false)}
                 >
                   {l.label}
                 </Link>
               ))}
               
               <div className="flex items-center gap-8 text-white/60 mt-8">
                  <a href="#" className="hover:text-mystic-300 hover:drop-shadow-[0_0_10px_#bc9cff] transition-all"><Facebook size={24} /></a>
                  <a href="#" className="hover:text-mystic-300 hover:drop-shadow-[0_0_10px_#bc9cff] transition-all"><Twitter size={24} /></a>
                  <a href="#" className="hover:text-mystic-300 hover:drop-shadow-[0_0_10px_#bc9cff] transition-all"><Instagram size={24} /></a>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ to, current, children }: { to: string, current: boolean, children: React.ReactNode }) {
  return (
    <Link to={to} className={`relative group flex flex-col items-center transition-colors ${current ? 'text-mystic-300' : 'hover:text-mystic-300'}`}>
      <span className={current ? 'text-glow' : ''}>{children}</span>
      {current && <Diamond size={8} className="text-mystic-400 absolute -bottom-4 animate-pulse opacity-100 drop-shadow-[0_0_8px_#bc9cff]" />}
      {!current && <Diamond size={8} className="text-mystic-500 absolute -bottom-4 opacity-0 group-hover:opacity-50 transition-opacity" />}
    </Link>
  );
}

function MagicCard({ icon, title, desc, delay, imageUrl }: { icon: React.ReactNode, title: string, desc: string, delay: number, imageUrl?: string }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [transformStyle, setTransformStyle] = useState({ rotateX: 0, rotateY: 0, scale: 1 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;

    setTransformStyle({ rotateX, rotateY, scale: 1.05 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle({ rotateX: 0, rotateY: 0, scale: 1 });
  };

  return (
    <div className="perspective-1000 w-full z-10" style={{ perspective: '1000px' }}>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay, type: "spring", bounce: 0.4 }}
        animate={{ 
           rotateX: transformStyle.rotateX, 
           rotateY: transformStyle.rotateY, 
           scale: transformStyle.scale 
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        className="glass-panel rounded-xl p-10 flex flex-col items-center text-center group cursor-pointer relative overflow-hidden preserve-3d"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {imageUrl && (
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
             <div className="absolute inset-0 bg-mystic-900/80 group-hover:bg-mystic-900/50 transition-colors duration-500 z-10" />
            <img onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop"; }} src={imageUrl} alt="" className="w-full h-full object-cover opacity-30 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700" />
          </div>
        )}

        <motion.div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"
          animate={{
            background: `radial-gradient(circle 250px at ${mousePos.x}px ${mousePos.y}px, rgba(123, 82, 217, 0.4), transparent 80%)`
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-br from-mystic-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
        
        <div 
          className="mb-8 relative animate-float inline-block z-30"
          style={{ transform: 'translateZ(30px)' }}
        >
          <div className="absolute inset-0 bg-mystic-500/50 blur-[30px] rounded-full scale-150 group-hover:bg-mystic-300/60 transition-colors duration-500" />
          <div className="relative z-10 drop-shadow-[0_0_20px_rgba(188,156,255,0.8)] group-hover:scale-110 transition-transform duration-500">
            {icon}
          </div>
        </div>
        <h3 
          className="font-serif tracking-[0.2em] text-lg mb-4 text-mystic-100 group-hover:text-white transition-colors group-hover:text-glow filter drop-shadow-lg z-30 relative"
          style={{ transform: 'translateZ(20px)' }}
        >{title}</h3>
        <p 
          className="text-mystic-200/60 font-light leading-relaxed group-hover:text-mystic-100 transition-colors relative z-30"
          style={{ transform: 'translateZ(10px)' }}
        >
          {desc}
        </p>
      </motion.div>
    </div>
  );
}

function Home() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const portalY = useTransform(scrollYProgress, [0, 1], ["-50%", "30%"]);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
      transition={{ duration: 0.8 }}
      className="relative z-10 flex flex-col"
    >
      <FloatingRunes />

      {/* Portal Background */}
      <motion.div 
        className="fixed top-1/2 right-[5%] w-[350px] md:w-[450px] h-[550px] md:h-[700px] rounded-[200px] portal-glow opacity-80 mix-blend-screen scale-110 lg:block hidden z-0 pointer-events-none"
        style={{ y: portalY }}
      >
        <div className="absolute inset-2 rounded-[200px] bg-mystic-800/20 border border-mystic-500/30 backdrop-blur-3xl overflow-hidden shadow-[inset_0_0_100px_#7b52d9]">
           <div className="absolute inset-0 bg-gradient-to-t from-mystic-900/90 via-transparent to-mystic-400/20" />
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-mystic-500/20 via-mystic-900/5 to-transparent blur-xl" />
           {/* Rotating Rings inside Portal */}
           <div className="absolute inset-4 border-[2px] border-mystic-400/30 rounded-[200px] animate-spin-slow" style={{ borderStyle: 'dashed' }} />
           <div className="absolute inset-8 border-[1px] border-mystic-300/20 rounded-[200px] animate-spin-slow-reverse" style={{ borderStyle: 'dotted' }} />
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.section 
        style={{ y: heroY, opacity: heroOpacity }}
        className="min-h-screen container mx-auto px-6 lg:px-12 flex flex-col justify-center pt-24 pb-12 relative z-10"
      >
        <div className="max-w-2xl relative">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-12 bg-mystic-500/50" />
            <Diamond size={10} className="text-mystic-400 animate-pulse" />
            <span className="text-mystic-300 text-xs md:text-sm tracking-[0.3em] uppercase font-semibold">
              The Journey Begins
            </span>
          </div>
          
          <h2 className="font-serif text-3xl md:text-5xl text-white/80 tracking-widest uppercase mb-2">
            Enter The
          </h2>
          <h1 className="font-serif text-7xl md:text-[130px] tracking-tighter leading-[0.85] text-transparent bg-clip-text bg-gradient-to-b from-white via-mystic-100 to-mystic-600 mb-10 pb-4 text-glow">
            MYSTIC
          </h1>
          
          <p className="text-mystic-100/60 text-lg md:text-xl font-light max-w-lg leading-relaxed mb-12 border-l border-mystic-500/30 pl-6">
            A realm beyond imagination. Step into a world where mystery and magic intertwine, waiting to be unleashed.
          </p>

          <Link to="/lore">
            <button className="group relative px-10 py-5 flex items-center justify-center overflow-hidden bg-mystic-900/40 backdrop-blur-md rounded-sm border border-mystic-600/50 hover:border-mystic-300 transition-all duration-500 hover:shadow-[0_0_30px_rgba(188,156,255,0.4)]">
              <div className="absolute inset-0 bg-mystic-500/10 group-hover:bg-mystic-400/30 transition-colors duration-500 blur-md" />
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-mystic-300 scale-100 group-hover:scale-150 transition-transform" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-mystic-300 scale-100 group-hover:scale-150 transition-transform" />
              <span className="relative font-serif text-sm tracking-[0.4em] font-bold text-mystic-100 group-hover:text-white drop-shadow-[0_0_8px_rgba(157,124,244,0.8)] group-hover:text-glow flex items-center gap-4">
                EXPLORE LORE <ArrowRight size={16} className="group-hover:translate-x-2 group-hover:scale-110 transition-transform" />
              </span>
            </button>
          </Link>
        </div>
      </motion.section>

      {/* Cinematic Info Section */}
      <section className="min-h-screen py-32 container mx-auto px-6 lg:px-12 flex items-center relative z-10 bg-[#030108]/40 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
          >
            <h3 className="font-serif text-4xl text-white mb-6 text-glow">Awaken The Ancient</h3>
            <p className="text-white/60 leading-loose text-lg mb-8">
              For millennia, the portal lay dormant in the shadowed valley of Aethelgard. Now, the leylines pulse with renewed energy.
              The mystic forces have awakened, bringing forth both untold power and ancient perils. Are you prepared to harness the void?
            </p>
            <ul className="space-y-4">
              {['Harness elemental magic', 'Discover forgotten artifacts', 'Confront shadows of the past'].map((li, i) => (
                <li key={i} className="flex items-center gap-4 text-mystic-200 group">
                  <Diamond size={12} className="text-mystic-500 group-hover:text-mystic-300 group-hover:animate-pulse transition-colors" /> 
                  <span className="group-hover:-translate-y-0.5 transition-transform">{li}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div 
            style={{ y: useTransform(scrollYProgress, [0.1, 0.7], ["20%", "-20%"]) }}
            className="relative h-[600px] w-full rounded-2xl glass-panel overflow-hidden border border-mystic-400/30 group hover:shadow-[0_0_50px_rgba(123,82,217,0.3)] transition-all duration-700"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1532453288672-3a27e9be1c4a?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-70 group-hover:scale-105 transition-all duration-1000 mix-blend-luminosity" />
            <div className="absolute inset-0 bg-gradient-to-t from-mystic-900/90 to-transparent group-hover:opacity-80 transition-opacity duration-1000" />
            <div className="absolute top-8 left-8 transition-opacity opacity-0 group-hover:opacity-100 duration-1000">
               <Eye size={48} className="text-mystic-300 animate-pulse drop-shadow-[0_0_20px_#bc9cff]" />
            </div>
            <div className="absolute bottom-8 left-8 transition-transform group-hover:-translate-y-2 duration-700">
              <span className="text-mystic-300 tracking-widest text-sm font-bold uppercase block mb-2 drop-shadow-[0_0_5px_#bc9cff]">Artifact #01</span>
              <span className="font-serif text-3xl text-white drop-shadow-[0_0_10px_#bc9cff]">The Void Prism</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Parallax Grid */}
      <motion.section 
        className="min-h-screen py-32 container mx-auto px-6 lg:px-12 flex flex-col justify-center relative z-10"
      >
        <div className="text-center mb-24">
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-4 text-glow">Mystic Attributes</h2>
          <div className="h-px w-24 bg-mystic-500/50 mx-auto relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-mystic-400 blur-sm rounded-full animate-pulse-slow" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <MagicCard 
            icon={<Gem className="w-10 h-10 text-mystic-200" />} 
            title="ANCIENT SECRETS" 
            desc="Uncover forgotten knowledge and hidden truths buried deep within the ruins." 
            delay={0}
            imageUrl="https://images.unsplash.com/photo-1623847844053-f72534575e14?q=80&w=800&auto=format&fit=crop"
          />
          <MagicCard 
            icon={<Sparkles className="w-10 h-10 text-mystic-200" />} 
            title="MYSTIC POWERS" 
            desc="Harness the energy of the unknown. Bend light and shadow to your will." 
            delay={0.2}
            imageUrl="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop"
          />
          <MagicCard 
            icon={<Sword className="w-10 h-10 text-mystic-200" />} 
            title="EPIC JOURNEY" 
            desc="Embark on an adventure beyond the realms. Face the ultimate trials." 
            delay={0.4}
            imageUrl="https://images.unsplash.com/photo-1508244229656-78fa23274be3?q=80&w=800&auto=format&fit=crop"
          />
        </div>
      </motion.section>
    </motion.div>
  );
}

function Lore() {
  const { scrollYProgress } = useScroll();
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
      transition={{ duration: 0.8 }}
      className="relative z-10 container mx-auto px-6 lg:px-12 pt-40 pb-24 min-h-screen"
    >
      <FloatingRunes />
      <motion.div style={{ y: titleY }} className="text-center mb-32 max-w-3xl mx-auto">
        <Compass className="w-16 h-16 text-mystic-400 mx-auto mb-6 animate-pulse drop-shadow-[0_0_15px_#bc9cff]" />
        <h1 className="font-serif text-5xl md:text-7xl mb-6 text-white text-transparent bg-clip-text bg-gradient-to-b from-white to-mystic-400 text-glow">Chronicles of the Void</h1>
        <p className="text-xl text-mystic-100/60 font-light drop-shadow-md">Read the ancient texts detailing the origin of the portals.</p>
      </motion.div>

      <div className="space-y-40">
        {[1, 2, 3].map((section, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className={`flex flex-col ${idx % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-16 items-center`}
          >
            <div className="w-full md:w-1/2">
              <div className="h-[400px] glass-panel rounded-2xl relative overflow-hidden group hover:shadow-[0_0_40px_rgba(123,82,217,0.3)] transition-shadow duration-700">
                <div className="absolute inset-0 bg-mystic-900/80 mix-blend-overlay group-hover:bg-mystic-900/40 transition-colors duration-1000 z-10" />
                <img onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop"; }} src={`https://images.unsplash.com/photo-${['1509315811345-67126ab572bf', '1506509659345-3db392762295', '1478147427282-58a87a120781'][idx]}?q=80&w=1200&auto=format&fit=crop`} alt="Lore visual" className="w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-90 transition-all duration-1000" />
              </div>
            </div>
            <div className="w-full md:w-1/2">
               <span className="text-mystic-300 font-bold tracking-widest text-sm mb-4 block drop-shadow-[0_0_5px_#bc9cff]">CHAPTER 0{idx + 1}</span>
               <h2 className="font-serif text-3xl md:text-5xl text-white mb-6 group cursor-default">
                  <span className="group-hover:text-glow transition-all duration-300">The {['Summoning', 'Fracture', 'Convergence'][idx]}</span>
               </h2>
               <p className="text-mystic-200/70 leading-loose text-lg">
                 Beneath the cosmic currents and shifting stellar plains, an entity not entirely known to the ancient scryers began to stir. The leylines, once flowing with bright astral energy, took on a deeper, resonant purple hue. It was the first sign.
               </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function Gallery() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
      transition={{ duration: 0.8 }}
      className="relative z-10 container mx-auto px-6 lg:px-12 pt-40 pb-24 min-h-screen flex flex-col items-center"
    >
      <FloatingRunes />
      <h1 className="font-serif text-5xl text-center mb-16 text-white text-transparent bg-clip-text bg-gradient-to-r from-mystic-200 via-white to-mystic-500 text-glow">Visual Archives</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {[
          '1509315579644-8d9e26ea4526', '1542382257-80da9fb9f5abc', 
          '1462331940025-496dfbfc7564', '1506509659345-3db392762295', 
          '1504311029279-bf738e4a9e9e', '1478147427282-58a87a120781'
        ].map((imgUrl, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.1, type: "spring", stiffness: 100 }}
            className="h-72 glass-panel rounded-xl overflow-hidden relative group cursor-pointer border border-mystic-600/30 hover:border-mystic-400 hover:shadow-[0_0_30px_rgba(188,156,255,0.4)] transition-all duration-500"
          >
             <div className="absolute inset-0 bg-mystic-800/40 group-hover:bg-transparent transition-colors duration-500 z-10" />
             <img onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop"; }} 
              src={`https://images.unsplash.com/photo-${imgUrl}?q=80&w=800&auto=format&fit=crop`} 
              alt="Gallery item"
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
             />
             <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 bg-gradient-to-t from-mystic-900/90 via-mystic-900/20 to-transparent translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <Diamond size={16} className="text-mystic-300 mb-2 animate-pulse" />
                <span className="text-white font-serif tracking-[0.2em] text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Vision 0{i + 1}</span>
             </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function Relics() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
      transition={{ duration: 0.8 }}
      className="relative z-10 container mx-auto px-6 lg:px-12 pt-40 pb-24 min-h-screen flex flex-col items-center"
    >
      <FloatingRunes />
      <h1 className="font-serif text-5xl text-center mb-16 text-white text-transparent bg-clip-text bg-gradient-to-r from-mystic-200 via-white to-mystic-500 text-glow">
        Ancient Relics
      </h1>
      <p className="text-mystic-200/70 max-w-2xl text-center mb-16 text-lg leading-relaxed">
        Artifacts retrieved from the deepest tears in the void. Each harbors an echo of the forgotten ones. Handle with care, for looking too deeply may invite them in.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 w-full max-w-7xl">
        {[
          { name: "The Howling Stone", img: "1623847844053-f72534575e14", desc: "A crystalline structure that constantly vibrates with unheard frequencies." },
          { name: "Void Prism", img: "1532453288672-3a27e9be1c4a", desc: "Traps light and slowly releases it as pure, unadulterated madness." },
          { name: "Shattered Crown", img: "1462331940025-496dfbfc7564", desc: "Worn by the first king who realized the physical realm was a cage." }
        ].map((relic, i) => (
          <motion.div
            key={relic.name}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.15 }}
            className="flex flex-col items-center group cursor-crosshair"
          >
            <div className="w-full h-[400px] rounded-t-full rounded-b-xl overflow-hidden relative mb-6 glass-panel border border-mystic-500/30">
               <div className="absolute inset-0 bg-mystic-900/60 mix-blend-overlay group-hover:bg-mystic-900/20 transition-colors duration-1000 z-10" />
               <img onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop"; }} src={`https://images.unsplash.com/photo-${relic.img}?q=80&w=800&auto=format&fit=crop`} alt={relic.name} className="w-full h-full object-cover opacity-70 group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000 origin-bottom" />
               <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#030108] to-transparent z-20" />
            </div>
            <h3 className="font-serif text-2xl text-mystic-100 mb-3 tracking-widest text-glow group-hover:text-white transition-colors">{relic.name}</h3>
            <p className="text-mystic-300/60 text-center text-sm leading-loose px-4 group-hover:text-mystic-200 transition-colors">{relic.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function Entities() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
      transition={{ duration: 0.8 }}
      className="relative z-10 container mx-auto px-6 lg:px-12 pt-40 pb-24 min-h-screen"
    >
      <FloatingRunes />
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-5xl md:text-6xl text-center mb-6 text-white text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-mystic-400 to-red-900 text-glow">
          The Awakened
        </h1>
        <p className="text-red-400/50 text-center mb-24 tracking-[0.3em] uppercase text-sm">Do not speak their names</p>

        <div className="space-y-32">
          {[
            { tag: "ENTITY 01", name: "The Watcher in the Woods", img: "1478147427282-58a87a120781", align: "left" },
            { tag: "ENTITY 02", name: "The Night Terror", img: "1506509659345-3db392762295", align: "right" },
            { tag: "ENTITY 03", name: "Mother of the Void", img: "1542382257-80da9fb9f5abc", align: "left" },
          ].map((entity, i) => (
            <motion.div 
              key={entity.tag}
              initial={{ opacity: 0, x: entity.align === 'left' ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, type: "spring" }}
              className={`flex flex-col md:flex-row gap-12 items-center ${entity.align === 'right' ? 'md:flex-row-reverse' : ''}`}
            >
               <div className="w-full md:w-1/2">
                 <div className="relative aspect-square md:aspect-[4/5] rounded-lg overflow-hidden glass-panel group shadow-[0_0_50px_rgba(255,0,0,0.1)] hover:shadow-[0_0_50px_rgba(255,0,0,0.3)] transition-all duration-700">
                    <img onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop"; }} src={`https://images.unsplash.com/photo-${entity.img}?q=80&w=1200&auto=format&fit=crop`} alt={entity.name} className="w-full h-full object-cover opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-1000 filter sepia-[0.3] hue-rotate-[250deg] saturate-200" />
                    <div className="absolute inset-0 bg-gradient-to-t from-red-950/80 to-transparent mix-blend-multiply" />
                 </div>
               </div>
               <div className={`w-full md:w-1/2 flex flex-col ${entity.align === 'right' ? 'md:items-end md:text-right' : 'md:items-start md:text-left'} items-center text-center`}>
                  <span className="text-red-500/80 tracking-widest text-xs font-mono mb-4 border border-red-500/30 px-3 py-1 rounded-full">{entity.tag}</span>
                  <h2 className="font-serif text-4xl lg:text-5xl text-mystic-100 mb-6 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">{entity.name}</h2>
                  <p className="text-mystic-200/60 leading-loose text-lg">
                    Witness statements are heavily redacted. It is said that when you feel the temperature drop, and the shadows lengthen towards the center of the room, they have already found you. What remains is only the silence they leave behind.
                  </p>
               </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Rituals() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
      transition={{ duration: 0.8 }}
      className="relative z-10 container mx-auto px-6 lg:px-12 pt-40 pb-24 min-h-screen"
    >
      <FloatingRunes />
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-5xl md:text-6xl text-center mb-6 text-white text-transparent bg-clip-text bg-gradient-to-r from-mystic-300 to-mystic-600 text-glow">
          Sacred Rituals
        </h1>
        <p className="text-mystic-300/50 text-center mb-24 tracking-[0.3em] uppercase text-sm">To bind the unseen</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[
            {
               title: "The Binding of Shadows",
               img: "1534447677768-be436bb09401",
               desc: "Requires the crushed stone of the Void Prism. Best performed under a blood moon."
            },
            {
               title: "Ethereal Communion",
               img: "1518709268805-4e9042af9f23",
               desc: "Allows the caster to glimpse into the spirit realm without leaving the physical one."
            },
            {
               title: "Summoning of Light",
               img: "1509315579644-8d9e26ea4526",
               desc: "A beacon in the dark. Banishes lesser entities and seals minor rifts."
            },
            {
               title: "Blood Pact",
               img: "1462331940025-496dfbfc7564",
               desc: "An advanced contract. Do not attempt without adequate protection."
            }
          ].map((ritual, i) => (
            <motion.div
              key={ritual.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="glass-panel p-6 rounded-2xl flex flex-col group cursor-pointer border border-mystic-500/20 hover:border-mystic-400 transition-colors duration-500"
            >
               <div className="w-full h-64 rounded-xl overflow-hidden mb-6 relative">
                  <div className="absolute inset-0 bg-mystic-900/40 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <img onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop"; }} src={`https://images.unsplash.com/photo-${ritual.img}?q=80&w=800&auto=format&fit=crop`} alt={ritual.title} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000" />
               </div>
               <h3 className="font-serif text-2xl text-mystic-100 mb-3">{ritual.title}</h3>
               <p className="text-mystic-200/60 leading-relaxed font-light">{ritual.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Grimoire() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
      transition={{ duration: 0.8 }}
      className="relative z-10 container mx-auto px-6 lg:px-12 pt-40 pb-24 min-h-screen"
    >
      <FloatingRunes />
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="font-serif text-5xl md:text-6xl text-center mb-6 text-white text-transparent bg-clip-text bg-gradient-to-t from-mystic-600 to-white text-glow">
          The Lost Grimoire
        </h1>
        <p className="text-mystic-100/60 leading-relax text-lg mb-16">
          Pages scattered across the multi-verse. Reconstructed from fragments found near the ancient ley-lines.
        </p>

        <div className="flex justify-center mb-16">
           <div className="w-full max-w-lg aspect-[3/4] glass-panel rounded-lg p-10 flex flex-col items-center justify-center relative overflow-hidden group cursor-text text-left border border-amber-900/30">
              <div className="absolute inset-0 bg-[#120a05]/80 z-0" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] mix-blend-overlay opacity-30 z-0" />
              
              <div className="relative z-10 w-full">
                 <h2 className="font-serif text-3xl text-amber-200/80 mb-6 text-center border-b border-amber-900/50 pb-4">Invocation IV</h2>
                 <p className="text-amber-100/60 font-serif leading-loose mb-6">
                    "When the three moons align and the sky turns the color of bruised flesh, the veil is at its thinnest. Speak the ancient words..."
                 </p>
                 <p className="font-mono text-amber-500/40 text-sm mb-6 text-center tracking-widest uppercase">
                    [Redacted for safety]
                 </p>
                 <p className="text-amber-100/60 font-serif leading-loose">
                    "Only then will the path be clear. But do not look towards the edges, for they are waiting."
                 </p>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

function MysticGames() {
  const [selectedRunes, setSelectedRunes] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  
  const [pendulumState, setPendulumState] = useState<'idle' | 'swinging' | 'answered'>('idle');
  const [pendulumAnswer, setPendulumAnswer] = useState('');

  const [tarotSelected, setTarotSelected] = useState<number | null>(null);
  const [tarotFlipped, setTarotFlipped] = useState(false);
  const tarotCards = useMemo(() => [
    { title: "The Fool", img: "1509315811345-67126ab572bf", desc: "A foolish step into the dark." },
    { title: "The Tower", img: "1462331940025-496dfbfc7564", desc: "Destruction is inevitable." },
    { title: "Death", img: "1542382257-80da9fb9f5abc", desc: "The end of all things." },
    { title: "The Devil", img: "1506509659345-3db392762295", desc: "Bound by chains you cannot see." },
    { title: "The Moon", img: "1532453288672-3a27e9be1c4a", desc: "Illusions and fear." },
  ].sort(() => Math.random() - 0.5).slice(0, 3), []);

  const [whisperMessage, setWhisperMessage] = useState('');
  const [isWhispering, setIsWhispering] = useState(false);
  
  const handleTarotClick = (index: number) => {
    if (tarotSelected !== null) return;
    setTarotSelected(index);
    setTimeout(() => {
       setTarotFlipped(true);
    }, 300);
  };
  
  const resetTarot = () => {
     setTarotFlipped(false);
     setTimeout(() => {
        setTarotSelected(null);
     }, 500);
  };

  const startWhispering = () => {
    if (isWhispering) return;
    setIsWhispering(true);
    setWhisperMessage('');
    const scaryMessages = [
        "BEHIND YOU",
        "DON'T LOOK",
        "IT SEES YOU",
        "TOO LATE",
        "RUN"
    ];
    const targetMsg = scaryMessages[Math.floor(Math.random() * scaryMessages.length)];
    let idx = 0;
    
    const interval = setInterval(() => {
       if (idx <= targetMsg.length) {
           setWhisperMessage(targetMsg.substring(0, idx));
           idx++;
       } else {
           clearInterval(interval);
           setTimeout(() => {
               setIsWhispering(false);
               setWhisperMessage('');
           }, 4000);
       }
    }, 200);
  };

  const runes = useMemo(() => [
    { char: 'ᚢ', name: 'Ur', desc: 'A journey awaits, though not in the physical realm.' },
    { char: 'ᚨ', name: 'Ansuz', desc: 'The watcher has noticed you. Tread carefully.' },
    { char: 'ᚦ', name: 'Thurisaz', desc: 'A hidden truth will soon reveal itself to you.' },
    { char: 'ᚫ', name: 'Aesc', desc: 'Chaos is impending. Prepare your mind.' },
    { char: 'ᚱ', name: 'Rad', desc: 'An ancient power slumbers within your blood.' },
    { char: 'ᚲ', name: 'Kenaz', desc: 'Do not trust the shadows you cast today.' },
    { char: 'ᚷ', name: 'Gyfu', desc: 'A sacrifice is required for the knowledge you seek.' },
    { char: 'ᚹ', name: 'Wynn', desc: 'The void speaks your name. Will you answer?' },
    { char: 'ᚻ', name: 'Hægl', desc: 'Time is an illusion that is about to break.' }
  ].sort(() => Math.random() - 0.5), []); 

  const handleRuneClick = (index: number) => {
    if (revealed || selectedRunes.includes(index) || selectedRunes.length >= 3) return;
    setSelectedRunes(prev => {
      const next = [...prev, index];
      if (next.length === 3) {
        setTimeout(() => setRevealed(true), 500);
      }
      return next;
    });
  };

  const resetRunes = () => {
    setRevealed(false);
    setSelectedRunes([]);
  };

  const askPendulum = () => {
    if (pendulumState === 'swinging') return;
    setPendulumState('swinging');
    setPendulumAnswer('');
    setTimeout(() => {
       const answers = [
          "YES", "NO", "UNCLEAR", "NEVER", "SOON", "DANGER"
       ];
       setPendulumAnswer(answers[Math.floor(Math.random() * answers.length)]);
       setPendulumState('answered');
    }, 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
      transition={{ duration: 0.8 }}
      className="relative z-10 container mx-auto px-6 lg:px-12 pt-40 pb-24 min-h-screen"
    >
      <FloatingRunes />
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        
        {/* Game 1: The Void's Oracle */}
        <div className="w-full mb-32 flex flex-col items-center">
          <h1 className="font-serif text-5xl md:text-6xl text-center mb-6 text-white text-transparent bg-clip-text bg-gradient-to-r from-mystic-400 to-red-600 text-glow">
            The Void's Oracle
          </h1>
          <p className="text-mystic-300/60 text-center mb-16 tracking-[0.2em] uppercase text-sm">
            Select three stones to hear its whisper
          </p>
          
          <div className="grid grid-cols-3 md:grid-cols-3 gap-6 md:gap-12 mb-16 perspective-1000">
            {runes.map((rune, i) => {
              const isSelected = selectedRunes.includes(i);
              const order = selectedRunes.indexOf(i);
              
              return (
                <motion.button
                  key={i}
                  onClick={() => handleRuneClick(i)}
                  className={`relative w-20 h-28 md:w-32 md:h-44 rounded-xl border flex items-center justify-center cursor-pointer transition-all duration-500 overflow-hidden ${isSelected ? 'border-red-500/50 shadow-[0_0_30px_rgba(220,38,38,0.3)] bg-red-950/30' : 'border-mystic-500/30 glass-panel hover:border-mystic-400 hover:shadow-[0_0_20px_rgba(188,156,255,0.2)]'}`}
                  animate={{
                     y: isSelected ? -20 : 0,
                     rotateY: isSelected ? 360 : 0,
                  }}
                  transition={{ duration: 0.8, type: 'spring' }}
                >
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20 mix-blend-overlay" />
                  <span className={`font-serif text-4xl md:text-6xl transition-colors duration-1000 ${isSelected ? 'text-red-400 text-glow drop-shadow-[0_0_10px_red]' : 'text-mystic-300'}`}>
                    {isSelected ? rune.char : '?'}
                  </span>
                  {isSelected && (
                    <div className="absolute top-2 right-2 text-xs font-mono text-red-500/50">
                      {order + 1}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {revealed && (
              <motion.div 
                 initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                 animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                 exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
                 transition={{ duration: 1 }}
                 className="w-full max-w-3xl glass-panel p-8 rounded-2xl border border-red-900/30 flex flex-col items-center gap-8 relative overflow-hidden"
              >
                 <div className="absolute inset-0 bg-red-950/10 z-0" />
                 <div className="relative z-10 w-full space-y-8">
                   {selectedRunes.map((runeIndex, idx) => (
                      <div key={idx} className="flex flex-col md:flex-row items-center gap-6 border-b border-white/5 pb-8 last:border-0 last:pb-0">
                         <div className="w-16 h-16 rounded-full border border-red-500/30 flex items-center justify-center shrink-0 bg-black/40 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                           <span className="font-serif text-3xl text-red-400 drop-shadow-[0_0_5px_red]">{runes[runeIndex].char}</span>
                         </div>
                         <div className="text-center md:text-left">
                           <h3 className="text-red-300 font-serif text-xl mb-2 tracking-widest">{runes[runeIndex].name}</h3>
                           <p className="text-mystic-200/70 font-light leading-relaxed">{runes[runeIndex].desc}</p>
                         </div>
                      </div>
                   ))}
                 </div>
                 
                 <button 
                   onClick={resetRunes}
                   className="relative z-10 mt-4 px-8 py-3 rounded-full border border-mystic-500/30 text-mystic-300 hover:text-white hover:border-mystic-400 hover:bg-mystic-900/50 transition-all font-mono tracking-widest text-sm"
                 >
                   CAST AGAIN
                 </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Game 2: The Pendulum */}
        <div className="w-full flex flex-col items-center">
          <h2 className="font-serif text-4xl md:text-5xl text-center mb-6 text-white text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-mystic-600 text-glow">
            The Pendulum's Answer
          </h2>
          <p className="text-blue-300/60 text-center mb-16 tracking-[0.2em] uppercase text-sm">
            Focus your mind on a yes or no question
          </p>

          <div className="relative h-[400px] w-full max-w-md flex flex-col items-center justify-start border-t border-mystic-500/20 pt-10">
             
             {/* Pivot point */}
             <div className="w-4 h-4 rounded-full bg-mystic-400 shadow-[0_0_10px_#bc9cff] absolute top-8" />
             
             {/* Pendulum Swing Animation */}
             <motion.div 
                className="flex flex-col items-center origin-top absolute top-10"
                initial={{ rotate: 0 }}
                animate={{
                   rotate: pendulumState === 'swinging' ? [0, 20, -20, 15, -15, 10, -10, 5, -5, 0] : 
                           pendulumState === 'answered' ? (pendulumAnswer === 'YES' ? [0, 45, 0] : [0, -45, 0]) : 0
                }}
                transition={{
                   duration: pendulumState === 'swinging' ? 3 : 1,
                   ease: "easeInOut",
                   times: pendulumState === 'swinging' ? [0, 0.1, 0.3, 0.5, 0.7, 0.8, 0.9, 0.95, 0.98, 1] : undefined
                }}
             >
                {/* Chain */}
                <div className="w-[2px] h-[200px] bg-gradient-to-b from-mystic-400 to-mystic-600/50" />
                {/* Bob */}
                <div className="w-12 h-16 clip-path-diamond bg-gradient-to-b from-blue-300 to-mystic-400 shadow-[0_0_20px_#bc9cff] relative">
                   <div className="absolute inset-1 clip-path-diamond bg-mystic-900/40" />
                </div>
             </motion.div>

             <div className="absolute bottom-10 flex flex-col items-center">
                 {pendulumState === 'answered' && (
                    <motion.div 
                       initial={{ opacity: 0, scale: 0.5 }}
                       animate={{ opacity: 1, scale: 1 }}
                       className="mb-8 font-serif text-4xl text-blue-300 text-glow tracking-widest"
                    >
                       {pendulumAnswer}
                    </motion.div>
                 )}

                 <button 
                   onClick={askPendulum}
                   disabled={pendulumState === 'swinging'}
                   className={`px-8 py-3 rounded-full border transition-all font-mono tracking-widest text-sm
                      ${pendulumState === 'swinging' 
                        ? 'border-mystic-500/10 text-mystic-500/30 cursor-not-allowed' 
                        : 'border-blue-500/30 text-blue-300 hover:text-white hover:border-blue-400 hover:bg-mystic-900/50 hover:shadow-[0_0_15px_rgba(96,165,250,0.4)]'
                      }
                   `}
                 >
                   {pendulumState === 'swinging' ? 'SEEKING...' : 'ASK QUESTION'}
                 </button>
             </div>
          </div>
         </div>

        {/* Game 3: The Cursed Tarot */}
        <div className="w-full mt-32 mb-32 flex flex-col items-center">
          <h2 className="font-serif text-4xl md:text-5xl text-center mb-6 text-white text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600 text-glow">
            Glimpse of Fate
          </h2>
          <p className="text-amber-300/60 text-center mb-16 tracking-[0.2em] uppercase text-sm">
            Draw a single card. Accept the consequences.
          </p>

          <div className="flex justify-center gap-4 md:gap-8 perspective-1000">
             {tarotCards.map((card, i) => {
                const isSelected = tarotSelected === i;
                const isNotSelected = tarotSelected !== null && tarotSelected !== i;
                return (
                  <motion.div
                     key={i}
                     onClick={() => handleTarotClick(i)}
                     className={`w-28 h-44 md:w-48 md:h-72 cursor-pointer preserve-3d relative transition-all duration-700 ${isNotSelected ? 'opacity-20 scale-90 blur-sm pointer-events-none' : ''}`}
                     animate={{
                         rotateY: isSelected && tarotFlipped ? 180 : 0,
                         y: isSelected && tarotFlipped ? -20 : 0,
                         scale: isSelected && tarotFlipped ? 1.1 : 1
                     }}
                     transition={{ duration: 1, type: "spring" }}
                  >
                     {/* Back of Card */}
                     <div className="absolute inset-0 backface-hidden bg-mystic-900 border-2 border-amber-900/50 rounded-xl overflow-hidden glass-panel hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-30 mix-blend-overlay" />
                         <div className="absolute inset-2 border border-amber-500/20 rounded-lg flex items-center justify-center">
                            <Eye className="text-amber-700/50 w-8 h-8" />
                         </div>
                     </div>
                     {/* Front of Card */}
                     <div className="absolute inset-0 backface-hidden bg-[#1a0f14] border-2 border-red-900/50 rounded-xl overflow-hidden glass-panel" style={{ transform: 'rotateY(180deg)' }}>
                         <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
                         <img onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop"; }} src={`https://images.unsplash.com/photo-${card.img}?q=80&w=400&fit=crop`} alt="Tarot" className="w-full h-full object-cover opacity-60 mix-blend-luminosity filter sepia" />
                         <div className="absolute bottom-4 left-0 right-0 z-20 text-center px-2">
                             <h4 className="text-red-400 font-serif text-lg tracking-widest text-glow mb-1">{card.title}</h4>
                             <p className="text-red-300/50 text-[10px] uppercase tracking-widest">{card.desc}</p>
                         </div>
                     </div>
                  </motion.div>
                )
             })}
          </div>

          <AnimatePresence>
             {tarotFlipped && (
                <motion.div
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0 }}
                   className="mt-12 flex flex-col items-center"
                >
                   <button 
                     onClick={resetTarot}
                     className="px-8 py-3 rounded-full border border-red-900/50 text-red-400 hover:text-white hover:border-red-500 hover:bg-red-900/30 transition-all font-mono tracking-widest text-sm"
                   >
                     CLOSE EYES
                   </button>
                </motion.div>
             )}
          </AnimatePresence>
        </div>

        {/* Game 4: The Whispering Board */}
        <div className="w-full mb-32 flex flex-col items-center">
          <h2 className="font-serif text-4xl md:text-5xl text-center mb-6 text-white text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-700 text-glow">
            Spirit Contact
          </h2>
          <p className="text-gray-400/60 text-center mb-16 tracking-[0.2em] uppercase text-sm">
            Touch the planchette to listen
          </p>
          
          <div className="relative w-full max-w-2xl h-64 md:h-80 glass-panel rounded-3xl border border-gray-600/30 overflow-hidden flex flex-col items-center justify-center p-8">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-20 mix-blend-overlay mix-blend-color-burn" />
             
             <div className="w-full flex justify-between font-serif text-2xl md:text-3xl text-gray-400/50 tracking-[0.5em] mb-auto drop-shadow-md z-0">
                 <span>YES</span>
                 <span>NO</span>
             </div>

             <div className="font-serif text-4xl md:text-6xl tracking-[0.2em] text-red-500 text-glow h-20 flex items-center justify-center z-10 pointer-events-none">
                 {whisperMessage}
             </div>

             <div className="w-full flex justify-center font-serif text-xl md:text-2xl text-gray-500/40 tracking-[0.2em] mt-auto z-0">
                 GOODBYE
             </div>

             {/* Planchette */}
             <motion.button 
                onClick={startWhispering}
                disabled={isWhispering}
                className="absolute z-10 w-24 h-32 clip-path-planchette bg-white/5 border-2 border-mystic-300/30 backdrop-blur-md flex items-center justify-center cursor-pointer hover:bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                animate={isWhispering ? {
                   x: [0, -60, 80, -30, 70, -90, 0],
                   y: [0, -40, 20, -50, 30, 40, 0],
                   rotate: [0, -15, 20, -10, 15, -20, 0]
                } : { x: 0, y: 0, rotate: 0 }}
                transition={{ duration: 4, ease: "easeInOut" }}
             >
                <div className="w-10 h-10 rounded-full border-2 border-white/20 mb-4 bg-black/20" />
             </motion.button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/lore" element={<Lore />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/relics" element={<Relics />} />
        <Route path="/entities" element={<Entities />} />
        <Route path="/rituals" element={<Rituals />} />
        <Route path="/grimoire" element={<Grimoire />} />
        <Route path="/games" element={<MysticGames />} />
      </Routes>
    </AnimatePresence>
  );
}

const WHISPERS = [
  "They are watching...",
  "Can you hear them?",
  "Don't look behind you",
  "The void hungers",
  "Awaken...",
  "It's too late",
  "Close your eyes",
  "Look closer",
  "Turn back",
  "It is inside you",
  "Shatter the glass"
];

function GhostlyApparitions() {
  const { level } = useContext(EffectsContext);
  const [apparitions, setApparitions] = useState<{id: number, x: number, y: number, img: string}[]>([]);
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);
  
  const images = [
    'https://images.unsplash.com/photo-1542382257-80da9fb9f5abc?q=80&w=800', 
    'https://images.unsplash.com/photo-1506509659345-3db392762295?q=80&w=800', 
    'https://images.unsplash.com/photo-1478147427282-58a87a120781?q=80&w=800', 
    'https://images.unsplash.com/photo-1509315811345-67126ab572bf?q=80&w=800', 
  ];

  useEffect(() => {
    if (level === 'off') return;
    let timeout: ReturnType<typeof setTimeout>;
    
    const handleScroll = (latest: number) => {
      const delta = Math.abs(latest - lastScrollY.current);
      if (delta > 20) {
         if (Math.random() > (level === 'low' ? 0.98 : 0.95) && apparitions.length === 0) {
             const id = Date.now();
             setApparitions([{
                 id,
                 x: Math.random() * 80 + 10,
                 y: Math.random() * 80 + 10,
                 img: images[Math.floor(Math.random() * images.length)]
             }]);
             timeout = setTimeout(() => {
                 setApparitions([]);
             }, 150 + Math.random() * 250); // Very brief flicker
         }
      }
      lastScrollY.current = latest;
    };
    
    const unsub = scrollY.on('change', handleScroll);
    return () => {
        unsub();
        clearTimeout(timeout);
    };
  }, [scrollY, apparitions.length, level]);

  if (level === 'off') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[6500] overflow-hidden mix-blend-screen opacity-50">
       <AnimatePresence>
         {apparitions.map(app => (
             <motion.div
                key={app.id}
                initial={{ opacity: 0, filter: 'contrast(300%) grayscale(100%) invert(100%) blur(10px)' }}
                animate={{ opacity: [0, 0.7, 0], filter: ['contrast(300%) grayscale(100%) invert(100%) blur(10px)', 'contrast(100%) grayscale(100%) invert(0%) blur(2px)', 'contrast(200%) grayscale(100%) invert(100%) blur(20px)'] }}
                transition={{ duration: 0.3, times: [0, 0.5, 1], ease: "easeInOut" }}
                className="absolute"
                style={{
                  left: `${app.x}%`,
                  top: `${app.y}%`,
                  width: '60vw',
                  height: '60vh',
                  transform: 'translate(-50%, -50%) rotate(' + (Math.random() * 10 - 5) + 'deg)',
                }}
             >
                <div 
                   className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat" 
                   style={{ 
                       backgroundImage: `url(${app.img})`,
                       maskImage: 'radial-gradient(circle at center, black 10%, transparent 60%)',
                       WebkitMaskImage: 'radial-gradient(circle at center, black 10%, transparent 60%)'
                   }} 
                />
             </motion.div>
         ))}
       </AnimatePresence>
    </div>
  )
}

function ScreenGlitch() {
   const { level } = useContext(EffectsContext);
   const [glitching, setGlitching] = useState(false);
   
   useEffect(() => {
       if (level === 'off') return;
       let timeoutId: ReturnType<typeof setTimeout>;
       const glitchLoop = () => {
           if (Math.random() > (level === 'low' ? 0.98 : 0.95)) {
               setGlitching(true);
               timeoutId = setTimeout(() => setGlitching(false), 50 + Math.random() * (level === 'low' ? 50 : 150));
           }
           timeoutId = setTimeout(glitchLoop, (level === 'low' ? 4000 : 2000) + Math.random() * 5000);
       };
       timeoutId = setTimeout(glitchLoop, 3000);
       return () => clearTimeout(timeoutId);
   }, [level]);
   
   if (!glitching || level === 'off') return null;
   
   return (
       <div className="fixed inset-0 z-[10000] pointer-events-none mix-blend-difference bg-white/20" style={{ backdropFilter: 'invert(1) hue-rotate(90deg) contrast(150%)', transform: `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)` }}>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/starnight.png')] opacity-60 mix-blend-overlay" />
       </div>
   );
}

function Whispers() {
  const [whisper, setWhisper] = useState({ text: '', x: 0, y: 0, active: false });

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    // Time-based whispers
    const interval = setInterval(() => {
      if (Math.random() > 0.7 && !whisper.active) {
         setWhisper({
            text: WHISPERS[Math.floor(Math.random() * WHISPERS.length)],
            x: Math.random() * 80 + 10,
            y: Math.random() * 80 + 10,
            active: true
         });
         timeoutId = setTimeout(() => setWhisper(prev => ({ ...prev, active: false })), 3000);
      }
    }, 4000);
    
    // Interaction-based whispers
    const handlePointerInfo = (e: MouseEvent) => {
        if (Math.random() > 0.99 && !whisper.active) {
            setWhisper({
                text: "I see you",
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100 - 10, // slightly above cursor
                active: true
            });
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => setWhisper(prev => ({ ...prev, active: false })), 2000);
        }
    };
    
    window.addEventListener('mousemove', handlePointerInfo);

    return () => {
        clearInterval(interval);
        window.removeEventListener('mousemove', handlePointerInfo);
        clearTimeout(timeoutId);
    };
  }, [whisper.active]);

  return (
    <AnimatePresence>
      {whisper.active && (
        <motion.div
           initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)', x: '-50%', y: '-50%' }}
           animate={{ 
               opacity: [0, 0.2, 0.4, 0.1, 0.5, 0], 
               scale: [0.9, 1, 1.05, 1, 1.2, 1.3], 
               filter: ['blur(10px)', 'blur(2px)', 'blur(0px)', 'blur(4px)', 'blur(1px)', 'blur(10px)'] 
           }}
           exit={{ opacity: 0, scale: 1.5, filter: 'blur(20px)', x: '-50%', y: '-50%' }}
           transition={{ duration: 1.5, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }}
           className="fixed pointer-events-none z-[100] font-serif text-3xl md:text-5xl text-red-700 mix-blend-screen tracking-[0.2em] uppercase italic whitespace-nowrap drop-shadow-[0_0_10px_rgb(220,38,38)]"
           style={{ left: `${whisper.x}%`, top: `${whisper.y}%` }}
        >
          {whisper.text}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CornerWebSVG() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full stroke-mystic-400/40 fill-transparent pointer-events-none" strokeWidth="0.5">
      <path d="M0,0 L100,0 M0,0 L90,30 M0,0 L70,60 M0,0 L35,85 M0,0 L0,100" />
      <path d="M20,0 Q18,10 15,13 Q10,18 0,20" />
      <path d="M40,0 Q36,20 30,26 Q20,36 0,40" />
      <path d="M60,0 Q54,30 45,39 Q30,54 0,60" />
      <path d="M80,0 Q72,40 60,52 Q40,72 0,80" />
      <path d="M100,0 Q90,50 75,65 Q50,90 0,100" />
    </svg>
  );
}

function CenterWebSVG() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full stroke-mystic-400/40 fill-transparent pointer-events-none drop-shadow-[0_0_5px_rgba(188,156,255,0.5)]" strokeWidth="0.5">
      <path d="M50,50 L50,0 M50,50 L85,15 M50,50 L100,50 M50,50 L85,85 M50,50 L50,100 M50,50 L15,85 M50,50 L0,50 M50,50 L15,15" strokeDasharray="2,1" />
      <path d="M50,30 Q60,35 64,36 Q70,45 70,50 Q65,60 64,64 Q55,70 50,70 Q40,65 36,64 Q30,55 30,50 Q35,40 36,36 Q45,30 50,30" />
      <path d="M50,15 Q65,22 75,25 Q82,35 85,50 Q78,65 75,75 Q65,82 50,85 Q35,78 25,75 Q18,65 15,50 Q22,35 25,25 Q35,18 50,15" />
      <path d="M50,0 Q70,10 85,15 Q90,30 100,50 Q90,70 85,85 Q70,90 50,100 Q30,90 15,85 Q10,70 0,50 Q10,30 15,15 Q30,10 50,0" />
    </svg>
  );
}

function MagicalSigils() {
  const { level } = useContext(EffectsContext);
  const [sigils, setSigils] = useState<{id: number, x: number, y: number, r: number, size: number}[]>([]);

  useEffect(() => {
    if (level === 'off') return;
    const interval = setInterval(() => {
        if (Math.random() > (level === 'low' ? 0.9 : 0.7)) {
            const id = Date.now();
            setSigils(prev => [...prev, {
                id,
                x: Math.random() * 80 + 10,
                y: Math.random() * 80 + 10,
                r: Math.random() * 360,
                size: Math.random() * 200 + 100
            }]);
            setTimeout(() => {
                setSigils(prev => prev.filter(s => s.id !== id));
            }, 6000);
        }
    }, 2000);
    return () => clearInterval(interval);
  }, [level]);

  if (level === 'off') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden mix-blend-screen">
      <AnimatePresence>
        {sigils.map(s => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, scale: 0.8, rotate: s.r - 45 }}
            animate={{ opacity: [0, 0.2, 0.4, 0], scale: 1, rotate: s.r + 45 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 6, ease: "easeInOut", times: [0, 0.2, 0.8, 1] }}
            className="absolute rounded-full flex items-center justify-center opacity-30 drop-shadow-[0_0_8px_rgba(188,156,255,0.4)]"
            style={{ 
               left: `${s.x}vw`, 
               top: `${s.y}vh`, 
               width: s.size, 
               height: s.size, 
               marginLeft: -s.size/2, 
               marginTop: -s.size/2 
            }}
          >
             <svg viewBox="0 0 100 100" className="w-full h-full stroke-mystic-400/50 fill-transparent pointer-events-none" strokeWidth="0.5">
               <circle cx="50" cy="50" r="45" strokeDasharray="4 2" />
               <circle cx="50" cy="50" r="40" stroke="rgba(188,156,255,0.2)" />
               <polygon points="50,10 90,50 50,90 10,50" />
               <polygon points="50,15 85,50 50,85 15,50" strokeDasharray="1 3" />
               <path d="M50,10 Q60,50 50,90 Q40,50 50,10" />
               <path d="M10,50 Q50,60 90,50 Q50,40 10,50" />
               <circle cx="50" cy="50" r="10" />
               <circle cx="50" cy="50" r="2" fill="rgba(188,156,255,0.8)" />
             </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

function EnergyLines() {
  const { level } = useContext(EffectsContext);
  
  if (level === 'off') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden mix-blend-screen opacity-20">
      <svg className="w-full h-[200vh] absolute top-[-50vh] left-0">
         <defs>
            <linearGradient id="energyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
               <stop offset="0%" stopColor="transparent" />
               <stop offset="50%" stopColor="rgba(188,156,255,0.6)" />
               <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <linearGradient id="energyGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
               <stop offset="0%" stopColor="transparent" />
               <stop offset="50%" stopColor="rgba(220,38,38,0.4)" />
               <stop offset="100%" stopColor="transparent" />
            </linearGradient>
         </defs>

         <motion.path 
            d="M 0,200 Q 300,500 800,100 T 1600,600" 
            fill="none" 
            stroke="url(#energyGrad)" 
            strokeWidth="1"
            initial={{ strokeDasharray: "200 2000", strokeDashoffset: 2200 }}
            animate={{ strokeDashoffset: -2200 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
         />
         
         {level === 'high' && (
           <motion.path 
              d="M 1600,300 Q 1000,800 500,200 T -200,900" 
              fill="none" 
              stroke="url(#energyGrad2)" 
              strokeWidth="1"
              initial={{ strokeDasharray: "300 2500", strokeDashoffset: 2800 }}
              animate={{ strokeDashoffset: -2800 }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear", delay: 5 }}
           />
         )}
      </svg>
    </div>
  )
}

function SpookyLayer() {
  const [jumpscare, setJumpscare] = useState(false);
  const [spiders, setSpiders] = useState<{id: number, x: number}[]>([]);
  const [hagImage] = useState('https://images.unsplash.com/photo-1542382257-80da9fb9f5abc?q=80&w=1200');
  const [webs, setWebs] = useState<{id: number, x: number, y: number, rot: number, size: number}[]>([]);

  useEffect(() => {
    let spiderCount = 0;
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < window.innerHeight * 0.2) {
         if (Math.random() > 0.97 && spiders.length < 3) {
            const id = spiderCount++;
            setSpiders(prev => [...prev, { id, x: e.clientX }]);
            setTimeout(() => {
               setSpiders(prev => prev.filter(s => s.id !== id));
            }, 4000); 
         }
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [spiders]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a') || target.closest('button')) return;
      
      const id = Date.now();
      setWebs(prev => [...prev, { 
         id, 
         x: e.clientX, 
         y: e.clientY,
         rot: Math.random() * 360,
         size: Math.random() * 80 + 120 
      }]);
      setTimeout(() => setWebs(prev => prev.filter(w => w.id !== id)), 6000);
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const triggerJumpscare = () => {
    if (jumpscare) return;
    setJumpscare(true);
    document.body.classList.add('animate-shake');
    setTimeout(() => {
      setJumpscare(false);
      document.body.classList.remove('animate-shake');
    }, 850);
  };

  return (
    <>
      <Whispers />
      
      <AnimatePresence>
        {webs.map(web => (
          <motion.div
            key={web.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.6, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(5px)' }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="fixed pointer-events-none z-[7500] mix-blend-screen"
            style={{ 
              left: web.x, 
              top: web.y, 
              width: web.size, 
              height: web.size,
              marginLeft: -web.size/2,
              marginTop: -web.size/2,
              rotate: `${web.rot}deg` 
            }}
          >
            <CenterWebSVG />
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div 
         animate={{ opacity: [0.05, 0.3, 0.05] }}
         transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
         className="fixed top-0 left-0 w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] pointer-events-none z-[7000] mix-blend-screen opacity-30"
      >
         <CornerWebSVG />
      </motion.div>
      <motion.div 
         animate={{ opacity: [0.1, 0.4, 0.1] }}
         transition={{ duration: 16, delay: 5, repeat: Infinity, ease: "easeInOut" }}
         className="fixed bottom-0 right-0 w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] pointer-events-none z-[7000] mix-blend-screen opacity-40 scale-x-[-1] scale-y-[-1]"
      >
         <CornerWebSVG />
      </motion.div>

      <div className="fixed inset-0 pointer-events-none z-[8000] overflow-hidden">
         {spiders.map(spider => (
           <div 
             key={spider.id}
             className="absolute top-0 w-16 pointer-events-none flex flex-col items-center animate-spider filter drop-shadow-[0_0_15px_#bc9cff]"
             style={{ left: spider.x - 32 }}
           >
             <div className="w-[2px] h-[40vh] bg-mystic-500/50 shadow-[0_0_5px_#bc9cff] opacity-40 mix-blend-screen" />
             <div className="text-4xl -mt-2 rotate-180 drop-shadow-2xl">🕷️</div>
             <div className="absolute w-[100px] h-[100px] opacity-20 -z-10" style={{
                background: 'radial-gradient(circle, rgba(188,156,255,0.4) 0%, transparent 70%)'
             }} />
           </div>
         ))}
      </div>

      {jumpscare && (
        <div className="fixed inset-0 z-[99999] pointer-events-none flex items-center justify-center animate-jumpscare bg-black/90 mix-blend-difference overflow-hidden">
          <img src={hagImage} alt="Hag" className="w-[120vw] h-[120vh] object-cover mix-blend-color-dodge filter contrast-200 hue-rotate-90 saturate-200" />
          <div className="absolute inset-0 bg-red-900/50 mix-blend-overlay" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/starnight.png')] opacity-50 mix-blend-screen" />
        </div>
      )}

      <img src="https://images.unsplash.com/photo-1533261250266-9e90bd0d2208?q=80&w=800" className="fixed top-[-50px] left-[-50px] w-[500px] opacity-[0.15] mix-blend-screen pointer-events-none z-[50]" style={{ objectPosition: 'top left', objectFit: 'cover' }} />
      <img src="https://images.unsplash.com/photo-1533261250266-9e90bd0d2208?q=80&w=800" className="fixed top-[-50px] right-[-50px] w-[500px] opacity-[0.15] mix-blend-screen pointer-events-none z-[50] transform -scale-x-100" style={{ objectPosition: 'top left', objectFit: 'cover' }} />

      <div 
        data-cursed="true"
        className="fixed bottom-10 left-10 z-[500] w-16 h-16 flex items-center justify-center group cursor-none"
        onMouseEnter={() => {
           setTimeout(triggerJumpscare, 400);
        }}
      >
         <div className="absolute inset-0 bg-red-900/10 rounded-full blur-xl animate-pulse group-hover:bg-red-600/60 transition-colors duration-300" />
         
         <div className="absolute w-[200px] h-[200px] opacity-20 pointer-events-none mix-blend-screen -z-10 group-hover:opacity-60 transition-opacity">
            <CenterWebSVG />
         </div>

         <div className="relative font-serif text-mystic-900 group-hover:text-red-500 transition-colors duration-300 flex flex-col items-center gap-1 opacity-20 group-hover:opacity-100 group-hover:scale-125 transform">
            <Skull size={24} className="animate-pulse drop-shadow-[0_0_10px_red]" />
            <span className="text-[10px] tracking-[0.3em] font-black uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-[0_0_5px_red]">Do Not Wake</span>
         </div>
      </div>
    </>
  );
}

export default function App() {
  const [effectsLevel, setEffectsLevel] = useState<EffectsLevel>('high');

  return (
    <EffectsContext.Provider value={{ level: effectsLevel, setLevel: setEffectsLevel }}>
      <Router>
        <div className="bg-[#030108] text-white font-sans selection:bg-mystic-500/30 min-h-screen">
          <GlobalBackground />
          <EnergyLines />
          <MagicalSigils />
          <HolographicGrid />
          <CinematicHUD />
          <GhostlyApparitions />
          <ScreenGlitch />
          <SpookyLayer />
          <MagicCursor />
          <Navigation />
          <AnimatedRoutes />
          <EffectsToggle />
        </div>
      </Router>
    </EffectsContext.Provider>
  );
}
