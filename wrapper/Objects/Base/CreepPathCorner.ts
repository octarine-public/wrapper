import { Color } from "../../Base/Color"
import { QAngle } from "../../Base/QAngle"
import { Vector3 } from "../../Base/Vector3"
import { WrapperClass } from "../../Decorators"
import { MapArea } from "../../Enums/MapArea"
import { RenderMode } from "../../Enums/RenderMode"
import { Team } from "../../Enums/Team"
import { EntityManager } from "../../Managers/EntityManager"
import { CreateEntityInternal, DeleteEntity } from "../../Managers/EntityManagerLogic"
import { Events } from "../../Managers/Events"
import { EventsSDK } from "../../Managers/EventsSDK"
import { GetPositionHeight } from "../../Native/WASM"
import { EntityDataLumps, EntityDataMap } from "../../Resources/ParseEntityLump"
import { Entity } from "./Entity"
import { LaneCreepSpawner, LaneCreepSpawners } from "./LaneCreepSpawner"

@WrapperClass("CreepPathCorner")
export class CreepPathCorner extends Entity {
	public OriginPosition = new Vector3().Invalidate()
	public Spawner: Nullable<LaneCreepSpawner>
	public Referencing = new Set<CreepPathCorner>()
	public TargetPath: Nullable<CreepPathCorner>
	public SelfTargetName = ""
	public TargetName: Nullable<string>

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
Events.on("NewConnection", () => {
	curLocalID = 0x3000
})

function FixCreepPathCorner(entity: CreepPathCorner): void {
	let team = Team.Neutral,
		lane = MapArea.Unknown
	const selfName = entity.SelfTargetName
	switch (true) {
		case selfName.includes("lane_top_pathcorner_goodguys"):
			team = Team.Radiant
			lane = MapArea.Top
			break
		case selfName.includes("lane_top_pathcorner_badguys"):
			team = Team.Dire
			lane = MapArea.Top
			break
		case selfName.includes("lane_bot_pathcorner_goodguys"):
			team = Team.Radiant
			lane = MapArea.Bottom
			break
		case selfName.includes("lane_bot_pathcorner_badguys"):
			team = Team.Dire
			lane = MapArea.Bottom
			break
		case selfName.includes("lane_mid_pathcorner_goodguys"):
			team = Team.Radiant
			lane = MapArea.Middle
			break
		case selfName.includes("lane_mid_pathcorner_badguys"):
			team = Team.Dire
			lane = MapArea.Middle
			break
	}
	const spawner = LaneCreepSpawners.find(x => x.Team === team && x.Lane === lane)
	if (spawner !== undefined) {
		entity.Team = spawner.Team
		entity.Spawner = spawner
	}
}

function DeleteSpawnersAndCorners(lump: EntityDataMap[]): void {
	const lumpSpawnerNames = lump
		.filter(data => {
			const classname = data.get("classname")
			return (
				typeof classname === "string" &&
				classname.startsWith("npc_dota_spawner_") &&
				typeof data.get("targetname") === "string"
			)
		})
		.map(data => data.get("targetname") as string)
	const lumpSpawners = LaneCreepSpawners.filter(ent =>
		lumpSpawnerNames.includes(ent.SelfTargetName)
	)
	for (let index = lumpSpawners.length - 1; index > -1; index--) {
		DeleteEntity(lumpSpawners[index].Index)
	}
	const lumpCornerNames = lump
		.filter(
			data =>
				data.get("classname") === "path_corner" &&
				typeof data.get("targetname") === "string"
		)
		.map(data => data.get("targetname") as string)
	const lumpCorners = CreepPathCorners.filter(ent =>
		lumpCornerNames.includes(ent.SelfTargetName)
	)
	for (let index = lumpCorners.length - 1; index > -1; index--) {
		DeleteEntity(lumpCorners[index].Index)
	}
	for (const ent of CreepPathCorners) {
		if (ent.TargetPath !== undefined && lumpCorners.includes(ent.TargetPath)) {
			ent.TargetPath = undefined
		}
		for (let index = lumpCorners.length - 1; index > -1; index--) {
			const ent2 = lumpCorners[index]
			if (ent.Referencing.has(ent2)) {
				ent.Referencing.delete(ent2)
			}
		}
	}
	for (const ent of LaneCreepSpawners) {
		if (ent.TargetPath !== undefined && lumpCorners.includes(ent.TargetPath)) {
			ent.TargetPath = undefined
		}
	}
}

function LoadCreepSpawnersAndPathCorners(layerName: string, state: boolean): void {
	const lump = EntityDataLumps.get(layerName)
	if (lump === undefined) {
		return
	}
	if (!state) {
		DeleteSpawnersAndCorners(lump)
		return
	}

	for (let index = 0, end = lump.length; index < end; index++) {
		const data = lump[index]
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
			npcfirstwaypoint =
				data.get("NPCFirstWaypoint") ?? data.get("npcfirstwaypoint"),
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
		const entity = new LaneCreepSpawner(id, 0)
		entity.Name_ = "npc_dota_spawner"
		entity.Team = team
		entity.Lane = lane
		entity.SelfTargetName = targetname
		if (typeof npcfirstwaypoint === "string") {
			entity.TargetName = npcfirstwaypoint
			const firstWaypoint = CreepPathCorners.find(
				ent => ent.SelfTargetName === npcfirstwaypoint
			)
			if (firstWaypoint !== undefined) {
				entity.TargetPath = firstWaypoint
				let currentCorner: Nullable<CreepPathCorner> = firstWaypoint
				while (currentCorner !== undefined) {
					currentCorner.Spawner = entity
					currentCorner.Team = entity.Team
					currentCorner = currentCorner.TargetPath
				}
			}
		}
		CreateEntityInternal(entity)
		EventsSDK.emit("PreEntityCreated", false, entity)
		const pos = Vector3.FromString(originStr),
			ang = QAngle.FromString(anglesStr)
		pos.SetZ(GetPositionHeight(pos))
		// Hack "GetPositionHeight(pos)"
		entity.OriginPosition.CopyFrom(pos)
		entity.VisualPosition.CopyFrom(pos)
		entity.NetworkedPosition.CopyFrom(pos)
		entity.VisualAngles.CopyFrom(ang)
		entity.NetworkedAngles.CopyFrom(ang)
		EventsSDK.emit("EntityCreated", false, entity)
	}

	for (let index = 0, end = lump.length; index < end; index++) {
		const data = lump[index]
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
			entity.TargetName = target
		}
		entity.SelfTargetName = targetname
		entity.Name_ = "path_corner"
		entity.Team = Team.Neutral
		FixCreepPathCorner(entity)
		CreateEntityInternal(entity)
		EventsSDK.emit("PreEntityCreated", false, entity)
		const pos = Vector3.FromString(originStr),
			ang = QAngle.FromString(anglesStr)
		pos.SetZ(GetPositionHeight(pos))
		// Hack "GetPositionHeight(pos)"
		entity.OriginPosition.CopyFrom(pos)
		entity.VisualPosition.CopyFrom(pos)
		entity.NetworkedPosition.CopyFrom(pos)
		entity.VisualAngles.CopyFrom(ang)
		entity.NetworkedAngles.CopyFrom(ang)
		for (let j = LaneCreepSpawners.length - 1; j > -1; j--) {
			const spawner = LaneCreepSpawners[j]
			if (spawner.TargetName === entity.SelfTargetName) {
				spawner.TargetPath = entity
				entity.Spawner = spawner
			}
		}
		// TargetName -> target
		// SelfTargetName -> targetname
		for (let j = CreepPathCorners.length - 1; j > -1; j--) {
			const prev = CreepPathCorners[j]
			if (
				prev.TargetName !== undefined &&
				entity.SelfTargetName === prev.TargetName
			) {
				prev.TargetPath = entity
				entity.Spawner = prev.Spawner
				entity.Team = prev.Spawner?.Team ?? Team.Neutral
				entity.Referencing.add(prev)
			}
			if (prev.SelfTargetName === entity.TargetName) {
				entity.TargetPath = prev
				prev.Spawner = entity.Spawner
				prev.Team = entity.Spawner?.Team ?? Team.Neutral
				prev.Referencing.add(entity)
			}
		}
		EventsSDK.emit("EntityCreated", false, entity)
	}
}

EventsSDK.on("WorldLayerVisibilityChanged", (layerName, state) => {
	try {
		LoadCreepSpawnersAndPathCorners(layerName, state)
	} catch (e) {
		console.error("Error in LoadCreepSpawnersAndPathCorners", e)
	}
})

function UpdatePositionHeight(entities: CreepPathCorner[] | LaneCreepSpawner[]): void {
	for (let index = entities.length - 1; index > -1; index--) {
		const entity = entities[index]
		entity.NetworkedPosition.SetZ(GetPositionHeight(entity.NetworkedPosition))
		entity.VisualPosition.SetZ(entity.NetworkedPosition.z)
		entity.OriginPosition.SetZ(entity.NetworkedPosition.z)
	}
}

EventsSDK.on("WorldLayersVisibilityChanged", () => {
	UpdatePositionHeight(CreepPathCorners)
	UpdatePositionHeight(LaneCreepSpawners)
})
