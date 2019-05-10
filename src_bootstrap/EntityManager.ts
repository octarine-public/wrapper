/// internal declarations
/// you may use ONLY this ones & default V8 things
declare var global: any

/// actual code
global.Entities = new class Entities {
	entities: C_BaseEntity[] = []
	entity_ids: C_BaseEntity[] = []
	
	GetEntityID(ent: C_BaseEntity) {
		return this.entity_ids.indexOf(ent)
	}
	
	GetEntityByID(id: number) {
		return this.entity_ids[id]
	}
}

Events.on("onEntityCreated", (ent, id) => {
	Entities.entities.push(ent)
	Entities.entity_ids[id] = ent
})

Events.on("onEntityDestroyed", (ent, id) => {
	Entities.entities.splice(Entities.entities.indexOf(ent), 1)
	Entities.entity_ids.splice(id, 1)
})
