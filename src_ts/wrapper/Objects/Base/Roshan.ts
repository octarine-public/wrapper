import Unit from "../Base/Unit"
import Entity from "../Base/Entity"
import EventsSDK from "../../Managers/EventsSDK"
import EntityManager from "../../Managers/EntityManager"
import { GameRules } from "./GameRules"

export default class Roshan extends Unit {
	public static HP = 0
	public static MaxHP = 0
	public static get Instance(): Nullable<Entity | number> {
		if (this.Instance_ instanceof Entity) {
			if (!(this.Instance_ instanceof Entity) || !this.Instance_.IsValid)
				return this.Instance_ = undefined
			return this.Instance_
		}
		return this.Instance_ = (EntityManager.EntityByIndex(this.Instance_ as number)
			?? this.Instance_
			?? EntityManager.AllEntities.find(ent => ent instanceof Roshan))
	}
	public static set Instance(ent: Nullable<Entity | number>) {
		this.Instance_ = ent
	}
	private static Instance_: Nullable<Entity | number>

	public NativeEntity: Nullable<C_DOTA_Unit_Roshan>
	public GoldenRoshan = false
}

import { RegisterClass, RegisterFieldHandler } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Roshan", Roshan)
RegisterFieldHandler(Roshan, "m_bGoldenRoshan", (rosh, new_value) => rosh.GoldenRoshan = new_value as boolean)

let last_event_ent = -1,
	last_minute = 0
EventsSDK.on("GameEvent", (name, obj) => {
	if (name === "npc_spawned")
		last_event_ent = obj.entindex
	else if (name === "dota_item_spawned" && obj.player_id === -1 && last_event_ent !== -1 && Roshan.Instance === undefined) {
		Roshan.Instance = last_event_ent
		if (GameRules !== undefined) {
			last_minute = Math.max(0, Math.floor(GameRules.GameTime / 60))
			Roshan.HP = 6000 + (last_minute * 115)
			Roshan.MaxHP = Roshan.HP
		}
	} else
		last_event_ent = -1

	if (name === "entity_hurt") {
		let ent = EntityManager.EntityByIndex(obj.entindex_killed) ?? obj.entindex_killed
		if (ent === Roshan.Instance)
			Roshan.HP = Math.max(Math.round(Roshan.HP - obj.damage), 0)
	} else if (name === "entity_killed") {
		let ent = EntityManager.EntityByIndex(obj.entindex_killed) ?? obj.entindex_killed
		if (ent === Roshan.Instance) {
			Roshan.HP = 0
			Roshan.MaxHP = 0
			Roshan.Instance = undefined
		}
	}
})

EventsSDK.on("EntityCreated", ent => {
	if (!(ent instanceof Roshan) || (Roshan.Instance instanceof Entity && Roshan.Instance !== ent))
		return
	Roshan.Instance = ent
	let time = GameRules?.GameTime ?? 0
	last_minute = Math.max(0, Math.floor(time / 60))
	Roshan.HP = 6000 + (last_minute * 115)
	Roshan.MaxHP = Roshan.HP
})

EventsSDK.on("EntityDestroyed", ent => {
	if (Roshan.Instance !== ent)
		return
	Roshan.Instance = undefined
	Roshan.HP = 0
	Roshan.MaxHP = 0
})

const HPRegen = 20
EventsSDK.on("Tick", () => {
	if (Roshan.HP === 0)
		return
	Roshan.HP = Math.min(Math.round(Roshan.HP + (HPRegen / 30)), 6000 + (last_minute * 115))
	let time = GameRules?.GameTime ?? 0
	let min = Math.floor(time / 60)
	if (min === last_minute)
		return
	Roshan.HP *= (6000 + (min * 115)) / (6000 + (last_minute * 115))
	last_minute = min
	Roshan.MaxHP = Roshan.HP
})

EventsSDK.on("GameEnded", () => {
	Roshan.Instance = undefined
	Roshan.HP = 0
	last_minute = 0
	Roshan.MaxHP = 0
})
