"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { questions } from "@/data/questions";
import { useTestStore } from "@/store/testStore";

function calcMainScore(answers: Record<number, number>) {
  let total = 0;
  let count = 0;
  questions
    .filter((q) => q.axis === "economic" || q.axis === "social")
    .forEach((q) => {
      total += (answers[q.id] ?? 0) * q.direction;
      count++;
    });
  return total / count;
}

function getMainResult(score: number) {
  if (score >= 1.2) return { label: "극좌", en: "Far Left", desc: "국가의 강력한 개입과 급진적 평등을 지지합니다. 현 체제의 근본적 변화가 필요하다고 봅니다.", color: "#1d4ed8", bar: 5 };
  if (score >= 0.4) return { label: "진보", en: "Progressive", desc: "사회적 평등과 국가의 적극적 역할을 지지합니다. 점진적 개혁을 통한 변화를 추구합니다.", color: "#2563eb", bar: 30 };
  if (score >= -0.4) return { label: "중도", en: "Centrist", desc: "좌우 어느 쪽에도 강하게 치우치지 않습니다. 상황에 따라 유연하게 판단하는 편입니다.", color: "#6b7280", bar: 50 };
  if (score >= -1.2) return { label: "보수", en: "Conservative", desc: "전통적 가치와 시장 자율을 중시합니다. 안정적이고 검증된 제도를 선호합니다.", color: "#dc2626", bar: 70 };
  return { label: "극우", en: "Far Right", desc: "강한 시장 자유와 전통 질서를 지지합니다. 국가 개입 최소화와 개인 책임을 강조합니다.", color: "#b91c1c", bar: 95 };
}

function calcSubResults(answers: Record<number, number>) {
  const participScore = -(answers[31] ?? 0) + (answers[39] ?? 0);
  const participation =
    participScore >= 2 ? { label: "정치 능동형", desc: "정치에 적극적으로 관심을 갖고 참여하려는 성향입니다.", color: "#059669" } :
      participScore >= -1 ? { label: "정치 관망형", desc: "정치에 관심은 있지만 거리를 두는 편입니다.", color: "#d97706" } :
        { label: "정치 무관심군", desc: "정치 이슈를 의도적으로 피하는 경향이 있습니다.", color: "#6b7280" };

  const manipScore = (answers[32] ?? 0) + (answers[36] ?? 0) + (answers[38] ?? 0);
  const manipulation =
    manipScore >= 6 ? { label: "선동 위험군", desc: "맹목적 지지와 권위 의존이 결합되어 선동에 취약할 수 있습니다.", color: "#dc2626" } :
      manipScore >= 2 ? { label: "선동 주의군", desc: "일부 편향이 있으나 크게 위험한 수준은 아닙니다.", color: "#d97706" } :
        { label: "비교적 안전", desc: "다양한 시각을 수용하고 비판적으로 정보를 판단하는 편입니다.", color: "#059669" };

  const biasScore = -(answers[33] ?? 0) + (answers[34] ?? 0) - (answers[35] ?? 0) + (answers[37] ?? 0);
  const confirmBias =
    biasScore >= 4 ? { label: "확증편향 고위험", desc: "자신의 생각과 일치하는 정보만 받아들이는 경향이 강합니다.", color: "#dc2626" } :
      biasScore >= 0 ? { label: "확증편향 주의", desc: "부분적인 편향이 있습니다. 다양한 시각을 의식적으로 접하세요.", color: "#d97706" } :
        { label: "균형 소비형", desc: "다양한 관점을 고려하며 정보를 소비하는 편입니다.", color: "#059669" };

  const judgScore = (answers[40] ?? 0) * 2 - (answers[35] ?? 0) - (answers[8] ?? 0);
  const judgment =
    judgScore >= 3 ? { label: "감정 주도형", desc: "정치 이슈에 감정이 먼저 반응하는 편입니다.", color: "#dc2626" } :
      judgScore >= -1 ? { label: "혼합형", desc: "감정과 이성이 균형 있게 작동하는 편입니다.", color: "#d97706" } :
        { label: "이성 주도형", desc: "감정보다 논리와 구조로 정치를 판단하는 편입니다.", color: "#059669" };

  return { participation, manipulation, confirmBias, judgment };
}

const LABEL_MAP: Record<string, ReturnType<typeof getMainResult>> = {
  "극좌": { label: "극좌", en: "Far Left", desc: "국가의 강력한 개입과 급진적 평등을 지지합니다. 현 체제의 근본적 변화가 필요하다고 봅니다.", color: "#1d4ed8", bar: 5 },
  "진보": { label: "진보", en: "Progressive", desc: "사회적 평등과 국가의 적극적 역할을 지지합니다. 점진적 개혁을 통한 변화를 추구합니다.", color: "#2563eb", bar: 30 },
  "중도": { label: "중도", en: "Centrist", desc: "좌우 어느 쪽에도 강하게 치우치지 않습니다. 상황에 따라 유연하게 판단하는 편입니다.", color: "#6b7280", bar: 50 },
  "보수": { label: "보수", en: "Conservative", desc: "전통적 가치와 시장 자율을 중시합니다. 안정적이고 검증된 제도를 선호합니다.", color: "#dc2626", bar: 70 },
  "극우": { label: "극우", en: "Far Right", desc: "강한 시장 자유와 전통 질서를 지지합니다. 국가 개입 최소화와 개인 책임을 강조합니다.", color: "#b91c1c", bar: 95 },
};

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { answers, reset } = useTestStore();

  const sharedLabel = searchParams.get("label");
  const sharedP1 = searchParams.get("p1");
  const sharedP2 = searchParams.get("p2");
  const sharedP3 = searchParams.get("p3");
  const sharedP4 = searchParams.get("p4");
  const isShared = !!sharedLabel;

  const mainScore = calcMainScore(answers);
  const main = isShared ? (LABEL_MAP[sharedLabel] ?? getMainResult(0)) : getMainResult(mainScore);
  const sub = isShared
    ? {
      participation: { label: sharedP1 ?? "", desc: "", color: "#6b7280" },
      manipulation: { label: sharedP2 ?? "", desc: "", color: "#6b7280" },
      confirmBias: { label: sharedP3 ?? "", desc: "", color: "#6b7280" },
      judgment: { label: sharedP4 ?? "", desc: "", color: "#6b7280" },
    }
    : calcSubResults(answers);

  const subResults = [
    { title: "정치 참여 성향", ...sub.participation },
    { title: "선동 취약도", ...sub.manipulation },
    { title: "확증편향 지수", ...sub.confirmBias },
    { title: "판단 방식", ...sub.judgment },
  ];

  const handleShare = () => {
    const s = calcSubResults(answers);
    const params = new URLSearchParams({
      label: main.label,
      bar: String(main.bar),
      p1: s.participation.label,
      p2: s.manipulation.label,
      p3: s.confirmBias.label,
      p4: s.judgment.label,
    });
    const url = `${window.location.origin}/result?${params.toString()}`;
    navigator.clipboard.writeText(url).then(() => alert("링크가 복사되었습니다!"));
  };

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
          cursor: pointer;
          transition: opacity 0.15s;
        }

        .logo:hover { opacity: 0.7; }

        .page {
          max-width: 900px;
          margin: 0 auto;
          padding: 48px 48px 80px;
        }

        .shared-banner {
          background: var(--blue-light);
          border: 1px solid #c8d8ee;
          border-radius: 10px;
          padding: 16px 20px;
          font-size: 15px;
          color: var(--blue);
          font-weight: 500;
          margin-bottom: 24px;
        }

        .main-result {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 48px 44px;
          margin-bottom: 24px;
        }

        .main-eyebrow {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-muted);
          margin-bottom: 18px;
        }

        .main-label {
          font-family: 'Playfair Display', serif;
          font-size: clamp(60px, 10vw, 96px);
          font-weight: 700;
          letter-spacing: -2px;
          line-height: 1;
          margin-bottom: 8px;
        }

        .main-en {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-style: italic;
          color: var(--ink-muted);
          margin-bottom: 28px;
        }

        .spectrum-wrap { margin-bottom: 28px; }

        .spectrum-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-muted);
          margin-bottom: 8px;
        }

        .spectrum-bar-bg {
          height: 10px;
          background: var(--paper);
          border-radius: 5px;
          border: 1px solid var(--border);
          position: relative;
          overflow: visible;
        }

        .spectrum-track {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          border-radius: 5px;
          background: linear-gradient(to right, #1d4ed8, #9ca3af, #b91c1c);
        }

        .spectrum-marker {
          position: absolute;
          top: -5px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--white);
          border: 3px solid var(--ink);
          transform: translateX(-50%);
          box-shadow: 0 1px 6px rgba(0,0,0,0.15);
          transition: left 0.8s cubic-bezier(0.4,0,0.2,1);
        }

        .main-desc {
          font-size: 17px;
          color: var(--ink-muted);
          line-height: 1.75;
        }

        .sub-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 18px;
          padding-top: 4px;
        }

        .sub-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 40px;
        }

        .sub-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .sub-card-dot { width: 10px; height: 10px; border-radius: 50%; margin-bottom: 2px; }

        .sub-card-title {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-muted);
        }

        .sub-card-label {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.3px;
        }

        .sub-card-desc { font-size: 14px; color: var(--ink-muted); line-height: 1.65; }

        .btn-row { display: flex; gap: 14px; flex-wrap: wrap; }

        .btn-retry {
          background: var(--blue);
          border: none;
          color: var(--white);
          padding: 17px 44px;
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.18s;
          flex: 1;
          max-width: 220px;
        }

        .btn-retry:hover {
          background: var(--blue-mid);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(26,58,110,0.2);
        }

        .btn-share {
          background: var(--white);
          border: 1.5px solid var(--blue);
          color: var(--blue);
          padding: 17px 36px;
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s;
          flex: 1;
          max-width: 220px;
        }

        .btn-share:hover { background: var(--blue-light); }

        .btn-home {
          background: var(--white);
          border: 1.5px solid var(--border);
          color: var(--ink-muted);
          padding: 17px 28px;
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s;
        }

        .btn-home:hover { border-color: var(--blue); color: var(--blue); }

        @media (max-width: 560px) {
          .header { padding: 16px; }
          .logo { font-size: 17px; }
          .page { padding: 24px 20px 56px; }
          .sub-grid { grid-template-columns: 1fr; }
          .main-label { font-size: 64px; }
          .main-result { padding: 32px 24px; }
          .btn-retry, .btn-share { max-width: 100%; }
        }
      `}</style>

      <header className="header">
        <div className="logo" onClick={() => router.push("/")}>정치성향판별기</div>
      </header>

      <div className="page">
        {isShared && (
          <div className="shared-banner">
            📊 친구가 공유한 정치성향 결과입니다. 나도 검사해보세요!
          </div>
        )}

        <div className="main-result">
          <p className="main-eyebrow">판별 결과</p>
          <h1 className="main-label" style={{ color: main.color }}>{main.label}</h1>
          <p className="main-en">{main.en}</p>

          <div className="spectrum-wrap">
            <div className="spectrum-label-row">
              <span>극좌</span>
              <span>진보</span>
              <span>중도</span>
              <span>보수</span>
              <span>극우</span>
            </div>
            <div className="spectrum-bar-bg">
              <div className="spectrum-track" />
              <div className="spectrum-marker" style={{ left: `${main.bar}%` }} />
            </div>
          </div>

          <p className="main-desc">{main.desc}</p>
        </div>

        <h2 className="sub-title">부가 진단</h2>
        <div className="sub-grid">
          {subResults.map((r) => (
            <div key={r.title} className="sub-card">
              <div className="sub-card-dot" style={{ background: r.color }} />
              <p className="sub-card-title">{r.title}</p>
              <p className="sub-card-label" style={{ color: r.color }}>{r.label}</p>
              {r.desc && <p className="sub-card-desc">{r.desc}</p>}
            </div>
          ))}
        </div>

        <div className="btn-row">
          {!isShared && (
            <>
              <button className="btn-retry" onClick={() => { reset(); router.push("/intro"); }}>
                다시하기
              </button>
              <button className="btn-share" onClick={handleShare}>
                결과 공유하기
              </button>
            </>
          )}
          {isShared && (
            <button className="btn-retry" onClick={() => router.push("/intro")}>
              나도 검사하기
            </button>
          )}
          <button className="btn-home" onClick={() => router.push("/")}>
            홈으로
          </button>
        </div>
      </div>
    </>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div style={{ padding: 32, fontFamily: "Inter, sans-serif" }}>로딩 중...</div>}>
      <ResultContent />
    </Suspense>
  );
}
