import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ExternalLink, Info, ShoppingBag, Tag } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductDisplayProps {
  productInfo: {
    text: string;
    groundingMetadata?: any;
  };
  barcode: string;
}

export const ProductDisplay: React.FC<ProductDisplayProps> = ({ productInfo, barcode }) => {
  const sources = productInfo.groundingMetadata?.groundingChunks?.map((chunk: any) => chunk.web).filter(Boolean) || [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-zinc-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-100 rounded-xl">
            <Tag className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-900">Product Details</h2>
            <p className="text-sm text-zinc-500 font-mono">Barcode: {barcode}</p>
          </div>
        </div>

        <div className="prose prose-zinc max-w-none">
          <ReactMarkdown 
            components={{
              h1: ({ children }) => <h1 className="text-xl font-bold mt-4 mb-2">{children}</h1>,
              h2: ({ children }) => <h2 className="text-lg font-bold mt-4 mb-2">{children}</h2>,
              h3: ({ children }) => <h3 className="text-md font-bold mt-3 mb-1">{children}</h3>,
              p: ({ children }) => <p className="text-zinc-700 leading-relaxed mb-4">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-5 mb-4 space-y-1">{children}</ul>,
              li: ({ children }) => <li className="text-zinc-700">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold text-zinc-900">{children}</strong>,
            }}
          >
            {productInfo.text}
          </ReactMarkdown>
        </div>

        {sources.length > 0 && (
          <div className="mt-8 pt-6 border-t border-zinc-100">
            <h3 className="text-sm font-semibold text-zinc-900 mb-4 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Sources & Retailers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sources.map((source: any, idx: number) => (
                <a
                  key={idx}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition-colors group"
                >
                  <span className="text-sm text-zinc-700 truncate mr-2">{source.title || 'View Source'}</span>
                  <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-emerald-500 flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-center pb-12">
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-full hover:bg-zinc-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
        >
          <ShoppingBag className="w-5 h-5" />
          Scan Another Product
        </button>
      </div>
    </motion.div>
  );
};
