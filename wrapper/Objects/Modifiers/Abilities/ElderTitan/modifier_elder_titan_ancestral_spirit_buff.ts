import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_elder_titan_ancestral_spirit_buff
	extends Modifier
	implements IBuff
{
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	public IsBuff(): this is IBuff {
		return true
	}

	protected GetPreAttackBonusDamage(): [number, boolean] {
		return [this.NetworkDamage, false]
	}

	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [this.NetworkArmor, false]
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.NetworkChannelTime, false]
	}
}
