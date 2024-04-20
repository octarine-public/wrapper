import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { EntityManager } from "../../Managers/EntityManager"
import { Events } from "../../Managers/Events"
import { EventsSDK } from "../../Managers/EventsSDK"
import { Entity } from "./Entity"

@WrapperClass("CInfoWorldLayer")
export class WorldLayer extends Entity {
	@NetworkedBasicField("m_worldName")
	public WorldName = ""
	@NetworkedBasicField("m_layerName")
	public LayerName = ""
	@NetworkedBasicField("m_bWorldLayerVisible")
	public WorldLayerVisible = false
	@NetworkedBasicField("m_bEntitiesSpawned")
	public EntitiesSpawned = false
}
export const WorldLayers = EntityManager.GetEntitiesByClass(WorldLayer)

const visibleLayers = new Set<string>()
Events.on("NewConnection", () => {
	if (visibleLayers.delete("world_layer_base")) {
		EventsSDK.emit("WorldLayerVisibilityChanged", false, "world_layer_base", false)
	}
})
EventsSDK.after("MapDataLoaded", () => {
	visibleLayers.add("world_layer_base")
	EventsSDK.emit("WorldLayerVisibilityChanged", false, "world_layer_base", true)
	EventsSDK.emit("WorldLayersVisibilityChanged", false)
})

EventsSDK.on("PostDataUpdate", () => {
	let changed = false
	for (let index = WorldLayers.length - 1; index > -1; index--) {
		const worldLayer = WorldLayers[index]
		if (worldLayer.WorldLayerVisible === visibleLayers.has(worldLayer.LayerName)) {
			continue
		}
		if (worldLayer.WorldLayerVisible) {
			visibleLayers.add(worldLayer.LayerName)
		} else {
			visibleLayers.delete(worldLayer.LayerName)
		}
		EventsSDK.emit(
			"WorldLayerVisibilityChanged",
			false,
			worldLayer.LayerName,
			worldLayer.WorldLayerVisible
		)
		changed = true
	}
	if (changed) {
		EventsSDK.emit("WorldLayersVisibilityChanged", false)
	}
})
EventsSDK.on("EntityDestroyed", ent => {
	if (ent instanceof WorldLayer) {
		if (!visibleLayers.has(ent.LayerName)) {
			return
		}
		visibleLayers.delete(ent.LayerName)
		EventsSDK.emit("WorldLayerVisibilityChanged", false, ent.LayerName, false)
	}
})
