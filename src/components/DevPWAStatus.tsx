"use client";

import React, { useState } from "react";
import {
  clearAllCache,
  reloadServiceWorker,
  updatePageCache,
  unregisterServiceWorkerAndClearCache,
  disablePWACache,
  enablePWACache,
} from "../pwaActions";
import { usePWAStatus } from "../hooks/usePWAStatus";

const toastStyle: React.CSSProperties = {
  position: "fixed",
  bottom: 16,
  left: "50%",
  transform: "translateX(-50%)",
  background: "#333",
  color: "#fff",
  padding: "10px 20px",
  borderRadius: 8,
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  zIndex: 10000,
  fontSize: 15,
  pointerEvents: "none",
  opacity: 0.95,
  transition: "opacity 0.2s",
};
const devPanelStyle: React.CSSProperties = {
  position: "fixed",
  bottom: 16,
  left: 16,
  zIndex: 9999,
  display: "flex",
  alignItems: "flex-end",
};

const buttonStyle = (
  background: string,
  color?: string
): React.CSSProperties => ({
  background,
  color: color || "white",
  width: "100%",
  marginBottom: 6,
  borderRadius: 8,
  fontWeight: "bold",
  padding: "2px 5px",
});

const indicatorStyle = (online: boolean): React.CSSProperties => ({
  width: 18,
  height: 18,
  borderRadius: "50%",
  background: online ? "#4caf50" : "#f44336",
  border: "2px solid #fff",
  boxShadow: "0 0 4px rgba(0,0,0,0.2)",
  cursor: "pointer",
  transition: "background 0.2s",
});

const popupStyle: React.CSSProperties = {
  position: "relative",
  left: 28,
  bottom: 0,
  background: "#222",
  color: "#fff",
  borderRadius: 8,
  padding: 12,
  minWidth: 180,
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  fontSize: 14,
  width: 200,
};

export default function DevPWAStatus() {
  const { online, hasUpdate, update } = usePWAStatus();
  const [show, setShow] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  // --- SW management functions ---
  const _clearCache = async () => {
    await clearAllCache();
    showToast("Cache cleared");
  };

  const _reloadSW = async () => {
    await reloadServiceWorker();
    showToast("SW reloading...");
    setTimeout(() => window.location.reload(), 1000);
  };

  const _updateCache = async () => {
    updatePageCache();
    showToast("Page cache updated");
  };

  const _unregisterSW = async () => {
    await unregisterServiceWorkerAndClearCache();
    await _clearCache();
    showToast("SW removed and cache cleared. Reload the page.");
  };

  const _disableCache = () => {
    disablePWACache();
    showToast("PWA cache disabled (until reload or enable)");
  };

  const _enableCache = () => {
    enablePWACache();
    showToast("PWA cache enabled");
  };

  return (
    <>
      {toast && <div style={toastStyle}>{toast}</div>}
      <div
        style={devPanelStyle}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        <div
          style={indicatorStyle(online)}
          title={online ? "Online" : "Offline"}
        />
        {show && (
          <div style={popupStyle}>
            <div style={{ marginBottom: 8, fontWeight: 600 }}>
              PWA Dev Tools
            </div>
            {!online && (
              <div style={{ color: "#f44336", marginBottom: 8 }}>
                Offline mode
              </div>
            )}
            {hasUpdate && (
              <button onClick={update} style={buttonStyle("#ff9800")}>
                Update app (new SW)
              </button>
            )}
            <button onClick={_clearCache} style={buttonStyle("#818181")}>
              Clear all cache
            </button>
            <button onClick={_reloadSW} style={buttonStyle("#dfdb01", "#000")}>
              Reload SW
            </button>
            <button onClick={_updateCache} style={buttonStyle("#4caf50")}>
              Update page cache
            </button>
            <button onClick={_unregisterSW} style={buttonStyle("#f44336")}>
              Delete SW and all cache
            </button>
            <button onClick={_disableCache} style={buttonStyle("#607d8b")}>
              Disable PWA cache
            </button>
            <button onClick={_enableCache} style={buttonStyle("#2196f3")}>
              Enable PWA cache
            </button>
          </div>
        )}
      </div>
    </>
  );
}
