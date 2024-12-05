import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_warlock_rain_of_chaos_golem extends Modifier {
	private cachedArmor = 0
	private cachedSlowResist = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_SLOW_RESISTANCE_STACKING,
			this.GetSlowResistanceStacking.bind(this)
		]
	])

	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [this.cachedArmor, false]
	}

	protected GetSlowResistanceStacking(): [number, boolean] {
		return [this.cachedSlowResist, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "warlock_rain_of_chaos"
		this.cachedArmor = this.GetSpecialValue("bonus_armor", name)
		this.cachedSlowResist = this.GetSpecialValue("bonus_slow_resistance", name)
	}
}
