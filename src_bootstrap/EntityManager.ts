export let entities: C_BaseEntity[]
let entity_ids: C_BaseEntity[]

export function GetEntityID(ent: C_BaseEntity) {
    return entity_ids.indexOf(ent)
}

export function GetEntityByID(id: number) {
    return entity_ids[id]
}

Events.on("onEntityCreated", (ent, id) => {
    entities.push(ent)
    entity_ids[id] = ent
})

Events.on("onEntityDestroyed", (ent, id) => {
    entities.splice(entities.indexOf(ent), 1)
    entity_ids.splice(id, 1)
})
