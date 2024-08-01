import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Hero } from "../../Base/Hero"
import { Unit } from "../../Base/Unit"

@WrapperClass("winter_wyvern_cold_embrace")
export class winter_wyvern_cold_embrace
	extends Ability
	implements IHealthRestore<Unit>, IManaRestore<Unit>
{
	public readonly RestoresAlly = true
	public readonly RestoresSelf = true
	public readonly InstantRestore = false

	public readonly HealthRestoreModifierName = "modifier_winter_wyvern_cold_embrace"
	public readonly ManaRestoreModifierName =
		"modifier_winter_wyvern_essence_of_the_blueheart"

	public GetHealthRestore(target: Unit): number {
		const additive = this.GetSpecialValue("heal_additive")
		const hpPercent = this.GetSpecialValue("heal_percentage")
		const byMaxHP = target.MaxHP * (hpPercent / 100)
		return (additive + byMaxHP) * this.MaxDuration
	}

	public GetManaRestore(target: Unit): number {
		const owner = this.Owner
		if (!(owner instanceof Hero) || owner.HeroFacetID !== 1) {
			return 0
		}
		const blueHeart = owner.GetAbilityByName("winter_wyvern_essence_of_the_blueheart")
		if (blueHeart === undefined) {
			return 0
		}
		const hpRestore = this.GetHealthRestore(target)
		// fraction for mana
		const fraction = blueHeart.GetSpecialValue("restore_pct") / 100
		return hpRestore * fraction * this.MaxDuration
	}
	public GetMaxDurationForLevel(level: number): number {
		return this.GetSpecialValue("duration", level)
	}
	public IsManaRestore(): this is IManaRestore<Unit> {
		return true
	}
	public IsHealthRestore(): this is IHealthRestore<Unit> {
		return true
	}
}
