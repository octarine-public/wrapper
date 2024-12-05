import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_vanguard extends Modifier {
	private blockDamageMelee = 0
	private blockDamageRanged = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_CONSTANT_BLOCK,
			this.GetPhysicalConstantBlock.bind(this)
		]
	])

	protected GetPhysicalConstantBlock(): [number, boolean] {
		const isRanged = this.Parent?.IsRanged ?? false
		return [isRanged ? this.blockDamageRanged : this.blockDamageMelee, false]
	}

	protected UpdateSpecialValues() {
		const name = "item_vanguard"
		this.blockDamageMelee = this.GetSpecialValue("block_damage_melee", name)
		this.blockDamageRanged = this.GetSpecialValue("block_damage_ranged", name)
	}
}
