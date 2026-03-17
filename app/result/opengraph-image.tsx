import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "정치성향판별기 - 나의 결과";
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
        {/* 좌측 라인 */}
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
          판별 결과
        </div>

        {/* 메인 */}
        <div
          style={{
            fontSize: 88,
            fontWeight: 700,
            color: "#1a3a6e",
            lineHeight: 1,
            marginBottom: 16,
            display: "flex",
          }}
        >
          나의 정치 성향은?
        </div>

        {/* 설명 */}
        <div
          style={{
            fontSize: 28,
            color: "#6e6e73",
            marginTop: 24,
            lineHeight: 1.6,
            display: "flex",
          }}
        >
          친구가 공유한 결과입니다. 나도 검사해보세요!
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
