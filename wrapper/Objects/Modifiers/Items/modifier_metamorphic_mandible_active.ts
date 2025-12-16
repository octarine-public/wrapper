import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_metamorphic_mandible_active extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedMres = 0
	private cachedArmor = 0
	private cachedSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
			this.GetMagicResistBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS_PERCENTAGE_POST,
			this.GetPhysicalArmorBonusPercentagePost.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetMagicResistBonus(): [number, boolean] {
		return [this.cachedMres, false]
	}
	protected GetPhysicalArmorBonusPercentagePost(): [number, boolean] {
		return [-this.cachedArmor, false]
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, false]
	}
	protected UpdateSpecialValues() {
		const name = "item_metamorphic_mandible"
		this.cachedArmor = this.GetSpecialValue("armor_decrease", name)
		this.cachedSpeed = this.GetSpecialValue("bonus_movespeed", name)
		this.cachedMres = this.GetSpecialValue("bonus_magic_resistance", name)
	}
}
