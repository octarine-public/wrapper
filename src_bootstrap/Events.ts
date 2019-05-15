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

global.Events = new EventEmitter()

setFireEvent((name, cancellable, ...args) => Events.emit(name, cancellable, ...args));

// temp onTick
(function onTick() {
	setTimeout(Math.max(1000 / 30, GetLatency(Flow_t.IN)), () => {
		if (IsInGame() && LocalDOTAPlayer !== undefined)
			try {
				Events.emit("onTick", false)
			} catch(e) {
				onTick()
				throw e
			}
		
		onTick()
	})
})();

let AllEntities: C_BaseEntity[] = [],
	EntitiesIDs: C_BaseEntity[] = [],
	NPCs: C_DOTA_BaseNPC[] = []
global.Entities = new (class Entities {
	get AllEntities() {
		return AllEntities
	}
	get EntitiesIDs() {
		return EntitiesIDs
	}
	GetEntityID(ent: C_BaseEntity) {
		return EntitiesIDs.indexOf(ent)
	}
	GetEntityByID(id: number) {
		return EntitiesIDs[id]
	}
	GetEntitiesInRange(vec: Vector3, range: number): C_BaseEntity[] {
		return AllEntities.filter(ent => ent.m_vecNetworkOrigin.Distance(vec) <= range)
	}
})()

Events.on("onEntityCreated", (ent, id) => {
	AllEntities.push(ent)
	EntitiesIDs[id] = ent

	if (ent instanceof C_DOTA_BaseNPC) {
		if (ent.m_iszUnitName === undefined)
			NPCs.push(ent)
		else
			Events.emit("onNPCCreated", false, ent)
	}
})

Events.on("onEntityDestroyed", (ent, id) => {
	AllEntities.splice(AllEntities.indexOf(ent), 1)
	delete EntitiesIDs[id]

	if (ent instanceof C_DOTA_BaseNPC) {
		const NPCs_id = NPCs.indexOf(ent)
		if (NPCs_id !== -1)
			NPCs.splice(NPCs_id, 1)
	}
})

Events.on("onTick", () => {
	for (let i = 0, end = NPCs.length; i < end; i++) {
		let npc = NPCs[i]
		if (npc.m_iszUnitName !== undefined) {
			Events.emit("onNPCCreated", false, npc)
			NPCs.splice(i--, 1)
			end--
		}
	}
})

//
/* Events.on("onNetworkFieldChanged", (obj, name) => {
	if (obj === GameRules && name === "m_fGameTime")
		Events.emit("onTick", false)
	else if (obj instanceof C_DOTA_BaseNPC && name === "m_iszUnitName" && !NPCs.includes(obj) && obj.m_iszUnitName !== undefined) {
		Events.emit("onNPCCreated", false, obj)
		NPCs.push(obj)
	}
}) */
