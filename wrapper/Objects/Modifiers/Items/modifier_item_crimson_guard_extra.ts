import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_crimson_guard_extra extends Modifier {
	private cachedblockDamage = 0
	private cachedMaxHPBlock = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_CONSTANT_BLOCK,
			this.GetPhysicalConstantBlock.bind(this)
		]
	])

	protected GetPhysicalConstantBlock(): [number, boolean] {
		const maxHP = this.Caster?.MaxHP ?? 0
		const additionalBlock = maxHP * (this.cachedMaxHPBlock / 100)
		return [this.cachedblockDamage + additionalBlock, false]
	}

	protected UpdateSpecialValues() {
		const name = "item_crimson_guard"
		this.cachedMaxHPBlock = this.GetSpecialValue("max_hp_pct", name)
		this.cachedblockDamage = this.GetSpecialValue("block_damage_active", name)
	}
}
