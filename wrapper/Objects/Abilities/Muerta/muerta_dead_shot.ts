import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("muerta_dead_shot")
export class muerta_dead_shot extends Ability implements INuke {
	public get ProjectileAttachment(): string {
		return "attach_attack1"
	}
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("speed", level)
	}
	public GetMaxChargesForLevel(level: number): number {
		const owner = this.Owner
		if (owner === undefined) {
			return 0
		}
		const ability = owner.GetAbilityByName(
			"special_bonus_unique_muerta_dead_shot_charges"
		)
		return ability?.GetSpecialValue("value", level) ?? 0
	}
}
