"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  // Estado para forçar a re-renderização no cliente após a montagem,
  // garantindo que 'theme' não seja undefined inicialmente.
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const toggleTheme = () => {
    if (theme === 'system') {
      setTheme('light')
    } else if (theme === 'light') {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }

  if (!mounted) {
    // Retorna um placeholder ou null para evitar hydration mismatch, 
    // já que o tema real só é conhecido no cliente.
    // Um botão desabilitado com tamanho similar pode ser uma boa opção.
    return <Button variant="ghost" size="icon" disabled className="focus:outline-none focus:ring-0 h-[1.2rem] w-[1.2rem]">&nbsp;</Button>;
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme} 
      className="focus:outline-none focus:ring-0"
      aria-label={`Mudar para tema ${theme === 'system' ? 'claro' : theme === 'light' ? 'escuro' : 'padrão do sistema'}`}
    >
      <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Mudar tema</span>
    </Button>
  )
} 