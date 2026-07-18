import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Cpu, AlertTriangle, RefreshCw, Layers } from "lucide-react";

interface NFCScannerProps {
  registeredSerials: string[];
}

export default function NFCScanner({ registeredSerials }: NFCScannerProps) {
  const [scanning, setScanning] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSerial, setSelectedSerial] = useState<string>(registeredSerials[0] || "CT-VACH-8801");

  const startScan = async () => {
    setScanning(true);
    setResult(null);
    setError(null);

    // Simulate scanning delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const response = await fetch(`/api/nfc/verify/${selectedSerial}`);
      const data = await response.json();
      if (response.ok && data.verified) {
        setResult(data);
      } else {
        setError(data.message || "Cryptographic microchip integrity check failed.");
      }
    } catch (err) {
      console.error("NFC read error", err);
      setError("Unable to connect to the global blockchain verification registry.");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="bg-white border border-espresso/5 p-6 md:p-8 rounded-sm shadow-xs space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] tracking-widest text-gold-burnished uppercase font-semibold">Microchip Verification</span>
          <h3 className="text-2xl font-serif text-espresso mt-1">NFC Authenticity Shield</h3>
          <p className="text-xs text-espresso/60 font-light mt-1">
            Every genuine Calvino Torvani item houses an uncopiable NFC microchip inside the lining. Scan to verify.
          </p>
        </div>
        <div className="p-2.5 bg-gold-burnished/10 rounded-sm">
          <ShieldCheck className="w-6 h-6 text-gold-burnished" />
        </div>
      </div>

      <div className="border border-espresso/5 rounded-sm p-5 bg-alabaster space-y-4">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-espresso/50 mb-1.5">Select Simulated Item Lining Chip</label>
          <select
            value={selectedSerial}
            onChange={(e) => setSelectedSerial(e.target.value)}
            className="w-full bg-white border border-espresso/10 rounded-sm py-2.5 px-3 text-xs tracking-wider focus:outline-none focus:border-gold-burnished"
          >
            <option value="CT-VACH-8801">Briefcase Lining Chip (Authentic Vachetta)</option>
            <option value="CT-CALF-9912">Tote Lining Chip (Authentic French Calf)</option>
            <option value="CT-BRID-4422">Saddle Crossbody Lining Chip (Authentic Bridle)</option>
            <option value="CT-SAFF-1052">Slim Fold Chip (Authentic Saffiano)</option>
            <option value="CT-BRID-3081">Sovereign Belt Lining Chip (Authentic Bridle)</option>
            <option value="CT-OSTR-003">Limited Ostrich Cardholder Chip (Authentic Exotic)</option>
            <option value="COUNTERFEIT-TAG">Counterfeit Replica Chip (Fails verification)</option>
          </select>
        </div>

        <div className="flex justify-center py-6 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {scanning ? (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center space-y-4"
              >
                {/* Simulated Radar Sweep */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-gold-burnished/20 animate-ping-slow" />
                  <div className="absolute w-16 h-16 rounded-full border border-gold-burnished/30 animate-pulse" />
                  <div className="absolute w-10 h-10 rounded-full bg-gold-burnished/10 flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-gold-burnished animate-spin-slow" />
                  </div>
                </div>
                <span className="text-[10px] tracking-widest uppercase text-gold-burnished animate-pulse">Reading Microchip Secure Elements...</span>
              </motion.div>
            ) : !result && !error ? (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-4"
              >
                <p className="text-xs text-espresso/40 italic">Ready to engage hardware scan</p>
                <button
                  onClick={startScan}
                  className="mt-4 px-6 py-3 bg-espresso text-alabaster text-xs uppercase tracking-widest hover:bg-gold-burnished transition-all rounded-sm flex items-center gap-2 mx-auto"
                >
                  <Cpu className="w-3.5 h-3.5" /> Initialize Cryptographic Scan
                </button>
              </motion.div>
            ) : null}

            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full bg-white border border-green-500/10 p-5 rounded-sm space-y-3 shadow-inner"
              >
                <div className="flex items-center gap-2.5 text-emerald-700 font-medium text-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 animate-bounce" />
                  <span className="tracking-widest uppercase font-semibold">PROVENANCE SECURED & REGISTERED Genuine</span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 text-xs border-t border-espresso/5">
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-espresso/40">Model Registered</span>
                    <span className="font-serif text-sm font-semibold text-espresso">{result.product?.name}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-espresso/40">Chip Serial Number</span>
                    <span className="font-mono text-xs">{result.certificate?.serialNumber}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-espresso/40">Master Craftsman</span>
                    <span className="font-light text-espresso">{result.certificate?.craftsman}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-espresso/40">Saddle-Stitch Date</span>
                    <span className="font-light text-espresso">{result.certificate?.stitchDate}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-espresso/40">Leather Traceability</span>
                    <span className="font-light text-espresso">{result.certificate?.origin}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-espresso/40">Certified Tannery</span>
                    <span className="font-light text-espresso">{result.certificate?.tannery}</span>
                  </div>
                </div>

                <div className="bg-emerald-50 text-[10px] text-emerald-800 p-2.5 rounded-xs font-mono break-all mt-4 border border-emerald-100">
                  {result.certificate?.hash}
                </div>

                <button
                  onClick={startScan}
                  className="w-full mt-4 py-2 bg-alabaster hover:bg-alabaster-dark border border-espresso/10 text-[10px] uppercase tracking-widest text-espresso transition-all rounded-sm flex items-center justify-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Rescan New Hardware
                </button>
              </motion.div>
            )}

            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full bg-red-50 border border-red-500/10 p-5 rounded-sm space-y-3 text-center"
              >
                <div className="flex flex-col items-center space-y-2">
                  <AlertTriangle className="w-8 h-8 text-red-600 animate-pulse" />
                  <span className="text-xs tracking-widest uppercase text-red-800 font-bold">VERIFICATION EXPIRED OR FAILS CRYPTOGRAPHY</span>
                  <p className="text-xs text-red-700/80 font-light leading-relaxed max-w-sm">
                    {error} We detect a counterfeit signature or an unauthorized imitation chip. Please contact Calvino Torvani Security.
                  </p>
                </div>

                <button
                  onClick={startScan}
                  className="w-full mt-4 py-2 bg-white hover:bg-red-100/50 border border-red-200 text-[10px] uppercase tracking-widest text-red-700 transition-all rounded-sm flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3 h-3" /> Retry Registry Query
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
