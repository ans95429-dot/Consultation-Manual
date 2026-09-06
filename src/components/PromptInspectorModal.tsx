import React, { useState } from "react";
import { X, Copy, Check, Code2, ShieldAlert } from "lucide-react";
import { ORIGINAL_PROMPT_TEMPLATE } from "../data/defaultManual";

interface PromptInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  institution: string;
  courseName: string;
  additionalSituation: string;
}

export const PromptInspectorModal: React.FC<PromptInspectorModalProps> = ({
  isOpen,
  onClose,
  institution,
  courseName,
  additionalSituation,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const situationText = (additionalSituation || "없음").trim();

  const resolvedPrompt = `${ORIGINAL_PROMPT_TEMPLATE}

# Input
- 훈련 기관명: ${institution || "국비지원 IT 직업훈련기관"}
- 운영 과정명: ${courseName || "IT 개발자 양성과정"}
- 추가/변형 상담 상황: ${situationText}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resolvedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              적용된 시스템 프롬프트 원문 (System Prompt Verification)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-3 bg-amber-50 border-b border-amber-100 flex items-center gap-2 text-xs text-amber-900">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>규칙 준수 확인:</strong> 사용자 프롬프트의 기능과 문구(Role, Goal, Instructions 1~6, Output Format, Constraints)를 임의 변경 없이 원형 그대로 시스템에 주입하여 실행합니다.
          </span>
        </div>

        <div className="p-6 overflow-y-auto grow">
          <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono whitespace-pre-wrap leading-relaxed">
            {resolvedPrompt}
          </pre>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex items-center justify-between">
          <span className="text-xs text-slate-500">
            실시간 생성 모델: <code className="font-semibold text-slate-800">gemini-3.8-flash</code> (서버사이드 안전 호출)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">복사됨</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-600" />
                  <span>프롬프트 복사</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
