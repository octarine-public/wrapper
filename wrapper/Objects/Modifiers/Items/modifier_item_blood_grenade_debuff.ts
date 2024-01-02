import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_blood_grenade_debuff extends Modifier {
	public readonly IsDebuff = true
	public readonly CustomAbilityName = "item_blood_grenade"

	protected SetMoveSpeedAmplifier(
		specialName = "movespeed_slow",
		subtract = false
	): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}

	// note: set "lvl is 1" (fixed bug because of dota)
	protected GetSpecialValue(specialName: string, lvl: number = 1): number {
		return this.byAbilityData(this.CustomAbilityName, specialName, lvl)
	}
}
