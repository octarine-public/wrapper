import { ERankType } from "../Enums/ERankType"
import { MenuLanguageID } from "../Enums/MenuLanguageID"
import { SOType } from "../Enums/SOType"

type Listener = (...args: any) => false | any

class ListenerStats {
	public callsCount = 0
	public totalRuntime = 0
	public maxRuntime = 0
}

export class EventEmitter {
	protected readonly events = new Map<string, [Listener, number][]>()
	protected readonly eventsAfter = new Map<string, [Listener, number][]>()
	protected readonly listener2line = new WeakMap<Listener, string>()

	public StatsRecording = false
	public StatsDuration = 1000
	public StatsTotal = false
	public listenerMaxLines = 1
	public listenerSortByMax = false
	public StatsFilterName = ""
	public StatsFilterThreshholdMax = 0
	public StatsFilterThreshholdTotal = 0

	public listenerStats = new Map<string, ListenerStats>()
	protected lastTime = 0
	public listenerStrTime = 0
	public listenerStr: string[][] = []
	public listenerStrWidth: number[][] = []
	public listenerStrTimeStart = 0
	public listenerStrFrameStart = 0
	public listenerStrFrameNow = 0

	public restartProfile() {
		this.listenerStrTime = 0
		this.listenerStr.clear()
		this.listenerStrWidth.clear()
	}
	protected pushCallStats(name: string) {
		if (!this.listenerStats.has(name)) {
			this.listenerStats.set(name, new ListenerStats())
		}
		const lastTime = this.lastTime
		this.lastTime = hrtime()
		const runtime = this.lastTime - lastTime

		const s = this.listenerStats.get(name)!
		s.callsCount++
		s.totalRuntime += runtime
		if (s.maxRuntime < runtime) {
			s.maxRuntime = runtime
		}
	}
	protected updateStats() {
		if (this.StatsRecording) {
			if (this.listenerStrTime === 0 || this.listenerStrTime < hrtime()) {
				const time = hrtime()
				this.listenerStrTime = time + this.StatsDuration
				this.listenerStrWidth.clear()
				this.listenerStr.clear()
				this.listenerStr.push([
					"Total".padStart(6, "_"),
					"Max".padStart(5, "_"),
					"Avg".padStart(5, "_"),
					"Per S".padStart(6, "_"),
					"Event".padStart(24, "_"),
					"Source".padStart(8, "_")
				])

				const stats = this.listenerStats.entries().toArray()
				const filtered: [string, ListenerStats][] = []

				const recordFrames = this.listenerStrFrameStart - this.listenerStrFrameNow
				const recordDuration = this.listenerStrTimeStart
					? time - this.listenerStrTimeStart
					: this.StatsDuration

				const thresh = new ListenerStats()
				thresh.maxRuntime = this.StatsFilterThreshholdMax
				thresh.totalRuntime =
					(this.StatsFilterThreshholdTotal / 100) * recordDuration

				const sortBy = (s1: ListenerStats, s2: ListenerStats, byMax: boolean) =>
					byMax === this.listenerSortByMax
						? s2.maxRuntime - s1.maxRuntime
						: s2.totalRuntime - s1.totalRuntime

				filtered.push(
					...stats
						.filter(v => 0 < sortBy(thresh, v[1], true))
						.sort((s1, s2) => sortBy(s1[1], s2[1], true))
						.slice(0, this.listenerMaxLines)
				)
				filtered.push(
					...stats
						.filter(v => 0 < sortBy(thresh, v[1], false))
						.filter(v => !filtered.contains([v]))
						.sort((s1, s2) => -sortBy(s1[1], s2[1], false))
						.slice(-this.listenerMaxLines)
				)

				filtered.forEach(v => {
					const s = v[1]
					if (s.callsCount) {
						const perFrame = recordFrames && recordFrames % s.callsCount === 0
						const split = v[0].indexOf("_")

						this.listenerStr.push([
							((s.totalRuntime / recordDuration) * 100).toFixed() + "%",
							s.maxRuntime.toFixed(1),
							(s.totalRuntime / s.callsCount).toFixed(1),
							(
								s.callsCount /
								(perFrame ? recordFrames : recordDuration / 1000)
							).toFixed(),
							v[0].slice(0, split),
							v[0].slice(split + 1)
						])
					}
				})
				if (this.listenerStr.length > 1) {
					console.log("time: ", hrtime())
					console.log([...this.listenerStr.slice(1)])
				}
				this.listenerStrFrameStart = this.listenerStrFrameNow
				this.listenerStrTimeStart = hrtime()
				this.listenerStats.clear()
			}
		}
	}
	public on(name: string, listener: Listener, priority = 0): EventEmitter {
		this.listener2line.set(listener, new Error().stack?.split("\n")[2] ?? "")

		const listeners = this.events.get(name) ?? []
		listeners.push([listener, priority])
		this.events.set(
			name,
			listeners.sort((a, b) => a[1] - b[1])
		)

		return this
	}
	public after(name: string, listener: Listener, priority = 0): EventEmitter {
		this.listener2line.set(listener, new Error().stack?.split("\n")[2] ?? "")

		const listeners = this.eventsAfter.get(name) ?? []
		listeners.push([listener, priority])
		this.eventsAfter.set(
			name,
			listeners.sort((a, b) => a[1] - b[1])
		)

		return this
	}

	public removeListener(name: string, listener: Listener): EventEmitter {
		const listeners = this.events.get(name)
		if (listeners === undefined) {
			return this
		}
		if (listeners.removeCallback(val => val[0] === listener)) {
			this.listener2line.delete(listener)
		}
		return this
	}

	public emit(name: string, cancellable = false, ...args: any[]): boolean {
		this.updateStats()
		const allListeners = [this.events.get(name), this.eventsAfter.get(name)]
		let statsIndividual = false

		if (this.StatsRecording) {
			if (!this.StatsFilterName || name.startsWith(this.StatsFilterName)) {
				statsIndividual = true
				name += "_"
			}
			this.lastTime = hrtime()
		}

		const eventStartTime = this.lastTime

		for (let listenerIdx = 0; listenerIdx < 2; listenerIdx++) {
			const listeners = allListeners[listenerIdx]
			if (listeners !== undefined) {
				for (let index = 0; index < listeners.length; index++) {
					const listener = listeners[index][0]

					try {
						if (listener(...args) === false && cancellable) {
							return false
						}
					} catch (e: any) {
						console.error(
							e instanceof Error ? e : new Error(e),
							this.listener2line.get(listener)
						)
					}
					if (statsIndividual) {
						this.pushCallStats(name + this.listener2line.get(listener))
					}
				}
			}
		}

		if (this.StatsRecording && this.StatsTotal) {
			this.lastTime = eventStartTime
			this.pushCallStats(name + "_Total")
		}

		return true
	}

	public once(name: string, listener: Listener, priority = 0): EventEmitter {
		const onceListener = (...args: any) => {
			this.removeListener(name, onceListener)
			listener(...args)
		}
		return this.on(name, onceListener, priority)
	}
}

declare interface Events extends EventEmitter {
	on(
		name: "UIStateChanged",
		callback: (new_state: number) => void,
		priority?: number
	): Events
	/**
	 * That's analog of https://docs.microsoft.com/en-us/previous-versions/windows/desktop/legacy/ms633573(v%3Dvs.85 (w/o hwnd)
	 * message_type: https://www.autoitscript.com/autoit3/docs/appendix/WinMsgCodes.htm
	 */
	on(
		name: "WndProc",
		callback: (
			message_type: number,
			wParam: bigint,
			lParam: bigint,
			x?: number,
			y?: number
		) => false | any,
		priority?: number
	): Events
	on(name: "RequestUserCmd", callback: () => void, priority?: number): Events
	on(
		name: "Draw",
		callback: (
			visual_data: ArrayBuffer,
			w: number,
			h: number,
			x?: number,
			y?: number
		) => void,
		priority?: number
	): Events
	on(name: "PrepareUnitOrders", callback: () => false | any, priority?: number): Events
	on(
		name: "DebuggerPrepareUnitOrders",
		callback: (is_user_input: boolean, was_cancelled: boolean) => void,
		priority?: number
	): Events
	on(
		name: "GameEvent",
		listener: (event_name: string, obj: any) => void,
		priority?: number
	): Events
	on(
		name: "CustomGameEvent",
		listener: (event_name: string, data: RecursiveMap) => void,
		priority?: number
	): Events
	on(
		name: "InputCaptured",
		listener: (is_captured: boolean) => void,
		priority?: number
	): Events
	on(
		name: "SharedObjectChanged",
		listener: (typeID: SOType, reason: number, msg: ArrayBuffer) => void,
		priority?: number
	): Events
	on(name: "NewConnection", listener: () => void, priority?: number): Events
	on(
		name: "ServerMessage",
		listener: (msgID: number, buf: ArrayBuffer) => void,
		priority?: number
	): Events
	on(name: "GCPingResponse", listener: () => boolean, priority?: number): Events
	on(
		name: "MatchmakingStatsUpdated",
		listener: (msg: ArrayBuffer) => void,
		priority?: number
	): Events
	on(name: "ScriptsUpdated", listener: () => void, priority?: number): Events
	on(
		name: "SetLanguage",
		func: (language: MenuLanguageID) => void,
		priority?: number
	): Events
	on(
		name: "RankData",
		func: (
			rankType: ERankType,
			rankValue: number,
			rankData1: number,
			rankData2: number,
			rankData3: number,
			rankData4: number
		) => void,
		priority?: number
	): Events
}

export const Events: Events = new EventEmitter()
setFireEvent(Events.emit.bind(Events))
