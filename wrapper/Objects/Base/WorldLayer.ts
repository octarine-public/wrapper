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
})

EventsSDK.on("PostDataUpdate", () => {
	for (const worldLayer of WorldLayers) {
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
	}
})
EventsSDK.on("EntityDestroyed", ent => {
	if (ent instanceof WorldLayer) {
		if (ent.WorldLayerVisible === visibleLayers.has(ent.LayerName)) {
			return
		}
		visibleLayers.delete(ent.LayerName)
		EventsSDK.emit("WorldLayerVisibilityChanged", false, ent.LayerName, false)
	}
})
