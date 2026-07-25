"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SK = "far_left" | "left" | "center" | "right" | "far_right";
interface RD {
  name: string;
  label: string;
  participants: number;
  dominant: string;
  lean: number;
  scores: Record<SK, number>;
}

const DATA: Record<string, RD> = {
  gyeonggi:  { name: "경기도",        label: "경기",   participants: 31842, dominant: "중도",      lean:   3, scores: { far_left:  7, left: 24, center: 40, right: 22, far_right:  7 } },
  seoul:     { name: "서울특별시",     label: "서울",   participants: 18732, dominant: "중도",      lean:   0, scores: { far_left:  9, left: 24, center: 39, right: 20, far_right:  8 } },
  incheon:   { name: "인천광역시",     label: "인천",   participants:  7245, dominant: "중도",      lean:  -5, scores: { far_left:  8, left: 27, center: 38, right: 21, far_right:  6 } },
  gangwon:   { name: "강원도",        label: "강원",   participants:  5621, dominant: "중도 보수",  lean:  18, scores: { far_left:  5, left: 18, center: 37, right: 28, far_right: 12 } },
  chungbuk:  { name: "충청북도",      label: "충청북", participants:  5234, dominant: "중도",      lean:  12, scores: { far_left:  6, left: 19, center: 38, right: 27, far_right: 10 } },
  chungnam:  { name: "충청남도",      label: "충청남", participants:  6103, dominant: "중도",      lean:   8, scores: { far_left:  6, left: 21, center: 39, right: 25, far_right:  9 } },
  daejeon:   { name: "대전광역시",     label: "대전",   participants:  5238, dominant: "중도",      lean:  -3, scores: { far_left:  8, left: 26, center: 39, right: 21, far_right:  6 } },
  sejong:    { name: "세종특별자치시", label: "세종",   participants:  1824, dominant: "중도",      lean:  -8, scores: { far_left:  9, left: 28, center: 37, right: 20, far_right:  6 } },
  jeonbuk:   { name: "전라북도",      label: "전라북", participants:  5948, dominant: "진보",      lean: -32, scores: { far_left: 14, left: 32, center: 30, right: 17, far_right:  7 } },
  jeonnam:   { name: "전라남도",      label: "전라남", participants:  4827, dominant: "진보",      lean: -42, scores: { far_left: 17, left: 35, center: 27, right: 15, far_right:  6 } },
  gwangju:   { name: "광주광역시",     label: "광주",   participants:  4213, dominant: "진보",      lean: -48, scores: { far_left: 20, left: 36, center: 25, right: 14, far_right:  5 } },
  gyeongbuk: { name: "경상북도",      label: "경상북", participants:  7934, dominant: "보수",      lean:  42, scores: { far_left:  4, left: 13, center: 27, right: 36, far_right: 20 } },
  gyeongnam: { name: "경상남도",      label: "경상남", participants:  9128, dominant: "보수",      lean:  32, scores: { far_left:  5, left: 16, center: 30, right: 33, far_right: 16 } },
  daegu:     { name: "대구광역시",     label: "대구",   participants:  6742, dominant: "보수",      lean:  45, scores: { far_left:  3, left: 11, center: 25, right: 37, far_right: 24 } },
  ulsan:     { name: "울산광역시",     label: "울산",   participants:  3891, dominant: "보수",      lean:  28, scores: { far_left:  5, left: 17, center: 31, right: 32, far_right: 15 } },
  busan:     { name: "부산광역시",     label: "부산",   participants:  8924, dominant: "중도 보수",  lean:  22, scores: { far_left:  5, left: 19, center: 33, right: 30, far_right: 13 } },
  jeju:      { name: "제주특별자치도", label: "제주",   participants:  2198, dominant: "중도",      lean: -12, scores: { far_left:  9, left: 26, center: 37, right: 21, far_right:  7 } },
};

// Coordinate system: x=(lon-124.5)*77, y=(38.8-lat)*98  viewBox="0 0 480 580"
const PATHS: Record<string, { d: string; lx: number; ly: number; fs?: number }> = {
  gyeonggi: {
    d: "M139,49 L193,49 L220,49 L259,68 L270,98 L258,127 L244,147 L224,166 L200,176 L169,176 L154,166 L147,147 L143,127 L147,98 L143,68 Z",
    lx: 202, ly: 125,
  },
  seoul: {
    d: "M177,110 L194,108 L207,112 L207,126 L200,135 L187,135 L177,133 Z",
    lx: 192, ly: 122, fs: 9,
  },
  incheon: {
    d: "M161,123 L171,126 L171,140 L158,151 L148,151 L144,146 L144,135 L148,126 Z",
    lx: 157, ly: 138, fs: 9,
  },
  gangwon: {
    d: "M216,20 L308,20 L339,35 L370,58 L378,93 L378,127 L366,152 L354,167 L339,167 L308,167 L270,167 L247,157 L247,127 L258,98 L258,68 L247,49 L231,29 Z",
    lx: 315, ly: 100,
  },
  chungbuk: {
    d: "M224,157 L247,157 L270,167 L293,176 L300,196 L293,215 L255,225 L220,225 L216,206 L216,176 Z",
    lx: 258, ly: 196,
  },
  chungnam: {
    d: "M216,167 L193,167 L170,167 L147,176 L143,206 L139,235 L124,255 L154,274 L185,264 L201,255 L212,225 L216,196 Z",
    lx: 170, ly: 215,
  },
  daejeon: {
    d: "M216,225 L235,227 L231,247 L220,253 L208,250 L208,237 Z",
    lx: 220, ly: 240, fs: 9,
  },
  sejong: {
    d: "M208,212 L220,212 L216,229 L205,232 L201,229 Z",
    lx: 210, ly: 221, fs: 7,
  },
  jeonbuk: {
    d: "M162,264 L185,264 L201,255 L231,274 L254,303 L254,323 L231,328 L193,328 L162,323 L154,303 L154,284 Z",
    lx: 200, ly: 298,
  },
  jeonnam: {
    d: "M254,323 L231,328 L193,328 L162,323 L154,342 L139,372 L131,401 L147,420 L170,440 L193,440 L216,420 L239,391 L254,372 L254,342 Z",
    lx: 192, ly: 382,
  },
  gwangju: {
    d: "M180,348 L192,345 L200,352 L198,362 L187,365 L178,358 Z",
    lx: 189, ly: 356, fs: 9,
  },
  gyeongbuk: {
    d: "M247,157 L270,167 L308,167 L354,167 L378,196 L378,235 L362,264 L347,294 L316,294 L285,294 L262,284 L254,274 L254,225 L254,196 Z",
    lx: 322, ly: 225,
  },
  gyeongnam: {
    d: "M262,284 L285,294 L316,294 L347,294 L370,323 L374,352 L362,372 L339,382 L308,382 L285,372 L262,372 L247,362 L239,343 L247,323 L254,303 Z",
    lx: 312, ly: 338,
  },
  daegu: {
    d: "M308,294 L325,292 L331,303 L320,313 L305,313 L298,303 Z",
    lx: 315, ly: 303, fs: 9,
  },
  ulsan: {
    d: "M347,294 L370,294 L374,323 L362,333 L347,323 L343,308 Z",
    lx: 358, ly: 313, fs: 9,
  },
  busan: {
    d: "M347,352 L370,343 L378,358 L370,372 L354,378 L339,372 L338,359 Z",
    lx: 358, ly: 362, fs: 9,
  },
  jeju: {
    d: "M147,503 L193,496 L239,494 L262,502 L258,520 L231,527 L185,527 L157,520 Z",
    lx: 205, ly: 511,
  },
};

const DRAW_ORDER = [
  "gyeonggi", "gangwon", "chungbuk", "chungnam", "jeonbuk", "jeonnam", "gyeongbuk", "gyeongnam", "jeju",
  "seoul", "incheon", "daejeon", "sejong", "gwangju", "daegu", "ulsan", "busan",
];

function fillColor(lean: number): string {
  const t = Math.max(-60, Math.min(60, lean)) / 60;
  if (t < 0) {
    const r = -t;
    return `rgb(${Math.round(210 - r * 106)},${Math.round(202 - r * 80)},${Math.round(192 - r * 20)})`;
  }
  const r = t;
  return `rgb(${Math.round(210 - r * 22)},${Math.round(202 - r * 114)},${Math.round(192 - r * 120)})`;
}

function badgeBg(lean: number) {
  if (lean <= -20) return "#dce5f2";
  if (lean >= 20) return "#f2e0db";
  return "#eae5dd";
}
function badgeColor(lean: number) {
  if (lean <= -20) return "#1a3a6e";
  if (lean >= 20) return "#8b2525";
  return "#6e6860";
}

const CATS: { key: SK; label: string; color: string }[] = [
  { key: "far_left",  label: "극좌", color: "#1a3a6e" },
  { key: "left",      label: "좌",   color: "#5878b8" },
  { key: "center",    label: "중도", color: "#9a9285" },
  { key: "right",     label: "우",   color: "#c07868" },
  { key: "far_right", label: "극우", color: "#8b2525" },
];

const TOTAL = 142318;

export default function MapPage() {
  const router = useRouter();
  const [sel, setSel] = useState("seoul");
  const d = DATA[sel];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { overflow-x: hidden; width: 100%; }
        :root {
          --blue: #1a3a6e; --blue-mid: #2e5fad;
          --paper: #faf8f4; --ink: #1c1c1e;
          --ink-muted: #6e6e73; --border: #dddad4; --white: #ffffff;
        }
        body { background: var(--paper); color: var(--ink); font-family: 'Inter', sans-serif; min-height: 100vh; }
        .header {
          width: 100%; border-bottom: 1px solid var(--border);
          padding: 20px 48px; display: flex; align-items: center;
          background: var(--paper); position: sticky; top: 0; z-index: 10;
        }
        .logo { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: var(--blue); cursor: pointer; transition: opacity 0.15s; }
        .logo:hover { opacity: 0.7; }
        .page { max-width: 1100px; margin: 0 auto; padding: 32px 48px 80px; }
        .ad-slot { width: 100%; display: flex; justify-content: center; margin: 0 0 28px; }
        .page-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: var(--blue); margin-bottom: 28px; }
        .layout { display: flex; gap: 40px; align-items: flex-start; }

        .map-section { flex: 0 0 460px; }
        .map-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; }
        .map-title { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 700; color: var(--blue); }
        .map-count { font-size: 13px; color: var(--ink-muted); }
        .map-count strong { font-size: 15px; font-weight: 700; color: var(--blue); }
        .map-svg { width: 100%; display: block; }
        .rp { cursor: pointer; transition: opacity 0.12s; }
        .rp:hover { opacity: 0.78; }
        .legend { display: flex; align-items: center; gap: 10px; margin-top: 10px; }
        .legend-lbl { font-size: 12px; color: var(--ink-muted); white-space: nowrap; }
        .legend-bar {
          flex: 1; height: 8px; border-radius: 4px;
          background: linear-gradient(to right, rgb(104,122,170), rgb(210,202,192), rgb(188,88,72));
        }

        .detail-section { flex: 1; min-width: 0; padding-top: 38px; }
        .detail-card {
          background: var(--white); border-radius: 16px; padding: 28px 26px 24px;
          box-shadow: 0 2px 20px rgba(0,0,0,0.06); border: 1px solid var(--border);
        }
        .d-name { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: var(--blue); margin-bottom: 4px; }
        .d-participants { font-size: 13px; color: var(--ink-muted); margin-bottom: 16px; }
        .d-participants strong { color: var(--blue); font-weight: 600; }
        .d-badge { padding: 10px 16px; border-radius: 24px; font-size: 15px; font-weight: 600; margin-bottom: 22px; text-align: center; }
        .bars { display: flex; flex-direction: column; gap: 11px; }
        .bar-row { display: flex; align-items: center; gap: 10px; }
        .bar-lbl { font-size: 13px; font-weight: 500; color: var(--ink); width: 28px; flex-shrink: 0; }
        .bar-bg { flex: 1; height: 10px; background: #ece8e2; border-radius: 6px; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 6px; transition: width 0.4s ease; }
        .bar-pct { font-size: 14px; font-weight: 600; color: var(--ink); width: 36px; text-align: right; flex-shrink: 0; }

        @media (max-width: 820px) {
          .header { padding: 16px 20px; }
          .page { padding: 20px 20px 60px; }
          .layout { flex-direction: column; gap: 24px; }
          .map-section { flex: none; width: 100%; }
          .detail-section { padding-top: 0; width: 100%; }
        }
      `}</style>

      <header className="header">
        <div className="logo" onClick={() => router.push("/")}>정치성향판별기</div>
      </header>

      <div className="page">
        <div className="ad-slot">
          <ins
            className="kakao_ad_area"
            style={{ display: "none" }}
            data-ad-unit="DAN-PCFVNkcNKANu1a8D"
            data-ad-width="320"
            data-ad-height="50"
          />
        </div>

        <h1 className="page-title">정치판세맵</h1>

        <div className="layout">
          <section className="map-section">
            <div className="map-top">
              <span className="map-title">지역별 정치성향 분포</span>
              <span className="map-count">누적 참여자 <strong>{TOTAL.toLocaleString()}</strong>명</span>
            </div>

            <svg viewBox="0 0 480 545" className="map-svg">
              {DRAW_ORDER.map(id => (
                <path
                  key={id}
                  d={PATHS[id].d}
                  fill={fillColor(DATA[id].lean)}
                  stroke="white"
                  strokeWidth={sel === id ? "2.8" : "1.5"}
                  strokeLinejoin="round"
                  className="rp"
                  onClick={() => setSel(id)}
                  style={{ filter: sel === id ? "drop-shadow(0 0 3px rgba(0,0,0,0.22))" : undefined }}
                >
                  <title>{DATA[id].name}</title>
                </path>
              ))}
              {DRAW_ORDER.map(id => (
                <text
                  key={`t-${id}`}
                  x={PATHS[id].lx}
                  y={PATHS[id].ly}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize={PATHS[id].fs ?? 11}
                  fontWeight="600"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {DATA[id].label}
                </text>
              ))}
            </svg>

            <div className="legend">
              <span className="legend-lbl">진보 우세</span>
              <div className="legend-bar" />
              <span className="legend-lbl">보수 우세</span>
            </div>
          </section>

          <section className="detail-section">
            <div className="detail-card">
              <h2 className="d-name">{d.name}</h2>
              <p className="d-participants">응답자 <strong>{d.participants.toLocaleString()}</strong>명 참여</p>
              <div
                className="d-badge"
                style={{ background: badgeBg(d.lean), color: badgeColor(d.lean) }}
              >
                {d.dominant} 우세
              </div>
              <div className="bars">
                {CATS.map(cat => (
                  <div key={cat.key} className="bar-row">
                    <span className="bar-lbl">{cat.label}</span>
                    <div className="bar-bg">
                      <div className="bar-fill" style={{ width: `${d.scores[cat.key]}%`, background: cat.color }} />
                    </div>
                    <span className="bar-pct">{d.scores[cat.key]}%</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
