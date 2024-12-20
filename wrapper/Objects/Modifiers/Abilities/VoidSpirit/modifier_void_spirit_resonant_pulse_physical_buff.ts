import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_void_spirit_resonant_pulse_physical_buff extends Modifier {
	public readonly HasVisualShield = true

	private isAllBarrier = false

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK,
			this.GetTotalConstantBlock.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_CONSTANT_BLOCK_SPECIAL,
			this.GetPhysicalConstantBlockSpecial.bind(this)
		]
	])

	protected GetTotalConstantBlock(): [number, boolean] {
		return this.isAllBarrier ? [this.NetworkArmor, false] : [0, false]
	}

	protected GetPhysicalConstantBlockSpecial(): [number, boolean] {
		return this.isAllBarrier ? [0, false] : [this.NetworkArmor, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "void_spirit_resonant_pulse"
		this.isAllBarrier = this.GetSpecialValue("is_all_barrier", name) !== 0
	}
}
