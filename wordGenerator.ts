
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  AlignmentType, 
  BorderStyle
} from 'docx';
import { OfficialDocument } from './types';

/**
 * GB/T 9704-2012 Specifications for DOCX:
 * - A4 Size
 * - Margins (mm to twips: 1mm = 56.7 twips)
 * - Font sizes: 
 *   - 二号 (22pt) -> docx size: 44
 *   - 三号 (16pt) -> docx size: 32
 * - Line spacing: 28pt (exact) -> docx line: 560 twips
 */

export const downloadWordDoc = async (doc: OfficialDocument) => {
  const mmToTwip = (mm: number) => Math.round(mm * 56.7);
  const ptToTwip = (pt: number) => pt * 20;
  const ptToHalfPoint = (pt: number) => pt * 2; // docx TextRun size is in half-points

  const docx = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: mmToTwip(210),
              height: mmToTwip(297),
            },
            margin: {
              top: mmToTwip(37),
              bottom: mmToTwip(35),
              left: mmToTwip(28),
              right: mmToTwip(26),
            },
          },
        },
        children: [
          // 1. 红头 (版头)
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: doc.sender,
                color: "FF0000",
                bold: true,
                size: ptToHalfPoint(36),
                font: "方正小标宋简体",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            border: {
              bottom: {
                color: "FF0000",
                space: 1,
                style: BorderStyle.SINGLE,
                size: 24,
              },
            },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `〔2025〕第 XX 号`,
                color: "FF0000",
                size: ptToHalfPoint(12),
                font: "仿宋",
              }),
            ],
            spacing: { after: 400 },
          }),

          // 2. 标题 - 二号小标宋体
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 800, after: 600, line: ptToTwip(28), lineRule: "exact" },
            children: [
              new TextRun({
                text: doc.title,
                size: ptToHalfPoint(22),
                font: "方正小标宋简体",
                bold: true,
              }),
            ],
          }),

          // 3. 主送机关 - 三号仿宋
          ...(doc.recipient ? [
            new Paragraph({
              spacing: { before: 200, after: 200, line: ptToTwip(28), lineRule: "exact" },
              children: [
                new TextRun({
                  text: `${doc.recipient}：`,
                  size: ptToHalfPoint(16),
                  font: "仿宋",
                }),
              ],
            }),
          ] : []),

          // 4. 正文 - 三号仿宋/黑体/楷体
          ...doc.body.split('\n').map(line => {
            if (!line.trim()) return new Paragraph({ spacing: { line: ptToTwip(28), lineRule: "exact" } });
            
            const trimmed = line.trim();
            let isLevel1 = /^[一二三四五六七八九十]+、/.test(trimmed);
            let isLevel2 = /^（[一二三四五六七八九十]+）/.test(trimmed);

            return new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 0, line: ptToTwip(28), lineRule: "exact" },
              indent: { firstLine: ptToTwip(16 * 2) }, // 首行缩进两个字符 (16pt * 2)
              children: [
                new TextRun({
                  text: line,
                  size: ptToHalfPoint(16),
                  font: isLevel1 ? "黑体" : (isLevel2 ? "楷体" : "仿宋"),
                  bold: isLevel1,
                }),
              ],
            });
          }),

          // 5. 附件
          ...(doc.attachments && doc.attachments.length > 0 ? [
            new Paragraph({
              spacing: { before: 400, line: ptToTwip(28), lineRule: "exact" },
              children: [
                new TextRun({
                  text: `附件：${doc.attachments.map((a, i) => `${i + 1}.${a}`).join(' ')}`,
                  size: ptToHalfPoint(16),
                  font: "仿宋",
                }),
              ],
            }),
          ] : []),

          // 6. 发文机关署名与日期
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { before: 800, line: ptToTwip(28), lineRule: "exact" },
            children: [
              new TextRun({
                text: doc.sender,
                size: ptToHalfPoint(16),
                font: "仿宋",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { line: ptToTwip(28), lineRule: "exact" },
            children: [
              new TextRun({
                text: doc.date,
                size: ptToHalfPoint(16),
                font: "仿宋",
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(docx);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${doc.title || '公文'}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
