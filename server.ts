import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

let aiInstance: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// Build exact prompt strictly as specified by the user prompt
function buildPrompt(
  institution: string,
  courseName: string,
  additionalSituation: string
): string {
  const inst = (institution || "국비지원 IT 직업훈련기관").trim();
  const course = (courseName || "IT 개발자 양성과정").trim();
  const situationText = (additionalSituation || "없음").trim();

  return `# Role
너는 20년 경력의 국비지원 IT 직업훈련기관 취업지원센터장이자 직업상담 심리 전문가다. 저연차·사회초년생 담임교사가 현장에서 즉시 읽고 적용할 수 있도록 교육생의 주요 위기 상황별 맞춤형 상담 스크립트와 대응 매뉴얼을 작성한다.

# Goal
입력된 교육생의 6가지 핵심 우려 및 위기 상황에 대해 [상황 분석 - 구체적 핵심 메시지 & 3대 설득 포인트 - 단계별 대화 스크립트 - Do & Don't 가이드 - 후속 조치]가 포함된 완전한 상담 대응 가이드를 마크다운 구조로 작성한다.

# Instructions
1. **[상황 1: 비전공자의 취업 두려움]**
   - 비전공자의 불안감을 수용하고, 이전 전공/경험(도메인 지식)과 IT 기술의 결합을 통한 차별화된 포지셔닝 대화 스크립트를 작성한다.
2. **[상황 2: 전공자임에도 느끼는 취업 두려움]**
   - 전공자로서 가지는 높은 기대감과 현실적 역량 간의 갭에서 오는 부담감을 완화하고, 실무형 포트폴리오 완성에 집중하도록 유도하는 대화를 구성한다.
3. **[상황 3: 학원 커리큘럼/역량에 대한 의구심("이걸로 취업이 될까요?")]**
   - 국비과정 실무 프로젝트의 채용 시장 내 가치와 기업이 실제로 검증하는 역량 요소를 객관적 데이터 기반으로 설득하는 스크립트를 작성한다.
4. **[상황 4: 학습 난이도 및 팀원/동기 갈등으로 인한 프로젝트 참여 회피]**
   - 대인관계 스트레스와 학습 부진을 분리하여 경청하고, 중립적 입장에서 역할 조정 및 소통 규칙을 수립하는 대화를 구성한다.
5. **[상황 5: 개발자 취업 불확실성으로 인한 자퇴/중도탈락 의사]**
   - 포기 의사 뒤에 숨은 핵심 원인(학습 지연, 경제적 스트레스, 타인과의 비교)을 파악하고, 보충 학습 연계 및 현실적 대체 경로(QA, 유지보수, IT 기획 등)를 안내하는 대화를 작성한다.
6. **[상황 6: 중장년층(30대 후반~50대)의 나이 장벽 및 취업 불안]**
   - 20대 신입들과의 나이 차이, 서류 탈락 공포, 조직 적응 부담감을 수용하고, 풍부한 사회 경험(업무 책임감, 원활한 커뮤니케이션, 도메인 이해도)을 차별화 자산으로 전환하며, 연령 친화적인 B2B 솔루션·SI·스마트팩토리 등 맞춤형 타겟 기업군 공략 대화 스크립트를 작성한다.
7. 모든 상황에 대해 \`❌ 권위적/부정적 표현 (Don't)\`과 \`⭕ 신뢰 형성/해결 중심 표현 (Do)\`을 비교하는 표를 제공한다.
8. 각 상황마다 담임교사가 교육생에게 확신을 줄 수 있는 **구체적인 핵심 메시지(상담 전략)**와 **3대 핵심 설득 포인트(📌 채용 시장 팩트, 💡 학생의 차별화 무기, 🎯 당일 실천 솔루션)**를 반드시 개조식으로 명시한다.

# Output Format
## 1. 6대 핵심 상황별 실전 상담 대화 스크립트

### [상황 1] 비전공자의 취업 불안 및 두려움
- **상황 진단**:
- **핵심 메시지 (상담 전략)**:
- **핵심 설득 포인트**:
  - 📌 [채용 시장 팩트]:
  - 💡 [학생의 차별화 무기]:
  - 🎯 [당일 실천 솔루션]:
- **상담사 지도 나침반**:
- **단계별 대화 스크립트**:
  - **1단계 (감정 수용 & 라포)**:
  - **2단계 (도메인 강점 재발굴)**:
  - **3단계 (액션 플랜 수립)**:

### [상황 2] 전공자의 취업 불안 및 완벽주의 부담감
- **상황 진단**:
- **핵심 메시지 (상담 전략)**:
- **핵심 설득 포인트**:
  - 📌 [현실 진단]:
  - 💡 [차별화 무기]:
  - 🎯 [실천 솔루션]:
- **상담사 지도 나침반**:
- **단계별 대화 스크립트**:
  - **1단계 (부담감 인정)**:
  - **2단계 (실무 역량 재정의)**:
  - **3단계 (목표 단계화)**:

### [상황 3] 국비 교육과정 효용성 및 취업 가능성에 대한 의구심
- **상황 진단**:
- **핵심 메시지 (상담 전략)**:
- **핵심 설득 포인트**:
  - 📌 [채용 팩트]:
  - 💡 [국비의 본질 가치]:
  - 🎯 [실천 솔루션]:
- **상담사 지도 나침반**:
- **단계별 대화 스크립트**:
  - **1단계 (의구심 공감)**:
  - **2단계 (채용 시장 현실 및 프로젝트 가치 설명)**:
  - **3단계 (포트폴리오 보완점 확인)**:

### [상황 4] 학습 난이도 및 팀원 갈등으로 인한 프로젝트 거부
- **상황 진단**:
- **핵심 메시지 (상담 전략)**:
- **핵심 설득 포인트**:
  - 📌 [감정-업무 분리]:
  - 💡 [소통 룰 확립]:
  - 🎯 [담임교사 중재 솔루션]:
- **상담사 지도 나침반**:
- **단계별 대화 스크립트**:
  - **1단계 (중립적 경청 & 감정 분리)**:
  - **2단계 (역할 및 소통 방식 재조정)**:
  - **3단계 (팀내 합의 유도)**:

### [상황 5] 개발 적성 고민 및 자퇴(중도탈락) 요구
- **상황 진단**:
- **핵심 메시지 (상담 전략)**:
- **핵심 설득 포인트**:
  - 📌 [진짜 병목 진단]:
  - 💡 [IT 인접 직무 확장성]:
  - 🎯 [즉각 구제 솔루션]:
- **상담사 지도 나침반**:
- **단계별 대화 스크립트**:
  - **1단계 (포기 의사 이면의 원인 파악)**:
  - **2단계 (학습 지원책 제시)**:
  - **3단계 (IT 인접 직무 확장성 안내)**:

### [상황 6] 중장년층(30대 후반~50대)의 나이 장벽 및 취업 불안
- **상황 진단**:
- **핵심 메시지 (상담 전략)**:
- **핵심 설득 포인트**:
  - 📌 [수요 시장 팩트]:
  - 💡 [차별화 무기]:
  - 🎯 [실천 솔루션]:
- **상담사 지도 나침반**:
- **단계별 대화 스크립트**:
  - **1단계 (나이로 인한 위축감과 절박함의 공감)**:
  - **2단계 (나이의 약점을 경험·책임감의 무기로 전환)**:
  - **3단계 (중장년 특화 전략적 액션 플랜)**:

## 2. 상황별 Do & Don't 대화 비교 가이드
| 상황 | ❌ 권위적/부정적 표현 (Don't) | ⭕ 신뢰 형성/해결 중심 표현 (Do) |
|---|---|---|
| 비전공자 취업 두려움 | | |
| 전공자 취업 불안 | | |
| 교육과정 효용성 의구심 | | |
| 팀 갈등 및 프로젝트 거부 | | |
| 자퇴/중도탈락 요구 | | |
| 중장년층 취업 불안/나이 장벽 | | |

# Constraints
- 서론, 인사말, 결론적 사족을 전혀 포함하지 말고 본론만 즉시 출력한다.
- 추상적인 상담 이론 용어 대신 현장에서 담임교사가 그대로 읽고 적용할 수 있는 구체적인 팩트와 논리를 제시한다.
- 비판적·훈계조 표현을 배제하고 개조식 및 표 형식으로 작성하여 스캔독해를 최적화한다.
- 6가지 상황 및 Do & Don't 가이드를 중간에 생략하지 않고 완전히 풀어서 작성한다.

# Input
- 훈련 기관명: ${inst}
- 운영 과정명: ${course}
- 추가/변형 상담 상황: ${situationText}`;
}

// API Health check
app.get("/api/health", (_req, res) => {
  const hasEnvKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({ status: "ok", hasEnvApiKey: hasEnvKey });
});

// Helper to sanitize error messages so API keys never leak into responses or logs
function sanitizeError(err: any): string {
  if (!err) return "알 수 없는 오류가 발생했습니다.";
  const msg = typeof err === "string" ? err : err.message || JSON.stringify(err);
  if (msg.includes("503") || msg.includes("high demand") || msg.includes("UNAVAILABLE")) {
    return "현재 Google Gemini 서비스 접속량이 많아 일시적으로 지연되고 있습니다. 잠시 후 다시 시도해 주세요.";
  }
  // Redact potential API keys (e.g. AIzaSy...)
  return msg.replace(/AIza[0-9A-Za-z-_]{35}/g, "[REDACTED_API_KEY]");
}

// 1. Backend Route: Verify user's Gemini API Key (Server-to-Server, never persists key)
app.post("/api/verify-key", async (req, res) => {
  const rawKey = req.body?.apiKey;
  if (!rawKey || typeof rawKey !== "string" || !rawKey.trim()) {
    return res.status(400).json({
      valid: false,
      error: "MISSING_KEY",
      message: "Gemini API Key가 입력되지 않았습니다. API 키를 입력해 주세요.",
    });
  }

  const trimmedKey = rawKey.trim();

  // Basic format sanity check (AIzaSy...)
  if (!trimmedKey.startsWith("AIza") && trimmedKey.length < 20) {
    return res.status(400).json({
      valid: false,
      error: "INVALID_FORMAT",
      message: "올바른 Google Gemini API Key 형식이 아닙니다. 'AIza...'로 시작하는 키를 입력해주세요.",
    });
  }

  try {
    // In-memory one-time verification instance (never logged or saved)
    const verificationAI = new GoogleGenAI({
      apiKey: trimmedKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    // Make minimal verification call to Google Gemini API
    const response = await verificationAI.models.generateContent({
      model: "gemini-3.8-flash",
      contents: "ping",
      config: {
        maxOutputTokens: 2,
      },
    });

    if (response && response.text !== undefined) {
      return res.status(200).json({
        valid: true,
        message: "Gemini API Key 승인이 성공적으로 완료되었습니다!",
        model: "gemini-3.8-flash",
      });
    }

    return res.status(200).json({
      valid: true,
      message: "Gemini API Key 승인이 성공적으로 완료되었습니다!",
      model: "gemini-3.8-flash",
    });
  } catch (err: any) {
    const status = err?.status || err?.statusCode || 500;
    const rawMsg = err?.message || "";
    console.error(`[Security Safe] Key verification failed with status ${status}`);

    if (
      rawMsg.includes("API_KEY_INVALID") ||
      rawMsg.includes("API key not valid") ||
      rawMsg.includes("403") ||
      rawMsg.includes("400") ||
      status === 400 ||
      status === 403
    ) {
      return res.status(401).json({
        valid: false,
        error: "INVALID_KEY",
        message: "유효하지 않거나 만료된 Gemini API Key입니다. Google AI Studio에서 발급받은 올바른 키인지 확인해주세요.",
      });
    }

    if (rawMsg.includes("RESOURCE_EXHAUSTED") || rawMsg.includes("429") || status === 429) {
      return res.status(429).json({
        valid: false,
        error: "QUOTA_EXCEEDED",
        message: "API 호출 한도(Quota)가 초과되었습니다. 잠시 후 다시 시도하시거나 계정 사용량을 확인해주세요.",
      });
    }

    if (
      rawMsg.includes("fetch failed") ||
      rawMsg.includes("ENOTFOUND") ||
      rawMsg.includes("ECONNREFUSED") ||
      rawMsg.includes("ETIMEDOUT")
    ) {
      return res.status(502).json({
        valid: false,
        error: "NETWORK_ERROR",
        message: "Google Gemini 서버와의 통신에 실패했습니다. 네트워크 연결 상태를 확인해주세요.",
      });
    }

    return res.status(500).json({
      valid: false,
      error: "VERIFICATION_ERROR",
      message: `API Key 유효성 검사 중 오류가 발생했습니다: ${sanitizeError(rawMsg)}`,
    });
  }
});

// 2. Backend Route: /api/gemini (Unified endpoint accepting user session key or env key)
app.post("/api/gemini", async (req, res) => {
  try {
    const userApiKey = (req.body?.apiKey as string)?.trim() || (req.headers["x-gemini-api-key"] as string)?.trim();
    const effectiveKey = userApiKey || process.env.GEMINI_API_KEY;

    if (!effectiveKey) {
      return res.status(401).json({
        error: "NO_API_KEY",
        message: "승인된 Gemini API Key가 없습니다. 먼저 랜딩페이지에서 API Key를 입력하고 승인받아 주세요.",
      });
    }

    const { prompt, institution, courseName, additionalSituation } = req.body || {};
    const finalPrompt = prompt || buildPrompt(institution, courseName, additionalSituation);

    const clientAI = new GoogleGenAI({
      apiKey: effectiveKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const response = await clientAI.models.generateContent({
      model: "gemini-3.8-flash",
      contents: finalPrompt,
    });

    const outputMarkdown = response.text || "";
    return res.json({
      markdown: outputMarkdown,
      promptUsed: finalPrompt,
      source: "gemini-3.8-flash",
    });
  } catch (error: any) {
    const status = error?.status || 500;
    const msg = error?.message || "";
    console.error(`[Security Safe] /api/gemini generation error status: ${status}`);

    if (msg.includes("API_KEY_INVALID") || msg.includes("API key not valid") || status === 400 || status === 403) {
      return res.status(401).json({
        error: "INVALID_KEY",
        message: "입력된 Gemini API Key가 유효하지 않습니다. 다시 확인 후 승인받아 주세요.",
      });
    }

    if (msg.includes("RESOURCE_EXHAUSTED") || status === 429) {
      return res.status(429).json({
        error: "QUOTA_EXCEEDED",
        message: "API 호출 한도(Quota)가 초과되었습니다. 잠시 후 다시 시도해주세요.",
      });
    }

    return res.status(500).json({
      error: "Generation failed",
      message: sanitizeError(msg) || "답변 생성 중 오류가 발생했습니다.",
    });
  }
});

// API generate route (supports backward compatibility with req.body.apiKey)
app.post("/api/generate", async (req, res) => {
  try {
    const userApiKey = (req.body?.apiKey as string)?.trim() || (req.headers["x-gemini-api-key"] as string)?.trim();
    const effectiveKey = userApiKey || process.env.GEMINI_API_KEY;

    if (!effectiveKey) {
      return res.status(503).json({
        error: "GEMINI_API_KEY is not configured",
        message: "승인된 Gemini API Key가 없습니다. 랜딩페이지에서 API Key를 활성화하거나 기본 내장 실전 매뉴얼을 활용할 수 있습니다.",
      });
    }

    const { institution, courseName, additionalSituation } = req.body || {};
    const fullPrompt = buildPrompt(institution, courseName, additionalSituation);

    const ai = new GoogleGenAI({
      apiKey: effectiveKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: fullPrompt,
    });

    const outputMarkdown = response.text || "";
    return res.json({
      markdown: outputMarkdown,
      promptUsed: fullPrompt,
      source: "gemini-3.8-flash",
    });
  } catch (error: any) {
    const status = error?.status || 500;
    const msg = error?.message || "";
    console.error(`[Security Safe] Gemini API generation error status: ${status}`);

    if (msg.includes("API_KEY_INVALID") || msg.includes("API key not valid") || status === 400 || status === 403) {
      return res.status(401).json({
        error: "INVALID_KEY",
        message: "입력된 Gemini API Key가 유효하지 않습니다. 다시 확인 후 승인받아 주세요.",
      });
    }

    return res.status(500).json({
      error: "Generation failed",
      message: sanitizeError(msg) || "답변 생성 중 오류가 발생했습니다.",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
