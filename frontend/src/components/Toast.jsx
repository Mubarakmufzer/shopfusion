import React, { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle, XCircle, Info } from 'lucide-react'

const ToastContext = createContext(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) return { showToast: () => {} }
  return ctx
}

let globalShowToast = null

export function setGlobalToast(fn) { globalShowToast = fn }
export function showGlobalToast(msg, type) { if (globalShowToast) globalShowToast(msg, type) }

export default function Toast() {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  React.useEffect(() => { setGlobalToast(showToast) }, [showToast])

  const icons = { success: <CheckCircle size={18} color="#9d6aea" />, error: <XCircle size={18} color="#f43f5e" />, info: <Info size={18} color="#06b6d4" /> }

  return (
    <ToastContext.Provider value={{ showToast }}>
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            {icons[t.type] || icons.success}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
