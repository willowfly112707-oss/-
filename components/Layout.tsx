
import React from 'react';
import { FileText, Printer, FileDown, Sparkles, Download } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onPrint: () => void;
  onDownloadWord: () => void;
  isLoading: boolean;
  hasDocument: boolean;
  installPrompt: any;
  onInstall: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  onPrint, 
  onDownloadWord, 
  isLoading, 
  hasDocument,
  installPrompt,
  onInstall
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="no-print sticky top-0 z-30 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-600 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-base font-bold text-slate-900 leading-tight">柳老师公文小助手</h1>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">AI Document Expert</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            {installPrompt && (
              <button 
                onClick={onInstall}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-full hover:bg-red-100 transition-all"
              >
                {/* Fixed error: Module '"lucide-react"' has no exported member 'DownloadMobile'. Replaced with 'Download'. */}
                <Download className="w-3.5 h-3.5" />
                安装到桌面
              </button>
            )}

            <div className="flex items-center bg-slate-100 p-1 rounded-full">
              <button 
                onClick={onPrint}
                disabled={!hasDocument}
                className="p-2 text-slate-600 hover:bg-white hover:shadow-sm rounded-full transition-all disabled:opacity-30"
                title="打印 / 保存 PDF"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button 
                onClick={onDownloadWord}
                disabled={!hasDocument}
                className="p-2 text-blue-600 hover:bg-white hover:shadow-sm rounded-full transition-all disabled:opacity-30"
                title="导出标准 Word"
              >
                <FileDown className="w-4 h-4" />
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-red-600 rounded-full shadow-lg shadow-red-200">
              <Sparkles className="w-3 h-3" />
              {isLoading ? "撰写中..." : "专业助手"}
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden bg-slate-50">
        {children}
      </main>
    </div>
  );
};

export default Layout;
