import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "정치성향판별기";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#faf8f4",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 100px",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        {/* 좌측 파란 라인 */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 12,
            background: "linear-gradient(to bottom, #1d4ed8, #b91c1c)",
          }}
        />

        {/* 태그라인 */}
        <div
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: "#6e6e73",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 24,
            display: "flex",
          }}
        >
          가치관으로 읽는 나의 정치 성향
        </div>

        {/* 메인 타이틀 */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: "#1c1c1e",
            lineHeight: 1.1,
            marginBottom: 12,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>당신이 모르는</span>
          <span style={{ color: "#1a3a6e" }}>당신의 정치 성향</span>
        </div>

        {/* 설명 */}
        <div
          style={{
            fontSize: 26,
            color: "#6e6e73",
            marginTop: 24,
            lineHeight: 1.6,
            display: "flex",
          }}
        >
          단순한 좌우 구분을 넘어 경제·사회·성향·정보소비 네 가지 측으로 분석합니다.
        </div>

        {/* 하단 앱 이름 */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 100,
            fontSize: 24,
            fontWeight: 700,
            color: "#1a3a6e",
            display: "flex",
          }}
        >
          정치성향판별기
        </div>

        {/* 스펙트럼 바 */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 12,
            right: 0,
            height: 8,
            background: "linear-gradient(to right, #1d4ed8, #9ca3af, #b91c1c)",
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
