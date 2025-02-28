import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_meepo_divided_we_stand_support_group
	extends Modifier
	implements IBuff
{
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedArmor = 0
	private cachedAttackSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_PERCENTAGE,
			this.GeAttackSpeedPercentage.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [this.cachedArmor, false]
	}
	protected GeAttackSpeedPercentage(): [number, boolean] {
		return [this.cachedAttackSpeed, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "meepo_divided_we_stand"
		this.cachedArmor = this.GetSpecialValue("support_group_armor", name)
		this.cachedAttackSpeed = this.GetSpecialValue(
			"support_group_attack_speed_pct",
			name
		)
	}
}
