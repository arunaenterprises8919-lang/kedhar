import { useState } from 'react';
import { BarcodeScanner } from './components/BarcodeScanner';
import { ProductDisplay } from './components/ProductDisplay';
import { getProductInfo } from './services/gemini';
import { Loader2, Search, ScanLine, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [barcode, setBarcode] = useState<string | null>(null);
  const [productInfo, setProductInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async (code: string) => {
    setBarcode(code);
    setIsScanning(false);
    setLoading(true);
    setError(null);
    try {
      const info = await getProductInfo(code);
      setProductInfo(info);
    } catch (err) {
      setError('Failed to fetch product information. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      handleScan(manualInput.trim());
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-zinc-900">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <ScanLine className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">India Barcode Pro</h1>
          </div>
          <div className="hidden sm:block text-sm text-zinc-500 font-medium">
            AI-Powered Price Comparison
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!barcode && !loading && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8"
            >
              <div className="space-y-4 max-w-xl">
                <h2 className="text-4xl sm:text-5xl font-bold text-zinc-900 leading-tight">
                  Scan any product to find the <span className="text-emerald-600">best price</span> in India.
                </h2>
                <p className="text-lg text-zinc-600">
                  Instant information, specifications, and price comparisons across major retailers.
                </p>
              </div>

              {!isScanning ? (
                <>
                  <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                    <button
                      onClick={() => setIsScanning(true)}
                      className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-semibold hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-200 active:scale-95"
                    >
                      <ScanLine className="w-6 h-6" />
                      Open Scanner
                    </button>
                    
                    <div className="relative flex-1">
                      <form onSubmit={handleManualSubmit} className="relative">
                        <input
                          type="text"
                          placeholder="Enter barcode manually..."
                          value={manualInput}
                          onChange={(e) => setManualInput(e.target.value)}
                          className="w-full px-6 py-4 bg-white border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                        />
                        <button
                          type="submit"
                          className="absolute right-2 top-2 p-2 bg-zinc-100 text-zinc-600 rounded-xl hover:bg-zinc-200 transition-colors"
                        >
                          <Search className="w-5 h-5" />
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl mt-12">
                    {[
                      { icon: <ScanLine className="w-5 h-5" />, title: "Instant Scan", desc: "Supports EAN, UPC, and QR codes" },
                      { icon: <Search className="w-5 h-5" />, title: "Live Prices", desc: "Real-time data from Indian retailers" },
                      { icon: <AlertCircle className="w-5 h-5" />, title: "AI Analysis", desc: "Detailed specs and product summaries" }
                    ].map((feature, i) => (
                      <div key={i} className="p-6 bg-white rounded-2xl border border-zinc-200 text-left space-y-2">
                        <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                          {feature.icon}
                        </div>
                        <h4 className="font-bold text-zinc-900">{feature.title}</h4>
                        <p className="text-sm text-zinc-500 leading-snug">{feature.desc}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="w-full">
                  <BarcodeScanner onScan={handleScan} isScanning={isScanning} />
                  <button
                    onClick={() => setIsScanning(false)}
                    className="mt-6 text-zinc-500 hover:text-zinc-900 font-medium transition-colors"
                  >
                    Cancel Scanning
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[60vh] space-y-6"
            >
              <div className="relative">
                <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-full animate-ping" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-zinc-900">Analyzing Product...</h3>
                <p className="text-zinc-500">Searching major Indian retailers for the best prices.</p>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto p-6 bg-red-50 border border-red-100 rounded-3xl text-center space-y-4"
            >
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-red-900">Something went wrong</h3>
                <p className="text-red-700">{error}</p>
              </div>
              <button
                onClick={() => {
                  setError(null);
                  setBarcode(null);
                  setIsScanning(false);
                }}
                className="px-6 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {barcode && productInfo && !loading && (
            <ProductDisplay productInfo={productInfo} barcode={barcode} />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-12 border-t border-zinc-200 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <ScanLine className="w-4 h-4" />
            <span className="text-sm font-medium">India Barcode Pro</span>
          </div>
          <div className="text-sm text-zinc-400">
            Powered by Gemini AI & Google Search
          </div>
          <div className="flex gap-6">
            <span className="text-xs text-zinc-400">Privacy</span>
            <span className="text-xs text-zinc-400">Terms</span>
            <span className="text-xs text-zinc-400">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
