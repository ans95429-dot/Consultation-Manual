import { SituationScript } from "../types";

interface ExportOptions {
  institution?: string;
  courseName?: string;
  filename?: string;
}

function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function generateManualHtml(
  situations: SituationScript[],
  rawMarkdown: string,
  options: ExportOptions = {}
): string {
  const institution = options.institution || "국비지원 IT 직업훈련기관";
  const courseName = options.courseName || "IT 개발자 양성과정";
  const exportedAt = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const tocHtml = situations
    .map(
      (s) => `
      <li>
        <a href="#situation-${s.id}">
          <span class="num-badge">상황 ${s.id}</span>
          <span class="toc-title">${escapeHtml(s.title)}</span>
          ${s.tag ? `<span class="toc-tag">${escapeHtml(s.tag)}</span>` : ""}
        </a>
      </li>`
    )
    .join("");

  const situationsHtml = situations
    .map((s) => {
      const isMiddleAge = s.id === 6 || s.title.includes("중장년");
      const stepsHtml = s.steps
        .map(
          (step, idx) => `
        <div class="step-card">
          <div class="step-header">
            <span class="step-badge">${escapeHtml(step.stage)}</span>
            <span class="step-label">[${escapeHtml(step.label)}]</span>
          </div>
          <blockquote class="step-script">
            "${escapeHtml(step.script)}"
          </blockquote>
          ${
            step.tip
              ? `<div class="step-tip">💡 <strong>지도 팁:</strong> ${escapeHtml(step.tip)}</div>`
              : ""
          }
        </div>`
        )
        .join("");

      const keyPointsHtml =
        s.keyPoints && s.keyPoints.length > 0
          ? `
        <div class="keypoints-box">
          <h4>📌 담임교사 3대 핵심 설득 포인트 &amp; 팩트 체크</h4>
          <div class="keypoints-grid">
            ${s.keyPoints
              .map(
                (kp, idx) => `
              <div class="keypoint-card">
                <span class="keypoint-num">설득 근거 ${idx + 1}</span>
                <p>${escapeHtml(kp)}</p>
              </div>`
              )
              .join("")}
          </div>
        </div>`
          : "";

      const followUpHtml = s.followUp
        .map((fu, idx) => `<li><span class="fu-num">${idx + 1}</span> <span>${escapeHtml(fu)}</span></li>`)
        .join("");

      return `
      <section id="situation-${s.id}" class="situation-section ${isMiddleAge ? "special-middleage" : ""}">
        <div class="situation-header">
          <div class="badge-group">
            <span class="situation-id-badge">상황 ${s.id}</span>
            ${isMiddleAge ? `<span class="special-badge">중장년층 취업불안 특화</span>` : ""}
            ${s.tag ? `<span class="tag-badge">#${escapeHtml(s.tag)}</span>` : ""}
          </div>
          <h3 class="situation-title">${escapeHtml(s.title)}</h3>
        </div>

        <!-- 1. 심리 진단 & 핵심 메시지 브리핑 -->
        <div class="core-briefing">
          <div class="briefing-grid">
            <div class="diagnosis-box">
              <span class="section-label">🔴 내담자 심리 상태 진단</span>
              <p>${escapeHtml(s.diagnosis)}</p>
            </div>
            <div class="message-box">
              <span class="section-label">🎯 상담사 핵심 전달 메시지 (Key Core Message)</span>
              <blockquote class="core-quote">
                "${escapeHtml(s.coreMessage || s.tag || s.diagnosis)}"
              </blockquote>
              <p class="core-advice">※ 상담 시작 전 학생의 두려움을 인정하고, 위 문장의 핵심 키워드로 관점을 전환시키십시오.</p>
            </div>
          </div>

          ${keyPointsHtml}

          ${
            s.counselorMindset
              ? `
          <div class="mindset-box">
            <span class="mindset-icon">💡</span>
            <div><strong>담임교사 현장 지도 나침반:</strong> ${escapeHtml(s.counselorMindset)}</div>
          </div>`
              : ""
          }
        </div>

        <!-- 2. 단계별 대화 스크립트 -->
        <div class="section-block">
          <h4 class="block-title">🗣️ 실전 단계별 대화 스크립트 (현장 대화체)</h4>
          <div class="steps-container">
            ${stepsHtml}
          </div>
        </div>

        <!-- 3. Do & Don't -->
        <div class="section-block">
          <h4 class="block-title">⚖️ Do &amp; Don't 대화 비교 가이드</h4>
          <div class="dodont-table-wrap">
            <table class="dodont-table">
              <thead>
                <tr>
                  <th class="th-dont">❌ 권위적/부정적 표현 (Don't)</th>
                  <th class="th-do">⭕ 신뢰 형성/해결 중심 표현 (Do)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="td-dont">"${escapeHtml(s.dont)}"</td>
                  <td class="td-do">"${escapeHtml(s.do)}"</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 4. 후속 조치 체크리스트 -->
        <div class="section-block">
          <h4 class="block-title">📋 상담 종료 후 후속 조치 (Follow-Up)</h4>
          <ul class="followup-list">
            ${followUpHtml}
          </ul>
        </div>
      </section>`;
    })
    .join("\n");

  const dodontSummaryRows = situations
    .map(
      (s) => `
      <tr>
        <td class="col-situation">
          <strong>상황 ${s.id}</strong><br/>
          <span class="sub-name">${escapeHtml(s.title)}</span>
        </td>
        <td class="col-dont">"${escapeHtml(s.dont)}"</td>
        <td class="col-do">"${escapeHtml(s.do)}"</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(institution)} - 취업지원센터 상담 대응 매뉴얼</title>
  <style>
    :root {
      --primary: #2563eb;
      --primary-dark: #1d4ed8;
      --primary-light: #dbeafe;
      --indigo: #4f46e5;
      --indigo-light: #e0e7ff;
      --slate-900: #0f172a;
      --slate-800: #1e293b;
      --slate-700: #334155;
      --slate-600: #475569;
      --slate-200: #e2e8f0;
      --slate-100: #f1f5f9;
      --slate-50: #f8fafc;
      --emerald-700: #047857;
      --emerald-50: #ecfdf5;
      --rose-700: #be123c;
      --rose-50: #fff1f2;
      --amber-900: #78350f;
      --amber-50: #fffbeb;
      --font-family: -apple-system, BlinkMacSystemFont, "Pretendard", "Noto Sans KR", "Apple SD Gothic Neo", "Segoe UI", Roboto, sans-serif;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: var(--font-family);
      color: var(--slate-800);
      background-color: var(--slate-50);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      padding-bottom: 80px;
    }

    /* Fixed Top Control Bar */
    .top-action-bar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(30, 41, 59, 0.95);
      backdrop-filter: blur(8px);
      color: #fff;
      padding: 10px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-b: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    .top-action-bar .brand {
      font-size: 13px;
      font-weight: 600;
      color: #cbd5e1;
    }
    .top-action-bar .btn-group {
      display: flex;
      gap: 8px;
    }
    .btn-action {
      background: #3b82f6;
      color: #fff;
      border: none;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background 0.15s ease;
      text-decoration: none;
    }
    .btn-action:hover {
      background: #2563eb;
    }
    .btn-secondary {
      background: #334155;
      color: #e2e8f0;
    }
    .btn-secondary:hover {
      background: #475569;
    }

    /* Container */
    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 32px 20px;
    }

    /* Hero Banner */
    .hero-card {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      color: #ffffff;
      padding: 36px 32px;
      border-radius: 16px;
      box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.3);
      border-left: 6px solid #3b82f6;
      margin-bottom: 32px;
    }
    .hero-meta {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 12px;
    }
    .hero-badge {
      background: rgba(59, 130, 246, 0.2);
      border: 1px solid rgba(59, 130, 246, 0.4);
      color: #93c5fd;
      padding: 3px 10px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .hero-title {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin-bottom: 12px;
      line-height: 1.3;
    }
    .hero-desc {
      font-size: 14px;
      color: #cbd5e1;
      line-height: 1.6;
      margin-bottom: 16px;
    }
    .hero-info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 12px;
      color: #94a3b8;
    }
    .hero-info-grid strong {
      color: #f1f5f9;
    }

    /* Core Counselor Principles Card */
    .principles-card {
      background: #ffffff;
      border: 1px solid var(--slate-200);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 32px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
    }
    .principles-card h3 {
      font-size: 16px;
      font-weight: 700;
      color: var(--slate-900);
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .principles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 16px;
    }
    .principle-item {
      background: var(--slate-50);
      border: 1px solid var(--slate-200);
      border-radius: 8px;
      padding: 14px;
      font-size: 13px;
    }
    .principle-item strong {
      display: block;
      color: var(--primary);
      margin-bottom: 4px;
      font-size: 13px;
    }

    /* TOC Section */
    .toc-card {
      background: #ffffff;
      border: 1px solid var(--slate-200);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 36px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
    }
    .toc-card h3 {
      font-size: 15px;
      font-weight: 700;
      color: var(--slate-800);
      margin-bottom: 16px;
      border-bottom: 2px solid var(--primary);
      padding-bottom: 8px;
      display: inline-block;
    }
    .toc-list {
      list-style: none;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 10px;
    }
    .toc-list a {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      background: var(--slate-50);
      border: 1px solid var(--slate-200);
      border-radius: 8px;
      color: var(--slate-700);
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.15s ease;
    }
    .toc-list a:hover {
      background: var(--primary-light);
      color: var(--primary-dark);
      border-color: #93c5fd;
      transform: translateX(2px);
    }
    .num-badge {
      background: #2563eb;
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      shrink: 0;
    }
    .toc-tag {
      font-size: 11px;
      color: #64748b;
      margin-left: auto;
    }

    /* Situation Section */
    .situation-section {
      background: #ffffff;
      border: 1px solid var(--slate-200);
      border-radius: 14px;
      padding: 28px 30px;
      margin-bottom: 40px;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.03);
      page-break-inside: avoid;
    }
    .situation-section.special-middleage {
      border: 2px solid #f59e0b;
      background: linear-gradient(180deg, #fffdfa 0%, #ffffff 100%);
    }
    .situation-header {
      border-bottom: 1px solid var(--slate-200);
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .badge-group {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 8px;
      flex-wrap: wrap;
    }
    .situation-id-badge {
      background: var(--primary);
      color: #fff;
      font-size: 12px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 6px;
    }
    .special-badge {
      background: #fef3c7;
      color: #92400e;
      border: 1px solid #fde68a;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 6px;
    }
    .tag-badge {
      font-size: 11px;
      color: var(--slate-600);
      background: var(--slate-100);
      padding: 2px 8px;
      border-radius: 4px;
    }
    .situation-title {
      font-size: 20px;
      font-weight: 800;
      color: var(--slate-900);
      letter-spacing: -0.3px;
    }

    /* Core Briefing Box */
    .core-briefing {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 24px;
    }
    .briefing-grid {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 16px;
      margin-bottom: 16px;
    }
    @media (max-width: 768px) {
      .briefing-grid {
        grid-template-columns: 1fr;
      }
    }
    .diagnosis-box {
      background: #ffffff;
      border: 1px solid var(--slate-200);
      border-radius: 8px;
      padding: 14px;
      font-size: 13px;
    }
    .message-box {
      background: #ffffff;
      border: 2px solid #818cf8;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 2px 6px rgba(99, 102, 241, 0.08);
    }
    .section-label {
      display: block;
      font-size: 11px;
      font-weight: 700;
      color: var(--slate-600);
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .core-quote {
      font-size: 14px;
      font-weight: 600;
      color: #1e1b4b;
      background: #eef2ff;
      border-left: 4px solid var(--indigo);
      padding: 10px 14px;
      border-radius: 4px;
      margin-bottom: 8px;
      line-height: 1.5;
    }
    .core-advice {
      font-size: 11px;
      color: #64748b;
    }

    /* Key Points */
    .keypoints-box {
      margin-top: 14px;
      padding-top: 14px;
      border-top: 1px dashed var(--slate-200);
    }
    .keypoints-box h4 {
      font-size: 12px;
      font-weight: 700;
      color: var(--slate-700);
      margin-bottom: 10px;
    }
    .keypoints-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 10px;
    }
    .keypoint-card {
      background: #ffffff;
      border: 1px solid var(--slate-200);
      border-radius: 8px;
      padding: 12px;
      font-size: 12px;
      line-height: 1.5;
    }
    .keypoint-num {
      display: inline-block;
      font-weight: 700;
      color: var(--indigo);
      margin-bottom: 4px;
    }

    /* Mindset Box */
    .mindset-box {
      margin-top: 14px;
      background: var(--amber-50);
      border: 1px solid #fde68a;
      border-radius: 8px;
      padding: 12px 14px;
      font-size: 12px;
      color: var(--amber-900);
      display: flex;
      gap: 10px;
      align-items: flex-start;
      line-height: 1.5;
    }
    .mindset-icon {
      font-size: 16px;
      flex-shrink: 0;
    }

    /* Section Blocks */
    .section-block {
      margin-bottom: 24px;
    }
    .block-title {
      font-size: 14px;
      font-weight: 700;
      color: var(--slate-800);
      margin-bottom: 12px;
      border-left: 3px solid var(--primary);
      padding-left: 8px;
    }

    /* Step Cards */
    .steps-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .step-card {
      background: var(--slate-50);
      border: 1px solid var(--slate-200);
      border-radius: 8px;
      padding: 14px 16px;
    }
    .step-header {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 8px;
    }
    .step-badge {
      background: #bfdbfe;
      color: #1e40af;
      font-size: 10px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .step-label {
      font-size: 12px;
      font-weight: 700;
      color: var(--slate-800);
    }
    .step-script {
      font-size: 13px;
      font-style: italic;
      color: var(--slate-800);
      line-height: 1.6;
      background: #ffffff;
      border-left: 3px solid #93c5fd;
      padding: 10px 14px;
      border-radius: 4px;
      margin-bottom: 6px;
    }
    .step-tip {
      font-size: 11px;
      color: #64748b;
      margin-top: 6px;
    }

    /* Do & Don't Table */
    .dodont-table-wrap {
      overflow-x: auto;
    }
    .dodont-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      border: 1px solid var(--slate-200);
    }
    .dodont-table th {
      padding: 10px 12px;
      font-size: 12px;
      text-align: left;
      font-weight: 700;
      border: 1px solid var(--slate-200);
    }
    .th-dont {
      background: var(--rose-50);
      color: var(--rose-700);
      width: 50%;
    }
    .th-do {
      background: var(--emerald-50);
      color: var(--emerald-700);
      width: 50%;
    }
    .dodont-table td {
      padding: 14px 16px;
      border: 1px solid var(--slate-200);
      vertical-align: top;
      line-height: 1.6;
    }
    .td-dont {
      background: #fffafa;
      color: var(--slate-700);
    }
    .td-do {
      background: #f6fbf9;
      color: #065f46;
      font-weight: 500;
    }

    /* Follow Up List */
    .followup-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .followup-list li {
      display: flex;
      gap: 10px;
      background: var(--slate-50);
      border: 1px solid var(--slate-200);
      border-radius: 6px;
      padding: 10px 14px;
      font-size: 13px;
      color: var(--slate-700);
    }
    .fu-num {
      background: #dbeafe;
      color: #1e40af;
      font-size: 11px;
      font-weight: 700;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 1px;
    }

    /* Summary Do & Don't Section */
    .summary-section {
      background: #ffffff;
      border: 1px solid var(--slate-200);
      border-radius: 14px;
      padding: 28px 30px;
      margin-top: 40px;
      margin-bottom: 40px;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.03);
    }
    .summary-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      border: 1px solid var(--slate-200);
      margin-top: 16px;
    }
    .summary-table th {
      background: var(--slate-100);
      padding: 10px;
      text-align: left;
      font-weight: 700;
      border: 1px solid var(--slate-200);
    }
    .summary-table td {
      padding: 12px;
      border: 1px solid var(--slate-200);
      vertical-align: top;
      line-height: 1.5;
    }
    .col-situation {
      width: 22%;
      font-weight: 600;
      background: var(--slate-50);
    }
    .col-situation .sub-name {
      font-size: 11px;
      color: var(--slate-500);
    }
    .col-dont {
      width: 39%;
      color: #991b1b;
      background: #fffdfd;
    }
    .col-do {
      width: 39%;
      color: #065f46;
      font-weight: 500;
      background: #fcfdfc;
    }

    /* Details Raw Markdown Accordion */
    .details-box {
      background: #ffffff;
      border: 1px solid var(--slate-200);
      border-radius: 12px;
      padding: 20px 24px;
      margin-bottom: 40px;
    }
    .details-box summary {
      cursor: pointer;
      font-weight: 700;
      font-size: 14px;
      color: var(--slate-700);
      user-select: none;
    }
    .details-box pre {
      margin-top: 16px;
      background: #0f172a;
      color: #f1f5f9;
      padding: 20px;
      border-radius: 8px;
      overflow-x: auto;
      font-size: 12px;
      line-height: 1.6;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      white-space: pre-wrap;
    }

    /* Footer */
    .manual-footer {
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
      padding-top: 24px;
      border-top: 1px solid var(--slate-200);
    }

    /* Print Styles */
    @media print {
      body {
        background: #ffffff;
        color: #000000;
        padding-bottom: 0;
      }
      .top-action-bar, .toc-card, .details-box, .btn-action {
        display: none !important;
      }
      .container {
        max-width: 100%;
        padding: 0;
      }
      .hero-card {
        background: #f8fafc !important;
        color: #000000 !important;
        border: 2px solid #000000;
        box-shadow: none;
      }
      .hero-title {
        color: #000000 !important;
      }
      .hero-badge, .hero-desc, .hero-info-grid strong {
        color: #333333 !important;
      }
      .situation-section {
        box-shadow: none;
        border: 1px solid #ccc;
        page-break-after: always;
      }
      .situation-section:last-of-type {
        page-break-after: auto;
      }
    }
  </style>
</head>
<body>
  <!-- Top Floating Action Toolbar -->
  <aside class="top-action-bar" aria-label="상단 메뉴">
    <div class="brand">
      📋 ${escapeHtml(institution)} | 상담 대응 매뉴얼 (오프라인 HTML 에디션)
    </div>
    <div class="btn-group">
      <button class="btn-action" onclick="window.print()">
        🖨️ PDF / 인쇄 출력
      </button>
      <a href="#toc" class="btn-action btn-secondary">
        목차로 이동
      </a>
      <a href="#summary-dodont" class="btn-action btn-secondary">
        Do &amp; Don't 종합표
      </a>
    </div>
  </aside>

  <main class="container">
    <!-- Hero Banner -->
    <header class="hero-card">
      <div class="hero-meta">
        <span class="hero-badge">20년 경력 센터장 실전 가이드</span>
        <span class="hero-badge">국비 IT 훈련기관 공식 표준</span>
        <span class="hero-badge">중장년층 취업불안 대응 포함</span>
      </div>
      <h1 class="hero-title">IT 직업훈련기관 취업지원센터 상담 대응 매뉴얼</h1>
      <p class="hero-desc">
        저연차·사회초년생 담임교사가 겪는 6대 위기 상황(자퇴 요구, 코딩 테스트 낙담, 비전공자 열등감, 기업 추천 거절, 팀 프로젝트 갈등, 중장년층 취업불안)에 대해 검증된 3단계 상담 화법과 Do &amp; Don't 가이드를 제시합니다.
      </p>
      <div class="hero-info-grid">
        <div>소속 기관: <strong>${escapeHtml(institution)}</strong></div>
        <div>훈련 과정: <strong>${escapeHtml(courseName)}</strong></div>
        <div>발행 일자: <strong>${escapeHtml(exportedAt)}</strong></div>
        <div>문서 규격: <strong>독립 실행형 HTML 매뉴얼</strong></div>
      </div>
    </header>

    <!-- 상담사의 3대 황금 원칙 -->
    <section class="principles-card">
      <h3>🧭 담임교사·상담사의 3대 핵심 상담 원칙 (Golden Principles)</h3>
      <div class="principles-grid">
        <div class="principle-item">
          <strong>1. 비판 금지 및 심리적 안전감(Psychological Safety) 형성</strong>
          학생의 불안과 방어기제를 나무라지 마십시오. 감정을 온전히 수용받았다고 느낄 때 비로소 이성적인 대화가 시작됩니다.
        </div>
        <div class="principle-item">
          <strong>2. 추상적 위로 배제 및 객관적 채용 팩트 제시</strong>
          "열심히 하면 다 돼요" 식의 공허한 위로는 불안을 키웁니다. 주니어 채용 시장의 객관적 기준과 구체적 데이터로 관점을 전환시키십시오.
        </div>
        <div class="principle-item">
          <strong>3. 즉각 실천 가능한 구체적 행동 단위(Small Win) 합의</strong>
          상담의 마무리는 거창한 결심이 아니라, "오늘 밤 완성할 커밋 1개", "이번 주말 완성할 기능 1개"처럼 작은 성공 경험이어야 합니다.
        </div>
      </div>
    </section>

    <!-- 목차 (TOC) -->
    <nav id="toc" class="toc-card" aria-label="상황별 바로가기 목차">
      <h3>📑 6대 핵심 위기 상황 바로가기 (Table of Contents)</h3>
      <ul class="toc-list">
        ${tocHtml}
      </ul>
    </nav>

    <!-- 상황별 상세 매뉴얼 본문 -->
    ${situationsHtml}

    <!-- 종합 Do & Don't 비교표 부록 -->
    <section id="summary-dodont" class="summary-section">
      <h3 style="font-size: 18px; font-weight: 800; color: var(--slate-900);">
        📊 [부록] 6대 상황 종합 Do &amp; Don't 한눈에 비교표
      </h3>
      <p style="font-size: 13px; color: var(--slate-600); margin-top: 4px;">
        상담 전 교무실이나 상담실 책상에 부착하여 실시간 화법을 체크할 수 있는 요약표입니다.
      </p>

      <div style="overflow-x: auto;">
        <table class="summary-table">
          <thead>
            <tr>
              <th>상황 구분</th>
              <th>❌ 권위적/부정적 표현 (Don't)</th>
              <th>⭕ 신뢰 형성/해결 중심 표현 (Do)</th>
            </tr>
          </thead>
          <tbody>
            ${dodontSummaryRows}
          </tbody>
        </table>
      </div>
    </section>

    <!-- 원문 마크다운 전문 (접기/펼치기) -->
    <section class="details-box">
      <details>
        <summary>📄 [부록] 매뉴얼 원문 마크다운 텍스트 (Markdown Raw) 펼쳐보기</summary>
        <pre><code>${escapeHtml(rawMarkdown)}</code></pre>
      </details>
    </section>

    <!-- 푸터 -->
    <footer class="manual-footer">
      <p>© ${new Date().getFullYear()} ${escapeHtml(institution)} 취업지원센터 상담 대응 매뉴얼 (20년 경력 센터장 노하우 반영)</p>
      <p style="margin-top: 4px; font-size: 11px;">본 매뉴얼은 단일 독립형 HTML 파일로 오프라인 환경에서도 인터넷 연결 없이 브라우저에서 바로 열람 및 인쇄 가능합니다.</p>
    </footer>
  </main>
</body>
</html>`;
}

export function downloadManualAsHtml(
  situations: SituationScript[],
  rawMarkdown: string,
  options: ExportOptions = {}
): void {
  const htmlContent = generateManualHtml(situations, rawMarkdown, options);
  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  
  const dateStr = new Date().toISOString().slice(0, 10);
  const defaultName = `국비_IT_상담대응매뉴얼_${dateStr}.html`;
  a.download = options.filename || defaultName;
  
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
