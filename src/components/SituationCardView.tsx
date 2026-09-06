import React, { useState, useEffect } from "react";
import {
  Volume2,
  VolumeX,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Printer,
  Sparkles,
  Target,
  Compass,
  MessageSquareQuote,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  BookmarkCheck,
  FileCode,
} from "lucide-react";
import { SituationScript } from "../types";
import { downloadManualAsHtml } from "../utils/htmlExporter";

interface SituationCardViewProps {
  situations: SituationScript[];
  selectedSituationId: number;
  onSelectSituation: (id: number) => void;
  currentMarkdown?: string;
  institution?: string;
  courseName?: string;
}

export const SituationCardView: React.FC<SituationCardViewProps> = ({
  situations,
  selectedSituationId,
  onSelectSituation,
  currentMarkdown,
  institution,
  courseName,
}) => {
  const current = situations.find((s) => s.id === selectedSituationId) || situations[0];
  const [copiedStepIndex, setCopiedStepIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedCoreMsg, setCopiedCoreMsg] = useState(false);
  const [downloadedHtml, setDownloadedHtml] = useState(false);
  const [speakingStepIndex, setSpeakingStepIndex] = useState<number | null>(null);
  const [speakingCoreMsg, setSpeakingCoreMsg] = useState(false);
  const [activeTab, setActiveTab] = useState<"script" | "strategy" | "dodont" | "followup">("script");

  // Speech synthesis cleanup
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedSituationId]);

  const handleCopyStep = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStepIndex(index);
      setTimeout(() => setCopiedStepIndex(null), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const handleCopyCoreMessage = async () => {
    if (!current) return;
    const msg = current.coreMessage || current.tag || "";
    try {
      await navigator.clipboard.writeText(msg);
      setCopiedCoreMsg(true);
      setTimeout(() => setCopiedCoreMsg(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const handleCopyAllSituation = async () => {
    if (!current) return;
    const coreMsg = current.coreMessage || current.tag;
    const keyPts = current.keyPoints?.map((kp) => `  - ${kp}`).join("\n") || "";
    const mindset = current.counselorMindset ? `\n■ 상담사 지도 나침반: ${current.counselorMindset}\n` : "";

    const text = `[상황 ${current.id}] ${current.title}
    
■ 상황 진단: ${current.diagnosis}
■ 핵심 전달 메시지 (상담 전략): ${coreMsg}
${keyPts ? `■ 3대 핵심 설득 포인트:\n${keyPts}` : ""}${mindset}
■ 단계별 대화 스크립트:
${current.steps.map((s) => `- ${s.stage} (${s.label}): "${s.script}"`).join("\n")}

■ Do & Don't 가이드:
- ❌ Don't: "${current.dont}"
- ⭕ Do: "${current.do}"

■ 상담 후속 조치:
${current.followUp.map((f, i) => `${i + 1}. ${f}`).join("\n")}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const handleDownloadHtml = () => {
    try {
      downloadManualAsHtml(situations, currentMarkdown || "", {
        institution,
        courseName,
      });
      setDownloadedHtml(true);
      setTimeout(() => setDownloadedHtml(false), 2000);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  const handleSpeak = (text: string, index: number) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("현재 브라우저에서는 음성 낭독 기능이 지원되지 않습니다.");
      return;
    }

    if (speakingStepIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingStepIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    setSpeakingCoreMsg(false);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    utterance.rate = 0.95; // calm, reassuring counseling pace
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setSpeakingStepIndex(null);
    };
    utterance.onerror = () => {
      setSpeakingStepIndex(null);
    };

    setSpeakingStepIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const handleSpeakCore = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("현재 브라우저에서는 음성 낭독 기능이 지원되지 않습니다.");
      return;
    }

    if (speakingCoreMsg) {
      window.speechSynthesis.cancel();
      setSpeakingCoreMsg(false);
      return;
    }

    window.speechSynthesis.cancel();
    setSpeakingStepIndex(null);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    utterance.rate = 0.93;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setSpeakingCoreMsg(false);
    };
    utterance.onerror = () => {
      setSpeakingCoreMsg(false);
    };

    setSpeakingCoreMsg(true);
    window.speechSynthesis.speak(utterance);
  };

  if (!current) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Sidebar navigation: 6대 핵심 위기 상황 */}
      <aside className="lg:col-span-4 bg-white border border-slate-200/90 p-4 sm:p-5 rounded-2xl shrink-0 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            6대 핵심 위기 상황 목록
          </h2>
          <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            총 6개 상황
          </span>
        </div>

        <nav className="space-y-2">
          {situations.map((sit) => {
            const isSelected = sit.id === selectedSituationId;
            return (
              <button
                key={sit.id}
                id={`situation-select-${sit.id}`}
                onClick={() => {
                  onSelectSituation(sit.id);
                  if (typeof window !== "undefined" && "speechSynthesis" in window) {
                    window.speechSynthesis.cancel();
                    setSpeakingStepIndex(null);
                    setSpeakingCoreMsg(false);
                  }
                }}
                className={`w-full text-left p-3.5 rounded-xl transition-all cursor-pointer text-sm font-medium ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-50/70 border border-slate-200 text-slate-700 hover:bg-blue-50/50 hover:border-blue-200"
                }`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span className="truncate font-bold">
                    {sit.id}. {sit.title}
                  </span>
                  {(sit.id === 6 || sit.title.includes("중장년")) ? (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        isSelected
                          ? "bg-white/25 text-white"
                          : "bg-amber-100 text-amber-900 border border-amber-200"
                      }`}
                    >
                      중장년 특화
                    </span>
                  ) : (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                        isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      상황 {sit.id}
                    </span>
                  )}
                </div>
                {sit.tag && (
                  <p
                    className={`text-[11px] mt-1 truncate ${
                      isSelected ? "text-blue-100" : "text-slate-500"
                    }`}
                  >
                    {sit.tag}
                  </p>
                )}
              </button>
            );
          })}
        </nav>

        {/* Professional Polish Counselor Principle Card */}
        <div className="mt-6 p-4 bg-blue-50/60 rounded-2xl border border-blue-100">
          <h3 className="text-xs font-bold text-blue-900 mb-1.5 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-blue-700" />
            <span>상담사의 황금 원칙</span>
          </h3>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            비판과 훈계는 학생의 방어기제를 강화합니다. 학생의 두려움을 먼저 있는 그대로 수용한 뒤,
            <strong> '객관적 시장 팩트'</strong>와 <strong>'구체적 행동 단위(Small Win)'</strong>로
            주의를 전환시키십시오.
          </p>
        </div>
      </aside>

      {/* Main Detail Section */}
      <div className="lg:col-span-8 bg-white rounded-2xl shadow-2xs border border-slate-200/90 flex flex-col overflow-hidden">
        {/* Card Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 flex-wrap gap-3">
          <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
              상황 {current.id}
            </span>
            {(current.id === 6 || current.title.includes("중장년")) && (
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-700" />
                중장년층 취업불안 대응
              </span>
            )}
            <h2 className="font-extrabold text-base sm:text-lg text-slate-900">
              {current.title}
            </h2>
          </div>

          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <button
              id="btn-copy-situation"
              onClick={handleCopyAllSituation}
              className="text-xs bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3.5 py-1.5 rounded-full font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
            >
              {copiedAll ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">전체 복사 완료</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>전체 매뉴얼 복사</span>
                </>
              )}
            </button>
            <button
              id="btn-download-html-situation"
              onClick={handleDownloadHtml}
              className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3.5 py-1.5 rounded-full font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
              title="전체 매뉴얼을 브라우저에서 바로 열람 가능한 HTML 파일로 다운로드"
            >
              {downloadedHtml ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">HTML 저장됨</span>
                </>
              ) : (
                <>
                  <FileCode className="w-3.5 h-3.5 text-blue-600" />
                  <span>HTML 다운로드</span>
                </>
              )}
            </button>
            <button
              id="btn-print-situation"
              onClick={() => window.print()}
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full font-bold shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PDF 출력</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* ========================================================= */}
          {/* CORE STRATEGY & MESSAGE BRIEFING BOX (Primary Upgrade)    */}
          {/* ========================================================= */}
          <div
            id="counselor-core-briefing"
            className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 via-slate-50/40 to-indigo-50/30 p-5 shadow-2xs space-y-4"
          >
            {/* Header of Briefing */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-100/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-600 text-white rounded-xl shadow-2xs">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <span>상담 전 핵심 전략 &amp; 핵심 메시지 브리핑</span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                      담임교사 필수 참고
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    상담 시작 전 학생에게 심어줄 핵심 관점 전환 방향과 구체적 설득 근거를 확인하세요.
                  </p>
                </div>
              </div>

              {/* Quick action: copy core message or speak it */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  id="btn-tts-core-message"
                  onClick={() => handleSpeakCore(current.coreMessage || current.tag || "")}
                  className={`px-2.5 py-1 text-xs font-semibold rounded border transition-colors cursor-pointer inline-flex items-center gap-1 ${
                    speakingCoreMsg
                      ? "bg-amber-100 text-amber-900 border-amber-300"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                  title="핵심 메시지 전달 톤 낭독 듣기"
                >
                  {speakingCoreMsg ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-amber-700" />
                      <span>낭독 중지</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>핵심 메시지 낭독</span>
                    </>
                  )}
                </button>
                <button
                  id="btn-copy-core-message"
                  onClick={handleCopyCoreMessage}
                  className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200 rounded transition-colors cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                  title="핵심 메시지만 클립보드에 복사"
                >
                  {copiedCoreMsg ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">복사 완료</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>핵심 메시지 복사</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 2-Column: Diagnosis (Left) vs Concrete Core Message (Right) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-stretch">
              {/* Left Column: Psychological Diagnosis */}
              <div className="md:col-span-4 bg-white/90 p-3.5 rounded-lg border border-slate-200 flex flex-col">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <h4 className="text-xs font-bold text-slate-700">내담자 심리 상태 진단</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed grow">
                  {current.diagnosis}
                </p>
                {current.tag && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>상담 키워드:</span>
                    <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {current.tag}
                    </span>
                  </div>
                )}
              </div>

              {/* Right Column: Concrete Core Message to Impart */}
              <div className="md:col-span-8 bg-white p-4 rounded-lg border-2 border-indigo-200 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 text-indigo-700 font-bold text-xs">
                      <MessageSquareQuote className="w-4 h-4 text-indigo-600" />
                      <span>상담사 핵심 전달 메시지 (Key Core Message)</span>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-800 bg-indigo-100/70 px-2 py-0.5 rounded-full">
                      관점 전환 앵커
                    </span>
                  </div>
                  <blockquote className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium bg-indigo-50/30 p-3 rounded-md border-l-3 border-indigo-500">
                    "{current.coreMessage || current.tag || current.diagnosis}"
                  </blockquote>
                </div>

                <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-500 shrink-0" />
                  <span>
                    상담 진행 시 위 문장의 핵심 키워드를 교육생에게 직접 들려주어 막연한 공포를 전환시키세요.
                  </span>
                </p>
              </div>
            </div>

            {/* 3 Key Persuasion Arguments & Concrete Facts (if present) */}
            {current.keyPoints && current.keyPoints.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <BookmarkCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>담임교사 3대 핵심 설득 포인트 & 팩트 체크</span>
                  </h4>
                  <span className="text-[10px] text-slate-500">
                    학생의 반론 및 불안 제기 시 제시할 객관적 근거
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {current.keyPoints.map((kp, idx) => {
                    // Extract icon & label if exists (e.g. 📌 [채용 시장 팩트]: text)
                    return (
                      <div
                        key={idx}
                        className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs hover:border-indigo-300 transition-colors flex flex-col text-xs text-slate-700 leading-relaxed"
                      >
                        <span className="font-bold text-slate-900 mb-1">
                          설득 근거 {idx + 1}
                        </span>
                        <p className="text-xs text-slate-700 leading-relaxed">{kp}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Counselor Mindset Navigator (Guidance Tip) */}
            {current.counselorMindset && (
              <div className="flex items-start gap-2 bg-amber-50/90 border border-amber-200 p-2.5 sm:p-3 rounded-lg text-xs text-amber-900">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold mr-1.5 text-amber-950">
                    💡 담임교사 현장 지도 나침반:
                  </span>
                  <span>{current.counselorMindset}</span>
                </div>
              </div>
            )}
          </div>

          {/* Sub-view navigation tabs */}
          <div className="flex items-center gap-1 sm:gap-2 border-b border-slate-200 overflow-x-auto">
            <button
              id="tab-script"
              onClick={() => setActiveTab("script")}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold transition-colors cursor-pointer border-b-2 -mb-px whitespace-nowrap ${
                activeTab === "script"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              단계별 대화 스크립트 (3단계)
            </button>
            <button
              id="tab-strategy"
              onClick={() => setActiveTab("strategy")}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold transition-colors cursor-pointer border-b-2 -mb-px whitespace-nowrap flex items-center gap-1 ${
                activeTab === "strategy"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>핵심 메시지 심층 참고</span>
            </button>
            <button
              id="tab-dodont"
              onClick={() => setActiveTab("dodont")}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold transition-colors cursor-pointer border-b-2 -mb-px whitespace-nowrap ${
                activeTab === "dodont"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              상황별 Do & Don't 가이드
            </button>
            <button
              id="tab-followup"
              onClick={() => setActiveTab("followup")}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold transition-colors cursor-pointer border-b-2 -mb-px whitespace-nowrap ${
                activeTab === "followup"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              후속 조치 (Checklist)
            </button>
          </div>

          {/* TAB 1: 3-Stage Dialogue Scripts */}
          {activeTab === "script" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800 border-l-4 border-blue-500 pl-3 text-sm sm:text-base">
                  실전 단계별 대화 스크립트 (현장 대화체)
                </h3>
                <span className="text-xs text-slate-500">
                  교사가 교육생에게 직접 낭독하며 진행할 수 있습니다.
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {current.steps.map((step, idx) => {
                  const isSpeaking = speakingStepIndex === idx;
                  const isCopied = copiedStepIndex === idx;

                  return (
                    <div
                      key={idx}
                      id={`step-card-${idx}`}
                      className="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-3.5 bg-white border border-slate-200 p-4 rounded-lg shadow-2xs hover:border-slate-300 transition-colors"
                    >
                      <div className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded mt-0.5 shrink-0">
                        {step.stage}
                      </div>

                      <div className="text-sm grow">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <p className="font-bold text-slate-900">[{step.label}]</p>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              id={`btn-tts-step-${idx}`}
                              onClick={() => handleSpeak(step.script, idx)}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded border transition-colors cursor-pointer ${
                                isSpeaking
                                  ? "bg-amber-100 text-amber-800 border-amber-300"
                                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                              }`}
                              title="현장 대화 톤으로 낭독 듣기"
                            >
                              {isSpeaking ? (
                                <>
                                  <VolumeX className="w-3 h-3 text-amber-700" />
                                  <span>중지</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-3 h-3 text-slate-600" />
                                  <span>낭독</span>
                                </>
                              )}
                            </button>

                            <button
                              id={`btn-copy-step-${idx}`}
                              onClick={() => handleCopyStep(step.script, idx)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded transition-colors cursor-pointer"
                              title="대화 스크립트 복사"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span className="text-emerald-700">복사됨</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 text-slate-600" />
                                  <span>복사</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        <p className="text-slate-700 italic leading-relaxed whitespace-pre-wrap">
                          "{step.script}"
                        </p>

                        {step.tip && (
                          <div className="mt-2 flex items-start gap-1.5 text-xs text-slate-500">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                            <span>{step.tip}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Deep Dive Core Message & Strategy Breakdown */}
          {activeTab === "strategy" && (
            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800 border-l-4 border-indigo-500 pl-3 text-sm sm:text-base">
                  핵심 메시지 심층 해설 & 상담 활용 가이드
                </h3>
                <span className="text-xs text-indigo-600 font-medium">
                  상황 {current.id} 맞춤 전략
                </span>
              </div>

              {/* In-depth breakdown card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    🎯 학생에게 전달할 핵심 메시지 전문 (전략적 화법)
                  </h4>
                  <div className="p-4 bg-indigo-50/50 rounded-lg border border-indigo-200 text-slate-800 text-sm leading-relaxed">
                    <p className="font-semibold text-indigo-950 mb-1">
                      [상담사가 교육생에게 각인시켜야 할 핵심 명제]
                    </p>
                    <p className="italic">
                      "{current.coreMessage || current.tag}"
                    </p>
                  </div>
                </div>

                {/* Why this message works */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
                      <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                      <span>학생의 표면적 발언 vs 이면의 진짜 두려움</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      학생이 호소하는 문제는 겉으로는 "실력 부족"이나 "자퇴"처럼 보이지만,
                      실제로는 <strong>'이 노력이 보상받지 못할 것이라는 미래 불확실성'</strong>과
                      <strong> '주변과의 비교에서 오는 수치심'</strong>입니다.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>핵심 메시지가 심어주는 심리적 효과</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      약점으로 여겼던 요소(비전공, 나이, 이론 중심 CS)를
                      <strong> '기업이 원하는 독보적 차별화 자산'</strong>으로 재정의(Reframing)하여
                      즉각적인 자존감 회복과 구체적 행동 동기를 부여합니다.
                    </p>
                  </div>
                </div>

                {/* 3 Key Persuasion Points detail */}
                {current.keyPoints && current.keyPoints.length > 0 && (
                  <div className="pt-2">
                    <h4 className="text-xs font-bold text-slate-700 mb-2.5 flex items-center gap-1.5">
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
                      <span>실전 상담 시 구체적 반박 논리 및 데이터 체크</span>
                    </h4>
                    <div className="space-y-2">
                      {current.keyPoints.map((kp, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-3 rounded-lg border border-indigo-100 bg-indigo-50/20 text-xs text-slate-800"
                        >
                          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed font-medium">{kp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Practical Recommended Questions for Counselor */}
                <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-lg text-xs space-y-1.5">
                  <p className="font-bold text-blue-900 flex items-center gap-1">
                    <span>💬 담임교사가 학생에게 던져야 할 유도 질문 (Open Questions):</span>
                  </p>
                  <ul className="list-disc list-inside text-blue-800 space-y-1 pl-1">
                    <li>"OO씨가 이전에 전공이나 사회생활에서 가장 재미있게 파고들었던 분야는 무엇이었나요?"</li>
                    <li>"지금 가장 큰 병목이 '코드를 못 짜는 것'인가요, 아니면 '이번 주 마감 부담감'인가요?"</li>
                    <li>"거창한 취업 걱정은 잠시 내려놓고, 이번 주말까지 딱 완성해 보고 싶은 1가지 기능이 있을까요?"</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Do & Don't Guide */}
          {activeTab === "dodont" && (
            <div className="pt-2">
              <h3 className="font-bold text-slate-800 mb-3 text-sm sm:text-base border-l-4 border-blue-500 pl-3">
                상황별 Do & Don't 대화 비교 가이드
              </h3>

              <table className="w-full text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700">
                    <th className="border border-slate-200 p-2.5 text-left w-1/2">
                      <span className="flex items-center gap-1 text-rose-700 font-bold">
                        <XCircle className="w-3.5 h-3.5" />
                        ❌ 권위적/부정적 표현 (Don't)
                      </span>
                    </th>
                    <th className="border border-slate-200 p-2.5 text-left w-1/2">
                      <span className="flex items-center gap-1 text-emerald-700 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ⭕ 신뢰 형성/해결 중심 표현 (Do)
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-200 p-3.5 text-slate-600 bg-rose-50/20 align-top leading-relaxed">
                      "{current.dont}"
                    </td>
                    <td className="border border-slate-200 p-3.5 text-blue-700 font-medium bg-blue-50/20 align-top leading-relaxed">
                      "{current.do}"
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
                <span className="font-bold text-slate-800 mr-1.5">💡 상담 적용 팁:</span>
                학생의 불안을 타인과 비교하거나 의지 문제로 치부하지 말고, 구체적 산출물과 실무 역량으로 대화를 전환하세요.
              </div>
            </div>
          )}

          {/* TAB 4: Center Director Follow-Up Checklist */}
          {activeTab === "followup" && (
            <div className="pt-2">
              <h3 className="font-bold text-slate-800 mb-3 text-sm sm:text-base border-l-4 border-blue-500 pl-3">
                상담 종료 후 담임교사 후속 조치 (Follow-Up Checklist)
              </h3>
              <ul className="space-y-2.5">
                {current.followUp.map((act, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200"
                  >
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-snug">{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Live Status Bar */}
        <div className="p-3.5 sm:p-4 bg-slate-800 text-white flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-xs">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              상담 가이드: [상황 {current.id}] {current.title}
            </span>
            <span className="opacity-60 hidden sm:inline">•</span>
            <span className="opacity-70 hidden sm:inline">20년 경력 센터장 실전 매뉴얼</span>
          </div>
          <div className="flex space-x-3 font-medium text-slate-200">
            <span>핵심 메시지 및 3대 설득 근거 즉시 적용 가능</span>
          </div>
        </div>
      </div>
    </div>
  );
};
