/// internal declarations
/// you may use ONLY this ones & default V8 things
declare function setFireEvent(func: (event_name: string, cancellable: boolean, ...args: any) => boolean): void
declare var global: any

/// actual code
global.EventEmitter = class EventEmitter {
	private readonly events: { [event_name: string]: Listener[] } = {}

	public on(name: string, listener: Listener): EventEmitter {
		let listeners = this.events[name]
		if (listeners === undefined)
			this.events[name] = listeners = []

		listeners.push(listener)
		return this
	}

	public removeListener(name: string, listener: Listener): EventEmitter {
		let listeners = this.events[name]
		if (listeners === undefined)
			return

		const idx = listeners.indexOf(listener)
		if (idx > -1)
			listeners.splice(idx, 1)
		return this
	}

	public removeAllListeners(): EventEmitter {
		Object.keys(this.events).forEach(name => this.events[name].splice(0))
		return this
	}

	public emit(name: string, cancellable: boolean, ...args: any[]): boolean {
		let listeners = this.events[name]
		if (listeners === undefined)
			return true

		return !listeners.some(listener => listener.apply(this, args) === false && cancellable)
	}

	public once(name: string, listener: Listener): EventEmitter {
		const once_listener = (...args: any) => {
			this.removeListener(name, once_listener)
			listener(...args)
		}
		return this.on(name, once_listener)
	}
}

const events = new EventEmitter()
setFireEvent((name, cancellable, ...args) => events.emit(name, cancellable, ...args))
global.Events = events

var NPCs: C_DOTA_BaseNPC[] = []
Events.on("onEntityCreated", ent => {
	if (ent instanceof C_DOTA_BaseNPC && ent.m_iszUnitName !== undefined) {
		Events.emit("onNPCCreated", false, ent)
		NPCs.push(ent)
	}
})
Events.on("onEntityDestroyed", ent => {
	if (!(ent instanceof C_DOTA_BaseNPC))
		return
	const id = NPCs.indexOf(ent)
	if (id !== -1)
		NPCs.splice(id, 1)
})

Events.on("onNetworkFieldChanged", (obj, name) => {
	if (obj === GameRules && name === "m_fGameTime")
		Events.emit("onTick", false)
	else if (obj instanceof C_DOTA_BaseNPC && name === "m_iszUnitName" && !NPCs.includes(obj) && obj.m_iszUnitName !== undefined) {
		Events.emit("onNPCCreated", false, obj)
		NPCs.push(obj)
	}
})
