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

	/* public removeAllListeners(): EventEmitter {
		Object.keys(this.events).forEach(name => this.events[name].splice(0))
		return this
	} */

	public emit(name: string, cancellable: boolean = false, ...args: any[]): boolean {
		let listeners = this.events[name]
		if (listeners === undefined)
			return true

		return !listeners.some(listener => {
			try {
				return listener.apply(this, args) === false && cancellable
			} catch (e) {
				console.log(e.stack || new Error(e).stack)
				return false
			}
		})
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
})()

Events.on("EntityCreated", (ent, id) => {
	AllEntities.push(ent)
	EntitiesIDs[id] = ent

	if (ent instanceof C_DOTA_BaseNPC) {
		if ((ent.m_pEntity.m_flags & (1 << 2)) !== 0)
			NPCs.push(ent)
		else
			Events.emit("NPCCreated", false, ent)
	}
})

Events.on("EntityDestroyed", (ent, id) => {
	AllEntities.splice(AllEntities.indexOf(ent), 1)
	delete EntitiesIDs[id]

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

Events.on("TeamVisibilityChanged", (npc, newTagged) => {
	npc.m_iTaggedAsVisibleByTeam = newTagged
})

//
/* Events.on("NetworkFieldChanged", (obj, name) => {
	if (obj === GameRules && name === "m_fGameTime")
		Events.emit("Tick", false)
	else if (obj instanceof C_DOTA_BaseNPC && name === "m_iszUnitName" && !NPCs.includes(obj) && obj.m_iszUnitName !== undefined) {
		Events.emit("NPCCreated", false, obj)
		NPCs.push(obj)
	}
}) */
