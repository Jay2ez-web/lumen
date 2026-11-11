'use client'

import { useEffect, useState } from 'react'
import type { Game } from '@/lib/games'

const shapes = [
  [[0, 0], [1, 0], [0, 1], [1, 1]],
  [[0, 0], [0, 1], [0, 2], [1, 2]],
  [[0, 0], [1, 0], [2, 0], [1, 1]],
  [[0, 0], [1, 0], [2, 0]],
]
const colors = ['bg-fuchsia-400', 'bg-cyan-300', 'bg-violet-400', 'bg-amber-300']
type Cell = number | null

export function PlayableGame({ game }: { game: Game }) {
  if (game.slug === 'neon-drift') return <NeonDrift />
  if (game.slug === 'cosmic-blocks') return <CosmicBlocks />
  if (game.slug === 'pixel-outpost') return <PixelOutpost />
  return <div className="relative z-10 max-w-md px-8 text-center"><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-white/[.06] text-2xl text-violet-300">{game.symbol}</span><h2 className="mt-4 text-lg font-semibold">Game coming soon</h2><p className="mt-2 text-sm leading-6 text-white/50">{game.title} is part of the Arcadia lineup. Its original browser game is still in development.</p></div>
}

function NeonDrift() {
  const [lane, setLane] = useState(1)
  const [hazard, setHazard] = useState(0)
  const [score, setScore] = useState(0)
  const [running, setRunning] = useState(false)
  const [crashed, setCrashed] = useState(false)
  const move = (direction: number) => setLane((current) => Math.max(0, Math.min(2, current + direction)))

  useEffect(() => {
    if (!running) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') { event.preventDefault(); move(-1) }
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') { event.preventDefault(); move(1) }
    }
    window.addEventListener('keydown', onKeyDown)
    const timer = window.setInterval(() => {
      const nextHazard = Math.floor(Math.random() * 3)
      if (nextHazard === lane) {
        setRunning(false)
        setCrashed(true)
      } else {
        setHazard(nextHazard)
        setScore((value) => value + 10)
      }
    }, 760)
    return () => { window.removeEventListener('keydown', onKeyDown); window.clearInterval(timer) }
  }, [running, lane])

  const start = () => { setLane(1); setHazard(-1); setScore(0); setCrashed(false); setRunning(true) }
  return <div className="relative z-10 flex w-full max-w-2xl flex-col items-center px-5 py-5 sm:px-8">
    <div className="mb-3 flex w-full items-center justify-between text-xs"><span className="font-semibold uppercase tracking-[.2em] text-fuchsia-200">Midnight circuit</span><span className="font-mono text-white/65">DISTANCE <b className="ml-2 text-white">{score} m</b></span></div>
    <div className="relative h-[min(48vh,380px)] w-full overflow-hidden rounded-2xl border border-fuchsia-300/20 bg-[#090916]">
      <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'linear-gradient(rgba(180,125,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(180,125,255,.12) 1px,transparent 1px)', backgroundSize: '48px 48px', transform: 'perspective(280px) rotateX(22deg) scale(1.4)' }} />
      <div className="absolute inset-x-[16%] bottom-0 top-0 flex justify-between border-x border-fuchsia-300/15">{[1, 2].map((item) => <span key={item} className="h-full border-l border-dashed border-white/15" />)}</div>
      {hazard >= 0 && <div className="absolute top-[36%] grid size-12 place-items-center rounded-xl border border-rose-200/50 bg-rose-400/80 shadow-[0_0_28px_#fb7185] transition-[left] duration-300" style={{ left: `calc(${27.3 + hazard * 22.7}% - 24px)` }} aria-label="Traffic obstacle"><span className="text-lg">!</span></div>}
      <div className="absolute bottom-8 grid size-11 place-items-center rounded-xl border border-cyan-100 bg-cyan-300 text-xl text-[#101528] shadow-[0_0_30px_#22d3ee] transition-[left] duration-150" style={{ left: `calc(${27.3 + lane * 22.7}% - 22px)` }} aria-label="Your hover car">◆</div>
      {!running && <div className="absolute inset-0 grid place-items-center bg-[#090916]/65 backdrop-blur-[2px]"><div className="text-center"><p className="text-sm font-semibold">{crashed ? `Crash! You drifted ${score} meters.` : 'Ready when you are.'}</p><button onClick={start} className="mt-4 rounded-xl bg-white px-5 py-3 text-xs font-bold text-[#11121a] transition hover:bg-fuchsia-100">{crashed ? 'Race again' : 'Start your engine'}</button></div></div>}
    </div>
    <div className="mt-4 flex w-full items-center justify-between"><p className="text-[11px] text-white/45">Dodge the traffic · Use ← → or A / D</p><div className="flex gap-2"><button onClick={() => move(-1)} aria-label="Steer left" className="grid size-10 place-items-center rounded-xl border border-white/15 text-lg hover:bg-white/10">←</button><button onClick={() => move(1)} aria-label="Steer right" className="grid size-10 place-items-center rounded-xl border border-white/15 text-lg hover:bg-white/10">→</button></div></div>
  </div>
}

function CosmicBlocks() {
  const [board, setBoard] = useState<Cell[]>(Array(64).fill(null))
  const [rack, setRack] = useState([0, 1, 2])
  const [selected, setSelected] = useState(0)
  const [score, setScore] = useState(0)
  const [message, setMessage] = useState('Choose a shape, then place it on the grid.')
  const place = (index: number) => {
    const shapeIndex = rack[selected]
    if (shapeIndex === undefined) return
    const shape = shapes[shapeIndex]
    const x = index % 8
    const y = Math.floor(index / 8)
    if (shape.some(([dx, dy]) => x + dx > 7 || y + dy > 7 || board[(y + dy) * 8 + x + dx] !== null)) {
      setMessage('That shape will not fit there. Try another spot.')
      return
    }
    const next = [...board]
    shape.forEach(([dx, dy]) => { next[(y + dy) * 8 + x + dx] = shapeIndex })
    const fullRows = Array.from({ length: 8 }, (_, row) => row).filter((row) => next.slice(row * 8, row * 8 + 8).every((cell) => cell !== null))
    const fullColumns = Array.from({ length: 8 }, (_, column) => column).filter((column) => next.every((_, row) => next[row * 8 + column] !== null))
    fullRows.forEach((row) => { for (let column = 0; column < 8; column++) next[row * 8 + column] = null })
    fullColumns.forEach((column) => { for (let row = 0; row < 8; row++) next[row * 8 + column] = null })
    setBoard(next)
    setScore((value) => value + shape.length * 10 + (fullRows.length + fullColumns.length) * 100)
    const nextRack = [...rack]
    nextRack[selected] = -1
    if (nextRack.every((item) => item === -1)) { setRack(Array.from({ length: 3 }, () => Math.floor(Math.random() * shapes.length))); setSelected(0) }
    else { setRack(nextRack); setSelected(nextRack.findIndex((item) => item !== -1)) }
    setMessage(fullRows.length || fullColumns.length ? 'Line cleared. Nice placement!' : 'Shape placed. Keep building your combo.')
  }
  const reset = () => { setBoard(Array(64).fill(null)); setRack([0, 1, 2]); setSelected(0); setScore(0); setMessage('Choose a shape, then place it on the grid.') }
  return <div className="relative z-10 flex w-full max-w-2xl flex-col items-center px-5 py-5 sm:px-8">
    <div className="mb-3 flex w-full items-center justify-between text-xs"><span className="font-semibold uppercase tracking-[.2em] text-violet-200">Cosmic grid</span><span className="font-mono text-white/65">SCORE <b className="ml-2 text-white">{score}</b></span></div>
    <div className="grid w-full max-w-[min(72vw,380px)] grid-cols-8 gap-1 rounded-2xl border border-violet-300/20 bg-[#0b0d19] p-2 sm:gap-1.5 sm:p-3" aria-label="Cosmic Blocks game board">{board.map((cell, index) => <button key={index} onClick={() => place(index)} aria-label={`Place shape at row ${Math.floor(index / 8) + 1}, column ${index % 8 + 1}`} className={`aspect-square rounded-[4px] border border-white/[.035] transition-colors hover:border-violet-200/50 hover:bg-violet-200/10 ${cell === null ? 'bg-white/[.035]' : `${colors[cell]} shadow-[0_0_12px_rgba(139,92,246,.22)]`}`} />)}</div>
    <p aria-live="polite" className="mt-3 min-h-4 text-center text-[11px] text-white/50">{message}</p>
    <div className="mt-3 flex w-full items-center justify-between gap-3"><div className="flex gap-2">{rack.map((shapeIndex, slot) => <button key={slot} disabled={shapeIndex < 0} onClick={() => setSelected(slot)} aria-label={`Select shape ${slot + 1}`} aria-pressed={selected === slot} className={`grid h-14 w-16 place-items-center rounded-xl border transition ${selected === slot ? 'border-violet-300/60 bg-violet-400/10' : 'border-white/10 bg-white/[.025]'} disabled:opacity-20`}><span className="grid grid-cols-3 gap-0.5">{Array.from({ length: 9 }, (_, i) => { const x = i % 3; const y = Math.floor(i / 3); const part = shapes[shapeIndex]?.some(([sx, sy]) => sx === x && sy === y); return <span key={i} className={`size-2.5 rounded-[2px] ${part ? colors[shapeIndex] : 'bg-transparent'}`} /> })}</span></button>)}</div><button onClick={reset} className="rounded-lg border border-white/15 px-3 py-2 text-[11px] text-white/65 hover:bg-white/10">New game</button></div>
  </div>
}

function PixelOutpost() {
  const [energy, setEnergy] = useState(12)
  const [crystals, setCrystals] = useState(0)
  const [explored, setExplored] = useState<number[]>([])
  const [message, setMessage] = useState('Tap a glowing tile to explore the outpost.')
  const gather = (index: number) => {
    if (explored.includes(index) || energy === 0) return
    const found = Math.random() > 0.34
    setExplored((current) => [...current, index])
    setEnergy((current) => current - 1)
    if (found) { setCrystals((current) => current + 1); setMessage('Crystal found. The camp lights up a little brighter.') }
    else setMessage('Just stardust here. Try another part of the frontier.')
  }
  const recharge = () => { if (crystals < 3) { setMessage('Gather 3 crystals before you can recharge the rover.'); return }; setCrystals((value) => value - 3); setEnergy(12); setExplored([]); setMessage('Rover recharged. A new sector is ready to explore.') }
  const reset = () => { setEnergy(12); setCrystals(0); setExplored([]); setMessage('Tap a glowing tile to explore the outpost.') }
  return <div className="relative z-10 flex w-full max-w-2xl flex-col items-center px-5 py-5 sm:px-8">
    <div className="mb-3 flex w-full items-center justify-between text-xs"><span className="font-semibold uppercase tracking-[.2em] text-lime-200">Frontier sector 07</span><span className="font-mono text-white/65">CRYSTALS <b className="ml-2 text-white">{crystals}</b></span></div>
    <div className="grid w-full max-w-[min(72vw,380px)] grid-cols-5 gap-2 rounded-2xl border border-lime-200/15 bg-[#0c1515] p-3 sm:gap-3 sm:p-4" aria-label="Pixel Outpost exploration map">{Array.from({ length: 25 }, (_, index) => <button key={index} onClick={() => gather(index)} disabled={explored.includes(index) || energy === 0} aria-label={`Explore sector tile ${index + 1}`} className={`aspect-square rounded-lg border text-lg transition hover:scale-105 disabled:cursor-default ${explored.includes(index) ? 'border-white/[.03] bg-white/[.025] text-white/15' : 'border-lime-200/20 bg-lime-300/[.08] text-lime-200 shadow-[inset_0_0_16px_rgba(190,242,100,.04)] hover:bg-lime-300/20'}`}>{explored.includes(index) ? '·' : '✦'}</button>)}</div>
    <p aria-live="polite" className="mt-3 min-h-4 text-center text-[11px] text-white/50">{energy ? message : 'The rover is out of energy. Collect 3 crystals to recharge.'}</p>
    <div className="mt-3 flex w-full items-center justify-between gap-3"><div className="flex items-center gap-2"><span className="text-[10px] uppercase tracking-widest text-white/45">Rover energy</span><div className="flex gap-1">{Array.from({ length: 12 }, (_, index) => <span key={index} className={`h-2 w-3 rounded-sm ${index < energy ? 'bg-lime-300' : 'bg-white/10'}`} />)}</div></div><div className="flex gap-2"><button onClick={recharge} className="rounded-lg border border-lime-200/25 px-3 py-2 text-[11px] text-lime-100 hover:bg-lime-300/10">Recharge · 3</button><button onClick={reset} className="rounded-lg border border-white/15 px-3 py-2 text-[11px] text-white/65 hover:bg-white/10">Reset</button></div></div>
  </div>
}
