import Color from "../../Base/Color"
import QAngle from "../../Base/QAngle"
import Vector3 from "../../Base/Vector3"
import { WrapperClass } from "../../Decorators"
import { RenderMode_t } from "../../Enums/RenderMode_t"
import { Team } from "../../Enums/Team"
import EntityManager, { CreateEntityInternal, DeleteEntity } from "../../Managers/EntityManager"
import EventsSDK from "../../Managers/EventsSDK"
import { GetPositionHeight } from "../../Native/WASM"
import { EntityDataLump } from "../../Resources/ParseEntityLump"
import { GridNav } from "../../Resources/ParseGNV"
import { ParseTRMP } from "../../Resources/ParseTRMP"
import GameState from "../../Utils/GameState"
import Entity from "./Entity"

@WrapperClass("CDOTA_MapTree")
export default class Tree extends Entity {
	public BinaryID = 0

	public get IsAlive() {
		return EntityManager.IsTreeActive(this.BinaryID)
	}
	public get CustomNativeID(): number {
		return (this.BinaryID << 1) | 1
	}
	public set CustomGlowColor(_: Nullable<Color>) {
		// N/A for non-networked entities
	}
	public set CustomDrawColor(_: Nullable<[Color, RenderMode_t]>) {
		// N/A for non-networked entities
	}
	public get RingRadius(): number {
		return 128
	}
	public async OnModelUpdated(): Promise<void> {
		await super.OnModelUpdated()
		this.BoundingBox.MaxOffset.z = this.BoundingBox.MinOffset.z + 320
	}
}
export const Trees = EntityManager.GetEntitiesByClass(Tree)

export let TempTreeIDOffset = 0
let cur_local_id = 0x2000
async function LoadTreeMap(buf: Uint8Array): Promise<void> {
	TempTreeIDOffset = 0
	while (cur_local_id > 0x2000) {
		const id = --cur_local_id
		const ent = EntityManager.EntityByIndex(id)
		if (ent instanceof Tree) {
			await DeleteEntity(id)
			GridNav?.UpdateTreeState(ent)
		}
	}
	const trees: Tree[] = []
	for (const pos of ParseTRMP(buf)) {
		TempTreeIDOffset++
		// for some reason there are trees duplicates, but earlier ones override them
		if (trees.some(tree => tree.Position.Equals(pos)))
			continue
		let id = cur_local_id++
		while (EntityManager.EntityByIndex(id) !== undefined)
			id = cur_local_id++
		const entity = new Tree(id, 0)
		await entity.AsyncCreate()
		entity.Name_ = "ent_dota_tree"
		entity.ClassName = "C_DOTA_MapTree"
		pos.SetZ(GetPositionHeight(pos))
		entity.VisualPosition.CopyFrom(pos)
		entity.NetworkedPosition.CopyFrom(pos)
		entity.BinaryID = TempTreeIDOffset - 1
		entity.Team = Team.Neutral
		CreateEntityInternal(entity)
		await EventsSDK.emit("PreEntityCreated", false, entity)
		GridNav?.UpdateTreeState(entity)
		await EventsSDK.emit("EntityCreated", false, entity)
		trees.push(entity)
	}
	for (const data of EntityDataLump) {
		if (data.get("classname") !== "ent_dota_tree")
			return
		const origin_str = data.get("origin"),
			angles_str = data.get("angles"),
			model = data.get("model")
		if (
			typeof origin_str !== "string"
			|| typeof angles_str !== "string"
			|| typeof model !== "string"
		)
			return
		const pos = Vector3.FromString(origin_str)
		const entity = trees.find(tree => (
			tree.Position.x === pos.x
			&& tree.Position.y === pos.y
		))
		if (entity === undefined)
			return
		const ang = QAngle.FromString(angles_str)
		entity.VisualAngles.CopyFrom(ang)
		entity.NetworkedAngles.CopyFrom(ang)
		entity.ModelName = model
		entity.OnModelUpdated()
	}
}

EventsSDK.after("ServerInfo", async () => {
	try {
		const buf = fread(`maps/${GameState.MapName}.trm`)
		if (buf !== undefined)
			await LoadTreeMap(buf)
	} catch (e) {
		console.error("Error in TreeMap init", e)
	}
})
