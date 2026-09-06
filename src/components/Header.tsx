import React, { useState } from "react";
import { BookOpen, Copy, Check, Download, Printer, Code2, Sparkles, FileCode, Rocket, KeyRound, ShieldCheck } from "lucide-react";
import { SituationScript } from "../types";
import { downloadManualAsHtml } from "../utils/htmlExporter";

interface HeaderProps {
  currentMarkdown: string;
  situations: SituationScript[];
  institution?: string;
  courseName?: string;
  onOpenPromptModal: () => void;
  isCustomGenerated: boolean;
  onGoToLanding?: () => void;
  isKeyApproved?: boolean;
  onOpenKeyActivation?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMarkdown,
  situations,
  institution,
  courseName,
  onOpenPromptModal,
  isCustomGenerated,
  onGoToLanding,
  isKeyApproved,
  onOpenKeyActivation,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloadedHtml, setDownloadedHtml] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentMarkdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const handleDownloadMd = () => {
    const blob = new Blob([currentMarkdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `국비_IT_상담대응매뉴얼_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadHtml = () => {
    try {
      downloadManualAsHtml(situations, currentMarkdown, {
        institution,
        courseName,
      });
      setDownloadedHtml(true);
      setTimeout(() => setDownloadedHtml(false), 2000);
    } catch (err) {
      console.error("Failed to download HTML", err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Brand & Titles */}
          <div
            className="flex items-center space-x-3.5 cursor-pointer select-none group"
            onClick={onGoToLanding}
            title="소개 페이지(홈)로 이동"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-2 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  IT 직업훈련기관 취업지원 상담 매뉴얼
                </h1>
                <span className="text-blue-700 font-semibold text-xs bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  20년 경력 센터장 가이드
                </span>
                {isCustomGenerated ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Sparkles className="w-3 h-3 text-emerald-500" />
                    맞춤형 생성
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    표준 실전 매뉴얼
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap font-medium">
                <span>대상: 저연차·사회초년생 담임교사</span>
                <span className="text-slate-300">•</span>
                <span>적용: K-디지털 및 IT 개발자 양성과정</span>
              </p>
            </div>
          </div>

          {/* Action Toolbar with Pill Shaped Controls */}
          <div className="flex items-center gap-2 self-end md:self-center flex-wrap">
            {/* Gemini API Key Status Pill */}
            {onOpenKeyActivation && (
              <button
                id="header-gemini-key-status-btn"
                type="button"
                onClick={onOpenKeyActivation}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer border shadow-2xs ${
                  isKeyApproved
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                    : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                }`}
                title="Gemini API Key 활성화 및 승인 관리로 이동"
              >
                <KeyRound className={`w-3.5 h-3.5 ${isKeyApproved ? "text-emerald-600" : "text-blue-600"}`} />
                <span>{isKeyApproved ? "API 승인 활성" : "API Key 승인"}</span>
                {isKeyApproved ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                )}
              </button>
            )}

            {onGoToLanding && (
              <button
                id="header-goto-landing-btn"
                onClick={onGoToLanding}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-blue-700 bg-blue-50/90 hover:bg-blue-100 border border-blue-200 rounded-full transition-all cursor-pointer shadow-2xs"
                title="매뉴얼 특장점 및 전체 개요 보기"
              >
                <Rocket className="w-3.5 h-3.5 text-blue-600" />
                <span>특장점 소개</span>
              </button>
            )}

            <button
              id="header-view-prompt-btn"
              onClick={onOpenPromptModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-full transition-colors cursor-pointer"
              title="프롬프트 원문 및 규칙 확인"
            >
              <Code2 className="w-3.5 h-3.5 text-slate-500" />
              <span>적용 프롬프트</span>
            </button>

            <button
              id="header-copy-all-btn"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-full transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">복사 완료</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>전체 복사</span>
                </>
              )}
            </button>

            {/* HTML Download Button (Main Visual Pill CTA) */}
            <button
              id="header-download-html-btn"
              onClick={handleDownloadHtml}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-xs transition-all cursor-pointer hover:shadow-md active:scale-98"
              title="브라우저에서 바로 열리는 단일 HTML 문서로 다운로드"
            >
              {downloadedHtml ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-200" />
                  <span>다운로드 완료!</span>
                </>
              ) : (
                <>
                  <FileCode className="w-3.5 h-3.5 text-blue-200" />
                  <span>HTML 다운로드</span>
                </>
              )}
            </button>

            <button
              id="header-download-btn"
              onClick={handleDownloadMd}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-full transition-colors cursor-pointer"
              title="마크다운 파일 다운로드"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">.md</span>
            </button>

            <button
              id="header-print-btn"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-full transition-colors cursor-pointer"
              title="인쇄 및 PDF 출력"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>PDF</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
