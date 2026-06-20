import { Color, EventsSDK, RendererSDK, Vector2 } from "../../../wrapper/Imports"
import { ProfilerMenu } from "./menu"

// One script's accumulated cost inside the current sampling window.
interface Stat {
	label: string
	totalMs: number
	calls: number
	maxMs: number
}

// A finished, displayable row (rates already computed for the window).
interface Row {
	label: string
	msPerSec: number
	avgMs: number
	maxMs: number
	callsPerSec: number
}

let windowMs = 1000

const acc = new Map<string, Stat>()
let display: Row[] = []
let totalMsPerSec = 0
let windowStart = hrtime()

// Read from the menu every frame so the hot path stays allocation-free.
let groupByFile = true
let sortMode = 0

// ── attribution ──────────────────────────────────────────────────────────────
// listener2line holds the stack line where `.on(...)` was called, e.g.
//   "    at new CSoundESP (.../internal/visuals/sound-esp/index.ts:14:3)"
// We turn that into a short, stable key like "internal/visuals/sound-esp".

function shorten(rawLine: Nullable<string>): { file: string; line: string } {
	if (rawLine === undefined || rawLine.length === 0) {
		return { file: "<no-stack>", line: "?" }
	}
	const norm = rawLine.replace(/\\/g, "/")
	// Grab the last "path:line[:col]" token in the frame, any extension.
	const all = [...norm.matchAll(/([^\s():]+):(\d+)(?::\d+)?/g)]
	const last = all[all.length - 1]
	if (last === undefined) {
		// No path token at all — surface the raw frame so we can see the format.
		const raw = norm.replace(/^\s*at\s+/, "").trim()
		return { file: raw.length > 0 ? raw.slice(0, 48) : "<empty>", line: "?" }
	}
	let file = last[1]
	const line = last[2]
	const cut = Math.max(
		file.lastIndexOf("internal/"),
		file.lastIndexOf("wrapper/"),
		file.lastIndexOf("prototypes/"),
		file.lastIndexOf("scripts/")
	)
	if (cut >= 0) {
		file = file.slice(cut)
	} else {
		// No known SDK root: this is a foreign script (another repo) that just
		// consumes the wrapper. Anchor on github.com/<owner>/<repo> and drop the
		// owner so each external script keeps its own identity instead of every
		// `index.ts` collapsing into a single "index" bucket.
		const gh = file.lastIndexOf("github.com/")
		if (gh >= 0) {
			const parts = file.slice(gh + "github.com/".length).split("/")
			file = parts.length > 1 ? parts.slice(1).join("/") : parts.join("/")
		} else {
			// Unknown layout — keep the last two segments for some context.
			const parts = file.split("/")
			file = parts.slice(-2).join("/")
		}
	}
	file = file.replace(/\/index\.(?:ts|js)$/, "").replace(/\.(?:ts|js)$/, "")
	return { file, line }
}

function record(event: string, rawLine: Nullable<string>, ms: number) {
	let parsed: { file: string; line: string }
	try {
		parsed = shorten(rawLine)
	} catch {
		parsed = { file: "<parse-error>", line: "?" }
	}
	const key = groupByFile ? parsed.file : `${parsed.file}:${parsed.line}|${event}`
	const label = groupByFile ? parsed.file : `${parsed.file} (${event})`

	let stat = acc.get(key)
	if (stat === undefined) {
		stat = { label, totalMs: 0, calls: 0, maxMs: 0 }
		acc.set(key, stat)
	}
	stat.totalMs += ms
	stat.calls += 1
	if (ms > stat.maxMs) {
		stat.maxMs = ms
	}
}

// ── timing emit ──────────────────────────────────────────────────────────────
// Faithful copy of EventEmitter.emit, with an hrtime() bracket around every
// listener call. Installed on the EventsSDK instance only while State is on.

function timingEmit(
	this: any,
	name: string,
	cancellable = false,
	...args: any[]
): boolean {
	const listeners = this.events.get(name)
	const listenersAfter = this.eventsAfter.get(name)

	if (listeners !== undefined) {
		for (let index = 0; index < listeners.length; index++) {
			const [listener] = listeners[index]
			const start = hrtime()
			try {
				if (listener(...args) === false && cancellable) {
					record(name, this.listener2line.get(listener), hrtime() - start)
					return false
				}
			} catch (e: any) {
				console.error(
					e instanceof Error ? e : new Error(e),
					this.listener2line.get(listener)
				)
			}
			record(name, this.listener2line.get(listener), hrtime() - start)
		}
	}
	if (listenersAfter !== undefined) {
		for (let index = 0; index < listenersAfter.length; index++) {
			const [listener] = listenersAfter[index]
			const start = hrtime()
			try {
				listener(...args)
			} catch (e: any) {
				console.error(
					e instanceof Error ? e : new Error(e),
					this.listener2line.get(listener)
				)
			}
			record(name, this.listener2line.get(listener), hrtime() - start)
		}
	}
	return true
}

function flush() {
	const now = hrtime()
	const elapsed = now - windowStart
	if (elapsed < windowMs) {
		return
	}

	const rows: Row[] = []
	totalMsPerSec = 0
	acc.forEach(stat => {
		const msPerSec = (stat.totalMs * 1000) / elapsed
		totalMsPerSec += msPerSec
		rows.push({
			label: stat.label,
			msPerSec,
			avgMs: stat.calls > 0 ? stat.totalMs / stat.calls : 0,
			maxMs: stat.maxMs,
			callsPerSec: (stat.calls * 1000) / elapsed
		})
	})
	rows.sort((a, b) => {
		if (sortMode === 1) {
			return b.avgMs - a.avgMs
		}
		if (sortMode === 2) {
			return b.maxMs - a.maxMs
		}
		if (sortMode === 3) {
			return b.callsPerSec - a.callsPerSec
		}
		return b.msPerSec - a.msPerSec
	})

	display = rows
	acc.clear()
	windowStart = now
}

new (class CScriptProfiler {
	private readonly menu = new ProfilerMenu()
	private readonly emitter = EventsSDK as any
	private patched = false

	constructor() {
		// Huge priority -> our listener runs last -> overlay draws on top.
		// Draw2D is throttled (~30fps) and its commands are cached, so the
		// overlay re-renders far less often than a per-frame Draw listener.
		EventsSDK.on("Draw2D", this.Draw2D.bind(this), 1e9)
		this.menu.State.OnValue(call => this.setEnabled(call.value))
		this.menu.Reset.OnValue(() => {
			acc.clear()
			display = []
			totalMsPerSec = 0
			windowStart = hrtime()
		})
	}

	protected Draw2D() {
		groupByFile = this.menu.GroupByFile.value
		sortMode = this.menu.SortBy.SelectedID
		windowMs = this.menu.Window.value * 1000
		if (!this.menu.State.value) {
			return
		}
		flush()
		this.Render()
	}

	private setEnabled(state: boolean) {
		if (state && !this.patched) {
			this.patched = true
			this.emitter.emit = timingEmit
			windowStart = hrtime()
		} else if (!state && this.patched) {
			this.patched = false
			delete this.emitter.emit // fall back to EventEmitter.prototype.emit
			acc.clear()
			display = []
		}
	}

	private Render() {
		if (display.length === 0) {
			return
		}
		const font = RendererSDK.DefaultFontName
		const size = 14
		const lineH = size + 6
		const pad = 8
		const width = 440
		const colW = 56
		const rows = Math.min(this.menu.MaxRows.value, display.length)
		const height = pad * 2 + lineH * (rows + 2)
		const origin = new Vector2(20, 150)

		RendererSDK.FilledRect(
			origin,
			new Vector2(width, height),
			new Color(0, 0, 0, 205)
		)

		// Right edges of the three numeric columns: ms/s | avg | max.
		const x = origin.x + pad
		const colMax = origin.x + width - pad
		const colAvg = colMax - colW
		const colMs = colAvg - colW
		const labelMaxW = colMs - colW - x

		let y = origin.y + pad
		const head = this.menu.Color.SelectedColor
		RendererSDK.Text(
			`Script Profiler — ${totalMsPerSec.toFixed(2)} ms/s`,
			new Vector2(x, y),
			head,
			font,
			size
		)
		this.Right("ms/s", colMs, y, head, font, size)
		this.Right("avg", colAvg, y, head, font, size)
		this.Right("max", colMax, y, head, font, size)
		y += lineH * 2

		for (let i = 0; i < rows; i++) {
			const row = display[i]
			const color = this.Heat(row.msPerSec)
			const label = row.label.startsWith("internal/")
				? row.label.slice(9)
				: row.label
			RendererSDK.Text(
				this.Fit(label, labelMaxW, font, size),
				new Vector2(x, y),
				color,
				font,
				size
			)
			this.Right(row.msPerSec.toFixed(2), colMs, y, color, font, size)
			this.Right(row.avgMs.toFixed(2), colAvg, y, color, font, size)
			this.Right(row.maxMs.toFixed(2), colMax, y, color, font, size)
			y += lineH
		}
	}

	// Draw text so its right edge sits at rightX.
	private Right(
		text: string,
		rightX: number,
		y: number,
		color: Color,
		font: string,
		size: number
	) {
		const w = RendererSDK.GetTextSize(text, font, size).x
		RendererSDK.Text(text, new Vector2(rightX - w, y), color, font, size)
	}

	// Trim with an ellipsis until it fits maxW pixels.
	private Fit(text: string, maxW: number, font: string, size: number): string {
		if (RendererSDK.GetTextSize(text, font, size).x <= maxW) {
			return text
		}
		let t = text
		while (t.length > 1 && RendererSDK.GetTextSize(`${t}…`, font, size).x > maxW) {
			t = t.slice(0, -1)
		}
		return `${t}…`
	}

	private Heat(msPerSec: number): Color {
		if (msPerSec >= 2) {
			return new Color(255, 90, 90)
		}
		if (msPerSec >= 0.5) {
			return new Color(255, 205, 90)
		}
		return new Color(150, 230, 150)
	}
})()
