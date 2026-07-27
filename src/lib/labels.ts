import type { AttachmentStatus, Category, PeriodType } from "@/lib/types";

export const REGION_LABEL: Record<string, string> = {
  NATIONWIDE: "전국",
  SEOUL: "서울",
  BUSAN: "부산",
  DAEGU: "대구",
  INCHEON: "인천",
  GWANGJU: "광주",
  DAEJEON: "대전",
  ULSAN: "울산",
  SEJONG: "세종",
  GYEONGGI: "경기",
  GANGWON: "강원",
  CHUNGBUK: "충북",
  CHUNGNAM: "충남",
  JEONBUK: "전북",
  JEONNAM: "전남",
  GYEONGBUK: "경북",
  GYEONGNAM: "경남",
  JEJU: "제주",
  ETC: "기타",
};

export const REGION_ORDER: string[] = Object.keys(REGION_LABEL);

export const regionLabel = (code: string): string => REGION_LABEL[code] ?? code;

export const PERIOD_LABEL: Record<PeriodType, string> = {
  FIXED: "마감일 고정",
  ROLLING: "상시",
  UNTIL_BUDGET: "예산 소진 시",
  UNKNOWN: "확인 필요",
};

export const periodLabel = (type: PeriodType): string => PERIOD_LABEL[type] ?? type;

export const ATTACHMENT_STATUS_LABEL: Record<AttachmentStatus, string> = {
  SAVED: "저장됨",
  ANALYZED: "분석완료",
  UNSUPPORTED: "미지원",
  FAILED: "실패",
};

export const attachmentStatusLabel = (status: AttachmentStatus): string =>
  ATTACHMENT_STATUS_LABEL[status] ?? status;

export const CATEGORY_SEED_LABEL: Record<string, string> = {
  MANUFACTURING: "제조",
  SMART_FACTORY: "스마트공장",
  RND: "연구개발",
  TECHNOLOGY: "기술",
  BUSINESS: "사업화",
  EXPORT: "수출",
  EMPLOYMENT: "고용",
  FUNDING: "자금",
  EDUCATION: "교육",
  ETC: "기타",
};

export function categoryLabelMap(categories: Category[] | undefined): Record<string, string> {
  const map: Record<string, string> = { ...CATEGORY_SEED_LABEL };
  for (const c of categories ?? []) map[c.code] = c.label;
  return map;
}
