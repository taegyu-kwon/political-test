export type QuestionAxis = "economic" | "social" | "personality" | "media";

export type Question = {
  id: number;
  text: string;
  axis: QuestionAxis;
  direction: 1 | -1;
};

export const questions: Question[] = [
  // Part 1 — 성격/성향 (personality, 부가결과용)
  // 변화 수용도, 집단 동조성, 권위 의존도, 불확실성 내성, 감정적 반응성
  { id: 1, text: "기존 방식에 문제가 없어도 더 나은 방법이 있으면 바꾸고 싶다.", axis: "personality", direction: 1 },
  { id: 2, text: "주변 대부분이 동의해도 내가 틀렸다고 생각하면 따르지 않는다.", axis: "personality", direction: 1 },
  { id: 3, text: "한 번 옳다고 판단한 원칙은 쉽게 바뀌지 않는 편이다.", axis: "personality", direction: -1 },
  { id: 4, text: "불확실하더라도 더 나은 가능성이 있다면 시도해보고 싶다.", axis: "personality", direction: 1 },
  { id: 5, text: "규칙이 불합리해 보여도 모두가 따르고 있다면 나도 따르는 게 맞다고 생각한다.", axis: "personality", direction: -1 },
  { id: 6, text: "결론이 나지 않은 상황을 오래 견디는 것이 힘들다.", axis: "personality", direction: -1 },
  { id: 7, text: "손실 가능성이 있다면 안정적인 선택을 더 선호한다.", axis: "personality", direction: -1 },
  { id: 8, text: "사회 문제를 접할 때 분노나 불안보다 원인을 먼저 생각하게 된다.", axis: "personality", direction: 1 },
  { id: 9, text: "다른 의견을 듣고 내 생각을 수정한 경험이 많다.", axis: "personality", direction: 1 },
  { id: 10, text: "내가 틀렸다는 증거를 봐도 처음 생각을 바꾸기 어렵다.", axis: "personality", direction: -1 },

  // Part 2 — 경제적 관점 (economic, 메인결과용)
  // 복지/세금, 국가개입 vs 시장자율, 개인책임 vs 사회구조, 부의분배, 노동/기업
  { id: 11, text: "고소득자에게 더 높은 세율을 적용하는 것은 당연하다.", axis: "economic", direction: 1 },
  { id: 12, text: "개인의 성공과 실패는 주로 본인의 노력에 달려있다.", axis: "economic", direction: -1 },
  { id: 13, text: "재벌 대기업에 대한 규제를 강화해야 한다.", axis: "economic", direction: 1 },
  { id: 14, text: "최저임금을 높이면 결국 일자리가 줄어든다.", axis: "economic", direction: -1 },
  { id: 15, text: "국가가 의료와 교육을 더 많이 책임져야 한다.", axis: "economic", direction: 1 },
  { id: 16, text: "부동산 시장은 국가가 강하게 개입해야 안정된다.", axis: "economic", direction: 1 },
  { id: 17, text: "상속은 개인의 재산권이므로 과도한 상속세는 부당하다.", axis: "economic", direction: -1 },
  { id: 18, text: "기업하기 좋은 환경을 만드는 것이 복지보다 더 중요하다.", axis: "economic", direction: -1 },
  { id: 19, text: "비정규직 문제는 기업의 자율에 맡기기보다 법으로 해결해야 한다.", axis: "economic", direction: 1 },
  { id: 20, text: "경제 성장이 이루어지면 혜택은 자연스럽게 아래로 흘러간다.", axis: "economic", direction: -1 },

  // Part 3 — 정치·가치관 (social, 메인결과용)
  // 표현/언론자유, 권력집중 vs 분산, 개인자유 vs 공동체, 소수자/다양성, 사법/제도
  { id: 21, text: "표현의 자유라 해도 혐오 표현이나 차별적 발언은 법으로 제한해야 한다.", axis: "social", direction: 1 },
  { id: 22, text: "위기 상황에서는 권력이 한 곳에 집중되는 게 효율적이다.", axis: "social", direction: -1 },
  { id: 23, text: "사회적 성취는 개인의 능력과 경쟁에 의해 결정되는 것이 바람직하다.", axis: "social", direction: -1 },
  { id: 24, text: "민주주의에서는 효율성보다 절차와 견제가 더 중요하다.", axis: "social", direction: 1 },
  { id: 25, text: "북한에 대해서는 대화보다 강경한 대응이 우선되어야 한다.", axis: "social", direction: -1 },
  { id: 26, text: "동성 결혼 또는 동성 파트너십을 법적으로 인정해야 한다.", axis: "social", direction: 1 },
  { id: 27, text: "이민자와 외국인 노동자 수용을 확대하는 것은 사회에 도움이 된다.", axis: "social", direction: 1 },
  { id: 28, text: "노동조합의 파업권은 더 폭넓게 보장되어야 한다.", axis: "social", direction: 1 },
  { id: 29, text: "사회 질서 유지를 위해 강력한 공권력 행사가 필요할 때가 있다.", axis: "social", direction: -1 },
  { id: 30, text: "특정 집단을 위한 할당제나 우대 정책은 역차별이다.", axis: "social", direction: -1 },

  // Part 4 — 정보 소비/참여 습관 (media, 부가결과용)
  // 정치참여, 선동취약도, 확증편향, 판단방식
  { id: 31, text: "정치 뉴스는 일부러 피하는 편이다.", axis: "media", direction: 1 },
  { id: 32, text: "지지하는 정치인이 잘못을 해도 상대편보다는 낫다고 생각한다.", axis: "media", direction: -1 },
  { id: 33, text: "하나의 기사만 보기보다 여러 매체를 비교하는 편이다.", axis: "media", direction: -1 },
  { id: 34, text: "마음에 드는 매체를 주로 반복해서 보는 경향이 있다.", axis: "media", direction: 1 },
  { id: 35, text: "논란이 되는 이슈는 감정보다 구조를 이해하려 한다.", axis: "media", direction: -1 },
  { id: 36, text: "내 생각과 비슷한 의견이 더 설득력 있게 느껴진다.", axis: "media", direction: 1 },
  { id: 37, text: "이미 입장이 정해진 이슈는 더 깊이 알아보지 않는다.", axis: "media", direction: 1 },
  { id: 38, text: "유명인이 말하면 더 신뢰하게 된다.", axis: "media", direction: -1 },
  { id: 39, text: "선거는 반드시 참여해야 한다고 생각한다.", axis: "media", direction: -1 },
  { id: 40, text: "정치 이슈를 접할 때 화가 나거나 불안해지는 경우가 자주 있다.", axis: "media", direction: 1 },
];

export const partLabels: Record<QuestionAxis, string> = {
  personality: "성격 · 성향",
  economic: "경제적 관점",
  social: "정치 · 가치관",
  media: "정보 소비 습관",
};
