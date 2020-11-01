import Entity from "./Entity"
import Vector3 from "../../Base/Vector3"
import QAngle from "../../Base/QAngle"
import EntityManager, { DeleteEntity, CreateEntityInternal } from "../../Managers/EntityManager"
import { WrapperClass } from "../../Decorators"
import { ParseTRMP } from "../../Utils/ParseTRMP"
import Events from "../../Managers/Events"
import { ParseMapName } from "../../Utils/Utils"
import { SignonState_t } from "../../Enums/SignonState_t"
import EventsSDK from "../../Managers/EventsSDK"

@WrapperClass("C_DOTA_MapTree")
export default class Tree extends Entity {
	public readonly FakeTreePos = new Vector3()
	public BinaryID = 0

	public get Position() {
		return this.FakeTreePos.Clone()
	}
	public get Rotation(): number {
		return 0
	}
	public get Angles(): QAngle {
		return new QAngle()
	}
	public get IsAlive() {
		return EntityManager.IsTreeActive(this.BinaryID)
	}
	public get RingRadius(): number {
		return 100
	}
}

let cur_local_id = 0x4000
function LoadTreeMap(buf: ArrayBuffer) {
	while (cur_local_id > 0x4000)
		DeleteEntity(--cur_local_id)
	ParseTRMP(buf).forEach((pos, i) => {
		let id = cur_local_id++
		let entity = new Tree(id)
		entity.Name_ = "ent_dota_tree"
		entity.ClassName = "C_DOTA_MapTree"
		entity.FakeTreePos.CopyFrom(pos)
		entity.BinaryID = i
		CreateEntityInternal(entity)
		EventsSDK.emit("PostEntityCreated", false, entity)
	})
}

let last_loaded_map_name = "<empty>"
let initialized = false
Events.on("ServerMessage", () => {
	if (initialized)
		return
	initialized = true
	try {
		let map_name = GetLevelNameShort()
		if (map_name === "start")
			map_name = "dota"
		let buf = fread(`maps/${map_name}.trm`)
		if (buf !== undefined)
			LoadTreeMap(buf)
	} catch (e) {
		console.log("Error in TreeMap static init: " + e)
	}
})

Events.on("PostAddSearchPath", path => {
	let map_name = ParseMapName(path)
	if (map_name === undefined)
		return

	let buf = fread(`maps/${map_name}.trm`)
	if (buf === undefined)
		return

	initialized = true
	try {
		LoadTreeMap(buf)
	} catch (e) {
		console.log("Error in TreeMap dynamic init: " + e)
	}
})

Events.on("PostRemoveSearchPath", path => {
	let map_name = ParseMapName(path)
	if (map_name === undefined || last_loaded_map_name !== map_name)
		return

	last_loaded_map_name = "<empty>"
	while (cur_local_id > 0x4000)
		DeleteEntity(--cur_local_id)
})

Events.on("SignonStateChanged", new_state => {
	if (new_state === SignonState_t.SIGNONSTATE_NONE)
		cur_local_id = 0x4000
})
