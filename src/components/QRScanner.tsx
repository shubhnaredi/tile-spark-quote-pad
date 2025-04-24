
import React, { useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface QRScannerProps {
  onScanSuccess: (qrCode: string) => void;
  onClose: () => void;
}

export function QRScanner({ onScanSuccess, onClose }: QRScannerProps) {
  const [scanning, setScanning] = useState(false);
  
  const startScanner = () => {
    const html5QrCode = new Html5Qrcode("reader");
    setScanning(true);
    
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    
    html5QrCode.start(
      { facingMode: "environment" }, 
      config,
      (decodedText) => {
        // Stop scanning after finding a valid QR code
        html5QrCode.stop().then(() => {
          setScanning(false);
          onScanSuccess(decodedText);
          toast.success("QR Code scanned successfully");
        }).catch(err => {
          toast.error("Failed to stop scanner");
          console.error("Failed to stop scanner:", err);
        });
      },
      (errorMessage) => {
        // Ignore errors during scanning
      }
    ).catch(err => {
      toast.error("Could not start scanner");
      console.error("Error starting scanner:", err);
      setScanning(false);
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-medium">Scan Tile QR Code</h3>
        <p className="text-sm text-gray-500">
          Position the QR code within the frame
        </p>
      </div>
      
      <div id="reader" className="w-full max-w-sm mx-auto mb-4 aspect-square"></div>
      
      <div className="flex justify-between">
        {!scanning ? (
          <Button onClick={startScanner} className="bg-primary text-white">
            Start Scanner
          </Button>
        ) : (
          <Button disabled className="bg-primary text-white opacity-50">
            Scanning...
          </Button>
        )}
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
