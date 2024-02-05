import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_terrorblade_demon_zeal_aura extends Modifier {
	public SetBonusAttackSpeed(
		specialName = this.Caster === this.Parent
			? undefined
			: "berserk_bonus_attack_speed",
		subtract = false
	): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
