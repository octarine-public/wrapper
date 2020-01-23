import Unit from "../Base/Unit"
import Entity from "../Base/Entity"
import Events from "../../Managers/Events"
import EntityManager from "../../Managers/EntityManager"

export default class Roshan extends Unit {
	private static Instance_: Nullable<Entity | number>
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

	public NativeEntity: Nullable<C_DOTA_Unit_Roshan>
	public GoldenRoshan = false

	public get LastHealthPercent(): number {
		return this.NativeEntity?.m_iLastHealthPercent ?? 100
	}
}

import { RegisterClass, RegisterFieldHandler } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Roshan", Roshan)
RegisterFieldHandler(Roshan, "m_bGoldenRoshan", (rosh, new_value) => rosh.GoldenRoshan = new_value as boolean)

let last_event_ent = -1
Events.on("GameEvent", (name, obj) => {
	if (name === "npc_spawned")
		last_event_ent = obj.entindex
	else if (name === "dota_item_spawned" && obj.player_id === -1 && last_event_ent !== -1 && Roshan.Instance === undefined)
		Roshan.Instance = last_event_ent
	else
		last_event_ent = -1
})
