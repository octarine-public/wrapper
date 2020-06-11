import { EMatchGroupServerStatus } from "../Enums/EMatchGroupServerStatus"

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
		let listeners = this.events.get(name)
		if (listeners === undefined)
			return this

		const idx = listeners.indexOf(listener)
		if (idx > -1)
			listeners.splice(idx, 1)
		return this
	}

	public emit(name: string, cancellable: boolean = false, ...args: any[]): boolean {
		let listeners = this.events.get(name),
			listeners_after = this.events_after.get(name)

		let ret = listeners === undefined || !listeners.some(listener => {
			try {
				return listener(...args) === false && cancellable
			} catch (e) {
				console.log(e.stack || new Error(e).stack)
				return false
			}
		})
		if (listeners_after !== undefined && ret)
			listeners_after.forEach(listener => {
				try {
					listener(...args)
				} catch (e) {
					console.log(e.stack || new Error(e).stack)
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

interface CMsgMatchmakingMatchGroupInfo {
	players_searching: number
	auto_region_select_ping_penalty: number
	auto_region_select_ping_penalty_custom: number
	status: EMatchGroupServerStatus
}

interface CMsgDOTAMatchmakingStatsResponse {
	legacy_searching_players_by_group_source2: number[]
	match_groups: CMsgMatchmakingMatchGroupInfo[]
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
	on(name: "CustomGameEvent", listener: (event_name: string, obj: any) => void): EventEmitter
	on(name: "InputCaptured", listener: (is_captured: boolean) => void): EventEmitter
	on(name: "SharedObjectChanged", listener: (id: number, reason: number, obj: any) => void): EventEmitter
	on(name: "SignonStateChanged", listener: (new_state: SignonState_t) => void): EventEmitter
	on(name: "AddSearchPath", listener: (path: string) => boolean): EventEmitter
	on(name: "PostAddSearchPath", listener: (path: string) => void): EventEmitter
	on(name: "RemoveSearchPath", listener: (path: string) => boolean): EventEmitter
	on(name: "PostRemoveSearchPath", listener: (path: string) => void): EventEmitter
	on(name: "ServerMessage", listener: (msg_id: number, buf: ArrayBuffer) => void): EventEmitter
	on(name: "GCPingResponse", listener: () => boolean): EventEmitter
	on(name: "MatchmakingStatsUpdated", listener: (data: CMsgDOTAMatchmakingStatsResponse) => void): EventEmitter
}

const Events: Events = new EventEmitter()
export default Events
setFireEvent((name, cancellable, ...args) => Events.emit(name, cancellable, ...args))
