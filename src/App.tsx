import React, { useState } from "react";
import { Header } from "./components/Header";
import { CounselingInputForm } from "./components/CounselingInputForm";
import { SituationCardView } from "./components/SituationCardView";
import { MarkdownManualView } from "./components/MarkdownManualView";
import { DoDontTableView } from "./components/DoDontTableView";
import { LandingPageView } from "./components/LandingPageView";
import { PromptInspectorModal } from "./components/PromptInspectorModal";
import { DEFAULT_PRESET_MANUAL_MD, SITUATIONS_STRUCTURED } from "./data/defaultManual";
import { PromptInput, SituationScript } from "./types";
import { parseMarkdownToSituations } from "./utils/markdownParser";
import { MessageSquare, FileText, TableProperties, Rocket, Sparkles } from "lucide-react";

export default function App() {
  const [input, setInput] = useState<PromptInput>({
    institution: "국비지원 IT 직업훈련기관",
    courseName: "IT 개발자 양성과정",
    additionalSituation: "없음",
  });

  // Client-side transient session-only API Key (strictly stored in React memory only, never in localStorage/DB)
  const [apiKey, setApiKey] = useState<string>("");
  const [isKeyApproved, setIsKeyApproved] = useState<boolean>(false);

  const [currentMarkdown, setCurrentMarkdown] = useState<string>(DEFAULT_PRESET_MANUAL_MD);
  const [situations, setSituations] = useState<SituationScript[]>(SITUATIONS_STRUCTURED);
  const [selectedSituationId, setSelectedSituationId] = useState<number>(1);
  const [activeMainTab, setActiveMainTab] = useState<"landing" | "cards" | "markdown" | "dodont">("landing");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isCustomGenerated, setIsCustomGenerated] = useState<boolean>(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState<boolean>(false);

  const handleInputChange = (field: keyof PromptInput, value: string) => {
    setInput((prev) => ({ ...prev, [field]: value }));
  };

  const handleResetToDefault = () => {
    setCurrentMarkdown(DEFAULT_PRESET_MANUAL_MD);
    setSituations(SITUATIONS_STRUCTURED);
    setIsCustomGenerated(false);
    setStatusMessage("표준 IT 직업훈련기관 6대 핵심 상황 상담 매뉴얼이 로드되었습니다.");
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleOpenKeyActivation = () => {
    setActiveMainTab("landing");
    setTimeout(() => {
      const el = document.getElementById("gemini-key-activation-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setStatusMessage(
      isKeyApproved
        ? "승인된 Gemini API로 6대 핵심 상황 상담 매뉴얼을 실시간 맞춤 생성 중입니다..."
        : "Gemini 3.8 Flash로 6대 핵심 상황 상담 매뉴얼을 생성 중입니다..."
    );

    try {
      // Direct call to our backend API route (prevents CORS and protects the key)
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: apiKey.trim() || undefined,
          institution: input.institution,
          courseName: input.courseName,
          additionalSituation: input.additionalSituation,
        }),
      });

      const data = await response.json();

      if (response.ok && data.markdown) {
        setCurrentMarkdown(data.markdown);
        const parsed = parseMarkdownToSituations(data.markdown);
        setSituations(parsed);
        setIsCustomGenerated(true);
        setStatusMessage("✅ 6대 핵심 상황별 실전 상담 매뉴얼 맞춤 생성이 완료되었습니다!");
      } else {
        console.warn("Server generation returned notice:", data.message);
        if (response.status === 401) {
          setStatusMessage("⚠️ API Key가 유효하지 않습니다. 랜딩페이지에서 API Key를 승인받아 주세요.");
        } else if (response.status === 429) {
          setStatusMessage("⚠️ API 호출 한도(Quota)가 초과되었습니다. 잠시 후 다시 시도해 주세요.");
        } else {
          setStatusMessage(`안내: ${data.message || "기본 내장 6대 상황 실전 매뉴얼을 표시합니다."}`);
        }
      }
    } catch (err) {
      console.error("Failed to generate manual", err);
      setStatusMessage("통신 상태를 확인해주세요. 기본 내장 6대 상황 실전 매뉴얼을 적용합니다.");
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      <Header
        currentMarkdown={currentMarkdown}
        situations={situations}
        institution={input.institution}
        courseName={input.courseName}
        onOpenPromptModal={() => setIsPromptModalOpen(true)}
        isCustomGenerated={isCustomGenerated}
        isKeyApproved={isKeyApproved}
        onOpenKeyActivation={handleOpenKeyActivation}
        onGoToLanding={() => {
          setActiveMainTab("landing");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Top Input & Conditions Setting Form */}
        <div id="counseling-generator-form-anchor">
          <CounselingInputForm
            input={input}
            onChange={handleInputChange}
            onGenerate={handleGenerate}
            onResetToDefault={handleResetToDefault}
            isLoading={isLoading}
            statusMessage={statusMessage}
            isKeyApproved={isKeyApproved}
            onOpenKeyActivation={handleOpenKeyActivation}
          />
        </div>

        {/* View Switcher Navigation (Pill-shaped Tabs Matching Reference Image) */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 pb-4 mb-8 flex-wrap">
          <div className="inline-flex rounded-full p-1.5 bg-white border border-slate-200 shadow-2xs gap-1 flex-wrap">
            <button
              id="tab-btn-landing"
              onClick={() => setActiveMainTab("landing")}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer ${
                activeMainTab === "landing"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Rocket className="w-4 h-4 text-amber-300" />
              <span>소개 &amp; 핵심 강점</span>
            </button>

            <button
              id="tab-btn-cards"
              onClick={() => setActiveMainTab("cards")}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer ${
                activeMainTab === "cards"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>실전 대화 카드 &amp; 낭독</span>
            </button>

            <button
              id="tab-btn-dodont"
              onClick={() => setActiveMainTab("dodont")}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer ${
                activeMainTab === "dodont"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <TableProperties className="w-4 h-4" />
              <span>Do &amp; Don't 비교표</span>
            </button>

            <button
              id="tab-btn-markdown"
              onClick={() => setActiveMainTab("markdown")}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer ${
                activeMainTab === "markdown"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>전체 마크다운 매뉴얼</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 font-semibold flex items-center gap-2 bg-blue-50/70 border border-blue-100/80 px-3.5 py-1.5 rounded-full">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>20년 경력 센터장 검증: 총 <span className="font-extrabold text-blue-700">{situations.length}개</span> 위기 대응 완비</span>
          </div>
        </div>

        {/* Content Area Based on Active Tab */}
        {activeMainTab === "landing" && (
          <LandingPageView
            situations={situations}
            currentMarkdown={currentMarkdown}
            institution={input.institution}
            courseName={input.courseName}
            apiKey={apiKey}
            isKeyApproved={isKeyApproved}
            onApiKeyChange={setApiKey}
            onKeyApprovedChange={setIsKeyApproved}
            onGoToSituation={(id) => {
              setSelectedSituationId(id);
              setActiveMainTab("cards");
              window.scrollTo({ top: 380, behavior: "smooth" });
            }}
            onGoToCards={() => {
              setActiveMainTab("cards");
              window.scrollTo({ top: 380, behavior: "smooth" });
            }}
            onGoToDoDont={() => {
              setActiveMainTab("dodont");
              window.scrollTo({ top: 380, behavior: "smooth" });
            }}
            onGoToMarkdown={() => {
              setActiveMainTab("markdown");
              window.scrollTo({ top: 380, behavior: "smooth" });
            }}
            onGoToGenerate={() => {
              const el = document.getElementById("counseling-generator-form-anchor");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          />
        )}

        {activeMainTab === "cards" && (
          <SituationCardView
            situations={situations}
            selectedSituationId={selectedSituationId}
            onSelectSituation={setSelectedSituationId}
            currentMarkdown={currentMarkdown}
            institution={input.institution}
            courseName={input.courseName}
          />
        )}

        {activeMainTab === "markdown" && (
          <MarkdownManualView
            markdown={currentMarkdown}
            situations={situations}
            institution={input.institution}
            courseName={input.courseName}
          />
        )}

        {activeMainTab === "dodont" && (
          <DoDontTableView situations={situations} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-slate-500 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>국비 IT 직업훈련기관 취업지원센터 상담 대응 매뉴얼</strong> | 6대 위기 상황 맞춤형 실전 가이드
          </div>
          <div className="flex items-center gap-3">
            <span>Powered by Gemini 3.8 Flash</span>
            <span>•</span>
            <button
              onClick={() => setIsPromptModalOpen(true)}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              프롬프트 원문 보기
            </button>
          </div>
        </div>
      </footer>

      {/* Prompt Inspector Modal */}
      <PromptInspectorModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        institution={input.institution}
        courseName={input.courseName}
        additionalSituation={input.additionalSituation}
      />
    </div>
  );
}
