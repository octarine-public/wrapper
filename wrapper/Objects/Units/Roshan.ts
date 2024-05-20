import { Vector2 } from "../../Base/Vector2"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { DOTAGameMode } from "../../Enums/DOTAGameMode"
import { GUIInfo } from "../../GUI/GUIInfo"
import { EventsSDK } from "../../Managers/EventsSDK"
import { Entity, GameRules } from "../Base/Entity"
import { FakeUnit } from "../Base/FakeUnit"
import { RoshanSpawner } from "../Base/RoshanSpawner"
import { Unit } from "../Base/Unit"

@WrapperClass("CDOTA_Unit_Roshan")
export class Roshan extends Unit {
	public static HP = 0
	public static MaxHP = 0
	public static HPRegenCounter = 0
	public static Instance: Nullable<Unit | FakeUnit>
	public static Spawner: Nullable<RoshanSpawner>

	public static get HPRegen() {
		return 20
	}
	@NetworkedBasicField("m_bGoldenRoshan")
	public GoldenRoshan = false

	/** @ignore */
	constructor(
		public readonly Index: number,
		serial: number
	) {
		super(Index, serial)
		this.IsRoshan = true
	}

	public get RingRadius(): number {
		return 80
	}
	public get Position() {
		return this.IsVisible || Roshan.Spawner === undefined
			? super.Position
			: Roshan.Spawner.RoshanPosition
	}
	public get HealthBarSize() {
		return new Vector2(GUIInfo.ScaleHeight(225), GUIInfo.ScaleHeight(5))
	}
	public get HealthBarPositionCorrection() {
		return new Vector2(this.HealthBarSize.x / 2, GUIInfo.ScaleHeight(9))
	}
}

function GetHPChangedByMinute(minute: number): number {
	let hpChanged = 130
	if (GameRules?.GameMode === DOTAGameMode.DOTA_GAMEMODE_TURBO) {
		hpChanged *= 2
	}
	return minute * hpChanged
}

let lastMinute = 0
EventsSDK.on("ParticleCreated", par => {
	if (par.PathNoEcon !== "particles/neutral_fx/roshan_spawn.vpcf") {
		return
	}
	Roshan.Instance = par.AttachedTo
	if (GameRules === undefined) {
		return
	}
	lastMinute = Math.max(0, Math.floor(GameRules.GameTime / 60))
	Roshan.HP = 6000 + GetHPChangedByMinute(lastMinute)
	Roshan.MaxHP = Roshan.HP
})
EventsSDK.on("GameEvent", (name, obj) => {
	if (name !== "entity_hurt") {
		return
	}
	if (Roshan.Instance?.HandleMatches(obj.entindex_killed)) {
		Roshan.HP = Math.max(Math.round(Roshan.HP - obj.damage), 0)
	}
})
EventsSDK.on("LifeStateChanged", ent => {
	if (Roshan.Instance === ent) {
		Roshan.HP = 0
	}
})

EventsSDK.on("PreEntityCreated", ent => {
	if (ent === GameRules && lastMinute === -1) {
		lastMinute = Math.floor(Math.max(GameRules.GameTime ?? 0, 0) / 60)
	}
	if (ent instanceof RoshanSpawner) {
		Roshan.Spawner = ent
	}
	if (
		!(ent instanceof Roshan) ||
		(Roshan.Instance instanceof Entity && Roshan.Instance !== ent)
	) {
		return
	}
	Roshan.Instance = ent
	lastMinute =
		GameRules !== undefined ? Math.floor(Math.max(GameRules.GameTime, 0) / 60) : -1
	Roshan.HP = ent.HP
	Roshan.MaxHP = ent.MaxHP
})

EventsSDK.on("EntityDestroyed", ent => {
	if (Roshan.Instance === ent) {
		Roshan.HP = 0
		Roshan.MaxHP = 0
		Roshan.Instance = undefined
	}
	if (ent instanceof RoshanSpawner) {
		Roshan.Spawner = undefined
	}
})

EventsSDK.on("PostDataUpdate", dt => {
	if (Roshan.HP === 0 || dt === 0) {
		return
	}

	Roshan.HPRegenCounter += Roshan.HPRegen * Math.min(dt, 0.1)
	const regenAmountFloor = Math.floor(Roshan.HPRegenCounter)
	Roshan.HP =
		Roshan.Instance instanceof Entity && Roshan.Instance.IsVisible
			? Roshan.Instance.HP
			: Math.min(Roshan.HP + regenAmountFloor, Roshan.MaxHP)
	Roshan.HPRegenCounter -= regenAmountFloor

	const min = Math.floor(Math.max(GameRules!.GameTime, 0) / 60)
	if (min === lastMinute) {
		return
	}
	Roshan.MaxHP = 6000 + GetHPChangedByMinute(min)
	Roshan.HP *= Roshan.MaxHP / (6000 + GetHPChangedByMinute(lastMinute))
	lastMinute = min
})

EventsSDK.on("GameEnded", () => {
	Roshan.HP = 0
	lastMinute = 0
	Roshan.MaxHP = 0
	Roshan.HPRegenCounter = 0
	Roshan.Spawner = undefined
	Roshan.Instance = undefined
})
