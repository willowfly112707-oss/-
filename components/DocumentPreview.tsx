
import React from 'react';
import { OfficialDocument } from '../types';
import { FileText } from 'lucide-react';

interface DocumentPreviewProps {
  doc: OfficialDocument | null;
}

/**
 * GB/T 9704-2012 Standards Implementation:
 * Page: A4 (210mm x 297mm)
 * Margins: Top 37mm, Bottom 35mm, Left 28mm, Right 26mm
 * Line Spacing: 28pt (fixed)
 * Font Sizes: Title (22pt / 二号), Body (16pt / 三号)
 */
const DocumentPreview: React.FC<DocumentPreviewProps> = ({ doc }) => {
  if (!doc) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 bg-white/50 border-2 border-dashed border-slate-200 rounded-2xl m-4 min-h-[600px]">
        <FileText className="w-16 h-16 mb-4 opacity-20" />
        <p className="text-lg font-medium">在左侧输入要素并点击生成</p>
        <p className="text-sm opacity-60">生成的公文将严格遵循 GB/T 9704-2012 标准排版</p>
      </div>
    );
  }

  // A simple function to apply different fonts based on numbering (Basic simulation of Level 1/2 headings)
  const formatBody = (text: string) => {
    return text.split('\n').map((line, index) => {
      const trimmedLine = line.trim();
      let className = "font-official-body";
      
      // Level 1: 一、... (HeiTi)
      if (/^[一二三四五六七八九十]+、/.test(trimmedLine)) {
        className = "font-official-h1";
      }
      // Level 2: （一）... (KaiTi)
      else if (/^（[一二三四五六七八九十]+）/.test(trimmedLine)) {
        className = "font-official-h2";
      }

      return (
        <div key={index} className={`${className} leading-[28pt] mb-[10pt] text-justify indent-[2em]`}>
          {line}
        </div>
      );
    });
  };

  return (
    <div className="print-area bg-white shadow-2xl mx-auto overflow-hidden flex flex-col" 
         style={{ width: '210mm', minHeight: '297mm', padding: '37mm 26mm 35mm 28mm' }}>
      
      {/* 1. Red Header (版头) - Optional, but common for official letters */}
      <div className="border-b-[1.5pt] border-red-600 mb-10 pb-4 flex flex-col items-center">
        <div className="text-red-600 font-bold text-[36pt] font-official-title tracking-[0.5em] mb-2 leading-none">
          {doc.sender}
        </div>
        <div className="text-red-600 text-[12pt] font-official-body">
          {/* Internal Reference Numbers could go here */}
          〔2025〕第 XX 号
        </div>
      </div>

      {/* 2. Title (标题) - 二号小标宋体 */}
      <div className="text-center mb-10 mt-4">
        <h1 className="text-[22pt] font-official-title leading-tight">
          {doc.title}
        </h1>
      </div>

      {/* 3. Recipient (主送机关) - 三号仿宋 */}
      {doc.recipient && (
        <div className="text-[16pt] font-official-body mb-6 leading-[28pt]">
          {doc.recipient}：
        </div>
      )}

      {/* 4. Body (正文) - 三号仿宋 + Hierarchical Fonts */}
      <div className="text-[16pt] flex-grow">
        {formatBody(doc.body)}
      </div>

      {/* 5. Attachments (附件) */}
      {doc.attachments && doc.attachments.length > 0 && (
        <div className="text-[16pt] font-official-body mt-8 mb-4 leading-[28pt]">
          <p>附件：{doc.attachments.map((a, i) => `${i + 1}.${a}`).join(' ')}</p>
        </div>
      )}

      {/* 6. Signature (发文机关署名与日期) */}
      <div className="mt-12 flex flex-col items-end">
        <div className="text-center min-w-[200px] text-[16pt] font-official-body leading-[28pt]">
          <div className="mb-2">{doc.sender}</div>
          <div>{doc.date}</div>
        </div>
      </div>

      {/* 7. Footer (版记) - Typically at the very bottom */}
      <div className="mt-auto pt-4 border-t border-slate-900 flex justify-between text-[10.5pt] font-official-body no-print opacity-50">
        <div>抄送：相关部门</div>
        <div>2025年3月10日印发</div>
      </div>
    </div>
  );
};

export default DocumentPreview;
