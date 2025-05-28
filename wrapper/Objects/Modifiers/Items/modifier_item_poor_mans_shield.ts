import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_poor_mans_shield extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedBlockMelee = 0
	private cachedBlockRange = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_CONSTANT_BLOCK,
			this.GetPhysicalConstantBlockSpecial.bind(this)
		]
	])
	protected GetPhysicalConstantBlockSpecial(): [number, boolean] {
		const value = this.Parent?.IsRanged
			? this.cachedBlockRange
			: this.cachedBlockMelee
		return [value, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "item_poor_mans_shield"
		this.cachedBlockMelee = this.GetSpecialValue("damage_block_melee", name)
		this.cachedBlockRange = this.GetSpecialValue("damage_block_ranged", name)
	}
}
