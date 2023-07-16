import { Color } from "../../Base/Color"
import { QAngle } from "../../Base/QAngle"
import { Vector3 } from "../../Base/Vector3"
import { WrapperClass } from "../../Decorators"
import { Team } from "../../Enums/Team"
import { EntityManager } from "../../Managers/EntityManager"
import {
	CreateEntityInternal,
	DeleteEntity,
} from "../../Managers/EntityManagerLogic"
import { EventsSDK } from "../../Managers/EventsSDK"
import { GetPositionHeight } from "../../Native/WASM"
import { EntityDataLump } from "../../Resources/ParseEntityLump"
import { GridNav } from "../../Resources/ParseGNV"
import { ParseTRMP } from "../../Resources/ParseTRMP"
import { FileBinaryStream } from "../../Utils/FileBinaryStream"
import { GameState } from "../../Utils/GameState"
import { Entity } from "./Entity"

@WrapperClass("CDOTA_MapTree")
export class Tree extends Entity {
	public static TreeActiveMask: bigint[] = []
	public BinaryID = 0

	public get IsAlive() {
		const bitPos = this.BinaryID
		const pos = (bitPos / 64) | 0,
			bit = 1n << BigInt(bitPos % 64)
		const mask = Tree.TreeActiveMask[pos]
		return mask !== undefined && (mask & bit) !== 0n
	}
	public get CustomNativeID(): number {
		return (this.BinaryID << 1) | 1
	}
	public set CustomGlowColor(_: Nullable<Color>) {
		// N/A for non-networked entities
	}
	public get RingRadius(): number {
		return 128
	}
	public OnModelUpdated(): void {
		super.OnModelUpdated()
		this.BoundingBox.MaxOffset.z = this.BoundingBox.MinOffset.z + 320
	}
}
export const Trees = EntityManager.GetEntitiesByClass(Tree)

export let TempTreeIDOffset = 0
let curLocalID = 0x3000
function LoadTreeMap(stream: ReadableBinaryStream): void {
	TempTreeIDOffset = 0
	while (curLocalID > 0x3000) {
		const id = --curLocalID
		const ent = EntityManager.EntityByIndex(id)
		if (ent instanceof Tree) {
			DeleteEntity(id)
			GridNav?.UpdateTreeState(ent)
		}
	}
	const trees: Tree[] = []
	for (const pos of ParseTRMP(stream)) {
		TempTreeIDOffset++
		// for some reason there are trees duplicates, but earlier ones override them
		if (trees.some(tree => tree.Position.Equals(pos))) continue
		let id = curLocalID++
		while (EntityManager.EntityByIndex(id) !== undefined) id = curLocalID++
		const entity = new Tree(id, 0)
		entity.Name_ = "ent_dota_tree"
		entity.ClassName = "C_DOTA_MapTree"
		pos.SetZ(GetPositionHeight(pos))
		entity.VisualPosition.CopyFrom(pos)
		entity.NetworkedPosition.CopyFrom(pos)
		entity.BinaryID = TempTreeIDOffset - 1
		entity.Team = Team.Neutral
		CreateEntityInternal(entity)
		EventsSDK.emit("PreEntityCreated", false, entity)
		GridNav?.UpdateTreeState(entity)
		EventsSDK.emit("EntityCreated", false, entity)
		trees.push(entity)
	}
	for (const data of EntityDataLump) {
		if (data.get("classname") !== "ent_dota_tree") return
		const originStr = data.get("origin"),
			anglesStr = data.get("angles"),
			model = data.get("model")
		if (
			typeof originStr !== "string" ||
			typeof anglesStr !== "string" ||
			typeof model !== "string"
		)
			return
		const pos = Vector3.FromString(originStr)
		const entity = trees.find(
			tree => tree.Position.x === pos.x && tree.Position.y === pos.y
		)
		if (entity === undefined) return
		const ang = QAngle.FromString(anglesStr)
		entity.VisualAngles.CopyFrom(ang)
		entity.NetworkedAngles.CopyFrom(ang)
		entity.ModelName = model
		entity.OnModelUpdated()
	}
}

EventsSDK.after("ServerInfo", () => {
	const buf = fopen(`maps/${GameState.MapName}.trm`)
	if (buf !== undefined)
		try {
			LoadTreeMap(new FileBinaryStream(buf))
		} catch (e) {
			console.error("Error in TreeMap init", e)
		} finally {
			buf.close()
		}
})
