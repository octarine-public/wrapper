import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_dazzle_bad_juju_armor_counter extends Modifier {
	protected SetBonusArmor(specialName = "armor_reduction", _subtract = true): void {
		const owner = this.Parent,
			caster = this.Caster
		if (owner === undefined || caster === undefined) {
			return
		}
		const maxStackCount = this.GetSpecialValue("max_stacks")
		const specialValue = this.GetSpecialArmorByState(specialName)
		const value = specialValue * Math.min(Math.max(this.StackCount, 0), maxStackCount)
		this.BonusArmor = owner === caster ? value : value * -1
	}
}
