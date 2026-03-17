import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "정치성향판별기";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const playfairRes = await fetch(
    "https://fonts.gstatic.com/s/playfairdisplay/v37/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtM.woff2"
  );
  const playfairData = await playfairRes.arrayBuffer();

  const playfairItalicRes = await fetch(
    "https://fonts.gstatic.com/s/playfairdisplay/v37/nuFRD-vYSZviVYUb_rj3ij__anPXDTzYh0c7AAFe.woff2"
  );
  const playfairItalicData = await playfairItalicRes.arrayBuffer();

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
        {/* 좌측 라인 */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 12,
            background: "linear-gradient(to bottom, #1d4ed8, #b91c1c)",
            display: "flex",
          }}
        />

        {/* 태그라인 */}
        <div
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: "#2e5fad",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: 28,
            display: "flex",
            fontFamily: "sans-serif",
          }}
        >
          가치관으로 읽는 나의 정치 성향
        </div>

        {/* 메인 타이틀 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              fontSize: 88,
              fontWeight: 700,
              color: "#1c1c1e",
              lineHeight: 1.1,
              letterSpacing: "-1px",
              fontFamily: "Playfair Display",
              display: "flex",
            }}
          >
            당신이 모르는
          </div>
          <div
            style={{
              fontSize: 88,
              fontWeight: 700,
              color: "#1a3a6e",
              lineHeight: 1.1,
              letterSpacing: "-1px",
              fontFamily: "Playfair Display",
              fontStyle: "italic",
              display: "flex",
            }}
          >
            당신의 정치 성향
          </div>
        </div>

        {/* 설명 */}
        <div
          style={{
            fontSize: 24,
            color: "#6e6e73",
            lineHeight: 1.8,
            display: "flex",
            fontFamily: "sans-serif",
          }}
        >
          단순한 좌우 구분을 넘어 경제·사회·성향·정보소비 네 가지 축으로 분석합니다.
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
            letterSpacing: "-0.2px",
            fontFamily: "Playfair Display",
            display: "flex",
          }}
        >
          정치성향판별기
        </div>

        {/* 하단 스펙트럼 바 */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 12,
            right: 0,
            height: 8,
            background: "linear-gradient(to right, #1d4ed8, #9ca3af, #b91c1c)",
            display: "flex",
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Playfair Display",
          data: playfairData,
          weight: 700,
          style: "normal",
        },
        {
          name: "Playfair Display",
          data: playfairItalicData,
          weight: 700,
          style: "italic",
        },
      ],
    }
  );
}
