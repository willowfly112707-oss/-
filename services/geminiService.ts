
import { GoogleGenAI, Type } from "@google/genai";
import { OfficialDocument, DocType } from "../types";

export const generateOfficialDoc = async (prompt: string, type: DocType): Promise<OfficialDocument> => {
  if (!process.env.API_KEY) {
    throw new Error("未检测到 API_KEY 环境配置。请在部署平台的环境变量中设置 API_KEY。");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `请根据以下结构化要素和要求生成公文：\n\n${prompt}`,
      config: {
        systemInstruction: `你是一个顶尖的公文写作专家，致力于推广“短、实、新”的优良文风。
        
        核心写作要求：
        1. **短（Concise）**：力戒长篇大论，开门见山，直奔主题。
        2. **实（Practical）**：措施具体，数据真实。
        3. **新（Innovative）**：观点新颖，表达生动。
        
        技术标准：
        - 严格执行《党政机关公文格式》（GB/T 9704-2012）。
        - 标题：发文机关+事由+文种，二号小标宋。
        - 正文：三号仿宋，28磅行距。
        - 序号层级：一、/（一）/1./（1）。

        输出必须是合法 JSON 格式。`,
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

    const text = response.text;
    if (!text) throw new Error("AI 未返回有效内容");
    return JSON.parse(text);
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    if (error.message?.includes("API_KEY")) {
      throw new Error("API Key 无效或未正确配置。");
    }
    throw new Error(`生成失败: ${error.message || "未知错误"}`);
  }
};
