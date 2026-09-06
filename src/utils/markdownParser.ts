import { SituationScript } from "../types";
import { SITUATIONS_STRUCTURED } from "../data/defaultManual";

export function parseMarkdownToSituations(markdown: string): SituationScript[] {
  try {
    const result: SituationScript[] = [];

    // Split markdown by situations
    const situationBlocks = markdown.split(/###\s*\[상황\s*(\d+)\]/i);

    // Extract Do & Don't table rows
    const tableRegex = /\|\s*([^|\n]+?)\s*\|\s*([^|\n]+?)\s*\|\s*([^|\n]+?)\s*\|/g;
    const tableRows: { situation: string; dont: string; do: string }[] = [];
    let match;

    while ((match = tableRegex.exec(markdown)) !== null) {
      const col1 = match[1].trim();
      const col2 = match[2].trim();
      const col3 = match[3].trim();
      // Skip header and separator rows
      if (
        col1.includes("상황") ||
        col1.includes("---") ||
        col2.includes("Don't") ||
        col2.includes("---")
      ) {
        continue;
      }
      tableRows.push({ situation: col1, dont: col2, do: col3 });
    }

    // Pair parsed situation blocks
    for (let i = 1; i < situationBlocks.length; i += 2) {
      const id = parseInt(situationBlocks[i], 10);
      const content = situationBlocks[i + 1] || "";

      // First line after header is usually title
      const lines = content.split("\n");
      const titleLine = lines[0].trim().replace(/^[:\s-]+/, "");
      const title = titleLine || `상황 ${id}`;

      // Extract diagnosis
      const diagMatch = content.match(/-\s*\*\*상황 진단(?:\s*및\s*핵심\s*메시지)?\*\*:\s*([^\n]+)/);
      const diagnosis = diagMatch ? diagMatch[1].trim() : SITUATIONS_STRUCTURED[id - 1]?.diagnosis || "";

      // Extract core message
      const coreMsgMatch = content.match(/-\s*\*\*핵심\s*메시지[^*]*\*\*:\s*([^\n]+)/);
      const coreMessage = coreMsgMatch ? coreMsgMatch[1].trim() : SITUATIONS_STRUCTURED[id - 1]?.coreMessage || "";

      // Extract key points
      const keyPoints: string[] = [];
      const kpRegex = /-\s*([📌💡🎯][^\n]+)/g;
      let kpMatch;
      while ((kpMatch = kpRegex.exec(content)) !== null) {
        keyPoints.push(kpMatch[1].trim());
      }
      const finalKeyPoints = keyPoints.length > 0 ? keyPoints : SITUATIONS_STRUCTURED[id - 1]?.keyPoints || [];

      // Extract counselor mindset
      const mindsetMatch = content.match(/-\s*\*\*상담사 지도 나침반\*\*:\s*([^\n]+)/);
      const counselorMindset = mindsetMatch ? mindsetMatch[1].trim() : SITUATIONS_STRUCTURED[id - 1]?.counselorMindset || "";

      // Extract 3 stages
      const steps: { stage: string; label: string; script: string; tip?: string }[] = [];
      const stepRegex = /-\s*\*\*(\d+단계)\s*\(([^)]+)\)\*\*:\s*["“]?([^"”\n]+)["”]?/g;
      let stepMatch;

      while ((stepMatch = stepRegex.exec(content)) !== null) {
        steps.push({
          stage: stepMatch[1].trim(),
          label: stepMatch[2].trim(),
          script: stepMatch[3].trim().replace(/^["“]+|["”]+$/g, ""),
          tip: SITUATIONS_STRUCTURED[id - 1]?.steps[steps.length]?.tip,
        });
      }

      // If step regex didn't catch 3, fallback to default steps for that situation
      const finalSteps = steps.length > 0 ? steps : SITUATIONS_STRUCTURED[id - 1]?.steps || [];

      // Find corresponding Do & Don't
      const matchedRow = tableRows[id - 1] || tableRows.find((r) => r.situation.includes(title.slice(0, 4)));
      const dont = matchedRow?.dont || SITUATIONS_STRUCTURED[id - 1]?.dont || "";
      const doText = matchedRow?.do || SITUATIONS_STRUCTURED[id - 1]?.do || "";

      result.push({
        id,
        title: title || SITUATIONS_STRUCTURED[id - 1]?.title || `상황 ${id}`,
        tag: SITUATIONS_STRUCTURED[id - 1]?.tag || "상담 대응 가이드",
        diagnosis,
        coreMessage: coreMessage || SITUATIONS_STRUCTURED[id - 1]?.coreMessage,
        keyPoints: finalKeyPoints,
        counselorMindset: counselorMindset || SITUATIONS_STRUCTURED[id - 1]?.counselorMindset,
        steps: finalSteps,
        dont: dont.replace(/^["“]+|["”]+$/g, ""),
        do: doText.replace(/^["“]+|["”]+$/g, ""),
        followUp: SITUATIONS_STRUCTURED[id - 1]?.followUp || [
          "심리적 안정감 확보 및 개별 면담 일지 기록",
          "학습 진도 및 팀 소통 상황 주간 모니터링",
          "필요시 보충 튜터링 및 직무 상담 연계",
        ],
      });
    }

    if (result.length >= 4) {
      return result;
    }
    return SITUATIONS_STRUCTURED;
  } catch (err) {
    console.warn("Markdown parsing fell back to structured defaults", err);
    return SITUATIONS_STRUCTURED;
  }
}
