"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { questions, partLabels, QuestionAxis } from "@/data/questions";
import { useTestStore } from "@/store/testStore";

const LABELS = ["강하게 반대", "반대", "약간 반대", "중립", "약간 동의", "동의", "강하게 동의"];
const VALUES = [-3, -2, -1, 0, 1, 2, 3];
const SIZE_WEIGHTS = [1.53, 1.35, 1.18, 1, 1.18, 1.35, 1.53];

const PARTS: QuestionAxis[] = ["personality", "economic", "social", "media"];
const PART_NUMBERS = ["I", "II", "III", "IV"];

export default function TestPage() {
  const router = useRouter();
  const { answers, setAnswer } = useTestStore();
  const [part, setPart] = useState(0);
  const [localVals, setLocalVals] = useState<Record<number, number | null>>({});

  const currentAxis = PARTS[part];
  const partQuestions = questions.filter((q) => q.axis === currentAxis);
  const isLast = part === PARTS.length - 1;

  useEffect(() => {
    const init: Record<number, number | null> = {};
    partQuestions.forEach((q) => {
      init[q.id] = answers[q.id] !== undefined ? answers[q.id] : null;
    });
    setLocalVals(init);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [part]);

  const handleChange = (id: number, val: number) => {
    setLocalVals((prev) => ({ ...prev, [id]: val }));
    setAnswer(id, val);
  };

  const totalAnswered = Object.keys(answers).length;
  const progress = (totalAnswered / questions.length) * 100;

  const allAnswered = partQuestions.every(
    (q) => localVals[q.id] !== null && localVals[q.id] !== undefined
  );

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
          --red: #c0392b;
        }

        body {
          background: var(--paper);
          color: var(--ink);
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
        }

        .page {
          max-width: 720px;
          margin: 0 auto;
          padding: 0 32px 80px;
          width: 100%;
        }

        .header {
          position: sticky;
          top: 0;
          background: var(--paper);
          z-index: 10;
          border-bottom: 1px solid var(--border);
          padding: 16px 0;
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .logo {
          font-family: 'Playfair Display', serif;
          font-size: 15px;
          font-weight: 700;
          color: var(--blue);
          white-space: nowrap;
        }

        .progress-area {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
        }

        .progress-bar-bg {
          width: 80px;
          height: 3px;
          background: var(--border);
          border-radius: 2px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .progress-bar-fill {
          height: 3px;
          background: var(--blue);
          border-radius: 2px;
          transition: width 0.5s ease;
        }

        .progress-text {
          font-size: 11px;
          color: var(--ink-muted);
          font-weight: 500;
          white-space: nowrap;
        }

        .part-header { padding: 32px 0 24px; }

        .part-number {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-muted);
          margin-bottom: 6px;
        }

        .part-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          color: var(--blue);
          font-style: italic;
          margin-bottom: 20px;
        }

        .part-tabs { display: flex; gap: 6px; flex-wrap: wrap; }

        .part-tab {
          font-size: 11px;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 20px;
          border: 1.5px solid var(--border);
          color: var(--ink-muted);
          background: var(--white);
          white-space: nowrap;
        }

        .part-tab.active {
          border-color: var(--blue);
          color: var(--blue);
          background: var(--blue-light);
        }

        .part-tab.done { opacity: 0.35; text-decoration: line-through; }

        .question-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 32px 40px;
          margin-bottom: 12px;
          display: flex;
          flex-direction: column;
          gap: 32px;
          transition: box-shadow 0.2s, border-color 0.2s;
          width: 100%;
          overflow: hidden;
        }

        .question-card:hover { box-shadow: 0 4px 20px rgba(26,58,110,0.07); }
        .question-card.answered { border-color: #c8d8ee; }

        .q-text {
          font-size: 17px;
          font-weight: 500;
          line-height: 1.65;
          color: var(--ink);
        }

        .circle-row {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
        }

        .end-label {
          font-size: 20px;
          font-weight: 600;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .end-label.left { color: var(--red); }
        .end-label.right { color: var(--blue-mid); }

        .circles {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex: 1;
          min-width: 0;
          gap: 4px;
        }

        .circle-btn {
          border-radius: 50%;
          cursor: pointer;
          border: 2.5px solid var(--border);
          background: var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.15s ease, background 0.15s ease, transform 0.15s ease;
          outline: none;
          padding: 0;
          flex: var(--w);
          aspect-ratio: 1 / 1;
          max-width: calc(var(--w) * 34px);
          min-width: 0;
        }

        .circle-btn:hover { border-color: var(--ink-muted); transform: scale(1.08); }
        .circle-btn.sel-neg { border-color: var(--red); background: var(--red); }
        .circle-btn.sel-neu { border-color: #8e8e93; background: #8e8e93; }
        .circle-btn.sel-pos { border-color: var(--blue-mid); background: var(--blue-mid); }

        .circle-btn svg {
          display: none;
          stroke: white;
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          fill: none;
          pointer-events: none;
          width: 55%;
          height: 55%;
        }

        .circle-btn.sel-neg svg,
        .circle-btn.sel-neu svg,
        .circle-btn.sel-pos svg { display: block; }

        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 28px;
          gap: 12px;
        }

        .btn-prev {
          background: var(--white);
          border: 1.5px solid var(--border);
          color: var(--ink-muted);
          padding: 12px 28px;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s;
        }

        .btn-prev:hover:not(:disabled) { border-color: var(--blue); color: var(--blue); }
        .btn-prev:disabled { opacity: 0.3; cursor: not-allowed; }

        .btn-next {
          background: var(--blue);
          border: none;
          color: var(--white);
          padding: 13px 40px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.18s;
          flex: 1;
          max-width: 280px;
        }

        .btn-next:hover:not(:disabled) {
          background: var(--blue-mid);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(26,58,110,0.2);
        }

        .btn-next:disabled { opacity: 0.4; cursor: not-allowed; }

        @media (max-width: 560px) {
          .page { padding: 0 16px 60px; }
          .question-card { padding: 20px 16px; gap: 20px; }
          .q-text { font-size: 15px; }
          .circle-row { gap: 4px; }
          .end-label { font-size: 10px; }
          .circles { gap: 2px; }
          .circle-btn { max-width: calc(var(--w) * 22px); }
        }
      `}</style>

      <div className="page">
        <header className="header">
          <div className="logo">정치성향판별기</div>
          <div className="progress-area">
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="progress-text">{Math.min(totalAnswered, questions.length)} / {questions.length} 완료</p>
          </div>
        </header>

        <div className="part-header">
          <p className="part-number">Part {PART_NUMBERS[part]} · {part + 1} / {PARTS.length}</p>
          <h2 className="part-title">{partLabels[currentAxis]}</h2>
          <div className="part-tabs">
            {PARTS.map((p, i) => (
              <span key={p} className={`part-tab ${i === part ? "active" : i < part ? "done" : ""}`}>
                {PART_NUMBERS[i]}. {partLabels[p]}
              </span>
            ))}
          </div>
        </div>

        {partQuestions.map((q) => {
          const val = localVals[q.id];
          const isAnswered = answers[q.id] !== undefined;

          return (
            <div key={q.id} className={`question-card ${isAnswered ? "answered" : ""}`}>
              <p className="q-text">{q.text}</p>
              <div className="circle-row">
                <span className="end-label left">반대</span>
                <div className="circles">
                  {VALUES.map((v, i) => {
                    const w = SIZE_WEIGHTS[i];
                    const isSelected = val === v;
                    const selClass = isSelected
                      ? v < 0 ? "sel-neg" : v > 0 ? "sel-pos" : "sel-neu"
                      : "";
                    return (
                      <button
                        key={v}
                        className={`circle-btn ${selClass}`}
                        style={{ "--w": w } as React.CSSProperties}
                        onClick={() => handleChange(q.id, v)}
                        title={LABELS[i]}
                      >
                        <svg viewBox="0 0 24 24">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </button>
                    );
                  })}
                </div>
                <span className="end-label right">동의</span>
              </div>
            </div>
          );
        })}

        <nav className="nav">
          <button className="btn-prev" onClick={() => setPart(p => p - 1)} disabled={part === 0}>
            이전 파트
          </button>
          <button
            className="btn-next"
            onClick={() => isLast ? router.push("/result") : setPart(p => p + 1)}
            disabled={!allAnswered}
          >
            {isLast ? "결과 보기" : "다음 파트"}
          </button>
        </nav>
      </div>
    </>
  );
}
