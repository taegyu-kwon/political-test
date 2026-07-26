"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type SK = "far_left" | "left" | "center" | "right" | "far_right";
interface RD {
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

const SEED: Record<string, Omit<RD, "name" | "label">> = {
  gyeonggi:  { participants: 31842, dominant: "중도",      lean:   3, scores: { far_left:  7, left: 24, center: 40, right: 22, far_right:  7 } },
  seoul:     { participants: 18732, dominant: "중도",      lean:   0, scores: { far_left:  9, left: 24, center: 39, right: 20, far_right:  8 } },
  incheon:   { participants:  7245, dominant: "중도",      lean:  -5, scores: { far_left:  8, left: 27, center: 38, right: 21, far_right:  6 } },
  gangwon:   { participants:  5621, dominant: "중도 보수",  lean:  18, scores: { far_left:  5, left: 18, center: 37, right: 28, far_right: 12 } },
  chungbuk:  { participants:  5234, dominant: "중도",      lean:  12, scores: { far_left:  6, left: 19, center: 38, right: 27, far_right: 10 } },
  chungnam:  { participants:  6103, dominant: "중도",      lean:   8, scores: { far_left:  6, left: 21, center: 39, right: 25, far_right:  9 } },
  daejeon:   { participants:  5238, dominant: "중도",      lean:  -3, scores: { far_left:  8, left: 26, center: 39, right: 21, far_right:  6 } },
  sejong:    { participants:  1824, dominant: "중도",      lean:  -8, scores: { far_left:  9, left: 28, center: 37, right: 20, far_right:  6 } },
  jeonbuk:   { participants:  5948, dominant: "진보",      lean: -32, scores: { far_left: 14, left: 32, center: 30, right: 17, far_right:  7 } },
  jeonnam:   { participants:  4827, dominant: "진보",      lean: -42, scores: { far_left: 17, left: 35, center: 27, right: 15, far_right:  6 } },
  gwangju:   { participants:  4213, dominant: "진보",      lean: -48, scores: { far_left: 20, left: 36, center: 25, right: 14, far_right:  5 } },
  gyeongbuk: { participants:  7934, dominant: "보수",      lean:  42, scores: { far_left:  4, left: 13, center: 27, right: 36, far_right: 20 } },
  gyeongnam: { participants:  9128, dominant: "보수",      lean:  32, scores: { far_left:  5, left: 16, center: 30, right: 33, far_right: 16 } },
  daegu:     { participants:  6742, dominant: "보수",      lean:  45, scores: { far_left:  3, left: 11, center: 25, right: 37, far_right: 24 } },
  ulsan:     { participants:  3891, dominant: "보수",      lean:  28, scores: { far_left:  5, left: 17, center: 31, right: 32, far_right: 15 } },
  busan:     { participants:  8924, dominant: "중도 보수",  lean:  22, scores: { far_left:  5, left: 19, center: 33, right: 30, far_right: 13 } },
  jeju:      { participants:  2198, dominant: "중도",      lean: -12, scores: { far_left:  9, left: 26, center: 37, right: 21, far_right:  7 } },
};


const PATHS: Record<string, { d: string; lx: number; ly: number; fs?: number }> = {
  gyeonggi: {
    d: "M139.7,207.4L142.8,208.3L142.4,210.5L149.6,217.4L163.4,212.3L171.9,218.0L172.3,215.4L178.4,212.8L178.1,210.3L181.2,209.3L182.5,206.5L187.7,207.1L189.0,204.6L190.4,205.1L192.3,202.5L191.9,198.9L195.9,199.8L199.1,194.1L199.6,183.0L202.3,178.4L199.7,172.9L204.9,169.3L201.7,166.8L196.7,166.7L190.4,161.8L187.8,163.6L186.6,162.6L188.0,156.7L184.7,156.4L187.0,153.5L185.9,148.3L190.4,145.2L191.0,140.2L187.1,138.4L186.7,135.8L182.2,134.9L180.8,127.7L173.8,128.7L171.2,126.5L171.6,122.1L168.0,125.6L164.5,118.0L161.6,118.0L160.9,114.7L153.8,118.8L151.9,123.8L152.9,125.4L149.3,125.5L146.7,127.7L146.3,132.8L144.1,135.6L135.5,139.2L136.7,145.6L134.8,147.9L135.0,152.2L130.9,153.7L126.4,152.5L127.3,161.6L129.6,165.8L132.8,165.5L134.5,162.9L140.1,167.1L142.7,167.0L143.3,165.3L146.3,167.8L149.0,166.4L149.7,162.4L151.8,161.3L153.9,163.0L155.8,158.2L160.5,159.1L161.1,169.0L165.3,167.2L165.7,169.8L163.1,172.4L164.2,173.9L158.8,178.4L155.0,175.6L149.1,178.0L147.2,173.6L144.0,175.0L144.4,170.1L141.1,169.1L139.7,174.1L141.8,176.8L139.7,181.8L136.3,185.5L127.7,189.1L129.4,192.7L128.1,194.9L132.0,194.8L131.9,193.0L134.0,196.1L133.8,190.3L130.0,188.5L135.5,185.8L144.1,188.1L142.5,192.1L133.9,189.6L134.5,198.8L136.9,198.9L136.2,201.9L140.5,206.1L139.7,207.4ZM140.5,206.0L136.3,201.9L142.7,197.2L142.1,198.9L144.0,199.5L140.7,201.5L140.5,206.0Z",
    lx: 169.6, ly: 180.6, fs: 12,
  },
  seoul: {
    d: "M156.2,158.2L153.9,163.0L151.5,161.4L149.0,166.4L146.3,167.8L143.3,165.3L141.0,169.0L144.4,170.1L144.0,175.0L147.2,173.6L149.1,178.0L155.0,175.6L158.8,178.4L163.4,175.1L163.2,172.0L165.7,169.8L165.2,167.2L161.1,169.0L160.5,159.1L156.2,158.2Z",
    lx: 154.3, ly: 168.7, fs: 9,
  },
  incheon: {
    d: "M102.3,190.1L101.0,193.6L104.4,194.3L105.7,192.9L102.3,190.1ZM124.3,192.1L125.3,189.7L121.5,189.9L121.5,193.1L124.3,192.1ZM125.6,170.8L124.0,173.1L117.1,175.1L117.6,177.5L122.0,179.0L130.3,173.8L125.6,170.8ZM138.6,166.2L134.5,162.9L129.8,166.6L131.7,169.0L131.6,173.4L133.6,172.8L130.9,177.7L133.3,178.3L131.3,179.4L134.5,183.8L130.3,184.5L135.1,184.3L141.2,178.5L141.8,175.2L139.7,172.5L142.7,167.0L138.6,166.2ZM78.7,159.8L76.9,159.8L77.4,161.8L78.7,159.8ZM115.3,154.8L112.9,155.0L111.9,157.6L115.8,162.3L118.2,159.5L114.6,157.2L115.3,154.8ZM23.4,152.4L20.8,153.6L23.4,152.4ZM111.6,149.7L108.0,152.8L109.6,154.4L115.4,151.6L111.6,149.7ZM121.8,148.9L116.6,151.4L116.8,157.7L120.1,161.2L118.0,164.8L126.4,167.2L128.0,164.3L126.9,154.7L121.8,148.9ZM20.1,148.8L20.3,147.4L17.5,149.3L19.4,150.4L20.1,148.8ZM18.4,137.3L14.0,138.0L15.5,141.4L18.7,142.0L21.9,138.9L18.4,137.3Z",
    lx: 128.3, ly: 175.4, fs: 8,
  },
  gangwon: {
    d: "M256.6,134.0L249.8,124.6L238.1,94.1L234.7,89.8L232.2,91.2L230.6,103.1L223.2,110.1L214.9,112.3L214.2,115.0L206.5,112.0L203.4,113.0L201.2,109.8L194.5,111.6L189.0,110.6L184.2,113.3L177.3,110.5L172.6,112.3L169.0,110.8L162.7,112.3L160.5,114.7L161.6,118.0L164.5,118.0L168.0,125.6L171.6,122.1L171.2,126.5L173.8,128.7L180.8,127.7L182.2,134.9L186.7,135.8L187.1,138.4L191.0,140.2L190.4,145.2L186.1,147.8L187.0,153.5L184.7,156.4L188.0,156.7L187.2,163.2L190.4,161.8L196.7,166.7L201.7,166.8L204.9,169.3L199.7,172.9L202.3,178.4L199.6,183.0L198.8,194.8L201.5,199.6L209.4,198.0L209.3,193.5L212.1,191.2L215.0,192.1L216.0,196.2L219.9,195.2L221.2,192.9L223.5,194.4L226.1,191.8L229.7,194.8L233.4,194.3L229.6,198.6L231.4,200.3L236.5,198.5L238.8,202.4L243.2,200.9L245.5,203.5L250.6,203.7L258.0,208.0L259.9,203.4L265.3,206.9L268.3,203.4L276.3,205.4L278.5,202.8L283.8,207.1L286.6,206.9L286.1,204.7L288.8,201.6L294.3,199.4L293.9,192.7L283.8,176.3L280.2,173.8L279.6,167.2L276.0,164.1L276.1,160.1L265.5,148.2L256.6,134.0Z",
    lx: 234.5, ly: 162.0, fs: 12,
  },
  chungnam: {
    d: "M118.0,239.9L118.0,239.9ZM118.0,239.9L117.1,238.8L114.3,240.7L115.3,251.3L121.1,254.4L117.1,241.6L118.0,239.9ZM136.9,210.2L133.3,210.1L125.3,205.4L122.7,210.3L116.9,209.4L115.4,211.3L118.7,212.6L115.6,212.8L121.4,217.5L117.4,219.3L117.3,222.6L115.5,220.3L115.8,223.6L112.8,224.9L115.2,218.3L113.6,211.9L112.7,217.3L106.3,218.7L106.7,224.0L105.2,221.5L102.6,226.8L103.2,231.7L105.1,228.1L109.0,230.7L105.7,231.0L105.1,233.9L107.3,234.1L111.7,230.1L113.1,240.7L117.5,237.7L123.3,240.9L125.2,251.8L127.3,251.3L124.2,255.3L128.9,257.8L125.6,259.8L128.2,264.4L125.0,273.6L129.9,273.5L134.0,277.1L133.1,279.6L135.3,283.3L139.3,283.6L140.0,281.7L147.1,279.0L148.4,273.3L152.3,272.1L157.6,273.4L158.4,276.6L162.1,278.9L163.5,277.0L169.6,277.5L169.7,275.3L174.9,274.2L178.4,282.8L180.5,281.5L181.8,284.8L184.8,285.0L186.5,283.9L186.2,280.6L191.1,283.5L192.5,278.6L189.6,273.8L190.1,267.6L186.3,265.2L181.1,269.3L176.8,263.7L174.5,270.1L171.4,265.7L172.1,264.2L169.4,262.3L171.5,253.2L166.7,251.5L165.1,247.2L167.1,241.3L164.0,239.1L164.5,233.7L162.4,231.7L164.6,229.8L171.7,233.0L174.7,228.4L179.6,227.7L178.0,224.4L164.3,212.4L146.7,219.0L144.1,217.9L142.1,212.0L136.9,210.2Z",
    lx: 143.1, ly: 247.0, fs: 11,
  },
  sejong: {
    d: "M165.0,230.0L162.4,231.7L164.5,233.7L164.0,239.1L167.1,241.3L164.9,246.1L166.6,251.4L169.6,253.8L174.1,252.7L176.1,247.8L179.1,247.3L178.8,244.3L172.5,240.6L171.2,236.6L173.0,233.6L165.0,230.0Z",
    lx: 169.6, ly: 243.3, fs: 7,
  },
  chungbuk: {
    d: "M171.9,218.0L179.6,227.7L174.7,228.4L171.7,233.0L173.0,233.6L171.2,236.6L172.5,240.6L178.6,244.0L178.6,250.2L181.7,250.7L183.4,248.7L184.5,253.7L186.7,252.8L187.9,254.5L184.4,258.7L184.0,266.2L186.3,265.2L190.1,267.6L189.6,273.8L193.7,280.6L195.5,279.0L200.1,282.7L205.0,280.6L206.6,281.9L211.6,278.5L212.9,268.9L217.2,268.8L215.4,264.0L211.5,265.2L208.1,261.6L205.1,263.6L204.5,260.9L207.4,257.3L205.9,255.0L206.5,247.9L208.3,246.5L201.9,239.6L205.3,238.8L206.8,235.5L209.4,239.4L209.7,234.6L206.8,233.8L209.7,233.0L211.3,229.6L218.0,231.7L215.8,228.8L217.5,223.7L219.3,225.2L221.8,222.5L226.6,224.0L228.0,219.7L232.5,223.7L238.6,224.0L240.4,221.4L238.9,219.3L239.9,215.6L248.2,207.0L252.3,205.4L245.5,203.5L243.2,200.9L238.8,202.4L236.5,198.5L230.4,199.7L229.8,197.9L233.2,195.5L232.4,193.7L229.7,194.8L226.1,191.8L223.5,194.4L221.2,192.9L219.9,195.2L216.0,196.2L215.0,192.1L212.7,191.1L209.6,193.0L210.0,197.2L208.1,198.9L201.5,199.6L198.3,194.6L195.5,200.1L191.9,198.9L192.3,202.5L190.4,205.1L189.0,204.6L187.7,207.1L182.5,206.5L181.2,209.3L178.1,210.3L178.4,212.8L172.3,215.4L171.9,218.0Z",
    lx: 199.1, ly: 224.9, fs: 11,
  },
  daejeon: {
    d: "M178.4,247.8L176.1,247.8L174.8,252.3L171.5,253.2L169.4,262.3L174.6,270.2L176.8,263.7L180.5,269.1L183.8,266.6L184.4,258.7L187.9,254.5L186.7,252.8L184.5,253.7L183.5,248.8L181.7,250.7L178.9,250.3L178.4,247.8Z",
    lx: 178.5, ly: 260.2, fs: 8,
  },
  jeonbuk: {
    d: "M137.2,283.9L134.7,284.6L137.2,283.9ZM192.5,278.6L191.1,283.5L186.2,280.6L186.5,283.9L183.7,285.2L180.5,281.5L178.5,282.9L177.1,281.8L174.9,274.2L169.7,275.3L169.6,277.5L163.5,277.0L162.1,278.9L158.4,276.6L157.6,273.4L152.3,272.1L148.4,273.3L147.1,279.0L140.0,281.7L139.3,284.6L126.9,285.5L125.2,294.7L123.9,296.5L122.0,296.0L122.4,297.5L125.1,295.8L127.4,288.4L130.6,289.3L130.9,287.4L132.2,291.5L135.7,291.7L137.6,298.3L133.2,298.1L133.0,301.8L129.4,305.9L124.4,297.4L128.7,305.5L122.9,310.0L123.0,311.9L125.9,314.2L135.3,314.6L124.4,318.6L121.2,324.6L124.8,326.2L124.0,328.2L126.8,333.4L130.4,334.3L130.5,332.1L133.9,332.9L137.1,330.8L140.4,325.8L139.6,323.3L144.7,320.9L151.5,327.6L156.9,322.3L157.9,325.2L156.5,327.5L159.1,329.7L157.4,332.8L161.1,334.5L167.9,331.9L177.6,334.2L180.7,329.8L182.7,329.7L188.9,333.7L190.6,333.1L194.6,323.9L192.4,322.9L193.2,320.1L189.5,315.8L192.3,311.4L193.9,301.0L198.8,294.9L204.5,293.3L208.6,287.3L205.2,280.7L200.1,282.7L195.5,279.0L193.7,280.6L192.5,278.6Z",
    lx: 163.7, ly: 301.8, fs: 11,
  },
  gyeongbuk: {
    d: "M297.6,218.1L298.0,205.4L294.3,199.4L288.8,201.6L286.1,204.7L286.6,206.9L283.8,207.1L278.5,202.8L276.3,205.4L268.3,203.4L265.3,206.9L259.9,203.4L258.0,208.0L252.3,205.4L247.2,207.9L246.6,210.3L239.9,215.6L238.9,219.3L240.4,221.4L238.6,224.0L232.5,223.7L228.0,219.7L226.6,224.0L221.8,222.5L219.3,225.2L217.5,223.7L215.8,228.8L218.0,231.7L211.3,229.6L209.7,233.0L207.3,232.9L210.3,235.8L209.4,239.4L206.8,235.5L205.3,238.8L201.9,239.6L208.3,246.5L206.5,247.9L205.9,255.0L207.4,257.3L204.5,260.9L205.1,263.6L208.1,261.6L211.5,265.2L215.4,264.0L217.2,268.8L212.9,268.9L211.6,278.5L206.6,281.9L208.6,287.3L206.9,290.6L214.6,296.0L220.9,296.3L225.5,302.8L226.0,306.6L223.4,308.7L231.9,308.7L236.8,311.4L237.5,309.3L234.6,305.1L239.5,304.9L236.5,301.0L238.7,297.5L242.4,296.6L236.5,294.3L237.4,290.9L240.6,287.7L241.5,290.9L243.7,291.7L245.2,285.0L246.5,286.4L250.4,283.1L254.9,282.4L257.9,285.5L258.7,293.3L254.2,298.9L254.2,303.9L250.4,305.2L250.1,302.7L248.1,302.6L245.0,304.5L245.5,310.9L248.4,313.7L254.4,313.0L260.1,315.1L267.8,309.7L272.1,312.0L275.6,309.0L277.6,309.5L277.4,305.9L281.5,303.6L288.0,305.3L288.0,308.3L290.1,309.4L293.7,306.9L299.4,309.0L304.4,293.2L303.5,288.9L307.3,280.2L305.1,277.4L299.2,284.1L296.2,282.3L298.3,281.4L295.1,280.4L298.8,276.5L296.2,273.3L294.9,264.9L299.6,246.5L297.2,237.9L301.0,230.2L297.6,218.1ZM385.6,170.1L378.6,171.8L379.6,175.0L383.3,176.5L385.9,174.4L385.6,170.1Z",
    lx: 255.2, ly: 254.3, fs: 12,
  },
  daegu: {
    d: "M245.1,306.6L247.1,302.8L250.1,302.7L250.4,305.2L254.2,303.9L254.2,298.9L258.7,293.3L257.9,285.5L254.9,282.4L250.4,283.1L246.5,286.4L245.2,285.0L243.7,291.7L241.5,290.9L240.6,287.7L237.4,290.9L236.5,294.3L242.4,296.6L238.7,297.5L236.5,301.0L239.5,304.9L234.6,305.1L237.5,309.3L235.9,312.1L243.7,309.8L245.1,306.6Z",
    lx: 249.3, ly: 293.0, fs: 8,
  },
  jeonnam: {
    d: "M128.3,415.0L125.7,416.2L126.1,418.9L132.5,416.6L128.3,415.0ZM134.5,413.5L132.9,417.2L134.7,419.4L136.2,417.1L134.6,415.3L136.3,414.6L134.5,413.5ZM148.4,412.1L146.4,416.9L150.0,416.4L148.4,412.1ZM129.4,410.9L128.2,414.1L132.0,414.7L132.7,412.9L129.4,410.9ZM145.4,405.4L147.9,405.5L148.7,403.0L140.7,403.5L145.4,405.4ZM156.6,403.4L158.1,403.7L157.2,405.4L158.8,402.9L160.8,403.5L156.8,400.9L154.0,402.0L156.6,403.4ZM136.8,399.2L133.6,400.4L134.2,403.8L136.9,406.8L141.8,407.1L136.8,399.2ZM151.5,399.6L151.5,398.2L151.0,399.7L146.7,398.6L146.8,401.0L149.3,402.4L151.8,401.4L151.5,399.6ZM145.0,396.4L141.6,397.4L141.1,402.0L146.9,399.9L145.0,396.4ZM183.1,394.5L181.7,393.6L181.5,395.7L183.5,395.6L182.2,395.9L183.5,398.0L186.1,397.5L186.5,395.6L183.1,394.5ZM167.7,392.3L162.9,393.9L162.0,392.6L160.7,396.0L167.1,397.0L168.7,393.6L167.7,392.3ZM142.0,389.7L142.0,389.7ZM182.4,388.8L180.5,390.6L181.5,393.4L184.7,392.6L181.9,390.9L182.4,388.8ZM200.3,389.8L198.5,388.1L196.0,389.2L201.4,392.9L200.3,389.8ZM110.7,385.9L108.0,392.2L107.1,390.9L101.4,397.1L104.1,402.2L107.9,402.1L111.6,399.3L113.1,401.5L113.2,398.4L114.9,397.6L115.2,399.3L117.5,396.0L118.1,391.0L110.7,385.9ZM99.3,382.8L101.0,385.9L97.7,387.6L99.3,388.1L98.3,389.7L101.9,387.8L102.4,385.6L99.3,382.8ZM96.9,382.2L97.1,387.3L99.2,387.1L96.9,382.2ZM105.3,379.8L102.8,381.0L103.1,383.7L107.8,382.2L105.3,379.8ZM62.0,377.8L59.8,380.4L60.7,383.0L64.3,378.5L62.0,377.8ZM201.2,376.7L198.5,375.2L199.8,378.7L196.9,383.3L201.6,385.8L202.5,380.4L199.6,377.3L201.2,376.7ZM94.1,375.7L90.8,377.8L93.8,380.7L96.5,378.3L94.1,375.7ZM102.1,372.8L100.4,373.0L100.6,377.2L103.8,375.6L106.2,377.5L106.0,373.9L102.1,372.8ZM117.0,371.8L116.9,374.1L117.0,371.8ZM95.5,369.9L89.9,372.0L90.3,376.1L92.3,375.9L93.1,372.9L95.8,373.1L95.5,369.9ZM102.7,364.5L102.7,366.7L99.5,366.8L100.6,369.0L98.5,368.5L100.2,370.7L100.6,369.0L102.9,370.4L103.0,368.0L104.6,367.7L103.7,366.1L105.1,365.7L102.7,364.5ZM113.2,366.8L116.2,367.4L116.4,369.4L117.9,368.0L116.9,365.8L114.5,365.7L116.6,363.4L113.5,361.6L113.8,364.2L109.3,367.0L113.2,366.8ZM99.6,360.9L94.8,365.6L97.2,365.2L98.5,367.0L100.7,365.8L101.5,362.8L99.6,360.9ZM198.4,360.3L196.5,362.3L201.1,364.2L201.1,362.1L198.4,360.3ZM103.8,354.2L101.7,355.8L104.3,356.5L103.4,359.7L106.4,357.6L103.8,354.2ZM99.2,350.6L102.8,351.6L103.1,346.6L105.1,345.4L98.8,348.6L99.2,350.6ZM148.4,395.1L151.2,395.7L151.4,393.2L153.6,393.7L155.2,387.3L153.6,386.7L155.4,384.1L153.2,382.9L157.6,382.3L162.5,377.4L165.8,378.0L169.1,373.3L170.2,375.2L174.2,373.9L175.2,376.9L173.7,379.7L171.3,379.6L171.3,376.5L169.7,376.8L161.5,388.6L163.5,390.4L169.9,390.4L170.7,393.2L174.8,395.9L173.7,394.2L179.9,391.1L180.7,388.4L178.3,387.7L178.2,385.7L182.8,386.6L184.7,385.1L181.9,381.5L183.7,381.1L177.2,375.7L179.6,369.6L176.5,368.2L183.5,367.4L183.8,365.1L185.3,365.0L186.9,367.5L185.7,369.7L187.6,369.8L189.9,374.1L187.6,376.2L187.6,380.5L193.0,382.7L191.1,377.2L192.8,377.2L193.7,373.6L196.5,376.2L199.2,375.0L200.6,366.5L195.9,365.7L192.4,368.4L189.0,361.9L192.6,364.4L198.0,359.3L200.2,360.8L199.3,358.9L201.2,354.5L191.3,342.3L188.9,333.7L184.2,330.0L180.7,329.8L177.6,334.2L167.9,331.9L161.1,334.5L157.4,332.8L159.1,329.7L156.5,327.5L157.9,325.2L156.9,322.3L151.5,327.6L144.7,320.9L139.6,323.3L138.5,329.5L133.9,332.9L130.5,332.1L130.4,334.3L126.8,333.4L124.2,325.2L120.8,325.0L119.6,327.4L120.8,329.7L119.3,329.4L117.8,334.8L115.3,335.9L113.5,339.9L116.1,342.0L118.2,341.0L117.1,343.9L123.3,348.8L121.0,353.9L119.4,353.7L118.7,350.0L117.8,351.6L115.4,349.2L116.3,344.5L114.8,346.9L111.5,345.5L110.7,349.0L107.1,347.9L105.1,349.5L105.4,351.2L109.6,352.2L110.5,355.0L111.3,352.2L114.4,352.1L114.6,349.7L116.6,353.1L118.4,352.6L116.5,357.7L113.3,358.5L114.0,361.2L117.6,361.8L117.9,356.1L120.2,367.3L116.5,370.7L122.4,371.7L118.4,372.6L117.3,378.0L112.9,373.3L110.9,379.1L113.2,382.6L111.3,384.1L114.4,387.1L118.3,387.4L118.7,389.6L121.2,388.0L122.8,389.4L124.1,395.5L122.8,395.6L125.8,396.1L126.4,398.1L123.4,402.1L126.7,402.2L126.8,406.8L128.8,404.7L131.2,405.4L132.2,398.9L140.1,393.9L141.8,383.8L142.2,394.2L148.0,397.4L148.4,395.1ZM143.6,352.3L140.3,351.4L139.3,348.2L134.6,347.9L134.4,342.1L138.2,340.7L140.7,337.3L140.4,339.2L143.4,340.3L149.9,337.4L153.0,343.0L156.1,343.6L155.5,347.1L152.0,350.8L150.2,349.4L143.6,352.3Z",
    lx: 149.0, ly: 374.0, fs: 11,
  },
  gwangju: {
    d: "M140.9,337.5L134.4,342.1L135.2,348.5L139.3,348.2L140.5,351.8L143.4,352.4L154.2,349.3L156.1,343.6L153.0,343.0L150.8,337.9L143.4,340.3L140.4,339.2L140.9,337.5Z",
    lx: 146.0, ly: 344.5, fs: 8,
  },
  gyeongnam: {
    d: "M234.8,367.6L233.4,368.6L238.9,372.9L239.9,368.9L234.8,367.6ZM215.8,361.8L211.6,365.4L212.2,367.4L218.9,368.3L216.6,363.4L214.5,365.5L215.8,361.8ZM208.2,366.0L209.7,362.1L207.7,359.8L202.5,366.5L204.3,374.1L207.4,376.0L208.1,373.1L210.6,372.0L211.4,376.9L217.4,376.9L215.9,376.1L217.4,368.9L213.3,368.1L211.1,370.1L208.2,366.0ZM253.6,371.3L253.6,369.4L257.3,371.4L255.3,367.4L257.8,365.5L257.2,363.9L254.9,364.7L256.7,359.9L254.9,357.5L256.3,354.3L254.3,353.2L254.1,356.7L248.4,359.8L250.7,363.7L245.1,361.6L241.8,365.2L244.0,369.8L248.6,367.1L248.3,370.6L245.8,371.9L249.1,372.1L247.9,374.6L249.7,375.3L247.9,377.4L254.0,374.7L251.5,373.2L253.6,371.3ZM241.1,349.5L245.5,347.4L249.1,351.1L247.7,352.1L251.3,351.1L249.4,350.7L250.9,349.9L247.8,346.7L249.1,345.8L247.1,342.5L250.6,340.5L248.6,341.7L249.7,346.1L252.0,345.1L253.2,347.5L254.4,345.4L254.9,349.0L259.5,351.3L260.2,347.8L260.2,350.4L261.8,350.4L263.6,347.9L260.7,344.7L265.0,343.9L265.3,345.2L265.7,340.9L272.5,339.2L273.9,336.2L279.5,333.7L280.3,329.8L284.2,330.0L285.7,326.3L276.2,317.6L272.6,317.9L271.1,315.6L274.0,313.8L273.9,311.5L267.8,309.7L260.1,315.1L252.6,312.8L249.4,314.1L245.5,310.9L245.1,306.6L243.7,309.8L235.9,312.1L234.5,309.3L223.4,308.7L226.0,306.6L225.5,302.8L220.9,296.3L209.7,294.1L207.1,290.1L204.5,293.3L198.8,294.9L194.2,300.4L192.3,311.4L189.6,315.2L193.2,320.1L192.4,322.9L194.6,323.9L190.9,329.6L191.5,332.0L188.9,333.9L191.3,342.3L201.2,354.5L199.6,358.4L201.8,361.0L204.5,358.7L206.9,359.7L209.3,355.0L210.9,357.8L214.3,357.3L212.9,352.8L215.2,353.8L217.0,350.1L215.7,359.2L216.9,361.0L221.8,364.0L223.0,362.6L225.8,363.7L225.7,360.3L229.1,360.3L231.0,362.5L232.7,358.8L234.7,362.6L231.6,363.4L238.7,365.9L236.1,367.5L239.5,367.7L241.6,364.4L239.8,362.3L238.8,365.0L240.1,357.6L237.9,356.5L241.2,356.9L243.4,354.5L240.9,352.6L241.6,350.7L235.5,354.4L235.9,352.4L242.1,350.4L241.1,349.5Z",
    lx: 228.6, ly: 334.4, fs: 11,
  },
  ulsan: {
    d: "M282.2,304.2L277.6,305.7L277.6,309.5L273.1,311.1L274.2,313.3L271.2,315.8L272.6,317.9L276.2,317.6L282.2,324.5L284.5,324.3L284.9,328.3L288.4,328.2L291.3,332.2L294.2,330.0L294.7,324.6L292.7,321.9L294.6,323.2L295.5,321.6L295.1,317.2L297.0,322.0L298.8,320.9L299.3,309.0L293.7,306.9L290.1,309.4L288.0,308.3L288.0,305.3L282.2,304.2Z",
    lx: 287.6, ly: 316.3, fs: 8,
  },
  busan: {
    d: "M262.8,349.5L260.5,351.6L262.4,356.5L264.1,353.0L262.8,349.5ZM262.3,349.0L266.0,350.3L266.8,347.4L266.7,350.3L269.1,348.4L268.9,350.7L270.3,348.4L271.0,352.9L272.8,352.9L272.4,350.0L273.6,352.3L275.7,347.3L280.2,348.9L279.7,345.3L286.0,342.7L288.3,333.3L290.9,332.6L289.2,329.2L284.7,328.0L283.4,330.6L280.3,329.8L279.5,333.7L273.9,336.2L272.5,339.2L265.7,340.9L265.3,345.2L265.0,343.9L260.7,344.7L263.6,347.9L262.3,349.0Z",
    lx: 277.6, ly: 343.1, fs: 8,
  },
  jeju: {
    d: "M111.7,489.6L111.5,490.0L111.8,490.2L111.7,489.6ZM109.4,469.3L109.4,469.3ZM149.1,462.0L140.8,458.5L114.3,465.2L105.4,474.8L105.4,478.1L111.9,484.7L115.4,481.4L131.2,481.9L134.1,479.5L139.5,478.8L144.8,476.7L151.2,468.0L149.1,462.0Z",
    lx: 128.3, ly: 471.6, fs: 11,
  },
};

const DRAW_ORDER = [
  "gyeonggi", "gangwon", "chungbuk", "chungnam", "jeonbuk", "jeonnam", "gyeongbuk", "gyeongnam", "jeju",
  "seoul", "incheon", "daejeon", "sejong", "gwangju", "daegu", "ulsan", "busan",
];

function seedData(): Record<string, RD> {
  return Object.fromEntries(
    Object.entries(REGIONS).map(([id, r]) => [
      id,
      {
        name: r.name,
        label: r.label,
        ...(SEED[id] ?? {
          participants: 0,
          dominant: "데이터 없음",
          lean: 0,
          scores: { ...EMPTY_SCORES },
        }),
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
  const liveTotal = Object.values(counts).reduce(
    (sum, c) => sum + c.far_left + c.left + c.center + c.right + c.far_right,
    0
  );
  // anon 읽기가 막혀 있으면 기존 시드로 폴백
  if (liveTotal === 0) return seedData();

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

function aggregateRows(rows: { region: string | null; result: string | null; cnt?: number | null }[]): Record<string, RD> {
  const counts: Record<string, Record<SK, number>> = {};
  for (const id of Object.keys(REGIONS)) {
    counts[id] = { far_left: 0, left: 0, center: 0, right: 0, far_right: 0 };
  }

  for (const row of rows) {
    if (!row.region || !row.result) continue;
    const id = LABEL_TO_ID[row.region];
    const sk = RESULT_TO_SK[row.result];
    if (!id || !sk) continue;
    counts[id][sk] += row.cnt ?? 1;
  }

  return buildFromCounts(counts);
}

async function fetchMapStats(): Promise<Record<string, RD>> {
  // 1) Prefer server-side aggregate RPC (works even with tight RLS if SECURITY DEFINER)
  const rpc = await supabase.rpc("map_region_stats");
  if (!rpc.error && rpc.data) {
    return aggregateRows(rpc.data as { region: string | null; result: string | null; cnt: number }[]);
  }

  // 2) Fallback: direct select (needs SELECT policy)
  const pageSize = 1000;
  let from = 0;
  const all: { region: string | null; result: string | null }[] = [];
  while (true) {
    const { data, error } = await supabase
      .from("responses")
      .select("region, result")
      .range(from, from + pageSize - 1);
    if (error) throw error;
    if (!data?.length) break;
    all.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return aggregateRows(all);
}

function fillColor(lean: number): string {
  // -60 = deep blue, 0 = light gray, +60 = deep red
  const t = Math.max(-60, Math.min(60, lean)) / 60;
  if (t < 0) {
    const r = -t; // progressive
    return `rgb(${Math.round(170 - r * 130)},${Math.round(190 - r * 90)},${Math.round(220 - r * 20)})`;
  }
  if (t === 0) return "rgb(210, 212, 216)";
  const r = t; // conservative
  return `rgb(${Math.round(200 + r * 40)},${Math.round(190 - r * 145)},${Math.round(195 - r * 150)})`;
}

function badgeBg(lean: number) {
  if (lean <= -20) return "#dce5f2";
  if (lean >= 20) return "#f2e0db";
  return "#eae5dd";
}
function badgeColor(lean: number) {
  if (lean <= -20) return "#1a3a6e";
  if (lean >= 20) return "#8b2525";
  return "#6e6860";
}

const CATS: { key: SK; label: string; color: string }[] = [
  { key: "far_left",  label: "극좌", color: "#1a3a6e" },
  { key: "left",      label: "좌",   color: "#5878b8" },
  { key: "center",    label: "중도", color: "#9a9285" },
  { key: "right",     label: "우",   color: "#c07868" },
  { key: "far_right", label: "극우", color: "#8b2525" },
];

export default function MapPage() {
  const router = useRouter();
  const [sel, setSel] = useState("seoul");
  const [data, setData] = useState<Record<string, RD>>(seedData);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    try {
      setData(await fetchMapStats());
    } catch (e) {
      console.error("Failed to load map stats:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
    const channel = supabase
      .channel("map-responses")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "responses" },
        () => { reload(); }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const total = useMemo(
    () => Object.values(data).reduce((sum, r) => sum + r.participants, 0),
    [data]
  );
  const d = data[sel];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { overflow-x: hidden; width: 100%; }
        :root {
          --blue: #1a3a6e; --blue-mid: #2e5fad;
          --paper: #faf8f4; --ink: #1c1c1e;
          --ink-muted: #6e6e73; --border: #dddad4; --white: #ffffff;
        }
        body { background: var(--paper); color: var(--ink); font-family: 'Inter', sans-serif; min-height: 100vh; }
        .header {
          width: 100%; border-bottom: 1px solid var(--border);
          padding: 20px 48px; display: flex; align-items: center;
          background: var(--paper); position: sticky; top: 0; z-index: 10;
        }
        .logo { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: var(--blue); cursor: pointer; transition: opacity 0.15s; }
        .logo:hover { opacity: 0.7; }
        .page { max-width: 520px; margin: 0 auto; padding: 32px 48px 80px; }
        .ad-slot { width: 100%; display: flex; justify-content: center; margin: 0 0 28px; }
        .page-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: var(--blue); margin-bottom: 28px; }
        .layout { display: flex; flex-direction: column; gap: 28px; align-items: stretch; }

        .map-section { width: 100%; }
        .map-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; gap: 12px; }
        .map-title { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 700; color: var(--blue); }
        .map-count { font-size: 13px; color: var(--ink-muted); }
        .map-count strong { font-size: 15px; font-weight: 700; color: var(--blue); }
        .map-svg { width: 100%; max-width: 420px; margin: 0 auto -4px; display: block; }
        .rp { cursor: pointer; transition: opacity 0.12s; }
        .rp:hover { opacity: 0.75; }
        .legend { display: flex; align-items: center; gap: 10px; margin-top: 2px; }
        .legend-lbl { font-size: 12px; color: var(--ink-muted); white-space: nowrap; }
        .legend-bar {
          flex: 1; height: 8px; border-radius: 4px;
          background: linear-gradient(to right, rgb(40,100,200), rgb(210,212,216), rgb(200,45,45));
        }

        .detail-section { width: 100%; }
        .detail-card {
          background: var(--white); border-radius: 16px; padding: 28px 26px 24px;
          box-shadow: 0 2px 20px rgba(0,0,0,0.06); border: 1px solid var(--border);
        }
        .d-name { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: var(--blue); margin-bottom: 4px; }
        .d-participants { font-size: 13px; color: var(--ink-muted); margin-bottom: 16px; }
        .d-participants strong { color: var(--blue); font-weight: 600; }
        .d-badge { padding: 10px 16px; border-radius: 24px; font-size: 15px; font-weight: 600; margin-bottom: 22px; text-align: center; }
        .bars { display: flex; flex-direction: column; gap: 11px; }
        .bar-row { display: flex; align-items: center; gap: 10px; }
        .bar-lbl { font-size: 13px; font-weight: 500; color: var(--ink); width: 28px; flex-shrink: 0; }
        .bar-bg { flex: 1; height: 10px; background: #ece8e2; border-radius: 6px; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 6px; transition: width 0.4s ease; }
        .bar-pct { font-size: 14px; font-weight: 600; color: var(--ink); width: 36px; text-align: right; flex-shrink: 0; }

        .footnote {
          margin-top: 28px;
          font-size: 11px;
          line-height: 1.55;
          color: var(--ink-muted);
          text-align: center;
        }

        @media (max-width: 820px) {
          .header { padding: 16px 20px; }
          .page { padding: 20px 20px 60px; }
        }
      `}</style>

      <header className="header">
        <div className="logo" onClick={() => router.push("/")}>정치성향판별기</div>
      </header>

      <div className="page">
        <div className="ad-slot">
          <ins
            className="kakao_ad_area"
            style={{ display: "none" }}
            data-ad-unit="DAN-PCFVNkcNKANu1a8D"
            data-ad-width="320"
            data-ad-height="50"
          />
        </div>

        <h1 className="page-title">정치판세맵</h1>

        <div className="layout">
          <section className="map-section">
            <div className="map-top">
              <span className="map-title">지역별 정치성향 분포</span>
              <span className="map-count">
                누적 참여자 <strong>{loading ? "…" : total.toLocaleString()}</strong>명
              </span>
            </div>

            <svg viewBox="0 0 400 505" className="map-svg">
              {DRAW_ORDER.map(id => (
                <path
                  key={id}
                  d={PATHS[id].d}
                  fill={fillColor(data[id].lean)}
                  fillRule="evenodd"
                  stroke="white"
                  strokeWidth={sel === id ? "2.5" : "1"}
                  strokeLinejoin="round"
                  className="rp"
                  onClick={() => setSel(id)}
                  style={{
                    filter: sel === id ? "drop-shadow(0 0 4px rgba(0,0,0,0.28))" : undefined,
                  }}
                >
                  <title>{data[id].name}</title>
                </path>
              ))}
            </svg>

            <div className="legend">
              <span className="legend-lbl">진보 우세</span>
              <div className="legend-bar" />
              <span className="legend-lbl">보수 우세</span>
            </div>
          </section>

          <section className="detail-section">
            <div className="detail-card">
              <h2 className="d-name">{d.name}</h2>
              <p className="d-participants">
                응답자 <strong>{d.participants.toLocaleString()}</strong>명 참여
              </p>
              <div
                className="d-badge"
                style={{ background: badgeBg(d.lean), color: badgeColor(d.lean) }}
              >
                {d.dominant} 우세
              </div>
              <div className="bars">
                {CATS.map(cat => (
                  <div key={cat.key} className="bar-row">
                    <span className="bar-lbl">{cat.label}</span>
                    <div className="bar-bg">
                      <div className="bar-fill" style={{ width: `${d.scores[cat.key]}%`, background: cat.color }} />
                    </div>
                    <span className="bar-pct">{d.scores[cat.key]}%</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <p className="footnote">
          ※ ‘극좌·극우’는 절대적인 이념 규정어가 아니라, 진보·보수와 구분하기 위한 표현입니다.
        </p>
      </div>
    </>
  );
}
