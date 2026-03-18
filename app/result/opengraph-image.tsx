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
          position: "relative",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 28 }}>
          <div
            style={{
              fontSize: 88,
              fontWeight: 700,
              color: "#1c1c1e",
              lineHeight: 1.1,
              letterSpacing: "-1px",
              fontFamily: "serif",
              display: "flex",
            }}
          >
            나의 정치 성향은?
          </div>
          <div
            style={{
              fontSize: 88,
              fontWeight: 700,
              color: "#1a3a6e",
              lineHeight: 1.1,
              letterSpacing: "-1px",
              fontFamily: "serif",
              fontStyle: "italic",
              display: "flex",
            }}
          >
            직접 확인해보세요
          </div>
        </div>

        <div
          style={{
            fontSize: 24,
            color: "#6e6e73",
            lineHeight: 1.8,
            display: "flex",
          }}
        >
          친구가 공유한 결과입니다. 검사 후 결과를 친구와 공유해보세요!
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 100,
            fontSize: 24,
            fontWeight: 700,
            color: "#1a3a6e",
            fontFamily: "serif",
            display: "flex",
          }}
        >
          정치성향판별기
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
