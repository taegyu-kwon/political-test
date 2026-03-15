"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { useTestStore } from "@/store/testStore";
import { supabase } from "@/lib/supabase";

const AGE_OPTIONS = ["10대", "20대", "30대", "40대", "50대", "60대 이상"];
const GENDER_OPTIONS = ["남성", "여성", "응답 안 함"];
const REGION_OPTIONS = [
  "서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종",
  "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주",
];

export default function IntroPage() {
  const router = useRouter();
  const { setDemo } = useTestStore();
  const [age, setAge] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [region, setRegion] = useState<string | null>(null);

  const genderRef = useRef<HTMLDivElement | null>(null);
  const regionRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLDivElement | null>(null);

  const canProceed = age !== null && gender !== null && region !== null;

  const handleAgeSelect = (a: string) => {
    setAge(a);
    if (!gender) {
      setTimeout(() => {
        genderRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 120);
    }
  };

  const handleGenderSelect = (g: string) => {
    setGender(g);
    if (!region) {
      setTimeout(() => {
        regionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 120);
    }
  };

  const handleRegionSelect = (r: string) => {
    setRegion(r);
    setTimeout(() => {
      btnRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);
  };

  const handleStart = async () => {
    setDemo({ age, gender, region });

    await supabase.from("responses").insert({
      age,
      gender,
      region,
    });

    router.push("/test");
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
          padding: 48px 48px 100px;
        }

        .intro-header { margin-bottom: 48px; }

        .eyebrow {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-muted);
          margin-bottom: 14px;
        }

        .title {
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          font-weight: 700;
          color: var(--blue);
          font-style: italic;
          margin-bottom: 16px;
          line-height: 1.3;
        }

        .subtitle {
          font-size: 17px;
          color: var(--ink-muted);
          line-height: 1.7;
        }

        .section { margin-bottom: 40px; }

        .section-label {
          font-size: 16px;
          font-weight: 600;
          color: var(--ink);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .section-label .required { color: #dc2626; font-size: 13px; }

        .chip-group { display: flex; flex-wrap: wrap; gap: 10px; }

        .chip {
          padding: 11px 24px;
          border-radius: 28px;
          border: 1.5px solid var(--border);
          background: var(--white);
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: var(--ink-muted);
          cursor: pointer;
          transition: all 0.15s ease;
          outline: none;
        }

        .chip:hover { border-color: var(--blue); color: var(--blue); }
        .chip.selected { border-color: var(--blue); background: var(--blue); color: var(--white); }

        .region-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
          gap: 10px;
        }

        .region-chip {
          padding: 11px 4px;
          border-radius: 10px;
          border: 1.5px solid var(--border);
          background: var(--white);
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: var(--ink-muted);
          cursor: pointer;
          transition: all 0.15s ease;
          outline: none;
          text-align: center;
        }

        .region-chip:hover { border-color: var(--blue); color: var(--blue); }
        .region-chip.selected { border-color: var(--blue); background: var(--blue); color: var(--white); }

        .divider { height: 1px; background: var(--border); margin: 40px 0; }

        .privacy-note {
          font-size: 14px;
          color: var(--ink-muted);
          line-height: 1.65;
          padding: 18px 20px;
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 10px;
          margin-bottom: 28px;
        }

        .btn-start {
          width: 100%;
          max-width: 360px;
          background: var(--blue);
          border: none;
          color: var(--white);
          padding: 18px 40px;
          font-family: 'Inter', sans-serif;
          font-size: 17px;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.18s;
          display: block;
        }

        .btn-start:hover:not(:disabled) {
          background: var(--blue-mid);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(26,58,110,0.2);
        }

        .btn-start:disabled { opacity: 0.35; cursor: not-allowed; }

        @media (max-width: 560px) {
          .header { padding: 16px; }
          .logo { font-size: 17px; }
          .page { padding: 24px 20px 60px; }
          .title { font-size: 26px; }
          .subtitle { font-size: 14px; }
          .chip { font-size: 13px; padding: 9px 18px; }
          .region-chip { font-size: 13px; }
          .region-grid { grid-template-columns: repeat(auto-fill, minmax(76px, 1fr)); }
          .btn-start { font-size: 15px; padding: 15px 32px; }
        }
      `}</style>

      <header className="header">
        <div className="logo" onClick={() => router.push("/")}>정치성향판별기</div>
      </header>

      <div className="page">
        <div className="intro-header">
          <p className="eyebrow">시작 전 기본 정보</p>
          <h1 className="title">검사를 시작하기 전에<br />간단한 정보를 입력해주세요</h1>
          <p className="subtitle">
            입력하신 정보는 연령대·성별·지역별 정치 성향 분석에만 활용되며,<br />
            개인을 특정하는 데 사용되지 않습니다.
          </p>
        </div>

        <div className="section">
          <p className="section-label">연령대 <span className="required">필수</span></p>
          <div className="chip-group">
            {AGE_OPTIONS.map((a) => (
              <button key={a} className={`chip ${age === a ? "selected" : ""}`} onClick={() => handleAgeSelect(a)}>{a}</button>
            ))}
          </div>
        </div>

        <div className="section" ref={genderRef}>
          <p className="section-label">성별 <span className="required">필수</span></p>
          <div className="chip-group">
            {GENDER_OPTIONS.map((g) => (
              <button key={g} className={`chip ${gender === g ? "selected" : ""}`} onClick={() => handleGenderSelect(g)}>{g}</button>
            ))}
          </div>
        </div>

        <div className="section" ref={regionRef}>
          <p className="section-label">거주 지역 <span className="required">필수</span></p>
          <div className="region-grid">
            {REGION_OPTIONS.map((r) => (
              <button key={r} className={`region-chip ${region === r ? "selected" : ""}`} onClick={() => handleRegionSelect(r)}>{r}</button>
            ))}
          </div>
        </div>

        <div className="divider" />

        <p className="privacy-note">
          ※ 수집된 정보는 건강한 정치 문화 조성을 위한 통계 분석 목적으로만 사용됩니다.
          개인을 식별할 수 있는 정보는 수집하지 않습니다.
        </p>

        <div ref={btnRef}>
          <button className="btn-start" onClick={handleStart} disabled={!canProceed}>
            검사 시작하기
          </button>
        </div>
      </div>
    </>
  );
}