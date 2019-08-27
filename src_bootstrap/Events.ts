/// internal declarations
/// you may use ONLY this ones & default V8 things
declare function setFireEvent(func: (event_name: string, cancellable: boolean, ...args: any) => boolean): void
declare var global: any

/// actual code
global.EventEmitter = class EventEmitter {
	private readonly events: { [event_name: string]: Listener[] } = {}
	private readonly events_after: { [event_name: string]: Listener[] } = {}

	public on(name: string, listener: Listener): EventEmitter {
		let listeners = this.events[name]
		if (listeners === undefined)
			this.events[name] = listeners = []

		listeners.push(listener)
		return this
	}
	public after(name: string, listener: Listener): EventEmitter {
		let listeners = this.events_after[name]
		if (listeners === undefined)
			this.events_after[name] = listeners = []

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

	/* public removeAllListeners(): EventEmitter {
		Object.keys(this.events).forEach(name => this.events[name].splice(0))
		return this
	} */

	public emit(name: string, cancellable: boolean = false, ...args: any[]): boolean {
		let listeners = this.events[name],
			listeners_after = this.events_after[name]

		let ret = listeners === undefined || !listeners.some(listener => {
			try {
				return listener.apply(this, args) === false && cancellable
			} catch (e) {
				console.log(e.stack || new Error(e).stack)
				return false
			}
		})
		if (listeners_after !== undefined)
			listeners_after.forEach(listener => {
				try {
					listener.apply(this, args)
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

global.Events = new EventEmitter()

setFireEvent((name, cancellable, ...args) => Events.emit(name, cancellable, ...args))

// temp onTick
setInterval(() => {
	try {
		if (IsInGame())
			Events.emit("Tick", false)
	} catch (e) {
		throw e
	}
}, Math.max(GetLatency(Flow_t.IN) * 1000, 1000 / 30))

let NPCs: C_DOTA_BaseNPC[] = []
global.Entities = new (class EntityManager {
	public readonly AllEntities: C_BaseEntity[] = []
	public readonly EntitiesIDs: C_BaseEntity[] = []

	public GetEntityID(ent: C_BaseEntity) {
		return this.EntitiesIDs.indexOf(ent)
	}
	public GetEntityByID(id: number) {
		return this.EntitiesIDs[id]
	}
})()

Events.on("EntityCreated", (ent, id) => {
	Entities.AllEntities.push(ent)
	Entities.EntitiesIDs[id] = ent

	if (ent instanceof C_DOTA_BaseNPC) {
		if ((ent.m_pEntity.m_flags & (1 << 2)) !== 0)
			NPCs.push(ent)
		else
			Events.emit("NPCCreated", false, ent)
	}
})

Events.on("EntityDestroyed", (ent, id) => {
	Entities.AllEntities.splice(Entities.AllEntities.indexOf(ent), 1)
	delete Entities.EntitiesIDs[id]

	if (ent instanceof C_DOTA_BaseNPC) {
		const NPCs_id = NPCs.indexOf(ent)
		if (NPCs_id !== -1)
			NPCs.splice(NPCs_id, 1)
	}
})

Events.on("Tick", () => {
	for (let i = 0, end = NPCs.length; i < end; i++) {
		let npc = NPCs[i]
		if ((npc.m_pEntity.m_flags & (1 << 2)) === 0) {
			Events.emit("NPCCreated", false, npc)
			NPCs.splice(i--, 1)
			end--
		}
	}
})

Events.on("TeamVisibilityChanged", (npc, newTagged) => npc.m_iTaggedAsVisibleByTeam = newTagged)

/* Events.on("NetworkFieldChanged", (obj, name) => {
	if (obj === GameRules && name === "m_fGameTime")
		Events.emit("Tick", false)
	else if (obj instanceof C_DOTA_BaseNPC && name === "m_iszUnitName" && !NPCs.includes(obj) && obj.m_iszUnitName !== undefined) {
		Events.emit("NPCCreated", false, obj)
		NPCs.push(obj)
	}
}) */
