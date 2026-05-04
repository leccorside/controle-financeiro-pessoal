import { useState } from 'react'

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Controle Financeiro
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Gerencie suas finanças de forma simples, visual e inteligente.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity">
            Começar Agora
          </button>
          <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md font-medium hover:bg-secondary/80 transition-colors border border-border">
            Saiba Mais
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
