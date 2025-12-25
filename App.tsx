
import React, { useState, useCallback, useEffect } from 'react';
import Layout from './components/Layout';
import DocumentPreview from './components/DocumentPreview';
import { DocType, OfficialDocument } from './types';
import { generateOfficialDoc } from './services/geminiService';
import { downloadWordDoc } from './wordGenerator';
import { 
  Send, 
  FileEdit, 
  Settings2, 
  RotateCcw, 
  AlertCircle, 
  Building2, 
  Users, 
  Calendar, 
  Target,
  FileText,
  Zap,
  Info
} from 'lucide-react';

const App: React.FC = () => {
  // PWA Installation State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  // Form states
  const [enterprise, setEnterprise] = useState('');
  const [recipient, setRecipient] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [background, setBackground] = useState('');
  const [corePoints, setCorePoints] = useState('');
  const [referenceDoc, setReferenceDoc] = useState('');
  
  const [docType, setDocType] = useState<DocType>(DocType.NOTICE);
  const [document, setDocument] = useState<OfficialDocument | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!background.trim() && !corePoints.trim()) {
      setError('请填写公文的核心内容或事由。');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    const structuredRequest = `
      风格要求：严格遵循公文“短、实、新”原则（短小精悍、务实管用、观点新颖）。
      发文单位：${enterprise || '默认单位'}
      主送机关：${recipient || '各相关部门'}
      成文日期：${date}
      核心事由/背景：${background}
      关键要求/要点：${corePoints}
      参考文件内容：${referenceDoc || '无'}
    `;

    try {
      const result = await generateOfficialDoc(structuredRequest, docType);
      setDocument(result);
    } catch (err) {
      setError('生成失败，请检查网络或稍后重试。');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleDownloadWord = useCallback(async () => {
    if (document) {
      await downloadWordDoc(document);
    }
  }, [document]);

  const handleReset = () => {
    setEnterprise('');
    setRecipient('');
    setBackground('');
    setCorePoints('');
    setReferenceDoc('');
    setDocument(null);
    setError(null);
  };

  return (
    <Layout 
      onPrint={handlePrint} 
      onDownloadWord={handleDownloadWord} 
      isLoading={isLoading}
      hasDocument={!!document}
      installPrompt={deferredPrompt}
      onInstall={handleInstall}
    >
      <div className="flex h-[calc(100vh-64px)] overflow-hidden flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="no-print w-full lg:w-[400px] flex-shrink-0 bg-white border-r flex flex-col shadow-sm z-10 overflow-hidden">
          <div className="p-5 flex-1 overflow-y-auto space-y-6 custom-scrollbar">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <FileEdit className="w-4 h-4 text-red-600" />
                要素配置
              </h2>
              <button onClick={handleReset} className="text-[10px] text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors">
                <RotateCcw className="w-3 h-3" /> 重置
              </button>
            </div>

            {/* Doc Type Selector */}
            <div className="grid grid-cols-4 gap-1.5">
              {Object.values(DocType).map((type) => (
                <button
                  key={type}
                  onClick={() => setDocType(type)}
                  className={`py-2 text-[11px] rounded-md border transition-all truncate ${
                    docType === type
                      ? 'bg-red-600 border-red-600 text-white font-bold'
                      : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <div className="group">
                <label className="text-[11px] font-bold text-slate-400 mb-1 block group-focus-within:text-red-600 transition-colors">发文机关</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-slate-300" />
                  <input
                    type="text"
                    value={enterprise}
                    onChange={(e) => setEnterprise(e.target.value)}
                    placeholder="如：XX局办公室"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="group">
                <label className="text-[11px] font-bold text-slate-400 mb-1 block group-focus-within:text-red-600 transition-colors">主送单位</label>
                <div className="relative">
                  <Users className="absolute left-3 top-2.5 w-4 h-4 text-slate-300" />
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="如：各科室、下属单位"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="group">
                <label className="text-[11px] font-bold text-slate-400 mb-1 block">落款日期</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-300" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-800 flex justify-between">
                  核心事由 
                  <span className="text-[10px] text-slate-400 font-normal italic">必填</span>
                </label>
                <textarea
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  placeholder="简洁描述发文的目的和背景..."
                  className="w-full h-20 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-800">关键内容/指标要求</label>
                <textarea
                  value={corePoints}
                  onChange={(e) => setCorePoints(e.target.value)}
                  placeholder="列出具体要求、时间节点、数据等..."
                  className="w-full h-24 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all resize-none"
                />
              </div>

              <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                <div className="flex items-center gap-2 text-red-700 font-bold text-[11px] mb-1">
                  <Zap className="w-3 h-3" /> 文风提示
                </div>
                <p className="text-[10px] text-red-600/80 leading-relaxed">
                  系统将自动通过 AI 润色，确保语言精炼、客观、严谨，符合“短、实、新”标准。
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-amber-800 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}
          </div>

          <div className="p-5 bg-white border-t">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-100 active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {isLoading ? "正在匠心撰写..." : "一键生成标准公文"}
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 bg-slate-100 overflow-y-auto p-4 sm:p-10 flex justify-center custom-scrollbar">
          <div className="w-full max-w-4xl">
            {!document && (
              <div className="no-print mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg text-white">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-blue-900">使用指南</h4>
                  <p className="text-[10px] text-blue-700">左侧填写基本要素，系统将自动按照 GB/T 9704-2012 标准为您排版。</p>
                </div>
              </div>
            )}
            
            <DocumentPreview doc={document} />
            <div className="no-print h-10" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default App;
