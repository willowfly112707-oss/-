
import { GoogleGenAI, Type } from "@google/genai";
import { OfficialDocument, DocType } from "../types";

export const generateOfficialDoc = async (prompt: string, type: DocType): Promise<OfficialDocument> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `请根据以下结构化要素和要求生成公文：\n\n${prompt}`,
    config: {
      systemInstruction: `你是一个顶尖的公文写作专家，致力于推广“短、实、新”的优良文风。
      
      核心写作要求：
      1. **短（Concise）**：力戒长篇大论，开门见山，直奔主题。删减空话、套话，每句话都要有信息量。
      2. **实（Practical）**：内容务实，措施具体，数据真实。重点放在解决什么问题、怎么解决问题上。
      3. **新（Innovative）**：观点新颖，表达生动。在符合公文规范的前提下，尽量避免陈词滥调，体现新时代的工作思路。
      
      技术标准：
      - 严格执行《党政机关公文格式》（GB/T 9704-2012）。
      - **标题**：发文机关+事由+文种，二号小标宋。
      - **正文**：三号仿宋，28磅行间距感。
      - **序号层级**：一、/（一）/1./（1）。
      - **参考文件利用**：若提供了参考文件，请精准提取核心精神或数据，并有机融入新公文中，而非简单堆砌。

      输出必须是JSON格式：
      - title: 标题
      - recipient: 主送机关（若无则为空）
      - body: 正文（重点体现“短实新”，结构严密）
      - sender: 发文单位
      - date: 成文日期（中文数字格式，如：二〇二五年三月十日）
      - attachments: 附件列表（数组）`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          recipient: { type: Type.STRING },
          body: { type: Type.STRING },
          sender: { type: Type.STRING },
          date: { type: Type.STRING },
          attachments: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
        },
        required: ["title", "body", "sender", "date"]
      },
      thinkingConfig: { thinkingBudget: 4000 }
    },
  });

  try {
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    throw new Error("生成文档格式解析失败");
  }
};
