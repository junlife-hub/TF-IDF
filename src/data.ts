import { Type } from "@google/genai";

export interface KeywordData {
  keyword: string;
  weight: number;
}

export interface ProductData {
  id: string;
  name: string;
  nameEn: string;
  topKeywords: KeywordData[];
  insight: string;
  attributes: {
    subject: string;
    value: number;
    fullMark: number;
  }[];
  categories: {
    name: string;
    value: number;
  }[];
}

export const DASHBOARD_DATA: ProductData[] = [
  {
    id: "overall",
    name: "전체 분석",
    nameEn: "Overall Analysis",
    topKeywords: [
      { keyword: "좋아요", weight: 505.74 },
      { keyword: "너무", weight: 272.80 },
      { keyword: "감사합니다", weight: 161.78 },
      { keyword: "만족합니다", weight: 157.57 },
      { keyword: "항상", weight: 151.78 },
      { keyword: "좋네요", weight: 151.09 },
      { keyword: "좋고", weight: 148.88 },
      { keyword: "있습니다", weight: 140.03 },
      { keyword: "배송", weight: 134.42 },
      { keyword: "있어요", weight: 130.40 },
    ],
    insight: `전체 쇼핑몰 리뷰 데이터를 TF-IDF 기법으로 분석한 결과, 소비자 만족의 핵심 동인은 '제품의 본질적 품질(좋아요, 만족)'과 '서비스 경험(배송, 감사합니다)'의 결합으로 나타났습니다. 특히 '항상', '있습니다'와 같은 키워드의 높은 가중치는 고객들이 일관된 품질과 지속적인 가용성을 중요하게 여김을 시사합니다. 비즈니스 전반에 걸쳐 긍정적인 감성 키워드가 압도적이지만, 품목별로 세분화했을 때 나타나는 기능적 키워드들과의 연결 고리를 찾는 것이 차별화된 마케팅 전략의 핵심입니다. 또한, 분석 과정에서 발견된 HTML 태그(em, br)의 높은 가중치는 향후 데이터 정제 파이프라인의 고도화가 필요함을 의미하며, 정교한 텍스트 마이닝을 통해 숨겨진 불만 사항이나 세부 니즈를 발굴하는 노력이 병행되어야 합니다.`,
    attributes: [
      { subject: "전반적만족", value: 85, fullMark: 100 },
      { subject: "배송속도", value: 90, fullMark: 100 },
      { subject: "가격경쟁력", value: 75, fullMark: 100 },
      { subject: "고객충성도", value: 80, fullMark: 100 },
      { subject: "데이터품질", value: 60, fullMark: 100 },
    ],
    categories: [
      { name: "긍정감성", value: 50 },
      { name: "배송/물류", value: 30 },
      { name: "제품품질", value: 20 },
    ]
  },
  {
    id: "omega3",
    name: "오메가3",
    nameEn: "Omega-3",
    topKeywords: [
      { keyword: "좋아요", weight: 164.09 },
      { keyword: "꾸준히", weight: 98.16 },
      { keyword: "항상", weight: 92.77 },
      { keyword: "배송", weight: 84.02 },
      { keyword: "먹고", weight: 80.48 },
      { keyword: "배송도", weight: 74.41 },
      { keyword: "감사합니다", weight: 64.69 },
      { keyword: "빠르고", weight: 63.86 },
      { keyword: "만족", weight: 55.20 },
      { keyword: "효과", weight: 48.10 },
    ],
    insight: `오메가3 제품군의 TF-IDF 분석 결과, 소비자들은 단순한 일회성 구매보다는 '꾸준히', '항상'과 같은 키워드에서 나타나듯 장기적인 복용 습관을 형성하고 있는 것으로 분석됩니다. 이는 건강기능식품 특유의 신뢰 기반 반복 구매 성향을 보여주며, 기업 입장에서는 정기 구독 서비스나 대용량 패키지 구성을 통한 락인(Lock-in) 전략이 매우 유효할 것임을 시사합니다. 또한 '배송', '빠르고' 키워드의 높은 가중치는 제품의 효능만큼이나 물류 서비스의 질이 구매 만족도에 직간접적인 영향을 미치고 있음을 의미합니다. 특히 '먹고'라는 동사형 키워드의 등장은 실제 섭취 편의성이나 목 넘김 등에 대한 리뷰가 활발함을 보여주므로, 캡슐 크기나 냄새 저감 기술을 마케팅 포인트로 강조할 필요가 있습니다.`,
    attributes: [
      { subject: "지속성", value: 95, fullMark: 100 },
      { subject: "배송만족", value: 88, fullMark: 100 },
      { subject: "가성비", value: 70, fullMark: 100 },
      { subject: "브랜드신뢰", value: 82, fullMark: 100 },
      { subject: "편의성", value: 75, fullMark: 100 },
    ],
    categories: [
      { name: "효능/지속성", value: 45 },
      { name: "배송/서비스", value: 30 },
      { name: "감성/만족", value: 25 },
    ]
  },
  {
    id: "wetwipes",
    name: "물티슈",
    nameEn: "Wet Wipes",
    topKeywords: [
      { keyword: "좋아요", weight: 191.20 },
      { keyword: "너무", weight: 129.62 },
      { keyword: "물티슈", weight: 127.10 },
      { keyword: "항상", weight: 95.99 },
      { keyword: "두께도", weight: 84.93 },
      { keyword: "미엘", weight: 77.30 },
      { keyword: "가성비", weight: 74.43 },
      { keyword: "가격도", weight: 71.95 },
      { keyword: "부드럽고", weight: 62.10 },
      { keyword: "좋네요", weight: 58.40 },
    ],
    insight: `물티슈 시장의 핵심 키워드는 '두께도'와 '가성비'로 요약됩니다. 소비자들은 제품의 물리적 스펙인 두께감을 품질의 척도로 삼고 있으며, 소모품 특성상 가격 경쟁력에 매우 민감하게 반응하고 있습니다. '미엘'이라는 특정 브랜드명이 상위에 랭크된 것은 브랜드 인지도가 구매 결정에 중요한 역할을 하고 있음을 보여주며, 충성 고객층이 두텁게 형성되어 있음을 암시합니다. 비즈니스 측면에서는 고중량(엠보싱 등) 라인업을 강화하여 '두께'에 대한 니즈를 충족시키는 동시에, 대량 구매 시의 가격 혜택을 강조하는 프로모션이 효과적일 것입니다. '부드럽고'와 같은 키워드는 피부 자극에 민감한 영유아 가구나 예민한 사용자를 타겟팅한 성분 마케팅의 중요성을 뒷받침합니다.`,
    attributes: [
      { subject: "가성비", value: 98, fullMark: 100 },
      { subject: "품질(두께)", value: 92, fullMark: 100 },
      { subject: "브랜드파워", value: 85, fullMark: 100 },
      { subject: "배송", value: 78, fullMark: 100 },
      { subject: "피부저자극", value: 80, fullMark: 100 },
    ],
    categories: [
      { name: "가격/경제성", value: 40 },
      { name: "제품스펙", value: 35 },
      { name: "브랜드/신뢰", value: 25 },
    ]
  },
  {
    id: "sunscreen",
    name: "달바선크림",
    nameEn: "Dalba Sunscreen",
    topKeywords: [
      { keyword: "좋아요", weight: 277.56 },
      { keyword: "너무", weight: 111.10 },
      { keyword: "좋고", weight: 100.42 },
      { keyword: "촉촉하고", weight: 82.30 },
      { keyword: "달바", weight: 79.57 },
      { keyword: "발림성도", weight: 78.45 },
      { keyword: "톤업", weight: 73.27 },
      { keyword: "좋네요", weight: 68.01 },
      { keyword: "자연스럽고", weight: 62.50 },
      { keyword: "인생템", weight: 55.80 },
    ],
    insight: `달바 선크림은 '촉촉하고', '발림성도', '톤업' 키워드가 주를 이루며 화장품으로서의 기능적 완성도가 매우 높게 평가받고 있습니다. 특히 '인생템'이라는 키워드의 등장은 제품에 대한 정서적 유착과 강력한 추천 의사를 반영하며, 이는 바이럴 마케팅의 핵심 자산이 됩니다. '자연스럽고'와 '톤업'의 조합은 인위적이지 않은 보정 효과를 원하는 현대 소비자들의 미적 기준을 정확히 관통하고 있음을 보여줍니다. 브랜드명 '달바' 자체가 높은 가중치를 갖는 것은 브랜드 아이덴티티가 확고함을 의미하므로, 프리미엄 이미지를 유지하면서도 수분감과 광채를 강조하는 비주얼 커뮤니케이션을 지속해야 합니다. 건성 피부 사용자를 위한 수분 베이스 강조 전략이 시장 점유율 확대에 결정적일 것으로 판단됩니다.`,
    attributes: [
      { subject: "기능성(톤업)", value: 94, fullMark: 100 },
      { subject: "사용감(발림)", value: 96, fullMark: 100 },
      { subject: "보습력", value: 90, fullMark: 100 },
      { subject: "브랜드이미지", value: 88, fullMark: 100 },
      { subject: "가격만족도", value: 65, fullMark: 100 },
    ],
    categories: [
      { name: "사용감/제형", value: 50 },
      { name: "미적효과", value: 30 },
      { name: "브랜드가치", value: 20 },
    ]
  },
  {
    id: "airpods",
    name: "에어팟프로2세대",
    nameEn: "AirPods Pro 2nd Gen",
    topKeywords: [
      { keyword: "너무", weight: 159.99 },
      { keyword: "좋아요", weight: 149.68 },
      { keyword: "에어팟", weight: 140.80 },
      { keyword: "배송", weight: 89.50 },
      { keyword: "만족합니다", weight: 83.53 },
      { keyword: "좋네요", weight: 82.68 },
      { keyword: "프로", weight: 78.24 },
      { keyword: "감사합니다", weight: 73.43 },
      { keyword: "노캔", weight: 65.20 },
      { keyword: "정품", weight: 62.10 },
    ],
    insight: `에어팟 프로 2세대의 리뷰 데이터에서는 '노캔(노이즈 캔슬링)'과 '정품' 키워드가 핵심적인 비즈니스 인사이트를 제공합니다. 고가의 전자기기인 만큼 소비자들은 가품에 대한 우려가 크며, '정품' 여부를 확인하고 안심하는 과정이 리뷰에 강하게 투영됩니다. 따라서 공식 판매처로서의 신뢰도를 강조하는 인증 마크나 정품 등록 가이드를 전면에 내세우는 것이 전환율 향상에 필수적입니다. 또한 '노캔' 성능에 대한 구체적인 찬사는 제품의 기술적 우위가 구매의 결정적 동기임을 증명합니다. 배송 키워드의 높은 순위는 고가 제품을 안전하고 빠르게 수령하고자 하는 심리를 반영하므로, 프리미엄 배송 서비스나 안심 포장 과정을 시각화하여 노출하는 전략이 고객 경험(CX)을 극대화할 수 있는 방안이 될 것입니다.`,
    attributes: [
      { subject: "기술력(노캔)", value: 98, fullMark: 100 },
      { subject: "신뢰도(정품)", value: 95, fullMark: 100 },
      { subject: "배송안전", value: 90, fullMark: 100 },
      { subject: "가격대비가치", value: 70, fullMark: 100 },
      { subject: "디자인", value: 85, fullMark: 100 },
    ],
    categories: [
      { name: "기술/성능", value: 45 },
      { name: "구매안전/배송", value: 35 },
      { name: "브랜드/디자인", value: 20 },
    ]
  }
];
