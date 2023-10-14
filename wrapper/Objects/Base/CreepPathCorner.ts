import { Color } from "../../Base/Color"
import { QAngle } from "../../Base/QAngle"
import { Vector3 } from "../../Base/Vector3"
import { WrapperClass } from "../../Decorators"
import { MapArea } from "../../Enums/MapArea"
import { RenderMode } from "../../Enums/RenderMode"
import { Team } from "../../Enums/Team"
import { EntityManager } from "../../Managers/EntityManager"
import { CreateEntityInternal, DeleteEntity } from "../../Managers/EntityManagerLogic"
import { EventsSDK } from "../../Managers/EventsSDK"
import { GetPositionHeight } from "../../Native/WASM"
import { EntityDataLump } from "../../Resources/ParseEntityLump"
import { Entity } from "./Entity"
import { LaneCreepSpawner } from "./LaneCreepSpawner"
// import { WardSpawner } from "./WardSpawner"

@WrapperClass("CreepPathCorner")
export class CreepPathCorner extends Entity {
	public Spawner: Nullable<LaneCreepSpawner>
	public Referencing = new Set<CreepPathCorner>()
	public Target: Nullable<CreepPathCorner>

	public get IsAlive() {
		return true
	}
	public set CustomGlowColor(_: Nullable<Color>) {
		// N/A for non-networked entities
	}
	public set CustomDrawColor(_: Nullable<[Color, RenderMode]>) {
		// N/A for non-networked entities
	}
}
export const CreepPathCorners = EntityManager.GetEntitiesByClass(CreepPathCorner)

let curLocalID = 0x3000
function LoadCreepSpawnersAndPathCorners(): void {
	while (curLocalID > 0x3000) {
		const id = --curLocalID
		const ent = EntityManager.EntityByIndex(id)
		if (ent instanceof CreepPathCorner || ent instanceof LaneCreepSpawner) {
			DeleteEntity(id)
		}
	}
	const ent2target = new Map<CreepPathCorner, string>(),
		ent2name = new Map<CreepPathCorner, string>()
	for (const data of EntityDataLump) {
		if (data.get("classname") !== "path_corner") {
			continue
		}
		const originStr = data.get("origin"),
			anglesStr = data.get("angles"),
			target = data.get("target"),
			targetname = data.get("targetname")
		if (
			typeof originStr !== "string" ||
			typeof anglesStr !== "string" ||
			typeof targetname !== "string"
		) {
			continue
		}
		let id = curLocalID++
		while (EntityManager.EntityByIndex(id) !== undefined) {
			id = curLocalID++
		}
		const entity = new CreepPathCorner(id, 0)
		if (typeof target === "string") {
			ent2target.set(entity, target)
		}
		ent2name.set(entity, targetname)
		entity.Name_ = "path_corner"
		entity.Team = Team.Neutral
		CreateEntityInternal(entity)
		EventsSDK.emit("PreEntityCreated", false, entity)
		const pos = Vector3.FromString(originStr),
			ang = QAngle.FromString(anglesStr)
		pos.SetZ(GetPositionHeight(pos))
		entity.VisualPosition.CopyFrom(pos)
		entity.NetworkedPosition.CopyFrom(pos)
		entity.VisualAngles.CopyFrom(ang)
		entity.NetworkedAngles.CopyFrom(ang)
	}

	for (const [ent, name] of ent2name) {
		for (const [prev, target] of ent2target) {
			if (ent !== prev && name === target) {
				prev.Target = ent
				ent.Referencing.add(prev)
			}
		}
	}

	for (const data of EntityDataLump) {
		let team: Nullable<Team>, lane: Nullable<MapArea>
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
		const originStr = data.get("origin"),
			anglesStr = data.get("angles"),
			npcfirstwaypoint = data.get("NPCFirstWaypoint")
		if (
			typeof originStr !== "string" ||
			typeof anglesStr !== "string" ||
			typeof npcfirstwaypoint !== "string"
		) {
			continue
		}
		let id = curLocalID++
		while (EntityManager.EntityByIndex(id) !== undefined) {
			id = curLocalID++
		}
		const entity = new LaneCreepSpawner(id, 0)
		entity.Name_ = "npc_dota_spawner"
		entity.Team = team
		entity.Lane = lane
		for (const [ent, name] of ent2name) {
			if (name === npcfirstwaypoint) {
				entity.Target = ent
				let currentCorner: Nullable<CreepPathCorner> = ent
				while (currentCorner !== undefined) {
					currentCorner.Spawner = entity
					currentCorner.Team = entity.Team
					currentCorner = currentCorner.Target
				}
				break
			}
		}
		CreateEntityInternal(entity)
		EventsSDK.emit("PreEntityCreated", false, entity)
		const pos = Vector3.FromString(originStr),
			ang = QAngle.FromString(anglesStr)
		pos.SetZ(GetPositionHeight(pos))
		entity.VisualPosition.CopyFrom(pos)
		entity.NetworkedPosition.CopyFrom(pos)
		entity.VisualAngles.CopyFrom(ang)
		entity.NetworkedAngles.CopyFrom(ang)
		EventsSDK.emit("EntityCreated", false, entity)
	}

	// for (const data of EntityDataLump) {
	// 	if (data.get("classname") !== "info_target") continue
	// 	const originStr = data.get("origin"),
	// 		anglesStr = data.get("angles"),
	// 		targetname = data.get("targetname")
	// 	if (
	// 		typeof originStr !== "string" ||
	// 		typeof anglesStr !== "string" ||
	// 		typeof targetname !== "string"
	// 	)
	// 		continue

	// 	const spawnflags = Number(data.get("spawnflags"))
	// 	if (spawnflags <= 0) continue

	// 	let id = curLocalID++
	// 	while (EntityManager.EntityByIndex(id) !== undefined) id = curLocalID++
	// 	const entity = new WardSpawner(id, 0)
	// 	entity.Name_ = targetname
	// 	CreateEntityInternal(entity)
	// 	EventsSDK.emit("PreEntityCreated", false, entity)
	// 	const pos = Vector3.FromString(originStr),
	// 		ang = QAngle.FromString(anglesStr)
	// 	pos.SetZ(GetPositionHeight(pos))
	// 	entity.VisualPosition.CopyFrom(pos)
	// 	entity.NetworkedPosition.CopyFrom(pos)
	// 	entity.VisualAngles.CopyFrom(ang)
	// 	entity.NetworkedAngles.CopyFrom(ang)
	// 	EventsSDK.emit("EntityCreated", false, entity)
	// }

	for (const [ent] of ent2name) {
		EventsSDK.emit("EntityCreated", false, ent)
	}
}

EventsSDK.after("ServerInfo", () => {
	try {
		LoadCreepSpawnersAndPathCorners()
	} catch (e) {
		console.error("Error in LoadCreepSpawnersAndPathCorners", e)
	}
})
