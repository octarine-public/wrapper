import Color from "../../Base/Color"
import QAngle from "../../Base/QAngle"
import Vector3 from "../../Base/Vector3"
import { RenderMode_t } from "../../Enums/RenderMode_t"
import { Team } from "../../Enums/Team"
import EntityManager, { CreateEntityInternal, DeleteEntity } from "../../Managers/EntityManager"
import Events from "../../Managers/Events"
import EventsSDK from "../../Managers/EventsSDK"
import { GetPositionHeight } from "../../Native/WASM"
import { EntityDataLump } from "../../Resources/ParseEntityLump"
import Entity from "./Entity"

export default class CreepPathCorner extends Entity {
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

let cur_local_id = 0x4000
async function LoadCreepPathCorners(): Promise<void> {
	while (cur_local_id > 0x4000) {
		const id = --cur_local_id
		const ent = EntityManager.EntityByIndex(id, true)
		if (ent instanceof CreepPathCorner)
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
			id++
		const entity = new CreepPathCorner(id)
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
	for (const [ent] of ent2name)
		await EventsSDK.emit("EntityCreated", false, ent)
}

let succeeded = false
async function TryLoadMapFiles(): Promise<void> {
	if (succeeded)
		return
	try {
		LoadCreepPathCorners()
		succeeded = true
	} catch (e) {
		console.log("Error in CreepPathCorners init: " + e)
	}
}

EventsSDK.after("ServerInfo", async () => {
	succeeded = false
	await TryLoadMapFiles()
})
Events.on("PostAddSearchPath", TryLoadMapFiles)
