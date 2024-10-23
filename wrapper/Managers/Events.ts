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

	public listenerStatsMode = false
	public listenerStatsDuration = 1000
	public listenerMaxLines = 1
	public listenerSortByMax = false
	public listenerNameFilter = ""
	public listenerStr: string[][] = []
	public listenerStrTime = 0
	public listenerStats = new Map<string, ListenerStats>()
	protected lastTime = 0

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
		const eventStartTime = hrtime()
		// eslint-disable-next-line prettier/prettier
		if (this.listenerStatsMode &&
			this.listenerStrTime < eventStartTime
		) {
			this.listenerStrTime = eventStartTime + this.listenerStatsDuration

			this.listenerStr = [["| Total", " | Max", " | Avg", " | Count |", " Name"]]

			this.listenerStats.forEach((v, k) => {
				if (v.callsCount === 0) {
					this.listenerStats.delete(k)
				}
			})
			const stats = this.listenerStats.entries().toArray()

			let best: [string, ListenerStats] = ["", new ListenerStats()]
			let biggestDiff = 0

			stats.forEach(v => {
				const diff = !this.listenerSortByMax
					? v[1].maxRuntime - best[1].maxRuntime
					: v[1].totalRuntime - best[1].totalRuntime
				if (biggestDiff < diff) {
					biggestDiff = diff
					best = v
				}
			})

			stats
				.toSorted((s1, s2) =>
					this.listenerSortByMax
						? s2[1].maxRuntime - s1[1].maxRuntime
						: s2[1].totalRuntime - s1[1].totalRuntime
				)
				.slice(0, this.listenerMaxLines)
				.concat([best])
				.forEach(v => {
					const s = v[1]
					const formatFlt = (n: number, l = 4) =>
						n.toFixed(l - 1).substring(0, l)
					this.listenerStr.push([
						//"|",
						formatFlt((s.totalRuntime / this.listenerStatsDuration) * 100) +
						"%",
						formatFlt(s.maxRuntime),
						formatFlt(s.totalRuntime / s.callsCount),
						s.callsCount.toFixed() + "  |",
						" " + v[0]
					])

					s.callsCount = s.maxRuntime = s.totalRuntime = 0
				})
		}
	}

	protected listenersSet = new Set<string>()
	public on(name: string, listener: Listener, priority = 0): EventEmitter {
		const n = new Error().stack?.split("\n")[2] ?? ""
		this.listener2line.set(listener, n)

		const sn = name + n
		console.log(sn)
		if (this.listenersSet.has(sn)) {
			console.log(new Error().stack)
		}
		this.listenersSet.add(sn)

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

		const eventStartTime = (this.lastTime = hrtime())
		const statsIndividual =
			this.listenerStatsMode &&
			(this.listenerNameFilter.length === 0 ||
				name.startsWith(this.listenerNameFilter))

		const allListeners = [this.events.get(name), this.eventsAfter.get(name)]

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

		if (this.listenerStatsMode) {
			const totalName = "Total"
			if (this.listenerNameFilter === totalName) {
				this.lastTime = eventStartTime
				this.pushCallStats(totalName + name)
			}
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
setFireEvent((name, cancellable, ...args) => Events.emit(name, cancellable, ...args))
