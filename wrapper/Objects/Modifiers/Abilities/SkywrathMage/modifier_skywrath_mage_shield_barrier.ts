import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_skywrath_mage_shield_barrier extends Modifier {
	public readonly HasVisualShield = true

	private cachedBaseShield = 0
	private cachedShieldPerLvl = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_CONSTANT_BLOCK,
			this.GetMagicalConstantBlock.bind(this)
		]
	])

	protected GetMagicalConstantBlock(_params?: IModifierParams): [number, boolean] {
		const owner = this.Parent
		if (owner === undefined) {
			return [0, false]
		}
		const perLvl = this.cachedShieldPerLvl * owner.Level,
			value = (this.cachedBaseShield + perLvl) * this.StackCount
		return [value - this.NetworkArmor, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "skywrath_mage_shield_of_the_scion"
		this.cachedBaseShield = this.GetSpecialValue("damage_barrier_base", name)
		this.cachedShieldPerLvl = this.GetSpecialValue("damage_barrier_per_level", name)
	}
}
