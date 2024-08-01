import { WrapperClass } from "../../../Decorators"
import { DOTA_ABILITY_BEHAVIOR } from "../../../Enums/DOTA_ABILITY_BEHAVIOR"
import { Ability } from "../../Base/Ability"
import { Hero } from "../../Base/Hero"
import { Unit } from "../../Base/Unit"

@WrapperClass("treant_living_armor")
export class treant_living_armor extends Ability implements IHealthRestore<Unit> {
	public readonly RestoresAlly = true
	public readonly RestoresSelf = true
	public readonly InstantRestore = false
	public readonly HealthRestoreModifierName = "modifier_treant_living_armor"

	public get AbilityBehaviorMask(): DOTA_ABILITY_BEHAVIOR {
		const owner = this.Owner
		if (!(owner instanceof Hero)) {
			return super.AbilityBehaviorMask
		}
		return owner.HeroFacetID !== 2
			? super.AbilityBehaviorMask
			: DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT
	}
	public GetHealthRestore(_target: Unit): number {
		return this.GetSpecialValue("heal_per_second") * this.MaxDuration
	}
	public GetMaxDurationForLevel(level: number): number {
		return this.GetSpecialValue("duration", level)
	}
	public IsHealthRestore(): this is IHealthRestore<Unit> {
		return true
	}
}
