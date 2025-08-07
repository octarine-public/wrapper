import { Vector2 } from "../../Base/Vector2"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { EntityManager } from "../../Managers/EntityManager"
import { Events } from "../../Managers/Events"
import { EventsSDK } from "../../Managers/EventsSDK"
import { EntityDataLumps } from "../../Resources/ParseEntityLump"
import { Entity } from "./Entity"

@WrapperClass("CInfoWorldLayer")
export class WorldLayer extends Entity {
	@NetworkedBasicField("m_worldName")
	public readonly WorldName: string = ""
	@NetworkedBasicField("m_layerName")
	public readonly LayerName: string = ""
	@NetworkedBasicField("m_bWorldLayerVisible")
	public readonly WorldLayerVisible: boolean = false
	@NetworkedBasicField("m_bEntitiesSpawned")
	public readonly EntitiesSpawned: boolean = false
}

export let GetWorldBounds: Nullable<[Vector2, Vector2]>
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

function ProcessWorldBoundsData(layerName: string): boolean {
	const worldBoundsData = EntityDataLumps.get(layerName)?.find(
		data => data.get("classname") === "world_bounds"
	)
	if (worldBoundsData === undefined) {
		return false
	}
	try {
		const min = worldBoundsData.get("min"),
			max = worldBoundsData.get("max")
		GetWorldBounds =
			typeof min === "string" && typeof max === "string"
				? [Vector2.FromString(min), Vector2.FromString(max)]
				: undefined
	} catch (e) {
		console.error("Error in worldBoundsData init", e)
		return false
	}
	return true
}

EventsSDK.on("WorldLayerVisibilityChanged", (layerName, state) => {
	if (state) {
		ProcessWorldBoundsData(layerName)
		return
	}
	for (let index = WorldLayers.length - 1; index > -1; index--) {
		const worldLayer = WorldLayers[index]
		if (
			worldLayer.WorldLayerVisible &&
			ProcessWorldBoundsData(worldLayer.LayerName)
		) {
			return
		}
	}
	if (!ProcessWorldBoundsData("world_layer_base")) {
		GetWorldBounds = undefined
	}
})
