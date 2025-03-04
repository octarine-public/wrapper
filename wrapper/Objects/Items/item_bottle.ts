import { WrapperClass } from "../../Decorators"
import { DOTA_RUNES } from "../../Enums/DOTA_RUNES"
import { EventPriority } from "../../Enums/EventPriority"
import { EntityManager } from "../../Managers/EntityManager"
import { EventsSDK } from "../../Managers/EventsSDK"
import { RegisterFieldHandler } from "../../Objects/NativeToSDK"
import { GameState } from "../../Utils/GameState"
import { Item } from "../Base/Item"
import { Rune } from "../Base/Rune"
import { Unit } from "../Base/Unit"

@WrapperClass("item_bottle")
export class item_bottle
	extends Item
	implements IManaRestore<Unit>, IHealthRestore<Unit>
{
	public readonly RestoresAlly = true
	public readonly RestoresSelf = true
	public readonly InstantRestore = false
	public readonly ManaRestoreModifierName = "modifier_bottle_regeneration"
	public readonly HealthRestoreModifierName = this.ManaRestoreModifierName

	public StoredRune = DOTA_RUNES.DOTA_RUNE_INVALID
	public LastRuneTypeChangeTime = GameState.RawGameTime
	public DestroyRuneTime_ = 0

	public get IsInvisibility() {
		return this.StoredRune === DOTA_RUNES.DOTA_RUNE_INVISIBILITY
	}
	public get StoredRuneTime(): number {
		return GameState.RawGameTime - this.LastRuneTypeChangeTime
	}
	public get TotalManaRestore(): number {
		return this.ManaRestore * this.MaxDuration
	}
	public get TotalHealthRestore(): number {
		return this.HealthRestore * this.MaxDuration
	}
	public get TexturePath(): string {
		switch (this.StoredRune) {
			case DOTA_RUNES.DOTA_RUNE_DOUBLEDAMAGE:
				return "panorama/images/items/bottle_doubledamage_png.vtex_c"
			case DOTA_RUNES.DOTA_RUNE_HASTE:
				return "panorama/images/items/bottle_haste_png.vtex_c"
			case DOTA_RUNES.DOTA_RUNE_ILLUSION:
				return "panorama/images/items/bottle_illusion_png.vtex_c"
			case DOTA_RUNES.DOTA_RUNE_INVISIBILITY:
				return "panorama/images/items/bottle_invisibility_png.vtex_c"
			case DOTA_RUNES.DOTA_RUNE_REGENERATION:
				return "panorama/images/items/bottle_regeneration_png.vtex_c"
			case DOTA_RUNES.DOTA_RUNE_BOUNTY:
				return "panorama/images/items/bottle_bounty_png.vtex_c"
			case DOTA_RUNES.DOTA_RUNE_ARCANE:
				return "panorama/images/items/bottle_arcane_png.vtex_c"
			case DOTA_RUNES.DOTA_RUNE_WATER:
				return "panorama/images/items/bottle_water_png.vtex_c"
			case DOTA_RUNES.DOTA_RUNE_XP:
				return "panorama/images/items/bottle_xp_png.vtex_c"
			case DOTA_RUNES.DOTA_RUNE_SHIELD:
				return "panorama/images/items/bottle_shield_png.vtex_c"
			default:
				switch (this.CurrentCharges) {
					case 2:
						return "panorama/images/items/bottle_medium_png.vtex_c"
					case 1:
						return "panorama/images/items/bottle_small_png.vtex_c"
					case 0:
						return "panorama/images/items/bottle_empty_png.vtex_c"
					default:
						return this.AbilityData.TexturePath
				}
		}
	}
	public get ManaRestore() {
		return this.GetSpecialValue("health_restore")
	}
	public get HealthRestore() {
		return this.GetSpecialValue("health_restore")
	}
	public get Cooldown() {
		return this.RuneExpireTime !== 0 ? this.RuneExpireTime : super.Cooldown
	}
	public get RuneExpireTime() {
		if (this.StoredRune === DOTA_RUNES.DOTA_RUNE_INVALID) {
			return 0
		}
		const expireTime = this.GetSpecialValue("rune_expire_time")
		return Math.max(this.DestroyRuneTime_ + expireTime - GameState.RawGameTime, 0)
	}
	public get IsCooldownReady(): boolean {
		return this.RuneExpireTime !== 0 ? true : super.IsCooldownReady
	}
	public get CanMoveInBackpack(): boolean {
		return super.CanMoveInBackpack && this.StoredRune === DOTA_RUNES.DOTA_RUNE_INVALID
	}
	public CanBeCasted(bonusMana: number = 0): boolean {
		return this.CurrentCharges > 0 && super.CanBeCasted(bonusMana)
	}
	public GetManaRestore(_target: Unit): number {
		return this.ManaRestore
	}
	public GetHealthRestore(_target: Unit): number {
		return this.HealthRestore
	}
	public GetMaxDurationForLevel(level: number): number {
		return this.GetSpecialValue("restore_time", level)
	}
	public IsManaRestore(): this is IManaRestore<Unit> {
		return true
	}
	public IsHealthRestore(): this is IHealthRestore<Unit> {
		return true
	}
}

RegisterFieldHandler(item_bottle, "m_iStoredRuneType", (bottle, newVal) => {
	if (bottle.StoredRune !== newVal) {
		bottle.StoredRune = newVal as DOTA_RUNES
		bottle.LastRuneTypeChangeTime = GameState.RawGameTime
	}
})

const cachedRuneTypes = new Map<DOTA_RUNES, number>()
export const Bottles = EntityManager.GetEntitiesByClass(item_bottle)

function UpdateTime(_dt: number) {
	const bottle = Bottles.find(x => cachedRuneTypes.has(x.StoredRune))
	if (bottle !== undefined) {
		const time = cachedRuneTypes.get(bottle.StoredRune)!
		bottle.DestroyRuneTime_ = time
		cachedRuneTypes.delete(bottle.StoredRune)
	}
}

EventsSDK.on("EntityDestroyed", entity => {
	if (entity instanceof Rune) {
		cachedRuneTypes.set(entity.Type, GameState.RawGameTime)
	}
})

EventsSDK.on("PostDataUpdate", UpdateTime, EventPriority.IMMEDIATE)

EventsSDK.on("GameEnded", () => cachedRuneTypes.clear(), EventPriority.IMMEDIATE)
