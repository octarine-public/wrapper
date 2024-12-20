import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_abyssal_blade extends Modifier {
	private cachedAttackDamage = 0
	private cachedBlockDamageMelee = 0
	private cachedBlockDamageRanged = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_CONSTANT_BLOCK,
			this.GetPhysicalConstantBlock.bind(this)
		]
	])

	protected GetPreAttackBonusDamage(): [number, boolean] {
		return [this.cachedAttackDamage, false]
	}

	protected GetPhysicalConstantBlock(): [number, boolean] {
		const isRanged = this.Parent?.IsRanged ?? false
		const value = isRanged
			? this.cachedBlockDamageRanged
			: this.cachedBlockDamageMelee
		return [value, false]
	}

	protected UpdateSpecialValues() {
		const name = "item_abyssal_blade"
		this.cachedAttackDamage = this.GetSpecialValue("bonus_damage", name)
		this.cachedBlockDamageMelee = this.GetSpecialValue("block_damage_melee", name)
		this.cachedBlockDamageRanged = this.GetSpecialValue("block_damage_ranged", name)
	}
}
