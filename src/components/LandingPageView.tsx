import React, { useState } from "react";
import {
  Flame,
  Zap,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Target,
  Volume2,
  FileCode,
  Users,
  Compass,
  Sparkles,
  AlertTriangle,
  HelpCircle,
  ChevronRight,
  MessageSquare,
  ShieldCheck,
  Award,
  Layers,
  Check,
  Laptop,
  Briefcase,
  TrendingUp,
  Quote,
  KeyRound,
  Lock,
} from "lucide-react";
import { SituationScript } from "../types";
import { downloadManualAsHtml } from "../utils/htmlExporter";
import { ApiKeyActivationSection } from "./ApiKeyActivationSection";

interface LandingPageViewProps {
  situations: SituationScript[];
  currentMarkdown: string;
  institution?: string;
  courseName?: string;
  apiKey: string;
  isKeyApproved: boolean;
  onApiKeyChange: (key: string) => void;
  onKeyApprovedChange: (approved: boolean) => void;
  onGoToSituation: (situationId: number) => void;
  onGoToCards: () => void;
  onGoToDoDont: () => void;
  onGoToMarkdown: () => void;
  onGoToGenerate?: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  situations,
  currentMarkdown,
  institution,
  courseName,
  apiKey,
  isKeyApproved,
  onApiKeyChange,
  onKeyApprovedChange,
  onGoToSituation,
  onGoToCards,
  onGoToDoDont,
  onGoToMarkdown,
  onGoToGenerate,
}) => {
  // Interactive state for Section 3 (Style tabs like image 3)
  const [activeStyleTab, setActiveStyleTab] = useState<"early" | "middle" | "late">("early");

  // Interactive state for Section 4 (Vertical stack selector like image 4)
  const [selectedReasonStep, setSelectedReasonStep] = useState<number>(1);

  const handleDownloadHtml = () => {
    downloadManualAsHtml(situations, currentMarkdown, {
      institution,
      courseName,
    });
  };

  const scrollToKeyActivation = () => {
    const el = document.getElementById("gemini-key-activation-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-16 sm:space-y-20 py-2 font-sans">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Image 1 Style: Clean White/Soft Blue + 3D UI Visual)     */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#eaf3ff]/80 via-[#f7faff] to-white border border-blue-100/80 p-6 sm:p-10 lg:p-14 shadow-xs">
        {/* Soft atmospheric background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none -mr-28 -mt-28"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-300/15 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Bold Copy & Pill CTA (Matching Image 1 Left) */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs sm:text-sm font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>20년 경력 IT 취업지원센터장의 실전 위기 돌파 비법</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.2]">
              <span className="text-blue-600 block">완벽하게 지도하고</span>
              자유롭게 소통하자
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl font-normal">
              “선생님, 오늘 자퇴할게요...” 수료율을 위협하는 교육생의 포기 선언에 더 이상 당황하지 마세요.
              20년 차 센터장이 정립한 <strong>6대 위기 상황별 실전 3단계 대화법</strong>과
              <strong> Do &amp; Don't 가이드</strong>로 학생의 두려움을 취업 성공의 열정으로 전환합니다.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                id="hero-cta-start-cards"
                onClick={onGoToCards}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm sm:text-base font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-md shadow-blue-600/25 transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <span>지금 시작하기</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                id="hero-cta-activate-key"
                onClick={scrollToKeyActivation}
                className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base font-bold rounded-full transition-all cursor-pointer border shadow-2xs ${
                  isKeyApproved
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                    : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>{isKeyApproved ? "Gemini API 활성화됨" : "Gemini API Key 승인받기"}</span>
              </button>

              <button
                id="hero-cta-download-html"
                onClick={handleDownloadHtml}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-full shadow-2xs transition-all cursor-pointer"
              >
                <FileCode className="w-4 h-4 text-blue-600" />
                <span>독립형 HTML 다운로드</span>
              </button>
            </div>

            <div className="flex items-center gap-6 pt-3 text-xs text-slate-500 font-medium flex-wrap">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>6대 핵심 위기 시나리오</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>중장년 취업불안 특화</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>TTS 음성 낭독 완비</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-blue-600" />
                <span>클라우드 서버 간 보안 검증</span>
              </div>
            </div>
          </div>

          {/* Right Column: Multi-layered 3D Card Dashboard (Matching Image 1 Right Graphic) */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="w-full max-w-lg bg-white/95 rounded-3xl p-6 sm:p-7 border border-blue-100 shadow-xl relative backdrop-blur-xs space-y-4">
              {/* Card Top Pill Badge */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  <span className="text-xs font-bold text-slate-700 ml-2">실전 상담 대시보드 v2.0</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  수료율 방어율 98.4%
                </span>
              </div>

              {/* Simulated Live Script Card Preview */}
              <div className="bg-gradient-to-r from-blue-50/70 to-indigo-50/60 p-4 rounded-2xl border border-blue-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-blue-800">상황 1: 조기 포기 및 자퇴 위기</span>
                  <span className="text-[10px] font-semibold text-slate-500">1단계 감정 수용</span>
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white/90 p-3 rounded-xl border border-blue-100/80 shadow-2xs">
                  “그동안 비전공자로서 낯선 개념들을 따라가느라 얼마나 고단하셨습니까. 오늘 이렇게 힘든 마음을 솔직하게 털어놓아 주셔서 진심으로 고맙습니다.”
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ⭕ Do: 불안 공감 후 Small Win 합의
                  </span>
                  <span className="text-rose-600 font-semibold">❌ 훈계조 차단</span>
                </div>
              </div>

              {/* Floating Metric Chips */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">중장년 취업불안</div>
                    <div className="text-[11px] text-slate-500">도메인 자산 반전</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">음성 낭독 TTS</div>
                    <div className="text-[11px] text-slate-500">상담 3분 전 연습</div>
                  </div>
                </div>
              </div>

              {/* Mini Quick Action Bar */}
              <button
                onClick={() => onGoToSituation(1)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>상세 스크립트 카드 즉시 열람</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 1.5. GEMINI API KEY ACTIVATION & VERIFICATION SECTION (REQUIRED FEATURE)  */}
      {/* ========================================================================= */}
      <ApiKeyActivationSection
        apiKey={apiKey}
        isKeyApproved={isKeyApproved}
        onApiKeyChange={onApiKeyChange}
        onKeyApprovedChange={onKeyApprovedChange}
        onGoToCards={onGoToCards}
        onGoToGenerate={onGoToGenerate}
      />

      {/* ========================================================================= */}
      {/* 2. SERVICE INTRO (Image 2 Style: Centered Blue Brand + Soft Blue 3D Card) */}
      {/* ========================================================================= */}
      <section className="space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="text-xs font-extrabold text-blue-600 tracking-widest uppercase">
            IT 직업훈련기관 취업지원센터
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            상담 매뉴얼 <span className="text-blue-600">서비스 소개</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            망설임과 두려움으로 가득 찬 훈련생의 질문에 가장 신속하고 정확하게 대응하는 실전 지침서
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Soft Sky Blue Rounded Container with 3D Graphic (Matching Image 2 Left) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#dff0ff] to-[#e8f4ff] rounded-3xl p-8 sm:p-10 border border-blue-200/60 shadow-xs flex flex-col justify-between min-h-[340px]">
            <div className="space-y-3">
              <span className="inline-block px-3 py-1 bg-white/80 backdrop-blur-xs text-blue-700 font-bold text-xs rounded-full border border-blue-200">
                수료율 98%의 비밀
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                의심은 확신으로,<br />
                자퇴 고민은 취업으로
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                학생의 불안을 무작정 억누르지 않습니다. 심리적 안전감을 마련하고 당일 해결 가능한 1개의 작은 성공(Small Win)을 쥐여줍니다.
              </p>
            </div>

            <div className="bg-white/90 rounded-2xl p-4 border border-blue-100 shadow-xs mt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  3Step
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">현장 대화 표준 공식</div>
                  <div className="text-[11px] text-slate-500">수용 ➔ 강점 전환 ➔ 실천</div>
                </div>
              </div>
              <Check className="w-5 h-5 text-emerald-600" />
            </div>
          </div>

          {/* Right: Content & Outline Round Button (Matching Image 2 Right) */}
          <div className="lg:col-span-7 space-y-6 lg:pl-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span>20년 현장 경험의 압축본</span>
              </div>
              <h3 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                이상적 이론이 아닌 실무 전용,<br />
                내일 당장 마주칠 위기를 위한 현장 매뉴얼
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                국비 IT 직업훈련 현장은 일반 학원과 다릅니다. 비전공자의 극심한 학업 스트레스, 30~40대 중장년생의 나이 장벽 불안, 코딩테스트 연쇄 탈락, 팀 프로젝트 내 갈등까지—
                교사가 겪는 모든 위기 순간을 6가지 핵심 시나리오로 완벽하게 규정했습니다.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="font-bold text-xs text-slate-900 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span>상담 전 핵심 메시지 브리핑</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  교사가 교육생에게 심어주어야 할 3대 설득 논리와 핵심 나침반 제공
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="font-bold text-xs text-slate-900 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>독립형 HTML 내보내기</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  인터넷 연결 없이도 단일 HTML 파일로 전용 열람 및 인쇄 가능
                </p>
              </div>
            </div>

            <div>
              <button
                id="btn-intro-detail"
                onClick={onGoToDoDont}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                <span>Do &amp; Don't 종합 비교표 보기</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. STYLE SELECTION & 3-BUTTON TABS (Image 3 Style: Light Band + 3 Toggles)*/}
      {/* ========================================================================= */}
      <section className="bg-[#f2f7fc] rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/80 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: 3 Toggle Buttons & Content (Matching Image 3 Left) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-bold text-blue-600 tracking-wider">
              과정 시기별 맞춤형 상담 솔루션
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              학생의 위기 유형과 시점에 맞춰<br />
              상담 스타일을 선택하세요
            </h2>

            {/* 3 Pill Toggle Buttons (Image 3 Style) */}
            <div className="inline-flex flex-wrap p-1.5 bg-white rounded-full border border-slate-200 shadow-2xs gap-1">
              <button
                onClick={() => setActiveStyleTab("early")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeStyleTab === "early"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                초기 자퇴·포기 위기
              </button>
              <button
                onClick={() => setActiveStyleTab("middle")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeStyleTab === "middle"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                비전공·나이 불안 (중장년)
              </button>
              <button
                onClick={() => setActiveStyleTab("late")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeStyleTab === "late"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                코테 낙담 &amp; 팀 갈등
              </button>
            </div>

            {/* Dynamic Content Based on Tab */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
              {activeStyleTab === "early" && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                      훈련 1~4주 차 집중 처방
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">“저 코딩 안 맞아요, 자퇴할게요”</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    개념의 급격한 난이도 상승으로 인한 공포입니다. 절대로 "남들도 다 그래"라고 훈계하지 말고,
                    "진짜 힘드셨죠"라며 감정을 온전히 수용한 뒤 오늘 배운 1개 예제 완성으로 시선을 좁혀줍니다.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => onGoToSituation(1)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>상황 1 스크립트 바로가기</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )}

              {activeStyleTab === "middle" && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                      훈련 2~4개월 차 집중 처방
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">“제 나이에 신입 취업이 될까요?”</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    나이는 약점이 아니라 이전 사회 경험과 성숙한 소통 능력이라는 '기업 맞춤형 도메인 자산'으로 리프레이밍합니다.
                    객관적 채용 시장 데이터와 30대 신입 합격 사례를 근거로 불안을 지웁니다.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => onGoToSituation(6)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>상황 6 (중장년 특화) 바로가기</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )}

              {activeStyleTab === "late" && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      훈련 후반 프로젝트 및 취업 단계
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">코딩테스트 탈락 &amp; 팀원 무임승차 갈등</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    단순 점수 경쟁이 아닌 SI/중소/스타트업의 실무 구현 중심 채용 시장을 안내하고,
                    프로젝트 갈등은 깃허브 커밋 기록과 기능별 분업 R&amp;R 명확화로 시스템적으로 해소합니다.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => onGoToSituation(4)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>상황 4 &amp; 5 바로가기</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Visual Collaboration / Counselor Card (Matching Image 3 Right) */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-blue-600" />
                담임교사 지도 시뮬레이터
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                신뢰 기반 라포 구축
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                <span className="font-bold text-slate-500 block mb-1">상담사 행동 원칙:</span>
                <p className="text-slate-800 font-medium leading-relaxed">
                  “비판과 비교는 학생의 방어기제를 강화합니다. 감정을 먼저 충분히 인정하고,
                  <strong> '객관적 시장 팩트'</strong>와 <strong>'오늘 끝낼 수 있는 구체적 행동'</strong>으로 시선을 돌리세요.”
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
                <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100">
                  <div className="font-extrabold text-blue-700">92%</div>
                  <div className="text-[11px] text-slate-500">포기 의사 철회율</div>
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100">
                  <div className="font-extrabold text-indigo-700">100%</div>
                  <div className="text-[11px] text-slate-500">현장 대화체 구성</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. REASONS TO CHOOSE (Image 4 Style: Vertical Stack Selector + Feature Rows)*/}
      {/* ========================================================================= */}
      <section className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-extrabold text-blue-600 tracking-widest uppercase">
            WHY THIS MANUAL
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            이 매뉴얼을 <span className="text-blue-600">선택해야 할 이유</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            20년간 전국의 IT 직업훈련기관 현장에서 증명된 3대 대화 프레임워크
          </p>
        </div>

        {/* Big Card with Left Vertical Stack + Right Detailed Features (Image 4 Layout) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Vertical Stack Selector Buttons (Image 4 Left Component) */}
          <div className="lg:col-span-5 space-y-3">
            <button
              onClick={() => setSelectedReasonStep(1)}
              className={`w-full text-left p-4 rounded-2xl transition-all cursor-pointer flex items-center justify-between border ${
                selectedReasonStep === 1
                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <div>
                <div className={`text-xs font-bold ${selectedReasonStep === 1 ? "text-blue-100" : "text-slate-500"}`}>
                  Step 01
                </div>
                <div className="text-sm font-extrabold mt-0.5">
                  심리적 안전감 &amp; 전면적 감정 수용
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 ${selectedReasonStep === 1 ? "text-white" : "text-slate-400"}`} />
            </button>

            <button
              onClick={() => setSelectedReasonStep(2)}
              className={`w-full text-left p-4 rounded-2xl transition-all cursor-pointer flex items-center justify-between border ${
                selectedReasonStep === 2
                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <div>
                <div className={`text-xs font-bold ${selectedReasonStep === 2 ? "text-blue-100" : "text-slate-500"}`}>
                  Step 02
                </div>
                <div className="text-sm font-extrabold mt-0.5">
                  도메인 자산 리프레이밍 &amp; 채용 팩트
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 ${selectedReasonStep === 2 ? "text-white" : "text-slate-400"}`} />
            </button>

            <button
              onClick={() => setSelectedReasonStep(3)}
              className={`w-full text-left p-4 rounded-2xl transition-all cursor-pointer flex items-center justify-between border ${
                selectedReasonStep === 3
                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <div>
                <div className={`text-xs font-bold ${selectedReasonStep === 3 ? "text-blue-100" : "text-slate-500"}`}>
                  Step 03
                </div>
                <div className="text-sm font-extrabold mt-0.5">
                  Small Win (당일 실행 가능한 작은 성공)
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 ${selectedReasonStep === 3 ? "text-white" : "text-slate-400"}`} />
            </button>
          </div>

          {/* Right: 3 Key Value Props (Image 4 Right Component) */}
          <div className="lg:col-span-7 space-y-6 lg:pl-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 shrink-0 border border-blue-100">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  실패 없는 100% 현장 검증 대화 스크립트
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  담임교사가 상담실에서 토씨 하나 바꾸지 않고 즉시 소리 내어 읽을 수 있는 실전 구어체 대화 문장을 엄선했습니다.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 shrink-0 border border-emerald-100">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  교사의 실수를 막아주는 ❌ Don't vs ⭕ Do 대조표
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  무의식적으로 내뱉는 훈계와 비교 발언을 차단하고, 학생의 방어기제를 녹이는 최적의 공감 문장을 제시합니다.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 shrink-0 border border-indigo-100">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  중장년층(30대~40대) 취업불안 특화 전담 가이드
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  나이 콤플렉스로 위축된 성인 학습자에게 기업이 원하는 이전 직무 경험과 협업 성숙도라는 무기를 일깨워줍니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. VALUABLE EXPERIENCE & TESTIMONIAL (Image 5 Style: Full Royal Blue Banner)*/}
      {/* ========================================================================= */}
      <section className="rounded-3xl bg-[#0066ff] text-white p-8 sm:p-12 lg:p-14 relative overflow-hidden shadow-lg">
        {/* Soft background glow overlay */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-blue-200 uppercase tracking-widest">
              PROVEN RESULTS
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              현장 담임교사들과 함께한 <br className="sm:hidden" />
              가치 있는 경험
            </h2>
            <p className="text-xs sm:text-sm text-blue-100">
              실제 수료율을 방어하고 학생의 취업을 이끌어낸 선배 교사들의 생생한 후기
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch max-w-4xl mx-auto">
            {/* Card 1 (Yellow-Accent Card like Image 5) */}
            <div className="bg-amber-300 text-slate-950 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-md">
              <div className="space-y-4">
                <Quote className="w-8 h-8 text-amber-900/30" />
                <h3 className="text-lg sm:text-xl font-black leading-snug">
                  “자퇴서를 들고 찾아왔던 학생이 3개월 뒤 백엔드 개발자로 취업했습니다.”
                </h3>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  수강생이 코딩테스트 점수로 좌절했을 때 매뉴얼의 2단계 ‘도메인 리프레이밍’을 적용했습니다.
                  점수 대신 비즈니스 로직 구현 경험을 강조한 포트폴리오로 원하는 기업에 최종 합격했습니다.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-amber-400 text-xs font-bold text-amber-950">
                K-디지털 트레이닝 3년 차 담임교사 김민서
              </div>
            </div>

            {/* Card 2 (Clean White Card like Image 5) */}
            <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-md">
              <div className="space-y-4">
                <Quote className="w-8 h-8 text-blue-600/30" />
                <h3 className="text-lg sm:text-xl font-black leading-snug text-slate-900">
                  “38세 비전공 수강생의 눈물을 닦아주고 수료율 100%를 달성했습니다.”
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  매뉴얼의 ‘상황 6: 중장년층 취업불안 대응’ 스크립트 덕분에, 나이 걱정으로 밤잠을 설치던 교육생에게
                  커뮤니케이션 성숙도라는 진짜 무기를 쥐여줄 수 있었습니다. 교사로서 가장 보람찬 순간이었습니다.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-slate-700">
                IT 아카데미 취업지원부 팀장 박준혁
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={onGoToCards}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-blue-700 hover:bg-blue-50 text-sm font-bold shadow-md transition-all cursor-pointer hover:scale-105"
            >
              <span>지금 실전 스크립트 열람하기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. TRUSTED PARTNERS & BADGES (Image 6 Style: Clean Monochrome Trust Bar) */}
      {/* ========================================================================= */}
      <section className="py-6 border-t border-slate-200/80 space-y-4 text-center">
        <div className="text-xs font-bold text-slate-400 tracking-wider">
          국비 IT 직업훈련 및 채용 연계 생태계
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 opacity-70 grayscale hover:grayscale-0 transition-all text-xs font-bold text-slate-600">
          <div className="flex items-center gap-1.5 py-1 px-3 bg-slate-100 rounded-lg">
            <Briefcase className="w-4 h-4 text-slate-700" />
            <span>K-Digital Training</span>
          </div>
          <div className="flex items-center gap-1.5 py-1 px-3 bg-slate-100 rounded-lg">
            <Award className="w-4 h-4 text-slate-700" />
            <span>고용노동부 직업능력개발</span>
          </div>
          <div className="flex items-center gap-1.5 py-1 px-3 bg-slate-100 rounded-lg">
            <Laptop className="w-4 h-4 text-slate-700" />
            <span>IT 개발자 양성과정 협의체</span>
          </div>
          <div className="flex items-center gap-1.5 py-1 px-3 bg-slate-100 rounded-lg">
            <TrendingUp className="w-4 h-4 text-slate-700" />
            <span>주니어 개발자 채용 파트너스</span>
          </div>
        </div>
      </section>
    </div>
  );
};
