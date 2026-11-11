'use client'

import { useEffect, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Check, Copy, Dices, ListTodo, NotebookPen, Palette, Play, RotateCcw, Timer, Trash2 } from 'lucide-react'
import type { AppItem } from '@/lib/apps'
import { readStorage, storageKeys, writeStorage } from '@/lib/storage'

type Todo = { id: string; text: string; done: boolean }

function makePalette() { return Array.from({ length: 5 }, () => `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`) }

export function AppToolView({ app }: { app: AppItem }) {
  const [note, setNote] = useState('')
  const [storageReady, setStorageReady] = useState(false)
  const [todos, setTodos] = useState<Todo[]>([])
  const [todoDraft, setTodoDraft] = useState('')
  const [calcDisplay, setCalcDisplay] = useState('0')
  const [calcPrevious, setCalcPrevious] = useState<number | null>(null)
  const [calcOperator, setCalcOperator] = useState<string | null>(null)
  const [calcFresh, setCalcFresh] = useState(false)
  const [seconds, setSeconds] = useState(60)
  const [remaining, setRemaining] = useState(60)
  const [timerRunning, setTimerRunning] = useState(false)
  const [palette, setPalette] = useState<string[]>(['#8B5CF6', '#5B8CFF', '#67D1C0', '#F2B86B', '#E88FB3'])
  const [copied, setCopied] = useState('')
  const [toolNotice, setToolNotice] = useState('')
  const [unitValue, setUnitValue] = useState('1')
  const [unitMode, setUnitMode] = useState<'cm-in' | 'c-f'>('cm-in')
  const [randomNumber, setRandomNumber] = useState<number | null>(null)

  useEffect(() => { setNote(readStorage(storageKeys.notes, '')); setTodos(readStorage(storageKeys.todos, [])); setStorageReady(true) }, [])
  useEffect(() => { if (storageReady) writeStorage(storageKeys.notes, note) }, [note, storageReady])
  useEffect(() => { if (storageReady) writeStorage(storageKeys.todos, todos) }, [todos, storageReady])
  useEffect(() => {
    if (!timerRunning) return
    const timer = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [timerRunning])
  useEffect(() => {
    if (timerRunning && remaining === 0) { setTimerRunning(false); setToolNotice('Timer complete') }
  }, [remaining, timerRunning])
  useEffect(() => { if (!toolNotice) return; const timeout = window.setTimeout(() => setToolNotice(''), 2200); return () => window.clearTimeout(timeout) }, [toolNotice])

  const addTodo = (event: FormEvent) => { event.preventDefault(); const text = todoDraft.trim(); if (!text) return; setTodos((current) => [{ id: crypto.randomUUID(), text, done: false }, ...current]); setTodoDraft('') }
  const todoKey = (event: KeyboardEvent<HTMLInputElement>) => { if (event.key === 'Enter' && (event.nativeEvent.isComposing || event.keyCode === 229)) event.preventDefault() }
  const calculate = (key: string) => {
    if (/^\d$/.test(key)) { setCalcDisplay((current) => calcFresh || current === '0' ? key : `${current}${key}`); setCalcFresh(false); return }
    if (key === 'C') { setCalcDisplay('0'); setCalcPrevious(null); setCalcOperator(null); setCalcFresh(false); return }
    if (key === '⌫') { setCalcDisplay((current) => current.length > 1 ? current.slice(0, -1) : '0'); return }
    if (key === '=') {
      if (calcPrevious === null || !calcOperator) return
      const right = Number(calcDisplay)
      const result = calcOperator === '+' ? calcPrevious + right : calcOperator === '−' ? calcPrevious - right : calcOperator === '×' ? calcPrevious * right : right === 0 ? NaN : calcPrevious / right
      setCalcDisplay(Number.isFinite(result) ? String(Number(result.toFixed(8))) : 'Error'); setCalcPrevious(null); setCalcOperator(null); setCalcFresh(true); return
    }
    setCalcPrevious(Number(calcDisplay)); setCalcOperator(key); setCalcFresh(true)
  }
  const toggleTodo = (id: string) => setTodos((current) => current.map((todo) => todo.id === id ? { ...todo, done: !todo.done } : todo))
  const unitResult = Number(unitValue) * (unitMode === 'cm-in' ? 0.393701 : 9 / 5) + (unitMode === 'c-f' ? 32 : 0)
  const title = app.name
  const card = 'rounded-2xl border border-white/[.08] bg-[#10121b] p-4 sm:p-6'

  return <section aria-labelledby="tool-title" className="mx-auto max-w-3xl"><div className="mb-6 flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl border border-violet-200/10 bg-violet-400/10 text-violet-100"><span className="text-lg">{app.icon === 'NotebookPen' ? '✎' : app.icon === 'Calculator' ? '÷' : app.icon === 'Timer' ? '◷' : app.icon === 'ListTodo' ? '✓' : app.icon === 'Palette' ? '◉' : '✦'}</span></span><div><p className="text-[9px] uppercase tracking-[.2em] text-violet-200/70">LUMEN mini app</p><h1 id="tool-title" className="text-2xl font-semibold">{title}</h1></div></div>
    {app.slug === 'notes' && <div className={card}><label htmlFor="lumen-notes" className="text-xs font-medium">Your notes</label><textarea id="lumen-notes" value={note} onChange={(event) => setNote(event.target.value)} maxLength={12000} placeholder="Write something worth remembering..." className="mt-3 min-h-64 w-full resize-y rounded-xl border border-white/[.08] bg-black/20 p-4 text-sm leading-6 outline-none placeholder:text-white/30 focus:border-violet-300/40"/><p className="mt-2 text-[10px] text-white/40">Saved on this device · {note.length}/12,000 characters</p></div>}
    {app.slug === 'calculator' && <div className={`${card} mx-auto max-w-sm`}><output aria-live="polite" className="mb-4 flex h-20 items-end justify-end overflow-hidden rounded-xl bg-black/25 px-4 py-3 font-mono text-3xl text-white">{calcDisplay}</output><div className="grid grid-cols-4 gap-2">{['C','⌫','÷','×','7','8','9','−','4','5','6','+','1','2','3','=','0','.'].map((key) => <button key={key} onClick={() => key === '.' ? setCalcDisplay((value) => value.includes('.') ? value : `${value}.`) : calculate(key)} className={`min-h-12 rounded-xl border border-white/[.07] text-sm transition hover:bg-white/[.08] ${['+','−','×','÷','='].includes(key) ? 'bg-violet-400/10 text-violet-100' : 'bg-white/[.025] text-white/80'} ${key === '0' ? 'col-span-2' : ''}`}>{key}</button>)}</div></div>}
    {app.slug === 'timer' && <div className={`${card} mx-auto max-w-md text-center`}><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-cyan-300/10 text-cyan-200"><Timer className="size-5"/></span><p className="mt-5 font-mono text-6xl font-light tabular-nums">{String(Math.floor(remaining / 60)).padStart(2, '0')}:{String(remaining % 60).padStart(2, '0')}</p><label className="mt-5 inline-flex items-center gap-2 text-xs text-white/55">Minutes <input type="number" min={1} max={180} value={seconds / 60} disabled={timerRunning} onChange={(event) => { const next = Math.max(1, Math.min(180, Number(event.target.value) || 1)) * 60; setSeconds(next); setRemaining(next) }} className="w-20 rounded-lg border border-white/10 bg-black/20 px-2 py-2 text-center text-white"/></label><div className="mt-5 flex justify-center gap-2"><button onClick={() => setTimerRunning((value) => !value)} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-violet-400 px-4 text-xs font-semibold text-[#11121a]">{timerRunning ? 'Pause' : <><Play className="size-3.5 fill-current"/>Start</>}</button><button onClick={() => { setTimerRunning(false); setRemaining(seconds) }} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/15 px-4 text-xs text-white/70"><RotateCcw className="size-3.5"/>Reset</button></div></div>}
    {app.slug === 'todo' && <div className={card}><form onSubmit={addTodo} className="flex gap-2"><input value={todoDraft} onChange={(event) => setTodoDraft(event.target.value)} onKeyDown={todoKey} maxLength={160} placeholder="Add a task..." aria-label="New to-do item" className="min-h-11 min-w-0 flex-1 rounded-xl border border-white/10 bg-black/20 px-3 text-sm outline-none focus:border-violet-300/40"/><button className="min-h-11 rounded-xl bg-violet-400 px-4 text-xs font-semibold text-[#11121a]">Add task</button></form><div className="mt-4 space-y-2">{todos.length ? todos.map((todo) => <div key={todo.id} className="flex items-center gap-3 rounded-xl border border-white/[.06] bg-white/[.02] p-3"><input type="checkbox" checked={todo.done} onChange={() => toggleTodo(todo.id)} aria-label={`Mark ${todo.text} ${todo.done ? 'incomplete' : 'complete'}`} className="accent-violet-400"/><span className={`flex-1 text-xs ${todo.done ? 'text-white/35 line-through' : 'text-white/75'}`}>{todo.text}</span><button onClick={() => setTodos((current) => current.filter((item) => item.id !== todo.id))} aria-label={`Delete ${todo.text}`} className="grid size-8 place-items-center rounded-lg text-white/35 hover:bg-white/[.07] hover:text-white"><Trash2 className="size-3.5"/></button></div>) : <div className="py-9 text-center"><ListTodo className="mx-auto size-6 text-white/30"/><p className="mt-3 text-xs text-white/50">Your list is clear.</p></div>}</div></div>}
    {app.slug === 'palette' && <div className={card}><div className="flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-white/50">Generate colors, then copy any hex value.</p><button onClick={() => { setPalette(makePalette()); setCopied('') }} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-white/15 px-3 text-xs text-white/75 hover:bg-white/[.06]"><Palette className="size-3.5"/>New palette</button></div><div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">{palette.map((color) => <button key={color} onClick={() => { void navigator.clipboard?.writeText(color); setCopied(color) }} className="overflow-hidden rounded-xl border border-white/10 text-left"><span className="block h-24" style={{ backgroundColor: color }}/><span className="flex items-center justify-between px-2 py-2 font-mono text-[10px] text-white/75">{color}{copied === color ? <Check className="size-3 text-emerald-300"/> : <Copy className="size-3 text-white/35"/>}</span></button>)}</div></div>}
    {app.slug === 'converter' && <div className={card}><p className="text-xs text-white/55">Convert common measurements.</p><div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_1fr]"><input type="number" value={unitValue} onChange={(event) => setUnitValue(event.target.value)} aria-label="Value to convert" className="min-h-11 rounded-lg border border-white/10 bg-black/20 px-3 text-sm"/><select aria-label="Conversion" value={unitMode} onChange={(event) => setUnitMode(event.target.value as 'cm-in' | 'c-f')} className="min-h-11 rounded-lg border border-white/10 bg-[#171925] px-3 text-xs"><option value="cm-in">cm to inches</option><option value="c-f">°C to °F</option></select><output className="flex min-h-11 items-center rounded-lg border border-white/10 bg-black/20 px-3 font-mono text-sm">{Number.isFinite(unitResult) ? unitResult.toFixed(2) : '—'} {unitMode === 'cm-in' ? 'in' : '°F'}</output></div></div>}
    {app.slug === 'randomizer' && <div className={`${card} text-center`}><Dices className="mx-auto size-7 text-pink-200"/><p className="mt-4 text-xs text-white/50">Pick a number from 1 to 100.</p><p className="mt-2 font-mono text-5xl">{randomNumber ?? '—'}</p><button onClick={() => setRandomNumber(Math.floor(Math.random() * 100) + 1)} className="mt-5 min-h-10 rounded-lg bg-violet-400 px-4 text-xs font-semibold text-[#11121a]">Generate</button></div>}
    {!['notes','calculator','timer','todo','palette','converter','randomizer'].includes(app.slug) && <div className={`${card} text-center`}><p className="text-sm font-medium">This mini app is on the roadmap.</p><p className="mt-2 text-xs text-white/50">LUMEN is prioritizing a few useful tools that work well before adding more.</p></div>}
    {toolNotice && <p role="status" className="mt-3 text-center text-xs text-violet-200">{toolNotice}</p>}
  </section>
}
