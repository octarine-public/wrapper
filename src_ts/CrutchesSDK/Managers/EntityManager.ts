/*import Entity from "../Extensions/Entity";

var entitiesCache: Entity[] = [];

Events.on("onEntityCreated", (ent, id) => {
	console.log(ent.m_iID);
	console.log(id);

	console.log(ent, " | ", Object.getOwnPropertyNames(ent));

	entitiesCache[ent.m_iID] = new Entity(ent as C_BaseEntity);

	console.log(JSON.stringify(ent, null, "\t"));
})

Events.on("onEntityDestroyed", ent => {
	console.log(ent);

	const id = entitiesCache.indexOf(new Entity(ent));
	if (id !== -1)
		entitiesCache.splice(id, 1)
})*/
