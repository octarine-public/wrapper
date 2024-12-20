import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_infused_raindrop extends Modifier {
	private cachedMinDamage = 0
	private cachedBlockDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_RAW_MAGICAL_CONSTANT_BLOCK,
			this.GetMagicalConstantBlock.bind(this)
		]
	])

	protected GetMagicalConstantBlock(params?: IModifierParams): [number, boolean] {
		if (params === undefined || params.RawDamage === undefined) {
			return [0, false]
		}
		const ability = this.Ability
		if (ability === undefined || !ability.IsReady) {
			return [0, false]
		}
		if (params.RawDamage < this.cachedMinDamage) {
			return [0, false]
		}
		return [this.cachedBlockDamage, false]
	}

	protected UpdateSpecialValues() {
		const name = "item_infused_raindrop"
		this.cachedMinDamage = this.GetSpecialValue("min_damage", name)
		this.cachedBlockDamage = this.GetSpecialValue("magic_damage_block", name)
	}
}
