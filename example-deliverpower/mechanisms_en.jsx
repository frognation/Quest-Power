import { useEffect, useRef, useState } from "react";

const eio = t => t < .5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2;
const pp  = (t, p=2) => { const x=(t%p)/p; return x<.5?eio(x*2):eio(2-x*2); };
const s01 = (t, p=2) => (Math.sin(t/p*Math.PI*2)+1)/2;

/* ── HYDRAULIC ─────────────────────────────────────────── */
function Hydraulic({t}) {
  const ph = pp(t,3);
  const sp = 12 + ph*38;
  const bp = 28 - ph*12;
  return (
    <svg viewBox="0 0 160 100" width="100%" height="100%">
      <rect x="22" y={sp+10} width="26" height={88-sp-10} fill="#1d4ed8" opacity=".4"/>
      <rect x="22" y="87"    width="116" height="11"       fill="#1d4ed8" opacity=".4"/>
      <rect x="94" y={bp+7}  width="44" height={88-bp-7}  fill="#1d4ed8" opacity=".4"/>
      <rect x="21" y="10" width="28" height="78" rx="1.5" fill="none" stroke="#323232" strokeWidth="1.5"/>
      <rect x="93" y="26" width="46" height="62" rx="1.5" fill="none" stroke="#323232" strokeWidth="1.5"/>
      <rect x="21" y="86" width="118" height="12" rx="1.5" fill="none" stroke="#323232" strokeWidth="1.5"/>
      <rect x="22" y={sp}   width="26" height="10" rx="1" fill="#c8c8c8"/>
      <rect x="32" y="0"    width="6"  height={sp} rx="1" fill="#888"/>
      <rect x="94" y={bp}   width="44" height="7"  rx="1" fill="#c8c8c8"/>
      <text x="35"  y="8"  textAnchor="middle" fontSize="6.5" fill="#555" fontFamily="monospace">F ↓</text>
      <text x="116" y="22" textAnchor="middle" fontSize="6"   fill="#555" fontFamily="monospace">F·A₂/A₁ ↑</text>
    </svg>
  );
}

/* ── MUSCLE ─────────────────────────────────────────────── */
function Muscle({t}) {
  const ph       = pp(t,2.5);
  const contract = ph*22;
  const leftZ    = 16+contract;
  const rightZ   = 144-contract;
  const aLen     = 40;
  const rows     = [24,50,76];
  return (
    <svg viewBox="0 0 160 100" width="100%" height="100%">
      <line x1={leftZ}  y1="12" x2={leftZ}  y2="90" stroke="#2a2a2a" strokeWidth="2.5"/>
      <line x1={rightZ} y1="12" x2={rightZ} y2="90" stroke="#2a2a2a" strokeWidth="2.5"/>
      {rows.map((y,i)=>(
        <g key={i}>
          <rect x="40" y={y-3} width="80" height="6" rx="3" fill="#4b5563"/>
          <rect x={leftZ}       y={y-1} width={aLen} height="2" rx="1" fill="#2563eb"/>
          <rect x={leftZ}       y={y-4} width="5"    height="8" rx="1" fill="#60a5fa"/>
          <rect x={rightZ-aLen} y={y-1} width={aLen} height="2" rx="1" fill="#2563eb"/>
          <rect x={rightZ-5}    y={y-4} width="5"    height="8" rx="1" fill="#60a5fa"/>
        </g>
      ))}
      <text x="80" y="98" textAnchor="middle" fontSize="6.5" fill="#444" fontFamily="monospace">
        contraction {Math.round(ph*100)}%
      </text>
    </svg>
  );
}

/* ── LEVER ──────────────────────────────────────────────── */
function Lever({t}) {
  const ph  = pp(t,2.5);
  const ang = (ph-.5)*28;
  const rad = ang*Math.PI/180;
  const cx=75, cy=70, len=60;
  const lx=cx-len*Math.cos(rad), ly=cy+len*Math.sin(rad);
  const rx=cx+len*Math.cos(rad), ry=cy-len*Math.sin(rad);
  return (
    <svg viewBox="0 0 160 102" width="100%" height="100%">
      <line x1="0" y1="96" x2="160" y2="96" stroke="#1c1c1c" strokeWidth="2"/>
      <polygon points={`${cx},${cy} ${cx-14},96 ${cx+14},96`} fill="#2e2e2e"/>
      <line x1={lx} y1={ly} x2={rx} y2={ry} stroke="#ddd" strokeWidth="4" strokeLinecap="round"/>
      <circle cx={cx} cy={cy} r="3.5" fill="#555"/>
      <rect x={lx-11} y={ly} width="22" height="13" rx="2" fill="#dc2626"/>
      <text x={lx}    y={ly+9.5} textAnchor="middle" fontSize="7.5" fill="white">F</text>
      <circle cx={rx} cy={ry-9}  r="9" fill="#16a34a" opacity=".9"/>
      <text x={rx}    y={ry-5.5} textAnchor="middle" fontSize="8" fill="white">↑</text>
      <text x={cx} y="102" textAnchor="middle" fontSize="6.5" fill="#444" fontFamily="monospace">fulcrum</text>
    </svg>
  );
}

/* ── PNEUMATIC ──────────────────────────────────────────── */
function Pneumatic({t}) {
  const ph        = pp(t,3);
  const pistonY   = 12+ph*42;
  const chamberT  = pistonY+10;
  const chamberH  = Math.max(6, 84-chamberT);
  const particles = Array.from({length:14},(_,i)=>{
    const s1=(i*137.508)%1, s2=(i*73.137)%1;
    const jig = Math.sin(t*3+i*0.7)*2;
    return {x:24+s1*46, y:chamberT+4+s2*(chamberH-8)+jig};
  });
  return (
    <svg viewBox="0 0 160 102" width="100%" height="100%">
      <rect x="20" y="10" width="56" height="75" rx="1.5" fill="none" stroke="#303030" strokeWidth="1.5"/>
      {particles.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#3b82f6" opacity=".6"/>)}
      <rect x="21" y={pistonY} width="54" height="10" rx="1" fill="#c8c8c8"/>
      <rect x="45" y="0"       width="6"  height={pistonY} rx="1" fill="#888"/>
      <rect x="76" y="60" width="40" height="8" fill="none" stroke="#303030" strokeWidth="1.5" rx="1"/>
      {ph>0.1&&<>
        <circle cx="90"  cy="64" r="2" fill="#3b82f6" opacity={ph*.85}/>
        <circle cx="100" cy="64" r="2" fill="#3b82f6" opacity={ph*.55}/>
        <circle cx="110" cy="64" r="2" fill="#3b82f6" opacity={ph*.3}/>
        <text x="120" y="68" fontSize="10" fill="#2563eb" opacity={ph}>→</text>
      </>}
      <text x="48" y="100" textAnchor="middle" fontSize="6.5" fill="#444" fontFamily="monospace">pneumatic cylinder</text>
    </svg>
  );
}

/* ── TURGOR ─────────────────────────────────────────────── */
function Turgor({t}) {
  const ph = s01(t,4);
  const r  = 26+ph*15;
  const cx=80, cy=52;
  const wdots = Array.from({length:8},(_,i)=>{
    const a=(i/8)*Math.PI*2, d=r+20-ph*14;
    return {x:cx+Math.cos(a)*d, y:cy+Math.sin(a)*d};
  });
  return (
    <svg viewBox="0 0 160 98" width="100%" height="100%">
      {wdots.map((w,i)=><circle key={i} cx={w.x} cy={w.y} r="3" fill="#2563eb" opacity={.28+ph*.52}/>)}
      <circle cx={cx} cy={cy} r={r+5} fill="none" stroke="#3a3a3a" strokeWidth="1.5"/>
      <circle cx={cx} cy={cy} r={r}   fill="#071e34" stroke="#1d4ed8" strokeWidth="1" opacity=".95"/>
      {Array.from({length:6},(_,i)=>{
        const a=(i/6)*Math.PI*2;
        return <line key={i}
          x1={cx+Math.cos(a)*r*.42} y1={cy+Math.sin(a)*r*.42}
          x2={cx+Math.cos(a)*r*.82} y2={cy+Math.sin(a)*r*.82}
          stroke="#22c55e" strokeWidth="1.2" opacity={ph*.9}/>;
      })}
      <text x={cx} y={cy+3.5} textAnchor="middle" fontSize="9" fill="#93c5fd" dominantBaseline="middle">H₂O</text>
      <text x={cx} y="95" textAnchor="middle" fontSize="6.5" fill="#444" fontFamily="monospace">
        turgor {Math.round(ph*100)}%
      </text>
    </svg>
  );
}

/* ── PIEZO ──────────────────────────────────────────────── */
function Piezo({t}) {
  const ph = pp(t,2.5);
  const cH=50-ph*18, cW=56+ph*18;
  const cY=32+ph*9,  cX=80-cW/2;
  return (
    <svg viewBox="0 0 160 102" width="100%" height="100%">
      {ph>0.05&&<g opacity={Math.min(1,ph*2)}>
        <line x1="80" y1="8"    x2="80"            y2={cY-3}    stroke="#dc2626" strokeWidth="1.5"/>
        <polygon points={`80,${cY} 76,${cY-7} 84,${cY-7}`}      fill="#dc2626"/>
        <line x1="80" y1="99"   x2="80"            y2={cY+cH+3} stroke="#dc2626" strokeWidth="1.5"/>
        <polygon points={`80,${cY+cH} 76,${cY+cH+7} 84,${cY+cH+7}`} fill="#dc2626"/>
      </g>}
      <rect x={cX} y={cY} width={cW} height={cH} rx="3" fill="#080f1c" stroke="#2563eb" strokeWidth="1.5"/>
      {[1,2,3].map(i=>(
        <line key={i} x1={cX+cW/4*i} y1={cY+3} x2={cX+cW/4*i} y2={cY+cH-3}
          stroke="#2563eb" strokeWidth=".5" opacity=".3"/>
      ))}
      <rect x={cX} y={cY}      width={cW} height="3" fill="#555"/>
      <rect x={cX} y={cY+cH-3} width={cW} height="3" fill="#555"/>
      <g opacity={ph}>
        <line x1={cX+cW} y1={cY+4}    x2="148" y2={cY+4}    stroke="#fbbf24" strokeWidth="1.5"/>
        <line x1={cX+cW} y1={cY+cH-4} x2="148" y2={cY+cH-4} stroke="#fbbf24" strokeWidth="1.5"/>
        <text x="151" y={cY+cH/2+5} textAnchor="middle" fontSize="16" fill="#fbbf24">⚡</text>
      </g>
      <text x="80" y="101" textAnchor="middle" fontSize="6.5" fill="#444" fontFamily="monospace">crystal deforms → voltage</text>
    </svg>
  );
}

/* ── SCREW / GEAR ───────────────────────────────────────── */
function Screw({t}) {
  const rotRad = ((t*90)%360)*Math.PI/180;
  const ph     = pp(t,4);
  const barX   = 10+ph*55;
  const cx=128, cy=54, r=28;
  return (
    <svg viewBox="0 0 160 100" width="100%" height="100%">
      <rect x="5" y="62" width="80" height="8" rx="2" fill="#141414" stroke="#282828" strokeWidth="1"/>
      <line x1="5" y1="66" x2="85" y2="66" stroke="#2e2e2e" strokeWidth="1" strokeDasharray="5,4"/>
      <rect x={barX} y="56" width="20" height="20" rx="2" fill="#c8c8c8"/>
      {[4,10,16].map(dx=>(
        <line key={dx} x1={barX+dx} y1="56" x2={barX+dx-2} y2="76" stroke="#999" strokeWidth=".7"/>
      ))}
      <line x1="85" y1="66" x2={cx-r} y2="66" stroke="#2a2a2a" strokeWidth="1" strokeDasharray="3,3"/>
      <circle cx={cx} cy={cy} r={r}   fill="none" stroke="#2e2e2e" strokeWidth="2"/>
      <circle cx={cx} cy={cy} r={r-3} fill="#0e0e0e"/>
      {[0,1,2,3].map(i=>{const a=rotRad+i*Math.PI/2; return (
        <line key={i}
          x1={cx+Math.cos(a)*5}     y1={cy+Math.sin(a)*5}
          x2={cx+Math.cos(a)*(r-3)} y2={cy+Math.sin(a)*(r-3)}
          stroke="#383838" strokeWidth="1.5"/>
      );})}
      <circle cx={cx+Math.cos(rotRad)*(r-6)} cy={cy+Math.sin(rotRad)*(r-6)} r="4" fill="#f59e0b"/>
      <text x="42"  y="97" textAnchor="middle" fontSize="6.5" fill="#444" fontFamily="monospace">linear →</text>
      <text x="128" y="97" textAnchor="middle" fontSize="6.5" fill="#444" fontFamily="monospace">rotary</text>
    </svg>
  );
}

/* ── KINESIN ─────────────────────────────────────────────── */
function Kinesin({t}) {
  const stepPh    = (t%1.0)/1.0;
  const totalProg = (t*18)%110;
  const bx        = 18+totalProg;
  const l1Moving  = stepPh<0.5;
  const l1Ph      = l1Moving ? stepPh*2 : 1;
  const l2Moving  = stepPh>=0.5;
  const l2Ph      = l2Moving ? (stepPh-.5)*2 : 0;
  const footY=74;
  const l1x = l1Moving ? bx-5+l1Ph*18 : bx+7;
  const l1y = l1Moving ? footY-Math.sin(l1Ph*Math.PI)*13 : footY;
  const l2x = l2Moving ? bx-7+l2Ph*18 : bx+1;
  const l2y = l2Moving ? footY-Math.sin(l2Ph*Math.PI)*13 : footY;
  return (
    <svg viewBox="0 0 160 98" width="100%" height="100%">
      <rect x="8" y="76" width="144" height="12" rx="2" fill="#071e34" stroke="#1e3a8a" strokeWidth="1"/>
      {Array.from({length:11},(_,i)=>(
        <line key={i} x1={8+i*13} y1="76" x2={8+i*13} y2="88" stroke="#1e3a8a" strokeWidth=".5" opacity=".5"/>
      ))}
      <rect x={bx}    y="44" width="20" height="12" rx="2" fill="#3b0764"/>
      <text x={bx+10} y="52.5" textAnchor="middle" fontSize="5.5" fill="#c4b5fd">cargo</text>
      <line x1={bx+10} y1="56" x2={bx+10} y2="60" stroke="#7c3aed" strokeWidth="1"/>
      <ellipse cx={bx+10} cy="62" rx="13" ry="7" fill="#d4d4d4"/>
      <line x1={bx+6}  y1="67" x2={l2x} y2={l2y} stroke="#888" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx={l2x} cy={l2y} r="3.5" fill={l2Moving?"#f59e0b":"#555"}/>
      <line x1={bx+14} y1="67" x2={l1x} y2={l1y} stroke="#ccc" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx={l1x} cy={l1y} r="3.5" fill={l1Moving?"#f59e0b":"#555"}/>
      <text x="80" y="96" textAnchor="middle" fontSize="6.5" fill="#444" fontFamily="monospace">microtubule</text>
    </svg>
  );
}

/* ── MAIN ────────────────────────────────────────────────── */
const CARDS = [
  { title:"Hydraulic Press",    sub:"Pascal's Law",         C: Hydraulic },
  { title:"Muscle Contraction", sub:"Sliding Filaments",    C: Muscle    },
  { title:"Lever",              sub:"Mechanical Advantage", C: Lever     },
  { title:"Pneumatics",         sub:"Compressed Air",       C: Pneumatic },
  { title:"Turgor / Osmosis",   sub:"Osmotic Pressure",     C: Turgor    },
  { title:"Piezoelectricity",   sub:"Deform → Voltage",     C: Piezo     },
  { title:"Screw / Gear",       sub:"Rotary → Linear",      C: Screw     },
  { title:"Motor Proteins",     sub:"Kinesin · ATP",        C: Kinesin   },
];

export default function App() {
  const [t, setT] = useState(0);
  const raf = useRef(), t0 = useRef(null);

  useEffect(() => {
    t0.current = performance.now();
    const loop = now => {
      setT((now - t0.current) / 1000);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return (
    <div style={{
      background: "#080808",
      minHeight: "100vh",
      padding: "32px 24px",
      fontFamily: "'DM Mono', 'Courier New', monospace",
    }}>
      <div style={{ marginBottom: "28px" }}>
        <div style={{
          color: "#2a2a2a", fontSize: "9px", letterSpacing: ".22em",
          textTransform: "uppercase", marginBottom: "8px",
        }}>
          ◼ FORCE TRANSFER MECHANISMS
        </div>
        <div style={{
          color: "#e0e0e0", fontSize: "18px", fontWeight: 300,
          letterSpacing: "-.01em", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        }}>
          Ways force moves through the world
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(188px, 1fr))",
        gap: "8px",
        maxWidth: "940px",
      }}>
        {CARDS.map(({ title, sub, C }) => (
          <div key={title} style={{
            background: "#0e0e0e",
            border: "1px solid #191919",
            borderRadius: "6px",
            overflow: "hidden",
          }}>
            <div style={{
              height: "148px",
              padding: "8px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <C t={t} />
            </div>
            <div style={{
              padding: "10px 14px 12px",
              borderTop: "1px solid #161616",
            }}>
              <div style={{ color: "#e0e0e0", fontSize: "11.5px", fontWeight: 500,
                fontFamily: "'DM Sans', sans-serif" }}>
                {title}
              </div>
              <div style={{ color: "#333", fontSize: "9.5px", marginTop: "3px",
                letterSpacing: ".06em" }}>
                {sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "24px", color: "#1e1e1e", fontSize: "8.5px", letterSpacing: ".15em" }}>
        ENERGY IS CONSERVED — ONLY FORM AND RATIO CHANGE
      </div>
    </div>
  );
}
