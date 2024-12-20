import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_tinker_defense_matrix extends Modifier {
	public readonly HasVisualShield = true

	private cachedShiled = 0
	private cachedStatusResist = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK,
			this.GetTotalConstantBlock.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_STATUS_RESISTANCE_STACKING,
			this.GetStatusResistanceStacking.bind(this)
		]
	])

	protected GetTotalConstantBlock(_params?: IModifierParams): [number, boolean] {
		return [this.cachedShiled - this.NetworkArmor, false]
	}

	protected GetStatusResistanceStacking(): [number, boolean] {
		return [this.cachedStatusResist, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "tinker_defense_matrix"
		this.cachedShiled = this.GetSpecialValue("damage_absorb", name)
		this.cachedStatusResist = this.GetSpecialValue("status_resistance", name)
	}
}
