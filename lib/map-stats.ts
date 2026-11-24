export type SK = "far_left" | "left" | "center" | "right" | "far_right";
export interface RD {
  name: string;
  label: string;
  participants: number;
  dominant: string;
  lean: number;
  scores: Record<SK, number>;
}

const REGIONS: Record<string, { name: string; label: string }> = {
  gyeonggi:  { name: "경기도",        label: "경기" },
  seoul:     { name: "서울특별시",     label: "서울" },
  incheon:   { name: "인천광역시",     label: "인천" },
  gangwon:   { name: "강원도",        label: "강원" },
  chungbuk:  { name: "충청북도",      label: "충북" },
  chungnam:  { name: "충청남도",      label: "충남" },
  daejeon:   { name: "대전광역시",     label: "대전" },
  sejong:    { name: "세종특별자치시", label: "세종" },
  jeonbuk:   { name: "전북특별자치도", label: "전북" },
  jeonnam:   { name: "전라남도",      label: "전남" },
  gwangju:   { name: "광주광역시",     label: "광주" },
  gyeongbuk: { name: "경상북도",      label: "경북" },
  gyeongnam: { name: "경상남도",      label: "경남" },
  daegu:     { name: "대구광역시",     label: "대구" },
  ulsan:     { name: "울산광역시",     label: "울산" },
  busan:     { name: "부산광역시",     label: "부산" },
  jeju:      { name: "제주특별자치도", label: "제주" },
};

const LABEL_TO_ID: Record<string, string> = Object.fromEntries(
  Object.entries(REGIONS).map(([id, r]) => [r.label, id])
);

const RESULT_TO_SK: Record<string, SK> = {
  "극좌": "far_left",
  "진보": "left",
  "중도": "center",
  "보수": "right",
  "극우": "far_right",
};

const EMPTY_SCORES: Record<SK, number> = {
  far_left: 0, left: 0, center: 0, right: 0, far_right: 0,
};

export function emptyRegionData(): Record<string, RD> {
  return Object.fromEntries(
    Object.entries(REGIONS).map(([id, r]) => [
      id,
      {
        name: r.name,
        label: r.label,
        participants: 0,
        dominant: "데이터 없음",
        lean: 0,
        scores: { ...EMPTY_SCORES },
      },
    ])
  );
}

function dominantFrom(scores: Record<SK, number>): string {
  const prog = scores.far_left + scores.left;
  const cons = scores.right + scores.far_right;
  const cen = scores.center;
  if (cen >= prog && cen >= cons) {
    if (cons >= prog + 8) return "중도 보수";
    if (prog >= cons + 8) return "중도 진보";
    return "중도";
  }
  if (prog > cons) return scores.far_left >= scores.left ? "극좌" : "진보";
  return scores.far_right >= scores.right ? "극우" : "보수";
}

function leanFrom(scores: Record<SK, number>): number {
  return (
    scores.far_left * -50 +
    scores.left * -25 +
    scores.center * 0 +
    scores.right * 25 +
    scores.far_right * 50
  ) / 100;
}

function buildFromCounts(counts: Record<string, Record<SK, number>>): Record<string, RD> {
  const out: Record<string, RD> = {};
  for (const id of Object.keys(REGIONS)) {
    const c = counts[id] ?? { ...EMPTY_SCORES };
    const total = c.far_left + c.left + c.center + c.right + c.far_right;
    if (total === 0) {
      out[id] = {
        name: REGIONS[id].name,
        label: REGIONS[id].label,
        participants: 0,
        dominant: "데이터 없음",
        lean: 0,
        scores: { ...EMPTY_SCORES },
      };
      continue;
    }
    const scores: Record<SK, number> = {
      far_left: Math.round((c.far_left / total) * 100),
      left: Math.round((c.left / total) * 100),
      center: Math.round((c.center / total) * 100),
      right: Math.round((c.right / total) * 100),
      far_right: Math.round((c.far_right / total) * 100),
    };
    const drift = 100 - (scores.far_left + scores.left + scores.center + scores.right + scores.far_right);
    if (drift !== 0) {
      const key = (Object.keys(scores) as SK[]).sort((a, b) => scores[b] - scores[a])[0];
      scores[key] += drift;
    }
    out[id] = {
      name: REGIONS[id].name,
      label: REGIONS[id].label,
      participants: total,
      dominant: dominantFrom(scores),
      lean: leanFrom(scores),
      scores,
    };
  }
  return out;
}

export function aggregateRows(rows: unknown): Record<string, RD> {
  if (!Array.isArray(rows)) throw new Error("Invalid aggregate response");
  const counts: Record<string, Record<SK, number>> = {};
  for (const id of Object.keys(REGIONS)) {
    counts[id] = { far_left: 0, left: 0, center: 0, right: 0, far_right: 0 };
  }

  for (const row of rows) {
    if (!row || typeof row.region !== "string" || typeof row.result !== "string") {
      throw new Error("Invalid aggregate row");
    }
    const id = LABEL_TO_ID[row.region];
    const sk = RESULT_TO_SK[row.result];
    if (!Object.hasOwn(LABEL_TO_ID, row.region) || !Object.hasOwn(RESULT_TO_SK, row.result)) continue;
    const count = typeof row.cnt === "string" && /^\d+$/.test(row.cnt) ? Number(row.cnt) : row.cnt;
    if (!Number.isSafeInteger(count) || count < 0 || !Number.isSafeInteger(counts[id][sk] + count)) {
      throw new Error("Invalid aggregate count");
    }
    counts[id][sk] += count;
  }

  const total = Object.values(counts).reduce((sum, group) =>
    sum + Object.values(group).reduce((a, b) => a + b, 0), 0);
  if (!Number.isSafeInteger(total)) throw new Error("Aggregate count overflow");
  return buildFromCounts(counts);
}

