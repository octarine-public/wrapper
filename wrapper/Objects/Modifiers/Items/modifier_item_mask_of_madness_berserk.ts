import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_mask_of_madness_berserk
	extends Modifier
	implements IBuff, IDisable
{
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
	public readonly DebuffModifierName = this.Name

	private cachedSpeed = 0
	private cachedArmor = 0
	private cachedAttackSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT,
			this.GetMoveSpeedBonusConstant.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	public IsDisable(): this is IDisable {
		return true
	}
	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [-this.cachedArmor, false]
	}
	protected GetMoveSpeedBonusConstant(): [number, boolean] {
		return [this.cachedSpeed, false]
	}
	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed, false]
	}
	protected UpdateSpecialValues() {
		const name = "item_mask_of_madness"
		this.cachedArmor = this.GetSpecialValue("berserk_armor_reduction", name)
		this.cachedSpeed = this.GetSpecialValue("berserk_bonus_movement_speed", name)
		this.cachedAttackSpeed = this.GetSpecialValue("berserk_bonus_attack_speed", name)
	}
}
