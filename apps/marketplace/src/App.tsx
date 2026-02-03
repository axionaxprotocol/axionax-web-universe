import { useMemo, useState } from 'react'
import { EscrowPanel } from './components/EscrowPanel'
import { MockBadge } from './components/MockBadge'

const mockASRWorkers = [
  {
    id: 'asr-001',
    name: 'axionax-asr-worker-1',
    specs: 'Whisper Large V3, 32 vCPU, 128 GB RAM',
    pricePerHour: 0.10,
    description: 'ASR worker for automatic speech recognition, selected by Auto-Selection Router (ASR) with Top K fairness.',
  },
  {
    id: 'asr-002',
    name: 'axionax-asr-worker-2',
    specs: 'Conformer-1, 16 vCPU, 64 GB RAM',
    pricePerHour: 0.08,
    description: 'ASR worker for real-time transcription, selected by ASR system.',
  },
]

export function App() {
  const [selected, setSelected] = useState<string | null>(null)
  const totalCost = useMemo(() => {
    if (!selected) return 0
    const worker = mockASRWorkers.find((w) => w.id === selected)
    return worker ? worker.pricePerHour : 0
  }, [selected])

  return (
    <div className="mx-auto max-w-5xl p-8">
      <header className="mb-10 text-center">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-2">
          <h1 className="text-4xl font-bold">axionax ASR Marketplace</h1>
          <MockBadge show label="Workers & Escrow" />
        </div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Rent ASR (Automatic Speech Recognition) workers selected by Auto-Selection Router (ASR) for ML/AI tasks using AXX tokens.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {mockASRWorkers.map((worker) => (
          <button
            key={worker.id}
            onClick={() => setSelected(worker.id)}
            className={`rounded border p-6 text-left shadow transition ${
              selected === worker.id ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200'
            }`}
          >
            <h2 className="text-2xl font-semibold">{worker.name}</h2>
            <p className="mt-2 text-sm text-gray-500">{worker.specs}</p>
            <p className="mt-2 text-xs text-gray-400">{worker.description}</p>
            <p className="mt-4 text-xl font-medium">{worker.pricePerHour.toFixed(2)} AXX/hour</p>
          </button>
        ))}
      </section>

      <footer className="mt-10 rounded border border-gray-200 p-6 text-center shadow bg-white dark:bg-slate-900">
        {selected ? (
          <div className="space-y-8">
            <div>
              <p className="text-lg">Selected ASR worker: {selected}</p>
              <p className="mt-2 text-2xl font-semibold">Total cost: {totalCost.toFixed(2)} AXX/hour</p>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="text-xl font-bold mb-4">Escrow Management</h3>
              <EscrowPanel 
                jobId={`job-${selected}-${Date.now().toString().slice(-4)}`} 
                className="w-full max-w-lg"
              />
            </div>
          </div>
        ) : (
          <p>Select an ASR worker to see pricing and continue.</p>
        )}
      </footer>
    </div>
  )
}

export default App
