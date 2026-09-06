import React, { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, FileText, Download, FileCode } from "lucide-react";
import { SituationScript } from "../types";
import { downloadManualAsHtml } from "../utils/htmlExporter";

interface MarkdownManualViewProps {
  markdown: string;
  situations?: SituationScript[];
  institution?: string;
  courseName?: string;
}

export const MarkdownManualView: React.FC<MarkdownManualViewProps> = ({
  markdown,
  situations,
  institution,
  courseName,
}) => {
  const [viewMode, setViewMode] = useState<"rendered" | "raw">("rendered");
  const [copied, setCopied] = useState(false);
  const [downloadedHtml, setDownloadedHtml] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const handleDownloadMd = () => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
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
    if (!situations || situations.length === 0) return;
    try {
      downloadManualAsHtml(situations, markdown, {
        institution,
        courseName,
      });
      setDownloadedHtml(true);
      setTimeout(() => setDownloadedHtml(false), 2000);
    } catch (err) {
      console.error("Failed to download HTML", err);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50/70 gap-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-bold text-slate-800">
            상담 대응 가이드 마크다운 전문 (Full Markdown Manual)
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex rounded-lg border border-slate-300 p-0.5 bg-slate-100">
            <button
              type="button"
              onClick={() => setViewMode("rendered")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                viewMode === "rendered"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              문서 보기
            </button>
            <button
              type="button"
              onClick={() => setViewMode("raw")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                viewMode === "raw"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Raw 마크다운
            </button>
          </div>

          {situations && situations.length > 0 && (
            <button
              type="button"
              id="btn-download-html-mdview"
              onClick={handleDownloadHtml}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 border border-indigo-500 rounded-lg transition-colors cursor-pointer shadow-2xs"
              title="오프라인에서 바로 열람 가능한 단일 HTML 파일로 저장"
            >
              {downloadedHtml ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>다운로드 완료</span>
                </>
              ) : (
                <>
                  <FileCode className="w-3.5 h-3.5 text-indigo-200" />
                  <span>HTML 다운로드</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={handleDownloadMd}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            title="마크다운 파일 다운로드"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>.md</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">복사 완료</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span>복사</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        {viewMode === "rendered" ? (
          <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-h2:text-xl prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-2 prose-h3:text-base prose-h3:text-slate-900 prose-h3:border-l-4 prose-h3:border-blue-500 prose-h3:pl-2.5 prose-p:text-slate-700 prose-li:text-slate-700 prose-table:w-full prose-table:border prose-table:border-slate-200 prose-th:bg-slate-100 prose-th:p-2.5 prose-td:p-2.5 prose-td:border-t prose-td:border-slate-200 text-sm sm:text-base leading-relaxed">
            <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
          </div>
        ) : (
          <div className="relative">
            <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg text-xs sm:text-sm font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[700px]">
              {markdown}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
