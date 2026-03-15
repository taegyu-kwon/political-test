"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600;1,700&family=Inter:wght@400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { overflow-x: hidden; width: 100%; }

        :root {
          --blue: #1a3a6e;
          --blue-mid: #2e5fad;
          --blue-light: #e8eef8;
          --paper: #faf8f4;
          --ink: #1c1c1e;
          --ink-muted: #6e6e73;
          --border: #dddad4;
          --white: #ffffff;
        }

        body {
          background: var(--paper);
          color: var(--ink);
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
        }

        .header {
          width: 100%;
          position: sticky;
          top: 0;
          background: var(--paper);
          z-index: 10;
          border-bottom: 1px solid var(--border);
          padding: 20px 48px;
          display: flex;
          align-items: center;
        }

        .logo {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          color: var(--blue);
          letter-spacing: -0.2px;
          white-space: nowrap;
          cursor: pointer;
          transition: opacity 0.15s;
        }

        .logo:hover { opacity: 0.7; }

        .page {
          min-height: calc(100vh - 65px);
          display: flex;
          flex-direction: column;
          max-width: 980px;
          margin: 0 auto;
          padding: 0 48px;
        }

        .hero {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 96px 0 64px;
          gap: 28px;
        }

        .eyebrow {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--blue-mid);
        }

        .title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(52px, 7vw, 88px);
          font-weight: 700;
          letter-spacing: -1px;
          line-height: 1.1;
          color: var(--ink);
        }

        .title em {
          font-style: italic;
          color: var(--blue);
        }

        .subtitle {
          font-size: 19px;
          font-weight: 400;
          color: var(--ink-muted);
          line-height: 1.8;
          max-width: 580px;
        }

        .mobile-br { display: none; }

        .cta-row {
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
          padding-top: 8px;
        }

        .btn-start {
          background: var(--blue);
          color: var(--white);
          border: none;
          padding: 17px 44px;
          font-family: 'Inter', sans-serif;
          font-size: 17px;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.18s;
        }

        .btn-start:hover {
          background: var(--blue-mid);
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(26,58,110,0.2);
        }

        .cta-meta {
          font-size: 15px;
          color: var(--ink-muted);
          font-weight: 400;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 28px;
        }

        .stat {
          padding: 28px 24px;
          border-right: 1px solid var(--border);
        }

        .stat:last-child { border-right: none; }

        .stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 38px;
          font-weight: 700;
          color: var(--blue);
          line-height: 1;
          letter-spacing: -0.5px;
        }

        .stat-label {
          font-size: 14px;
          font-weight: 500;
          color: var(--ink-muted);
          margin-top: 7px;
          line-height: 1.4;
        }

        .parts-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 30px 36px;
          margin-bottom: 56px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .parts-label {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ink-muted);
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border);
        }

        .part-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .part-num {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          font-weight: 700;
          color: var(--blue);
          min-width: 24px;
        }

        .part-name {
          font-size: 17px;
          font-weight: 500;
          color: var(--ink);
        }

        .footer {
          padding: 24px 0;
          border-top: 1px solid var(--border);
          font-size: 14px;
          color: var(--ink-muted);
          display: flex;
          justify-content: space-between;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .f1 { animation: fadeUp 0.55s ease both 0.05s; }
        .f2 { animation: fadeUp 0.55s ease both 0.15s; }
        .f3 { animation: fadeUp 0.55s ease both 0.25s; }
        .f4 { animation: fadeUp 0.55s ease both 0.35s; }
        .f5 { animation: fadeUp 0.55s ease both 0.45s; }
        .f6 { animation: fadeUp 0.55s ease both 0.55s; }

        @media (max-width: 560px) {
          .header { padding: 16px; }
          .logo { font-size: 17px; }
          .page { padding: 0 20px; }
          .subtitle { font-size: 15px; }
          .mobile-br { display: block; }
          .btn-start { font-size: 15px; padding: 14px 32px; }
          .stat-num { font-size: 28px; }
          .stat-label { font-size: 12px; }
          .part-name { font-size: 15px; }
          .stats { grid-template-columns: repeat(2, 1fr); }
          .stat:nth-child(2) { border-right: none; }
          .stat:nth-child(3) { border-top: 1px solid var(--border); }
          .stat:nth-child(4) { border-top: 1px solid var(--border); }
        }
      `}</style>

      <header className="header">
        <div className="logo">정치성향판별기</div>
      </header>

      <div className="page">
        <main className="hero">
          <p className={`eyebrow ${mounted ? "f1" : ""}`}>가치관으로 읽는 나의 정치 성향</p>
          <h1 className={`title ${mounted ? "f2" : ""}`}>
            당신이 모르는 <br />
            <em>당신의 정치 성향</em>
          </h1>
          <p className={`subtitle ${mounted ? "f3" : ""}`}>
            단순한 좌우 구분을 넘어<span className="mobile-br" /> 경제·사회·성향·정보소비 네 가지 축으로<span className="mobile-br" /> 당신의 정치적 성향을 분석합니다.
          </p>
          <div className={`cta-row ${mounted ? "f4" : ""}`}>
            <button className="btn-start" onClick={() => router.push("/intro")}>
              시작하기
            </button>
            <span className="cta-meta">약 10분 · 40문항</span>
          </div>
        </main>

        <div className={mounted ? "f5" : ""}>
          <div className="stats">
            <div className="stat">
              <div className="stat-num">40</div>
              <div className="stat-label">가치관 질문</div>
            </div>
            <div className="stat">
              <div className="stat-num">4</div>
              <div className="stat-label">분석 파트</div>
            </div>
            <div className="stat">
              <div className="stat-num">5</div>
              <div className="stat-label">성향 유형</div>
            </div>
            <div className="stat">
              <div className="stat-num">+4</div>
              <div className="stat-label">부가 진단</div>
            </div>
          </div>
        </div>

        <div className={`parts-card ${mounted ? "f6" : ""}`}>
          <p className="parts-label">검사 구성</p>
          <div className="part-row">
            <span className="part-num">I</span>
            <span className="part-name">성격 · 성향</span>
          </div>
          <div className="part-row">
            <span className="part-num">II</span>
            <span className="part-name">경제적 관점</span>
          </div>
          <div className="part-row">
            <span className="part-num">III</span>
            <span className="part-name">정치 · 가치관</span>
          </div>
          <div className="part-row">
            <span className="part-num">IV</span>
            <span className="part-name">정보 소비 습관</span>
          </div>
        </div>

        <footer className="footer">
          <span>© 2026 정치성향판별기</span>
          <span>더 나은 정치 문화를 함께 만들어갑니다.</span>
        </footer>
      </div>
    </>
  );
}
