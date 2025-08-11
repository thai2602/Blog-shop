import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast UI */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`px-4 py-2 rounded shadow text-white ${
              t.type === "success" ? "bg-green-500" :
              t.type === "error" ? "bg-red-500" : "bg-gray-700"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
