import { ERankType } from "../Enums/ERankType"
import { MenuLanguageID } from "../Enums/MenuLanguageID"
import { SOType } from "../Enums/SOType"
import { GameState } from "../Utils/GameState"

type Listener = (...args: any) => false | any
export class EventEmitter {
	protected readonly events = new Map<string, [Listener, number][]>()
	protected readonly eventsAfter = new Map<string, [Listener, number][]>()
	protected readonly listener2line = new WeakMap<Listener, string>()

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
		const listeners = this.events.get(name),
			listenersAfter = this.eventsAfter.get(name)

		if (listeners !== undefined) {
			for (let index = 0; index < listeners.length; index++) {
				const startTime = hrtime()
				const [listener] = listeners[index]
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
				const runTime = hrtime() - startTime
				if (runTime > 3) {
					SendListenerPerf(
						this.listener2line.get(listener)!,
						runTime,
						GameState.RawGameTime
					)
				}
			}
		}
		if (listenersAfter !== undefined) {
			for (let index = 0; index < listenersAfter.length; index++) {
				const startTime = hrtime()
				const [listener] = listenersAfter[index]
				try {
					listener(...args)
				} catch (e: any) {
					console.error(
						e instanceof Error ? e : new Error(e),
						this.listener2line.get(listener)
					)
				}
				const runTime = hrtime() - startTime
				if (runTime > 3) {
					SendListenerPerf(
						this.listener2line.get(listener)!,
						runTime,
						GameState.RawGameTime
					)
				}
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
