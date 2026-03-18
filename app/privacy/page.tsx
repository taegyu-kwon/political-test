"use client";

import { useRouter } from "next/navigation";

export default function PrivacyPage() {
  const router = useRouter();

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
          max-width: 720px;
          margin: 0 auto;
          padding: 64px 48px 100px;
        }

        .eyebrow {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-muted);
          margin-bottom: 16px;
        }

        h1 {
          font-family: 'Playfair Display', serif;
          font-size: 48px;
          font-weight: 700;
          color: var(--ink);
          letter-spacing: -0.5px;
          line-height: 1.15;
          margin-bottom: 12px;
        }

        .updated {
          font-size: 14px;
          color: var(--ink-muted);
          margin-bottom: 56px;
        }

        .section {
          margin-bottom: 48px;
        }

        h2 {
          font-size: 18px;
          font-weight: 600;
          color: var(--ink);
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border);
        }

        p {
          font-size: 16px;
          color: var(--ink-muted);
          line-height: 1.85;
          margin-bottom: 12px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 12px;
          font-size: 15px;
        }

        th {
          background: var(--white);
          border: 1px solid var(--border);
          padding: 12px 16px;
          text-align: left;
          font-weight: 600;
          color: var(--ink);
          font-size: 14px;
        }

        td {
          border: 1px solid var(--border);
          padding: 12px 16px;
          color: var(--ink-muted);
          line-height: 1.6;
        }

        .contact-box {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 28px 32px;
          margin-top: 16px;
        }

        .contact-box p {
          margin-bottom: 6px;
        }

        @media (max-width: 560px) {
          .header { padding: 16px; }
          .logo { font-size: 17px; }
          .page { padding: 40px 20px 80px; }
          h1 { font-size: 36px; }
        }
      `}</style>

      <header className="header">
        <div className="logo" onClick={() => router.push("/")}>정치성향판별기</div>
      </header>

      <div className="page">
        <p className="eyebrow">Legal</p>
        <h1>개인정보처리방침</h1>
        <p className="updated">최종 업데이트: 2026년 3월 17일</p>

        <div className="section">
          <h2>1. 수집하는 정보</h2>
          <p>정치성향판별기는 서비스 개선과 통계 분석을 위해 다음의 정보를 익명으로 수집합니다.</p>
          <table>
            <thead>
              <tr>
                <th>항목</th>
                <th>수집 목적</th>
                <th>보유 기간</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>연령대</td>
                <td>연령별 정치성향 통계 분석</td>
                <td>서비스 종료 시까지</td>
              </tr>
              <tr>
                <td>성별</td>
                <td>성별 정치성향 통계 분석</td>
                <td>서비스 종료 시까지</td>
              </tr>
              <tr>
                <td>거주 지역</td>
                <td>지역별 정치성향 통계 분석</td>
                <td>서비스 종료 시까지</td>
              </tr>
              <tr>
                <td>진단 결과</td>
                <td>성향 분포 통계 분석</td>
                <td>서비스 종료 시까지</td>
              </tr>
            </tbody>
          </table>
          <p>수집된 정보는 개인을 식별할 수 없는 익명 통계 데이터로만 활용됩니다.</p>
        </div>

        <div className="section">
          <h2>2. 수집하지 않는 정보</h2>
          <p>본 서비스는 이름, 이메일, 전화번호, IP 주소 등 개인을 직접 식별할 수 있는 정보를 수집하지 않습니다. 별도의 회원가입이나 로그인도 없습니다.</p>
        </div>

        <div className="section">
          <h2>3. 정보의 활용</h2>
          <p>수집된 익명 통계 데이터는 다음과 같이 활용될 수 있습니다.</p>
          <p>서비스 품질 개선 및 문항 보완, 언론사·연구기관·정치 관련 기관과의 통계 데이터 공유, 공익적 목적의 정치성향 분석 리포트 발행. 단, 어떠한 경우에도 개인을 특정할 수 있는 형태로 제공되지 않습니다.</p>
        </div>

        <div className="section">
          <h2>4. 제3자 제공</h2>
          <p>개인을 식별할 수 없는 익명 통계 데이터에 한해, 언론사·연구기관·정치 관련 기관에 제공될 수 있습니다. 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.</p>
        </div>

        <div className="section">
          <h2>5. 쿠키 사용</h2>
          <p>본 서비스는 쿠키를 사용하지 않습니다.</p>
        </div>

        <div className="section">
          <h2>6. 문의</h2>
          <p>개인정보 처리에 관한 문의사항이 있으시면 아래로 연락해 주세요.</p>
          <div className="contact-box">
            <p><strong>서비스명</strong>: 정치성향판별기</p>
            <p><strong>이메일</strong>: political-test-kr@gmail.com</p>
          </div>
        </div>
      </div>
    </>
  );
}
