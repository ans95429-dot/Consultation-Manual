import React, { useState } from "react";
import { Sparkles, RefreshCw, Layers, HelpCircle, CheckCircle2, ChevronDown, ChevronUp, KeyRound, ShieldCheck } from "lucide-react";
import { PromptInput } from "../types";

interface CounselingInputFormProps {
  input: PromptInput;
  onChange: (field: keyof PromptInput, value: string) => void;
  onGenerate: () => void;
  onResetToDefault: () => void;
  isLoading: boolean;
  statusMessage?: string | null;
  isKeyApproved?: boolean;
  onOpenKeyActivation?: () => void;
}

export const CounselingInputForm: React.FC<CounselingInputFormProps> = ({
  input,
  onChange,
  onGenerate,
  onResetToDefault,
  isLoading,
  statusMessage,
  isKeyApproved,
  onOpenKeyActivation,
}) => {
  const [showRoleInfo, setShowRoleInfo] = useState(false);

  const presets = [
    {
      label: "프롬프트 예시 (Java/Spring)",
      institution: "국비지원 스마트 IT 아카데미",
      courseName: "Java/Spring 백엔드 개발자 양성과정",
      additionalSituation: "없음",
    },
    {
      label: "웹/풀스택 과정",
      institution: "테크 이노베이션 부트캠프",
      courseName: "React & Node.js 풀스택 개발자 과정",
      additionalSituation: "비전공자 비율 70%, 3개월차 팀 프로젝트 진입 직전",
    },
    {
      label: "클라우드/DevOps",
      institution: "국비 클라우드 인프라 센터",
      courseName: "AWS & Kubernetes 클라우드 엔지니어링 과정",
      additionalSituation: "자격증 취득 지연 및 CS 인프라 기초 부족 호소",
    },
    {
      label: "AI/데이터 분석",
      institution: "인공지능 소프트웨어 아카데미",
      courseName: "파이썬 기반 생성형 AI & 빅데이터 분석가 과정",
      additionalSituation: "수학/통계 장벽 및 모델 학습 구현 난이도에 대한 불안",
    },
    {
      label: "중장년층(30·40대) 전직 특화",
      institution: "Re-Start IT 직업능력개발원",
      courseName: "Java & 클라우드 엔터프라이즈 솔루션 개발과정",
      additionalSituation: "30대 후반~40대 교육생 다수, 신입 채용 시 나이 제한 및 어린 팀장과의 관계 적응에 대한 극심한 불안",
    },
    {
      label: "기본값 복원",
      institution: "국비지원 IT 직업훈련기관",
      courseName: "IT 개발자 양성과정",
      additionalSituation: "없음",
    },
  ];

  const applyPreset = (p: typeof presets[0]) => {
    onChange("institution", p.institution);
    onChange("courseName", p.courseName);
    onChange("additionalSituation", p.additionalSituation);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
            상담 매뉴얼 생성 조건 설정 (Prompt Input)
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setShowRoleInfo(!showRoleInfo)}
          className="text-xs text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 self-start sm:self-auto cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
          <span>센터장 역할 및 작성 원칙</span>
          {showRoleInfo ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {showRoleInfo && (
        <div className="mb-5 p-4 bg-blue-50/70 border border-blue-100 rounded-xl text-xs leading-relaxed text-slate-700">
          <div className="font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            20년 경력 센터장의 3대 상담 원칙 (담임교사 실전 적용 기준)
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
            <li><strong>즉시 낭독성:</strong> 추상적 상담 심리 이론 대신 교사가 학생 앞에서 바로 읽을 수 있는 완결된 대화체.</li>
            <li><strong>원인 분리:</strong> 대인관계 감정 스트레스와 실제 기술 진도 격차를 분리하여 시스템적 해결책(R&R) 제시.</li>
            <li><strong>출구 전략:</strong> 맹목적 격려를 지양하고 도메인 융합, CS 실무화, QA/기술지원 등 다양한 IT 확장 경로 제시.</li>
          </ul>
        </div>
      )}

      {/* Quick Presets (Pill Badges) */}
      <div className="mb-5">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2 font-semibold">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>신속 설정 프리셋 (Quick Presets)</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p, idx) => (
            <button
              key={idx}
              id={`preset-btn-${idx}`}
              type="button"
              onClick={() => applyPreset(p)}
              className="px-3 py-1.5 text-xs bg-slate-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 text-slate-700 border border-slate-200 rounded-full transition-all cursor-pointer font-medium"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-5">
        <div>
          <label htmlFor="institution-input" className="block text-xs font-bold text-slate-700 mb-1">
            훈련 기관명 <span className="text-slate-400 font-normal">(기본값: 국비지원 IT 직업훈련기관)</span>
          </label>
          <input
            id="institution-input"
            type="text"
            value={input.institution}
            onChange={(e) => onChange("institution", e.target.value)}
            placeholder="국비지원 IT 직업훈련기관"
            className="w-full px-3.5 py-2 text-sm bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label htmlFor="coursename-input" className="block text-xs font-bold text-slate-700 mb-1">
            운영 과정명 <span className="text-slate-400 font-normal">(기본값: IT 개발자 양성과정)</span>
          </label>
          <input
            id="coursename-input"
            type="text"
            value={input.courseName}
            onChange={(e) => onChange("courseName", e.target.value)}
            placeholder="IT 개발자 양성과정"
            className="w-full px-3.5 py-2 text-sm bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label htmlFor="situation-input" className="block text-xs font-bold text-slate-700 mb-1">
            추가/변형 상담 상황 <span className="text-slate-400 font-normal">(기본값: 없음)</span>
          </label>
          <input
            id="situation-input"
            type="text"
            value={input.additionalSituation}
            onChange={(e) => onChange("additionalSituation", e.target.value)}
            placeholder="없음 (특정 팀 갈등 또는 수강생 애로사항 입력 가능)"
            className="w-full px-3.5 py-2 text-sm bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <div className="text-xs text-slate-500 flex items-center gap-2 w-full sm:w-auto font-medium flex-wrap">
          {isKeyApproved ? (
            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              사용자 승인 API Key 적용됨
            </span>
          ) : (
            onOpenKeyActivation && (
              <button
                type="button"
                onClick={onOpenKeyActivation}
                className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-200 font-bold text-[11px] cursor-pointer transition-colors"
                title="Gemini API Key를 활성화하고 승인받기"
              >
                <KeyRound className="w-3 h-3 text-blue-600" />
                <span>개인 API Key 승인 등록</span>
              </button>
            )
          )}

          {statusMessage ? (
            <span className="text-blue-700 font-bold">{statusMessage}</span>
          ) : (
            <span>6대 상황별 3단계 대화 스크립트 + Do &amp; Don't 비교표가 즉시 최적화됩니다.</span>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            id="btn-load-standard"
            type="button"
            onClick={onResetToDefault}
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-full transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>표준 매뉴얼 복원</span>
          </button>

          <button
            id="btn-generate-ai"
            type="button"
            onClick={onGenerate}
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-all shadow-xs disabled:opacity-50 cursor-pointer hover:shadow-md active:scale-98"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>AI 상담 매뉴얼 맞춤 생성 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-blue-200" />
                <span>맞춤형 매뉴얼 생성</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
