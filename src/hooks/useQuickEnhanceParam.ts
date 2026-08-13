import { useState, useEffect } from "react"

export function useQuickEnhanceParam() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("action") === "enhance") {
      setIsOpen(true)
    }
  }, [])

  function onClose() {
    setIsOpen(false)
    const url = new URL(window.location.href)
    url.searchParams.delete("action")
    window.history.replaceState({}, "", url.toString())
  }

  return { isOpen, onClose }
}
