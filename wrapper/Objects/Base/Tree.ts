import { Color } from "../../Base/Color"
import { QAngle } from "../../Base/QAngle"
import { Vector2 } from "../../Base/Vector2"
import { Vector3 } from "../../Base/Vector3"
import { WrapperClass } from "../../Decorators"
import { RenderMode } from "../../Enums/RenderMode"
import { Team } from "../../Enums/Team"
import { EntityManager } from "../../Managers/EntityManager"
import { CreateEntityInternal, DeleteEntity } from "../../Managers/EntityManagerLogic"
import { Events } from "../../Managers/Events"
import { EventsSDK } from "../../Managers/EventsSDK"
import { GetPositionHeight } from "../../Native/WASM"
import { EntityDataLumps } from "../../Resources/ParseEntityLump"
import { GridNav } from "../../Resources/ParseGNV"
import { ParseTRMP } from "../../Resources/ParseTRMP"
import { GameState } from "../../Utils/GameState"
import { ViewBinaryStream } from "../../Utils/ViewBinaryStream"
import { Entity } from "./Entity"

@WrapperClass("CDOTA_MapTree")
export class Tree extends Entity {
	public static TreeActiveMask: bigint[] = []
	public BinaryID = 0

	constructor(
		public readonly Index: number,
		serial: number
	) {
		super(Index, serial)
		this.IsTree = true
	}

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
	public set CustomDrawColor(_: Nullable<[Color, RenderMode]>) {
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
Events.on("NewConnection", () => {
	TempTreeIDOffset = 0
	curLocalID = 0x3000
})

let treeMap = new Map<string, [number, Vector2][]>()
EventsSDK.on("MapDataLoaded", () => {
	const buf = fread(`maps/${GameState.MapName}.trm`, true)
	if (buf !== undefined) {
		try {
			const [trmp, treeCount] = ParseTRMP(new ViewBinaryStream(new DataView(buf)))
			treeMap = trmp
			TempTreeIDOffset = treeCount
		} catch (e) {
			console.error("Error in TreeMap init", e)
		}
	}
})

EventsSDK.on("WorldLayerVisibilityChanged", (layerName, state) => {
	const layerTrees = treeMap.get(layerName)
	if (layerTrees === undefined) {
		return
	}

	if (!state) {
		const layerTreesEnts = Trees.filter(tree =>
			layerTrees.find(layerTree => layerTree[0] === tree.BinaryID)
		)
		for (let index = layerTreesEnts.length - 1; index > -1; index--) {
			const tree = layerTreesEnts[index]
			DeleteEntity(tree.Index)
			GridNav?.UpdateTreeState(tree)
		}
		return
	}

	const lump = EntityDataLumps.get(layerName)
	for (let index = 0, end = layerTrees.length; index < end; index++) {
		const [binaryID, trmpPos] = layerTrees[index]
		let id = curLocalID++
		while (EntityManager.EntityByIndex(id) !== undefined) {
			id = curLocalID++
		}
		const entData = lump?.find(data => {
			if (data.get("classname") !== "ent_dota_tree") {
				return false
			}
			const originStr = data.get("origin")
			if (typeof originStr !== "string") {
				return false
			}
			const pos = Vector3.FromString(originStr)
			return pos.x === trmpPos.x && pos.y === trmpPos.y
		})
		if (entData === undefined) {
			continue
		}
		const anglesStr = entData.get("angles"),
			model = entData.get("model")
		if (typeof anglesStr !== "string" || typeof model !== "string") {
			continue
		}

		const entity = new Tree(id, 0)
		entity.Name_ = "ent_dota_tree"
		entity.ClassName = "C_DOTA_MapTree"
		const treePos = new Vector3(trmpPos.x, trmpPos.y, GetPositionHeight(trmpPos))
		entity.VisualPosition.CopyFrom(treePos)
		entity.NetworkedPosition.CopyFrom(treePos)
		entity.BinaryID = binaryID
		entity.Team = Team.Neutral

		const ang = QAngle.FromString(anglesStr)
		entity.VisualAngles.CopyFrom(ang)
		entity.NetworkedAngles.CopyFrom(ang)
		entity.ModelName = model
		entity.OnModelUpdated()

		CreateEntityInternal(entity)
		EventsSDK.emit("PreEntityCreated", false, entity)
		GridNav?.UpdateTreeState(entity)
		EventsSDK.emit("EntityCreated", false, entity)
	}
})

EventsSDK.on("WorldLayersVisibilityChanged", () => {
	for (let index = Trees.length - 1; index > -1; index--) {
		const ent = Trees[index]
		ent.NetworkedPosition.SetZ(GetPositionHeight(ent.NetworkedPosition))
		ent.VisualPosition.SetZ(ent.NetworkedPosition.z)
	}
})
