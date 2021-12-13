import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { DOTA_GameMode } from "../../Enums/DOTA_GameMode"
import EntityManager from "../../Managers/EntityManager"
import EventsSDK from "../../Managers/EventsSDK"
import Entity, { GameRules } from "../Base/Entity"
import Unit from "../Base/Unit"

@WrapperClass("CDOTA_Unit_Roshan")
export default class Roshan extends Unit {
	public static HP = 0
	public static HPRegenCounter = 0
	public static MaxHP = 0
	public static Instance: Nullable<Entity | number>
	public static get HPRegen() {
		return 20
	}
	@NetworkedBasicField("m_bGoldenRoshan")
	public GoldenRoshan = false

	public get RingRadius(): number {
		return 80
	}
}

function GetHPChangedByMinute(minute: number): number {
	let hp_changed = 115
	if (GameRules?.GameMode === DOTA_GameMode.DOTA_GAMEMODE_TURBO)
		hp_changed *= 2
	return minute * hp_changed
}

let last_minute = 0
EventsSDK.on("ParticleCreated", par => {
	if (par.Path !== "particles/neutral_fx/roshan_spawn.vpcf")
		return
	Roshan.Instance = typeof par.AttachedTo === "number"
		? par.AttachedTo & EntityManager.INDEX_MASK
		: par.AttachedTo
	if (GameRules === undefined)
		return
	last_minute = Math.max(0, Math.floor(GameRules.GameTime / 60))
	Roshan.HP = 6000 + GetHPChangedByMinute(last_minute)
	Roshan.MaxHP = Roshan.HP
})
EventsSDK.on("GameEvent", (name, obj) => {
	if (name !== "entity_hurt")
		return
	const ent = EntityManager.EntityByIndex(obj.entindex_killed) ?? (obj.entindex_killed & EntityManager.INDEX_MASK)
	if (ent === Roshan.Instance)
		Roshan.HP = Math.max(Math.round(Roshan.HP - obj.damage), 0)
})
EventsSDK.on("LifeStateChanged", ent => {
	if (Roshan.Instance === ent)
		Roshan.HP = 0
})

EventsSDK.on("PreEntityCreated", ent => {
	if (ent === GameRules && last_minute === -1)
		last_minute = Math.floor(Math.max((GameRules.GameTime ?? 0), 0) / 60)
	if (!(ent instanceof Roshan) || (Roshan.Instance instanceof Entity && Roshan.Instance !== ent))
		return
	Roshan.Instance = ent
	last_minute = GameRules !== undefined
		? Math.floor(Math.max(GameRules.GameTime, 0) / 60)
		: -1
	Roshan.HP = ent.HP
	Roshan.MaxHP = ent.MaxHP
})

EventsSDK.on("EntityDestroyed", ent => {
	if (Roshan.Instance !== ent)
		return
	Roshan.Instance = undefined
	Roshan.HP = 0
	Roshan.MaxHP = 0
})

EventsSDK.on("Tick", dt => {
	if (Roshan.HP === 0)
		return

	Roshan.HPRegenCounter += Roshan.HPRegen * Math.min(dt, 0.1)
	const regen_amount_floor = Math.floor(Roshan.HPRegenCounter)
	Roshan.HP = Math.min(Roshan.HP + regen_amount_floor, Roshan.MaxHP)
	Roshan.HPRegenCounter -= regen_amount_floor

	const min = Math.floor(Math.max(GameRules!.GameTime, 0) / 60)
	if (min === last_minute)
		return
	Roshan.MaxHP = 6000 + GetHPChangedByMinute(min)
	Roshan.HP *= Roshan.MaxHP / (6000 + GetHPChangedByMinute(last_minute))
	last_minute = min
})

EventsSDK.on("GameEnded", () => {
	Roshan.Instance = undefined
	Roshan.HP = 0
	last_minute = 0
	Roshan.MaxHP = 0
	Roshan.HPRegenCounter = 0
})
