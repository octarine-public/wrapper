import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_centaur_khan_endurance_aura_bonus extends Modifier {
	public readonly IsBuff = true

	public SetBonusAttackSpeed(
		specialName = this.Caster !== this.Parent ? "bonus_attack_speed" : undefined,
		subtract = false
	): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
