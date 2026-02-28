import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Camera, RefreshCw, X } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (decodedText: string) => void;
  isScanning: boolean;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, isScanning }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isScanning && !scannerRef.current) {
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        formatsToSupport: [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.QR_CODE
        ]
      };

      const scanner = new Html5QrcodeScanner("reader", config, false);
      
      scanner.render(
        (decodedText) => {
          onScan(decodedText);
          scanner.clear().catch(console.error);
          scannerRef.current = null;
        },
        (errorMessage) => {
          // Silent error for continuous scanning
        }
      );

      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    };
  }, [isScanning, onScan]);

  return (
    <div className="w-full max-w-md mx-auto overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl">
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-emerald-500" />
          <span className="font-medium text-zinc-100">Scanner</span>
        </div>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
      
      <div id="reader" className="w-full aspect-square bg-black"></div>
      
      <div className="p-4 bg-zinc-900/50 text-center">
        <p className="text-sm text-zinc-400">
          Align the barcode within the frame to scan
        </p>
      </div>
    </div>
  );
};
