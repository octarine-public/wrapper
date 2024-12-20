import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_spark_of_courage extends Modifier {
	private cachedArmor = 0
	private cachedDamage = 0
	private cachedHPTreshold = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		]
	])

	protected GetPreAttackBonusDamage(): [number, boolean] {
		const hpPercent = this.Parent?.HPPercent ?? 0
		return [hpPercent >= this.cachedHPTreshold ? this.cachedDamage : 0, false]
	}

	protected GetPhysicalArmorBonus(): [number, boolean] {
		const hpPercent = this.Parent?.HPPercent ?? 0
		return [hpPercent <= this.cachedHPTreshold ? this.cachedArmor : 0, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "item_spark_of_courage"
		this.cachedArmor = this.GetSpecialValue("armor", name)
		this.cachedDamage = this.GetSpecialValue("damage", name)
		this.cachedHPTreshold = this.GetSpecialValue("health_pct", name)
	}
}
