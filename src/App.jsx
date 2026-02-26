import { useState, useEffect, useRef } from "react";
import { ChevronDown, CheckCircle, Menu, X, Zap, Brain, BarChart3, MessageSquare, TrendingUp, ArrowRight, ChevronLeft, ChevronRight, Lock, MessageCircle, Calculator, Cpu, Globe, Layers } from "lucide-react";

/* ─── Paleta ─── */
const C = {
  primary: "#22d3ee",     // cyan-400
  primaryDark: "#0891b2", // cyan-600
  primaryGlow: "rgba(34,211,238,0.15)",
  primaryLine: "rgba(34,211,238,0.25)",
  bg: "#020817",
  bgCard: "#0a1628",
  bgCardHover: "#0d1f38",
};

/* ─── Vortex canvas ─── */
const Vortex = () => {
  const ref = useRef(null);
  const animRef = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    c.width = c.offsetWidth; c.height = c.offsetHeight;
    const cx = c.width / 2, cy = c.height / 2;
    let t = 0;
    const rings = 6, dotsPerRing = 18;
    function draw() {
      ctx.clearRect(0, 0, c.width, c.height);
      t += 0.004;
      for (let r = 0; r < rings; r++) {
        const radius = 60 + r * 55;
        const speed = (r % 2 === 0 ? 1 : -1) * (0.6 + r * 0.1);
        const alpha = 0.08 + r * 0.04;
        for (let d = 0; d < dotsPerRing; d++) {
          const angle = (d / dotsPerRing) * Math.PI * 2 + t * speed;
          const x = cx + Math.cos(angle) * radius;
          const y = cy + Math.sin(angle) * radius * 0.35;
          const size = 1.5 + r * 0.3;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(34,211,238,${alpha})`;
          ctx.fill();
        }
        // ring line
        ctx.beginPath();
        ctx.ellipse(cx, cy, radius, radius * 0.35, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(34,211,238,${alpha * 0.5})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      // center glow
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80);
      grd.addColorStop(0, "rgba(34,211,238,0.18)");
      grd.addColorStop(1, "rgba(34,211,238,0)");
      ctx.beginPath(); ctx.arc(cx, cy, 80, 0, Math.PI * 2);
      ctx.fillStyle = grd; ctx.fill();
      animRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full" aria-hidden="true" />;
};

/* ─── Reveal ─── */
const Reveal = ({ children, delay = 0 }) => {
  const [v, setV] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setTimeout(() => setV(true), delay); }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);
  return <div ref={ref} className={`transition-all duration-700 ${v ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>{children}</div>;
};

/* ─── Counter ─── */
const Counter = ({ end, suffix = "" }) => {
  const [n, setN] = useState(0);
  const [v, setV] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!v) return;
    let s = 0; const inc = end / 120;
    const t = setInterval(() => { s += inc; if (s >= end) { setN(end); clearInterval(t); } else setN(Math.floor(s)); }, 16);
    return () => clearInterval(t);
  }, [v, end]);
  return <span ref={ref}>{n}{suffix}</span>;
};

/* ─── ROI Calc ─── */
const ROICalc = () => {
  const [emp, setEmp] = useState(10);
  const [hrs, setHrs] = useState(15);
  const [sal, setSal] = useState(3000);
  const saved = Math.round(emp * hrs * 0.65 * 4 * (sal / 160));
  const roi = Math.round((saved * 12 / 12000) * 100);
  const Sl = ({ label, val, min, max, step, fn, suf }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span style={{ color: "#94a3b8" }}>{label}</span>
        <span style={{ color: C.primary }} className="font-bold">{val}{suf}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={val} onChange={e => fn(+e.target.value)}
        style={{ accentColor: C.primary }} className="w-full h-1 rounded-full" />
    </div>
  );
  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
      <div style={{ background: C.bgCard, borderColor: C.primaryLine }} className="border rounded-xl p-8 space-y-7">
        <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: C.primary }}>
          <Calculator size={20} /> Configura tu empresa
        </h3>
        <Sl label="Empleados en tareas repetitivas" val={emp} min={1} max={100} step={1} fn={setEmp} suf=" personas" />
        <Sl label="Horas manuales por semana" val={hrs} min={1} max={40} step={1} fn={setHrs} suf=" hrs" />
        <Sl label="Salario mensual promedio" val={sal} min={500} max={10000} step={100} fn={setSal} suf=" USD" />
      </div>
      <div style={{ background: `linear-gradient(135deg, rgba(34,211,238,0.08), ${C.bgCard})`, borderColor: C.primaryLine }} className="border rounded-xl p-8 flex flex-col justify-center space-y-6">
        <h3 className="text-lg font-bold text-white">Tu ahorro estimado</h3>
        <div>
          <p style={{ color: "#64748b" }} className="text-xs uppercase tracking-widest mb-1">Ahorro mensual</p>
          <p className="text-4xl font-black" style={{ color: C.primary }}>${saved.toLocaleString()} <span className="text-base font-normal text-slate-400">USD/mes</span></p>
        </div>
        <div>
          <p style={{ color: "#64748b" }} className="text-xs uppercase tracking-widest mb-1">ROI anual estimado</p>
          <p className="text-4xl font-black text-white">{roi}%</p>
        </div>
        <p className="text-xs text-slate-600">*Basado en 65% de automatización promedio. Inversión base $12,000 USD.</p>
      </div>
    </div>
  );
};

/* ─── Testimonials ─── */
const Testimonials = () => {
  const [i, setI] = useState(0);
  const data = [
    { q: "Pasamos de responder en 4 horas a 28 segundos. El impacto en ventas fue inmediato.", a: "María González", r: "Directora de Operaciones" },
    { q: "Automatizamos 15 horas semanales. El equipo dejó de hacer tareas de robot.", a: "Carlos Ramírez", r: "CEO, Sector Logística" },
    { q: "El agente de IA maneja el 80% de consultas. Escalamos sin contratar más personas.", a: "Ana Martínez", r: "Gerente Comercial" }
  ];
  useEffect(() => { const t = setInterval(() => setI(p => (p + 1) % data.length), 6000); return () => clearInterval(t); }, []);
  return (
    <div className="max-w-3xl mx-auto">
      <div style={{ background: C.bgCard, borderColor: C.primaryLine }} className="border rounded-xl p-10">
        <div style={{ color: C.primary }} className="text-5xl font-black leading-none mb-6">"</div>
        <div className="min-h-[120px]">
          <p className="text-xl text-white font-medium leading-relaxed mb-8">{data[i].q}</p>
          <p style={{ color: C.primary }} className="font-bold">{data[i].a}</p>
          <p className="text-slate-500 text-sm">{data[i].r}</p>
        </div>
        <div className="flex items-center justify-between mt-8">
          <button onClick={() => setI(p => (p - 1 + data.length) % data.length)} style={{ background: "#0f172a" }} className="p-2 rounded-full hover:opacity-80"><ChevronLeft size={18} /></button>
          <div className="flex gap-2">{data.map((_, x) => <button key={x} onClick={() => setI(x)} style={{ background: x === i ? C.primary : "#1e293b" }} className={`h-1.5 rounded-full transition-all duration-300 ${x === i ? "w-8" : "w-2"}`} />)}</div>
          <button onClick={() => setI(p => (p + 1) % data.length)} style={{ background: "#0f172a" }} className="p-2 rounded-full hover:opacity-80"><ChevronRight size={18} /></button>
        </div>
      </div>
    </div>
  );
};

/* ─── FAQ ─── */
const FAQ = () => {
  const [open, setOpen] = useState(null);
  const items = [
    { q: "¿Cuánto tiempo toma implementar?", a: "2–3 semanas para proyectos simples. MVP funcional en la primera semana, siempre." },
    { q: "¿Necesito equipo técnico interno?", a: "No. Entregamos todo listo, con capacitación para tu equipo en interfaces sin código." },
    { q: "¿Qué tan segura es mi información?", a: "Encriptación E2E, datos en tus propios servidores, NDA en cada proyecto. Nunca usamos tu data para entrenar modelos." },
    { q: "¿Con qué sistemas se integran?", a: "HubSpot, Salesforce, WhatsApp Business, Google Workspace, Notion, ERPs y +200 herramientas vía API." },
    { q: "¿Ofrecen soporte después de lanzar?", a: "3 meses incluidos en todos los proyectos. Planes de mantenimiento mensual disponibles." }
  ];
  return (
    <div className="max-w-3xl mx-auto space-y-2">
      {items.map((f, idx) => (
        <Reveal key={idx} delay={idx * 40}>
          <div style={{ background: C.bgCard, borderColor: open === idx ? C.primaryLine : "#1e293b" }} className="border rounded-lg transition-colors duration-300">
            <button onClick={() => setOpen(open === idx ? null : idx)} className="w-full text-left p-5 flex justify-between items-center gap-4">
              <span className="font-semibold text-white text-sm">{f.q}</span>
              <ChevronDown style={{ color: C.primary }} className={`flex-shrink-0 transition-transform duration-300 ${open === idx ? "rotate-180" : ""}`} size={16} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${open === idx ? "max-h-40" : "max-h-0"}`}> 
              <p className="px-5 pb-5 text-slate-400 text-sm leading-relaxed">{f.a}</p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
};

/* ─── Glow card ─── */
const Card = ({ children, delay = 0 }) => {
  const [hover, setHover] = useState(false);
  return (
    <Reveal delay={delay}>
      <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{ background: hover ? C.bgCardHover : C.bgCard, borderColor: hover ? C.primaryLine : "#1e293b", boxShadow: hover ? `0 0 30px ${C.primaryGlow}` : "none", transition: "all 0.3s" }}
        className="border rounded-xl p-7 h-full">
        {children}
      </div>
    </Reveal>
  );
};

/* ─── Main ─── */
export default function VortekAI() {
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [captcha, setCaptcha] = useState(false);

  useEffect(() => { const h = () => setScrolled(window.scrollY > 40); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  const go = id => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenu(false); };
  const chg = (k, v) => { setForm({ ...form, [k]: v }); if (errors[k]) setErrors({ ...errors, [k]: "" }); };
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Requerido";
    if (!form.email.trim()) e.email = "Requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email inválido";
    if (!form.phone.trim()) e.phone = "Requerido";
    if (!form.message.trim()) e.message = "Requerido";
    if (!captcha) e.captcha = "Confirma que no eres un robot";
    return e;
  };
  const submit = e => {
    e.preventDefault(); if (sending) return;
    const errs = validate(); setErrors(errs);
    if (!Object.keys(errs).length) {
      setSending(true);
      setTimeout(() => { setDone(true); setForm({ name: "", email: "", phone: "", message: "" }); setCaptcha(false); setSending(false); setTimeout(() => setDone(false), 8000); }, 1500);
    }
  };

  const navLinks = [["servicios","Servicios"],["casos","Casos"],["roi","ROI"],["testimonios","Clientes"],["faq","FAQ"]];

  const svcs = [
    { icon: Zap, t: "Automatización de procesos", d: ["Elimina tareas repetitivas", "Integra tus sistemas", "Flujos de trabajo inteligentes"] },
    { icon: MessageSquare, t: "Agentes IA", d: ["Chatbots multicanal", "Asistentes internos", "Agentes autónomos 24/7"] },
    { icon: Brain, t: "IA para decisiones", d: ["Análisis predictivo", "Procesamiento de documentos", "Reportes automáticos"] },
    { icon: TrendingUp, t: "Automatización comercial", d: ["Calificación de leads", "Embudos inteligentes", "Seguimiento automático"] },
    { icon: BarChart3, t: "Consultoría IA", d: ["Diagnóstico de procesos", "Mapa de casos de uso", "Hoja de ruta de implementación"] }
  ];

  const stack = ["OpenAI","Anthropic","LangChain","n8n","Make","Zapier","Python","HubSpot","WhatsApp API","Google AI","Pinecone","LlamaIndex"];
  const industries = [["🏥","Salud"],["🏬","Retail"],["🏦","Fintech"],["⚖️","Legal"],["🚚","Logística"],["🏗️","Construcción"],["🎓","Educación"],["🏨","Hotelería"]];
  const cases = [
    { icon: MessageSquare, t: "Atención 24/7", d: "Agente multicanal que resuelve, agenda y escalaje al humano cuando necesario.", r: ["80% resuelto automáticamente","Respuesta < 30 segundos"] },
    { icon: BarChart3, t: "Análisis predictivo", d: "Modelo que predice demanda y optimiza compras sin intervención humana.", r: ["−45% exceso de stock","78% precisión en predicción"] },
    { icon: Zap, t: "Screening RRHH", d: "Filtrado de CVs, ranking de candidatos y primer contacto automatizado.", r: ["−60% tiempo en selección","100× más rápido"] }
  ];
  const steps = [
    { n:"01", t:"Diagnóstico", d:"Mapeamos tus procesos e identificamos los cuellos de botella con mayor impacto económico." },
    { n:"02", t:"Diseño", d:"Arquitectura de solución adaptada a tu stack, equipo y objetivos específicos." },
    { n:"03", t:"Implementación", d:"Desarrollo e integración con soporte continuo. MVP en la primera semana." },
    { n:"04", t:"Optimización", d:"Medimos, ajustamos y escalamos basados en datos reales de rendimiento." }
  ];

  return (
    <div style={{ background: C.bg, fontFamily: "'Inter', system-ui, sans-serif" }} className="text-white min-h-screen">

      {/* WhatsApp flotante */}
      <a href="https://wa.me/573212257107" target="_blank" rel="noopener noreferrer"
        style={{ background: "#16a34a", boxShadow: "0 0 24px rgba(22,163,74,0.5)" }}
        className="fixed bottom-6 right-6 z-50 text-white px-4 py-3 rounded-full flex items-center gap-2 text-sm font-semibold hover:scale-105 transition-transform">
        <MessageCircle size={18} /> WhatsApp
      </a>

      {/* Nav */}
      <nav style={{ background: scrolled ? "rgba(2,8,23,0.9)" : "transparent", borderBottom: scrolled ? `1px solid ${C.primaryLine}` : "none", backdropFilter: scrolled ? "blur(20px)" : "none", transition: "all 0.3s" }} className="fixed w-full z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-xl font-black tracking-tight">
              <span style={{ color: C.primary }}>VOR</span>TEK <span style={{ color: C.primary, fontSize: "0.7em", fontWeight: 400 }}>AI</span>
            </button>
            <div className="hidden md:flex items-center gap-8 text-sm">
              {navLinks.map(([id, label]) => (
                <button key={id} onClick={() => go(id)} style={{ color: "#94a3b8" }} className="hover:text-white transition-colors">{label}</button>
              ))}
              <button onClick={() => go("contacto")} style={{ background: C.primary, color: "#020817" }} className="px-5 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity">Diagnóstico gratis</button>
            </div>
            <button onClick={() => setMenu(!menu)} className="md:hidden">{menu ? <X size={22} /> : <Menu size={22} />}</button>
          </div>
        </div>
        {menu && (
          <div style={{ background: "rgba(10,22,40,0.98)", borderTop: `1px solid ${C.primaryLine}` }} className="md:hidden px-4 py-4 space-y-2">
            {navLinks.map(([id, label]) => <button key={id} onClick={() => go(id)} className="block w-full text-left text-slate-300 py-2 text-sm">{label}</button>)}
            <button onClick={() => go("contacto")} style={{ background: C.primary, color: "#020817" }} className="block w-full text-left px-4 py-2 rounded-lg font-bold text-sm">Diagnóstico gratis</button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Vortex />
        <div style={{ background: `radial-gradient(ellipse at center, transparent 30%, ${C.bg} 75%)` }} className="absolute inset-0"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20">
          <div style={{ color: C.primary, borderColor: C.primaryLine, background: "rgba(34,211,238,0.05)" }} className="inline-flex items-center gap-2 border rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest mb-8">
            <Globe size={12} /> Automatización IA · Global en Español
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-none tracking-tight">
            <span className="text-white">Automatiza.</span><br />
            <span style={{ color: C.primary }}>Escala.</span><br />
            <span className="text-white">Domina.</span>
          </h1>
          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            VORTEK AI diseña agentes e infraestructura de inteligencia artificial que eliminan trabajo manual, reducen costos y escalan tu negocio sin límites.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => go("roi")} style={{ background: C.primary, color: "#020817", boxShadow: `0 0 30px ${C.primaryGlow}` }} className="group px-8 py-4 rounded-lg font-black text-base inline-flex items-center justify-center gap-2 hover:scale-105 transition-transform">
              Calcular mi ROI <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </button>
            <button onClick={() => go("contacto")} style={{ borderColor: C.primaryLine, color: "white" }} className="border px-8 py-4 rounded-lg font-semibold text-base hover:border-cyan-400 transition-colors">
              Ver casos de uso
            </button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"><ChevronDown style={{ color: C.primaryLine }} size={28} /></div>
      </section>

      {/* Stats */}
      <section style={{ borderTop: `1px solid ${C.primaryLine}`, borderBottom: `1px solid ${C.primaryLine}` }} className="py-14">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-8 text-center">
          {[{v:40,s:"%",l:"Reducción de costos"},{v:60,s:"%",l:"Ahorro en tiempo"},{v:24,s:"/7",l:"Disponibilidad"}].map((x,i)=>(
            <Reveal key={i} delay={i*120}>
              <div className="text-4xl font-black mb-1" style={{ color: C.primary }}><Counter end={x.v} suffix={x.s} /></div>
              <p className="text-slate-500 text-xs uppercase tracking-widest">{x.l}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <p style={{ color: C.primary }} className="text-xs font-bold uppercase tracking-widest text-center mb-3">Qué hacemos</p>
            <h2 className="text-4xl font-black text-center mb-3">Servicios</h2>
            <p className="text-slate-400 text-center max-w-xl mx-auto mb-16">Todo lo que necesitas para convertir IA en ventaja competitiva real.</p>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {svcs.map((s,i)=>{ const I=s.icon; return (
              <Card key={i} delay={i*80}>
                <div style={{ background: "rgba(34,211,238,0.08)", borderRadius: 8 }} className="w-10 h-10 flex items-center justify-center mb-5"><I style={{ color: C.primary }} size={20} /></div>
                <h3 className="font-bold text-white mb-4">{s.t}</h3>
                <ul className="space-y-2">{s.d.map((x,j)=><li key={j} className="flex items-start gap-2 text-sm text-slate-400"><CheckCircle style={{ color: C.primaryDark, flexShrink: 0 }} size={14} className="mt-0.5" />{x}</li>)}</ul>
              </Card>
            );})}
          </div>
        </div>
      </section>

      {/* Stack */}
      <section style={{ borderTop: `1px solid ${C.primaryLine}`, borderBottom: `1px solid ${C.primaryLine}`, background: "rgba(34,211,238,0.02)" }} className="py-14">
        <div className="max-w-5xl mx-auto px-4">
          <Reveal>
            <p className="text-slate-600 text-xs uppercase tracking-widest text-center mb-8">Stack tecnológico</p>
            <div className="flex flex-wrap justify-center gap-2">
              {stack.map((t,i)=>(
                <span key={i} style={{ background: C.bgCard, borderColor: "#1e293b", color: "#94a3b8" }} className="px-4 py-2 border rounded-full text-xs font-medium hover:border-cyan-500/40 hover:text-white transition-all cursor-default">{t}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Casos */}
      <section id="casos" className="py-24">
        <div className=