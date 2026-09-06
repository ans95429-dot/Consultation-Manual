import React, { useState } from "react";
import { Copy, Check, Search, XCircle, CheckCircle2 } from "lucide-react";
import { SituationScript } from "../types";

interface DoDontTableViewProps {
  situations: SituationScript[];
}

export const DoDontTableView: React.FC<DoDontTableViewProps> = ({ situations }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filtered = situations.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.dont.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.do.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCopyRow = async (sit: SituationScript) => {
    const text = `[${sit.title}]\n❌ Don't: "${sit.dont}"\n⭕ Do: "${sit.do}"`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(sit.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
      <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 border-l-4 border-blue-600 pl-3">
            상황별 Do &amp; Don't 대화 비교 가이드
          </h3>
          <p className="text-xs text-slate-500 mt-1 pl-4 font-medium">
            권위적·훈계조 화법을 차단하고, 교육생의 심리적 저항을 완화하는 신뢰 기반 대화법 비교
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="상황 또는 대화 검색..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-white border border-slate-300 rounded-full focus:outline-hidden focus:ring-2 focus:ring-blue-600 shadow-2xs"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/80 text-xs font-bold text-slate-700 border-b border-slate-200">
              <th className="py-3 px-4 w-1/5 min-w-[140px] border border-slate-200">상황 (Situation)</th>
              <th className="py-3 px-4 w-2/5 min-w-[240px] text-slate-700 border border-slate-200">
                <span className="flex items-center gap-1 text-rose-700 font-bold">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  ❌ 권위적/부정적 표현 (Don't)
                </span>
              </th>
              <th className="py-3 px-4 w-2/5 min-w-[240px] text-blue-700 border border-slate-200">
                <span className="flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  ⭕ 신뢰 형성/해결 중심 표현 (Do)
                </span>
              </th>
              <th className="py-3 px-3 w-16 text-center border border-slate-200">복사</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-4 align-top font-semibold text-slate-900 border border-slate-200">
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                      #{s.id}
                    </span>
                    {(s.id === 6 || s.title.includes("중장년")) && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-bold">
                        중장년 특화
                      </span>
                    )}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900">{s.title}</div>
                  {s.tag && (
                    <div className="text-[11px] text-blue-700 mt-1.5 font-semibold bg-blue-50/80 px-2.5 py-0.5 rounded-full border border-blue-100 inline-block">
                      🎯 {s.tag}
                    </div>
                  )}
                </td>

                <td className="py-3.5 px-4 align-top bg-rose-50/15 text-slate-600 border border-slate-200">
                  <div className="p-3 bg-white border border-rose-200/80 rounded-xl leading-relaxed">
                    "{s.dont}"
                  </div>
                  <div className="text-[11px] text-rose-700 mt-1.5 font-medium">
                    🚫 평가절하, 타인 비교, 페널티 위협 주의
                  </div>
                </td>

                <td className="py-3.5 px-4 align-top bg-blue-50/15 text-blue-800 font-medium border border-slate-200">
                  <div className="p-3 bg-white border border-blue-200/80 rounded-xl leading-relaxed">
                    "{s.do}"
                  </div>
                  <div className="text-[11px] text-blue-700 mt-1.5 font-medium">
                    💡 감정 인정 후 문제 분리 및 대안 제시
                  </div>
                </td>

                <td className="py-3.5 px-3 align-top text-center border border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleCopyRow(s)}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors cursor-pointer"
                    title="해당 상황 Do &amp; Don't 복사"
                  >
                    {copiedId === s.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
