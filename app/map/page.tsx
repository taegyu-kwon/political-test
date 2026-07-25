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

const PATHS: Record<string, { d: string; lx: number; ly: number; fs?: number }> = {
  gyeonggi:  { d: "M175,155 L205,138 L252,133 L290,148 L298,182 L288,215 L262,242 L238,252 L205,248 L178,232 L155,212 L148,185 Z", lx: 222, ly: 195 },
  seoul:     { d: "M214,177 L232,172 L248,180 L250,197 L237,208 L219,208 L207,197 Z", lx: 229, ly: 192, fs: 9 },
  incheon:   { d: "M148,172 L168,164 L182,175 L180,205 L160,215 L142,208 L138,188 Z", lx: 161, ly: 192, fs: 9 },
  gangwon:   { d: "M292,135 L420,130 L424,158 L410,208 L395,248 L368,270 L335,275 L297,260 L287,230 L290,188 L292,158 Z", lx: 358, ly: 202 },
  chungbuk:  { d: "M238,252 L292,248 L322,268 L318,308 L295,325 L264,328 L236,312 L226,285 L230,262 Z", lx: 276, ly: 292 },
  chungnam:  { d: "M148,248 L204,245 L230,262 L226,298 L220,328 L194,348 L160,348 L132,330 L122,303 L128,270 Z", lx: 175, ly: 298 },
  daejeon:   { d: "M220,320 L242,317 L250,332 L241,345 L220,345 L211,330 Z", lx: 231, ly: 333, fs: 9 },
  sejong:    { d: "M207,296 L222,292 L228,305 L218,315 L204,308 Z", lx: 215, ly: 304, fs: 7 },
  jeonbuk:   { d: "M138,348 L194,345 L220,350 L255,340 L266,368 L267,398 L240,415 L198,418 L155,408 L135,387 L133,362 Z", lx: 198, ly: 382 },
  jeonnam:   { d: "M138,408 L198,418 L240,418 L267,408 L272,445 L257,477 L225,495 L190,492 L160,478 L133,457 L122,432 L130,411 Z", lx: 193, ly: 458 },
  gwangju:   { d: "M192,430 L218,427 L226,445 L218,458 L194,458 L184,443 Z", lx: 205, ly: 445, fs: 9 },
  gyeongbuk: { d: "M296,260 L335,253 L375,258 L420,272 L422,318 L403,360 L372,383 L334,388 L303,375 L276,342 L271,304 L281,270 Z", lx: 352, ly: 318 },
  gyeongnam: { d: "M265,408 L303,378 L337,390 L368,393 L397,417 L397,452 L376,472 L337,483 L293,478 L263,458 L253,428 L258,410 Z", lx: 322, ly: 438 },
  daegu:     { d: "M296,372 L328,367 L338,385 L327,400 L300,402 L288,387 Z", lx: 313, ly: 388, fs: 9 },
  ulsan:     { d: "M366,393 L398,386 L409,413 L403,442 L377,448 L360,432 L358,412 Z", lx: 384, ly: 418, fs: 9 },
  busan:     { d: "M342,457 L377,450 L400,462 L393,483 L360,492 L337,482 L334,464 Z", lx: 367, ly: 472, fs: 9 },
  jeju:      { d: "M188,540 L242,534 L274,545 L272,566 L242,576 L194,568 L182,554 Z", lx: 228, ly: 557 },
};

// Provinces first, then cities drawn on top
const DRAW_ORDER = [
  "gyeonggi", "gangwon", "chungbuk", "chungnam", "jeonbuk", "jeonnam", "gyeongbuk", "gyeongnam", "jeju",
  "seoul", "incheon", "daejeon", "sejong", "gwangju", "daegu", "ulsan", "busan",
];

function fillColor(lean: number): string {
  const t = Math.max(-60, Math.min(60, lean)) / 60;
  if (t < 0) {
    const r = -t;
    return `rgb(${Math.round(210 - r * 106)},${Math.round(202 - r * 80)},${Math.round(190 - r * 20)})`;
  }
  const r = t;
  return `rgb(${Math.round(210 - r * 22)},${Math.round(202 - r * 114)},${Math.round(190 - r * 120)})`;
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
        .page-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: var(--ink); margin-bottom: 28px; }
        .layout { display: flex; gap: 40px; align-items: flex-start; }

        .map-section { flex: 0 0 460px; }
        .map-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; }
        .map-title { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; color: var(--ink); }
        .map-count { font-size: 13px; color: var(--ink-muted); }
        .map-count strong { font-size: 15px; font-weight: 700; color: var(--ink); }
        .map-svg { width: 100%; display: block; }
        .rp { cursor: pointer; transition: opacity 0.12s; }
        .rp:hover { opacity: 0.78; }
        .legend { display: flex; align-items: center; gap: 10px; margin-top: 10px; }
        .legend-lbl { font-size: 12px; color: var(--ink-muted); white-space: nowrap; }
        .legend-bar {
          flex: 1; height: 8px; border-radius: 4px;
          background: linear-gradient(to right, rgb(104,122,170), rgb(210,202,190), rgb(188,88,70));
        }

        .detail-section { flex: 1; min-width: 0; padding-top: 38px; }
        .detail-card {
          background: var(--white); border-radius: 16px; padding: 28px 26px 24px;
          box-shadow: 0 2px 20px rgba(0,0,0,0.06); border: 1px solid var(--border);
        }
        .d-name { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
        .d-participants { font-size: 13px; color: var(--ink-muted); margin-bottom: 16px; }
        .d-participants strong { color: var(--ink); font-weight: 600; }
        .d-badge { padding: 10px 16px; border-radius: 24px; font-size: 15px; font-weight: 600; margin-bottom: 22px; text-align: center; }
        .bars { display: flex; flex-direction: column; gap: 11px; margin-bottom: 20px; }
        .bar-row { display: flex; align-items: center; gap: 10px; }
        .bar-lbl { font-size: 13px; font-weight: 500; color: var(--ink); width: 28px; flex-shrink: 0; }
        .bar-bg { flex: 1; height: 10px; background: #ece8e2; border-radius: 6px; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 6px; transition: width 0.4s ease; }
        .bar-pct { font-size: 14px; font-weight: 600; color: var(--ink); width: 36px; text-align: right; flex-shrink: 0; }
        .d-desc { font-size: 13px; color: var(--ink-muted); background: #f5f2ee; border-radius: 8px; padding: 12px 14px; margin-bottom: 16px; line-height: 1.55; }
        .d-desc strong { color: var(--ink); }
        .d-btn {
          width: 100%; background: var(--blue); color: white; border: none;
          border-radius: 10px; padding: 16px; font-size: 15px; font-weight: 600;
          font-family: 'Inter', sans-serif; cursor: pointer; transition: background 0.15s;
        }
        .d-btn:hover { background: var(--blue-mid); }

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

            <svg viewBox="0 0 480 590" className="map-svg">
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
              <div className="d-desc">
                <strong>{d.name}</strong>은 {d.dominant} 성향이 우세합니다.{" "}
                다른 지역을 눌러 비교해보세요.
              </div>
              <button className="d-btn" onClick={() => router.push("/")}>
                {d.label} 커뮤니티
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
