import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_clinkz_burning_army extends Modifier {
	private cachedBAT = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_BASE_ATTACK_TIME_CONSTANT,
			this.GetBaseAttackTimeConstant.bind(this)
		]
	])

	protected GetBaseAttackTimeConstant(): [number, boolean] {
		return [this.cachedBAT, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedBAT = this.GetSpecialValue("attack_rate", "clinkz_bone_and_arrow")
	}
}
