import { SOType } from "../Enums/SOType"
import { BinaryKV } from "../Utils/VBKV"

type Listener = (...args: any) => false | any
export class EventEmitter {
	protected readonly events = new Map<string, Listener[]>()
	protected readonly events_after = new Map<string, Listener[]>()
	protected readonly listener2line = new Map<Listener, string>()

	public on(name: string, listener: Listener): EventEmitter {
		this.listener2line.set(listener, new Error().stack?.split("\n")[2] ?? "")
		let listeners = this.events.get(name)
		if (listeners === undefined)
			this.events.set(name, listeners = [])

		listeners.push(listener)
		return this
	}
	public after(name: string, listener: Listener): EventEmitter {
		this.listener2line.set(listener, new Error().stack?.split("\n")[2] ?? "")
		let listeners = this.events_after.get(name)
		if (listeners === undefined)
			this.events_after.set(name, listeners = [])

		listeners.push(listener)
		return this
	}

	public removeListener(name: string, listener: Listener): EventEmitter {
		const listeners = this.events.get(name)
		if (listeners === undefined)
			return this

		const idx = listeners.indexOf(listener)
		if (idx !== -1) {
			listeners.splice(idx, 1)
			this.listener2line.delete(listener)
		}
		return this
	}

	public emit(name: string, cancellable = false, ...args: any[]): boolean {
		const listeners = this.events.get(name),
			listeners_after = this.events_after.get(name)

		const ret = !listeners?.some(listener => {
			try {
				return listener(...args) === false && cancellable
			} catch (e) {
				console.error(e instanceof Error ? e : new Error(e), this.listener2line.get(listener))
				return false
			}
		})
		if (listeners_after !== undefined && ret)
			listeners_after.forEach(listener => {
				try {
					listener(...args)
				} catch (e) {
					console.error(e instanceof Error ? e : new Error(e), this.listener2line.get(listener))
				}
			})
		return ret
	}

	public once(name: string, listener: Listener): EventEmitter {
		const once_listener = (...args: any) => {
			this.removeListener(name, once_listener)
			listener(...args)
		}
		return this.on(name, once_listener)
	}
}

declare interface Events extends EventEmitter {
	on(name: "UIStateChanged", callback: (new_state: number) => void): EventEmitter
	/**
	 * That's analog of https://docs.microsoft.com/en-us/previous-versions/windows/desktop/legacy/ms633573(v%3Dvs.85 (w/o hwnd)
	 * message_type: https://www.autoitscript.com/autoit3/docs/appendix/WinMsgCodes.htm
	 */
	on(name: "WndProc", callback: (message_type: number, wParam: bigint, lParam: bigint) => false | any): EventEmitter
	on(name: "Update", callback: () => void): EventEmitter
	on(name: "Draw", callback: () => void): EventEmitter
	on(name: "PrepareUnitOrders", callback: () => false | any): EventEmitter
	on(name: "GameEvent", listener: (event_name: string, obj: any) => void): EventEmitter
	on(name: "CustomGameEvent", listener: (event_name: string, data: Map<string, BinaryKV>) => void): EventEmitter
	on(name: "InputCaptured", listener: (is_captured: boolean) => void): EventEmitter
	on(name: "SharedObjectChanged", listener: (id: number, reason: SOType, msg: ArrayBuffer) => void): EventEmitter
	on(name: "NewConnection", listener: () => void): EventEmitter
	on(name: "AddSearchPath", listener: (path: string) => boolean): EventEmitter
	on(name: "PostAddSearchPath", listener: (path: string) => void): EventEmitter
	on(name: "RemoveSearchPath", listener: (path: string) => boolean): EventEmitter
	on(name: "PostRemoveSearchPath", listener: (path: string) => void): EventEmitter
	on(name: "ServerMessage", listener: (msg_id: number, buf_len: number) => void): EventEmitter
	on(name: "GCPingResponse", listener: () => boolean): EventEmitter
	on(name: "MatchmakingStatsUpdated", listener: (msg: ArrayBuffer) => void): EventEmitter
	on(name: "ScriptsUpdated", listener: () => void): EventEmitter
}

const Events: Events = new EventEmitter()
export default Events
setFireEvent((name, cancellable, ...args) => Events.emit(name, cancellable, ...args))
