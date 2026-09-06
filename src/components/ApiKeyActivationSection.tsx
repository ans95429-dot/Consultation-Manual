import React, { useState } from "react";
import {
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Lock,
  Sparkles,
  ArrowRight,
  RefreshCw,
  LogOut,
} from "lucide-react";

interface ApiKeyActivationSectionProps {
  apiKey: string;
  isKeyApproved: boolean;
  onApiKeyChange: (key: string) => void;
  onKeyApprovedChange: (approved: boolean) => void;
  onGoToCards?: () => void;
  onGoToGenerate?: () => void;
}

export const ApiKeyActivationSection: React.FC<ApiKeyActivationSectionProps> = ({
  apiKey,
  isKeyApproved,
  onApiKeyChange,
  onKeyApprovedChange,
  onGoToCards,
  onGoToGenerate,
}) => {
  const [inputKey, setInputKey] = useState<string>(apiKey || "");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    isKeyApproved ? "Gemini API Key 승인이 완료되어 활성화 상태입니다." : null
  );

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmed = inputKey.trim();
    if (!trimmed) {
      setErrorMessage("Gemini API Key를 입력해 주세요.");
      setSuccessMessage(null);
      return;
    }

    setIsVerifying(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Server-to-server validation via dedicated backend route to prevent CORS and client leaks
      const response = await fetch("/api/verify-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey: trimmed }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        onApiKeyChange(trimmed);
        onKeyApprovedChange(true);
        setSuccessMessage(data.message || "Gemini API Key 승인이 성공적으로 완료되었습니다!");
        setErrorMessage(null);
      } else {
        onKeyApprovedChange(false);
        setErrorMessage(
          data.message || "API Key 유효성 검사에 실패했습니다. 올바른 키인지 확인해주세요."
        );
      }
    } catch (err: any) {
      onKeyApprovedChange(false);
      setErrorMessage(
        "네트워크 또는 서버 통신 오류가 발생했습니다. 백엔드 연결 상태를 확인해주세요."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDeactivate = () => {
    setInputKey("");
    onApiKeyChange("");
    onKeyApprovedChange(false);
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  return (
    <section
      id="gemini-key-activation-section"
      className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 lg:p-10 shadow-xs"
    >
      {/* Background Accent Gradients */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16"></div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-2xs">
              <KeyRound className="w-3.5 h-3.5 text-blue-600" />
              <span>Google Gemini API Key 활성화 및 승인</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              실시간 AI 맞춤 상담 서비스 승인 센터
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal">
              클라우드 서버-투-서버(Server-to-Server) 유효성 검증을 거쳐 CORS 오류 없이 안전하게 API를 승인받고 서비스를 이용하세요.
            </p>
          </div>

          {/* Status Badge */}
          <div className="shrink-0">
            {isKeyApproved ? (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>API Key 승인 완료 (Active)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>승인 대기 중 (Unapproved)</span>
              </span>
            )}
          </div>
        </div>

        {/* Input Form Area */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="gemini-api-key-input"
              className="block text-xs sm:text-sm font-bold text-slate-800 flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-blue-600" />
                Gemini API Key 입력 (비밀번호 형식 암호화)
              </span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 hover:underline"
              >
                <span>Google AI Studio에서 키 무료 발급</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </label>

            <div className="relative flex items-center">
              <input
                id="gemini-api-key-input"
                type={showPassword ? "text" : "password"}
                value={inputKey}
                onChange={(e) => {
                  setInputKey(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                disabled={isVerifying}
                placeholder="AIzaSy... (Google AI Studio에서 발급받은 Gemini API Key를 입력하세요)"
                className="w-full pl-4 pr-24 py-3 text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all font-mono shadow-2xs"
                autoComplete="off"
                spellCheck="false"
              />

              {/* Password visibility toggle */}
              <div className="absolute right-3 flex items-center gap-1">
                <button
                  type="button"
                  id="btn-toggle-key-visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
                  title={showPassword ? "키 숨기기" : "키 표시"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <div className="text-xs text-slate-500 font-medium">
              * 영문 대소문자 및 숫자로 이루어진 구글 공식 API 키를 정확히 입력해 주세요.
            </div>

            <div className="flex items-center gap-2">
              {isKeyApproved && (
                <button
                  type="button"
                  id="btn-deactivate-key"
                  onClick={handleDeactivate}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-full transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>키 세션 해제</span>
                </button>
              )}

              <button
                type="submit"
                id="btn-verify-key"
                disabled={isVerifying || !inputKey.trim()}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-full shadow-md shadow-blue-600/20 transition-all cursor-pointer active:scale-95"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>유효성 확인 및 승인 진행 중...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-blue-200" />
                    <span>{isKeyApproved ? "키 재검증 및 승인" : "유효성 확인 및 승인"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Alert / Notification Area */}
        {successMessage && (
          <div
            id="key-success-alert"
            className="p-4 sm:p-5 rounded-2xl bg-emerald-50/90 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-emerald-900">
                  {successMessage}
                </h4>
                <p className="text-xs text-emerald-700 mt-0.5">
                  이제 6대 핵심 위기상황 실전 대화 카드 열람, TTS 낭독, 그리고 AI 맞춤 매뉴얼 생성기 등 모든 프리미엄 기능을 자유롭게 사용하실 수 있습니다.
                </p>
              </div>
            </div>

            {/* Direct Quick Jump Buttons */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              {onGoToCards && (
                <button
                  type="button"
                  id="btn-key-goto-cards"
                  onClick={onGoToCards}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-2xs transition-all cursor-pointer hover:scale-105"
                >
                  <span>대화 카드 열람</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              {onGoToGenerate && (
                <button
                  type="button"
                  id="btn-key-goto-generate"
                  onClick={onGoToGenerate}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-blue-800 bg-white hover:bg-blue-50 border border-blue-200 rounded-full transition-all cursor-pointer shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>맞춤 매뉴얼 생성</span>
                </button>
              )}
            </div>
          </div>
        )}

        {errorMessage && (
          <div
            id="key-error-alert"
            className="p-4 sm:p-5 rounded-2xl bg-rose-50/90 border border-rose-200 flex items-start gap-3 text-rose-800 transition-all"
          >
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-rose-900">승인 실패 (Verification Failed)</h4>
              <p className="text-xs text-rose-700 mt-1 leading-relaxed">{errorMessage}</p>
              <div className="mt-2 text-[11px] text-rose-600">
                💡 팁: Google AI Studio(aistudio.google.com)에서 생성한 API Key가 올바른지 다시 확인해 주시기 바랍니다.
              </div>
            </div>
          </div>
        )}

        {/* Security Notice Box (Required Specification) */}
        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-3 text-slate-700">
          <div className="p-1.5 bg-blue-600 text-white rounded-xl shadow-2xs shrink-0 mt-0.5">
            <Lock className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <div className="text-xs sm:text-sm font-bold text-slate-900">
              🔒 입력하신 API Key는 서버나 DB에 저장되지 않으며, 세션 종료 시 즉시 파기됩니다.
            </div>
            <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
              본 시스템은 개인정보 및 보안 키 보호 원칙을 준수합니다. 입력하신 API 키는 데이터베이스, 서버 파일, 디스크, 브라우저 로컬 저장소(localStorage/sessionStorage)에 일절 영구 저장되지 않으며, 브라우저 탭을 닫는 즉시 메모리에서 완벽히 소멸됩니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
