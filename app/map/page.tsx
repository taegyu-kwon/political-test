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
  chungbuk:  { name: "충청북도",      label: "충북",   participants:  5234, dominant: "중도",      lean:  12, scores: { far_left:  6, left: 19, center: 38, right: 27, far_right: 10 } },
  chungnam:  { name: "충청남도",      label: "충남",   participants:  6103, dominant: "중도",      lean:   8, scores: { far_left:  6, left: 21, center: 39, right: 25, far_right:  9 } },
  daejeon:   { name: "대전광역시",     label: "대전",   participants:  5238, dominant: "중도",      lean:  -3, scores: { far_left:  8, left: 26, center: 39, right: 21, far_right:  6 } },
  sejong:    { name: "세종특별자치시", label: "세종",   participants:  1824, dominant: "중도",      lean:  -8, scores: { far_left:  9, left: 28, center: 37, right: 20, far_right:  6 } },
  jeonbuk:   { name: "전북특별자치도", label: "전북",   participants:  5948, dominant: "진보",      lean: -32, scores: { far_left: 14, left: 32, center: 30, right: 17, far_right:  7 } },
  jeonnam:   { name: "전라남도",      label: "전남",   participants:  4827, dominant: "진보",      lean: -42, scores: { far_left: 17, left: 35, center: 27, right: 15, far_right:  6 } },
  gwangju:   { name: "광주광역시",     label: "광주",   participants:  4213, dominant: "진보",      lean: -48, scores: { far_left: 20, left: 36, center: 25, right: 14, far_right:  5 } },
  gyeongbuk: { name: "경상북도",      label: "경북",   participants:  7934, dominant: "보수",      lean:  42, scores: { far_left:  4, left: 13, center: 27, right: 36, far_right: 20 } },
  gyeongnam: { name: "경상남도",      label: "경남",   participants:  9128, dominant: "보수",      lean:  32, scores: { far_left:  5, left: 16, center: 30, right: 33, far_right: 16 } },
  daegu:     { name: "대구광역시",     label: "대구",   participants:  6742, dominant: "보수",      lean:  45, scores: { far_left:  3, left: 11, center: 25, right: 37, far_right: 24 } },
  ulsan:     { name: "울산광역시",     label: "울산",   participants:  3891, dominant: "보수",      lean:  28, scores: { far_left:  5, left: 17, center: 31, right: 32, far_right: 15 } },
  busan:     { name: "부산광역시",     label: "부산",   participants:  8924, dominant: "중도 보수",  lean:  22, scores: { far_left:  5, left: 19, center: 33, right: 30, far_right: 13 } },
  jeju:      { name: "제주특별자치도", label: "제주",   participants:  2198, dominant: "중도",      lean: -12, scores: { far_left:  9, left: 26, center: 37, right: 21, far_right:  7 } },
};

// South Korea — geographic province paths, viewBox="0 0 400 530"
// Coordinate basis: lon 126°E→x≈30, 127°E→x≈138, 128°E→x≈246, 129°E→x≈354; lat 38.5°N→y≈20, 37°N→y≈152, 36°N→y≈260, 35°N→y≈368, 34°N→y≈476
const PATHS: Record<string, { d: string; lx: number; ly: number; fs?: number }> = {
  gyeonggi: {
    d: "M 72,38 C 105,28 168,24 222,30 L 258,46 L 280,88 L 278,152 C 272,172 260,188 242,198 L 208,204 L 172,204 L 144,197 L 118,190 L 90,172 C 73,156 62,138 60,118 L 58,76 Z",
    lx: 168, ly: 148,
  },
  seoul: {
    d: "M 146,88 L 176,84 L 186,98 L 182,120 L 164,126 L 144,122 L 136,108 Z",
    lx: 162, ly: 106, fs: 9,
  },
  incheon: {
    d: "M 64,114 L 84,104 L 98,118 L 94,142 L 78,152 L 62,148 L 56,130 Z",
    lx: 77, ly: 130, fs: 9,
  },
  gangwon: {
    d: "M 222,30 L 316,22 L 344,40 L 360,80 L 364,148 L 348,186 L 318,204 L 286,206 C 270,205 258,196 244,192 L 262,164 C 272,140 278,108 270,82 L 258,48 Z",
    lx: 310, ly: 122,
  },
  chungnam: {
    d: "M 58,200 L 90,174 L 120,192 L 142,200 L 160,230 C 156,252 150,272 140,298 L 115,320 L 88,324 C 68,318 50,298 46,276 L 44,250 Z",
    lx: 102, ly: 262,
  },
  sejong: {
    d: "M 174,234 L 190,230 L 194,246 L 183,257 L 170,254 Z",
    lx: 182, ly: 244, fs: 7,
  },
  chungbuk: {
    d: "M 208,204 L 244,196 L 270,210 L 290,238 C 286,262 278,282 264,298 L 232,306 L 200,294 L 180,270 L 180,238 L 190,216 Z",
    lx: 237, ly: 252,
  },
  daejeon: {
    d: "M 164,274 L 182,270 L 186,286 L 178,300 L 161,297 L 153,282 Z",
    lx: 170, ly: 286, fs: 9,
  },
  jeonbuk: {
    d: "M 120,328 L 150,314 L 184,306 L 218,312 L 240,334 C 241,354 236,372 218,390 L 178,396 L 136,392 L 108,372 Z",
    lx: 176, ly: 356,
  },
  gyeongbuk: {
    d: "M 270,212 L 320,208 L 352,228 L 366,272 L 360,322 L 336,356 L 302,366 L 270,356 L 250,326 L 248,288 C 252,270 260,252 266,238 Z",
    lx: 312, ly: 286,
  },
  daegu: {
    d: "M 294,282 L 324,278 L 334,296 L 322,316 L 296,316 L 284,300 Z",
    lx: 309, ly: 299, fs: 9,
  },
  jeonnam: {
    d: "M 108,376 L 136,396 L 178,400 L 218,393 L 236,416 C 228,442 216,460 194,468 L 156,474 L 116,467 L 88,442 L 78,410 Z",
    lx: 158, ly: 434,
  },
  gwangju: {
    d: "M 162,398 L 184,394 L 192,410 L 184,425 L 162,425 L 152,410 Z",
    lx: 172, ly: 412, fs: 9,
  },
  gyeongnam: {
    d: "M 240,338 L 272,360 L 304,368 L 336,358 L 360,380 C 362,404 355,424 333,436 L 296,444 L 257,436 L 232,418 L 222,392 Z",
    lx: 296, ly: 406,
  },
  ulsan: {
    d: "M 348,322 L 372,312 L 378,342 L 366,366 L 344,368 L 332,354 Z",
    lx: 356, ly: 342, fs: 9,
  },
  busan: {
    d: "M 336,416 L 360,406 L 374,422 L 367,442 L 342,448 L 326,436 Z",
    lx: 350, ly: 430, fs: 9,
  },
  jeju: {
    d: "M 105,478 L 162,470 L 216,470 L 248,480 L 240,496 L 196,504 L 148,504 L 110,496 Z",
    lx: 178, ly: 487,
  },
};

const DRAW_ORDER = [
  "gyeonggi", "gangwon", "chungbuk", "chungnam", "jeonbuk", "jeonnam", "gyeongbuk", "gyeongnam", "jeju",
  "seoul", "incheon", "daejeon", "sejong", "gwangju", "daegu", "ulsan", "busan",
];

const REGION_LIST = [
  ["seoul","incheon","gyeonggi"],
  ["gangwon"],
  ["chungnam","sejong","chungbuk","daejeon"],
  ["jeonbuk","jeonnam","gwangju"],
  ["gyeongbuk","daegu","gyeongnam","ulsan","busan"],
  ["jeju"],
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

        .map-section { flex: 0 0 420px; }
        .map-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; }
        .map-title { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 700; color: var(--blue); }
        .map-count { font-size: 13px; color: var(--ink-muted); }
        .map-count strong { font-size: 15px; font-weight: 700; color: var(--blue); }
        .map-svg { width: 100%; display: block; }
        .rp { cursor: pointer; transition: opacity 0.12s; }
        .rp:hover { opacity: 0.75; }
        .legend { display: flex; align-items: center; gap: 10px; margin-top: 10px; }
        .legend-lbl { font-size: 12px; color: var(--ink-muted); white-space: nowrap; }
        .legend-bar {
          flex: 1; height: 8px; border-radius: 4px;
          background: linear-gradient(to right, rgb(104,122,170), rgb(210,202,192), rgb(188,88,72));
        }

        .region-grid { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 16px; }
        .region-btn {
          font-size: 12px; font-weight: 600; padding: 5px 12px;
          border-radius: 16px; border: 1.5px solid var(--border);
          background: var(--white); color: var(--ink-muted);
          cursor: pointer; transition: all 0.12s;
        }
        .region-btn:hover { border-color: var(--blue); color: var(--blue); }
        .region-btn.active { border-color: var(--blue); background: #e8eef8; color: var(--blue); }

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

            <svg viewBox="0 0 400 530" className="map-svg">
              {DRAW_ORDER.map(id => (
                <path
                  key={id}
                  d={PATHS[id].d}
                  fill={fillColor(DATA[id].lean)}
                  stroke="white"
                  strokeWidth={sel === id ? "3" : "1.5"}
                  strokeLinejoin="round"
                  className="rp"
                  onClick={() => setSel(id)}
                  style={{
                    filter: sel === id ? "drop-shadow(0 0 4px rgba(0,0,0,0.28))" : undefined,
                  }}
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

            <div className="region-grid">
              {Object.keys(DATA).map(id => (
                <button
                  key={id}
                  className={`region-btn${sel === id ? " active" : ""}`}
                  onClick={() => setSel(id)}
                >
                  {DATA[id].label}
                </button>
              ))}
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
