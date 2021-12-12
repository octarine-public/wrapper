import Color from "../../Base/Color"
import QAngle from "../../Base/QAngle"
import Vector3 from "../../Base/Vector3"
import { WrapperClass } from "../../Decorators"
import { MapArea } from "../../Enums/MapArea"
import { RenderMode_t } from "../../Enums/RenderMode_t"
import { Team } from "../../Enums/Team"
import EntityManager, { CreateEntityInternal, DeleteEntity } from "../../Managers/EntityManager"
import EventsSDK from "../../Managers/EventsSDK"
import { GetPositionHeight } from "../../Native/WASM"
import { EntityDataLump } from "../../Resources/ParseEntityLump"
import Entity from "./Entity"
import LaneCreepSpawner from "./LaneCreepSpawner"

@WrapperClass("CreepPathCorner")
export default class CreepPathCorner extends Entity {
	public Spawner: Nullable<LaneCreepSpawner>
	public Referencing = new Set<CreepPathCorner>()
	public Target: Nullable<CreepPathCorner>

	public get IsAlive() {
		return true
	}
	public set CustomGlowColor(_: Nullable<Color>) {
		// N/A for non-networked entities
	}
	public set CustomDrawColor(_: Nullable<[Color, RenderMode_t]>) {
		// N/A for non-networked entities
	}
}
export const CreepPathCorners = EntityManager.GetEntitiesByClass(CreepPathCorner)

let cur_local_id = 0x4000
async function LoadCreepSpawnersAndPathCorners(): Promise<void> {
	while (cur_local_id > 0x4000) {
		const id = --cur_local_id
		const ent = EntityManager.EntityByIndex(id, true)
		if (ent instanceof CreepPathCorner || ent instanceof LaneCreepSpawner)
			await DeleteEntity(id)
	}
	const ent2target = new Map<CreepPathCorner, string>(),
		ent2name = new Map<CreepPathCorner, string>()
	for (const data of EntityDataLump) {
		if (data.get("classname") !== "path_corner")
			continue
		const origin_str = data.get("origin"),
			angles_str = data.get("angles"),
			target = data.get("target"),
			targetname = data.get("targetname")
		if (
			typeof origin_str !== "string"
			|| typeof angles_str !== "string"
			|| typeof targetname !== "string"
		)
			continue
		let id = cur_local_id++
		while (EntityManager.EntityByIndex(id, true) !== undefined)
			id = cur_local_id++
		const entity = new CreepPathCorner(id, 0)
		await entity.AsyncCreate()
		if (typeof target === "string")
			ent2target.set(entity, target)
		ent2name.set(entity, targetname)
		entity.Name_ = "path_corner"
		entity.Team = Team.Neutral
		CreateEntityInternal(entity)
		await EventsSDK.emit("PreEntityCreated", false, entity)
		const pos = Vector3.FromString(origin_str),
			ang = QAngle.FromString(angles_str)
		pos.SetZ(GetPositionHeight(pos))
		entity.VisualPosition.CopyFrom(pos)
		entity.NetworkedPosition.CopyFrom(pos)
		entity.VisualAngles.CopyFrom(ang)
		entity.NetworkedAngles.CopyFrom(ang)
	}
	for (const [ent, name] of ent2name)
		for (const [prev, target] of ent2target)
			if (ent !== prev && name === target) {
				prev.Target = ent
				ent.Referencing.add(prev)
			}
	for (const data of EntityDataLump) {
		let team: Nullable<Team>,
			lane: Nullable<MapArea>
		switch (data.get("classname")) {
			case "npc_dota_spawner_good_bot":
				team = Team.Radiant
				lane = MapArea.Bottom
				break
			case "npc_dota_spawner_good_mid":
				team = Team.Radiant
				lane = MapArea.Middle
				break
			case "npc_dota_spawner_good_top":
				team = Team.Radiant
				lane = MapArea.Top
				break
			case "npc_dota_spawner_bad_bot":
				team = Team.Dire
				lane = MapArea.Bottom
				break
			case "npc_dota_spawner_bad_mid":
				team = Team.Dire
				lane = MapArea.Middle
				break
			case "npc_dota_spawner_bad_top":
				team = Team.Dire
				lane = MapArea.Top
				break
			default:
				continue
		}
		const origin_str = data.get("origin"),
			angles_str = data.get("angles"),
			npcfirstwaypoint = data.get("npcfirstwaypoint")
		if (
			typeof origin_str !== "string"
			|| typeof angles_str !== "string"
			|| typeof npcfirstwaypoint !== "string"
		)
			continue
		let id = cur_local_id++
		while (EntityManager.EntityByIndex(id, true) !== undefined)
			id = cur_local_id++
		const entity = new LaneCreepSpawner(id, 0)
		await entity.AsyncCreate()
		entity.Name_ = "npc_dota_spawner"
		entity.Team = team
		entity.Lane = lane
		for (const [ent, name] of ent2name)
			if (name === npcfirstwaypoint) {
				entity.Target = ent
				let current_corner: Nullable<CreepPathCorner> = ent
				while (current_corner !== undefined) {
					current_corner.Spawner = entity
					current_corner.Team = entity.Team
					current_corner = current_corner.Target
				}
				break
			}
		CreateEntityInternal(entity)
		await EventsSDK.emit("PreEntityCreated", false, entity)
		const pos = Vector3.FromString(origin_str),
			ang = QAngle.FromString(angles_str)
		pos.SetZ(GetPositionHeight(pos))
		entity.VisualPosition.CopyFrom(pos)
		entity.NetworkedPosition.CopyFrom(pos)
		entity.VisualAngles.CopyFrom(ang)
		entity.NetworkedAngles.CopyFrom(ang)
		await EventsSDK.emit("EntityCreated", false, entity)
	}
	for (const [ent] of ent2name)
		await EventsSDK.emit("EntityCreated", false, ent)
}

EventsSDK.after("ServerInfo", async () => {
	try {
		await LoadCreepSpawnersAndPathCorners()
	} catch (e) {
		console.error("Error in LoadCreepSpawnersAndPathCorners init", e)
	}
})
