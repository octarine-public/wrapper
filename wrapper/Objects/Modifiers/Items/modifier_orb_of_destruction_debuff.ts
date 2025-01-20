import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_orb_of_destruction_debuff extends Modifier implements IDebuff {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedArmor = 0
	private cachedSpeedMelee = 0
	private cachedSpeedRanged = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return true
	}
	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [-this.cachedArmor, this.IsMagicImmune()]
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		const caster = this.Caster
		if (caster === undefined) {
			return [0, false]
		}
		const value = this.HasMeleeAttacksBonuses(caster)
			? this.cachedSpeedMelee
			: this.cachedSpeedRanged
		return [-value, this.IsMagicImmune()]
	}
	protected UpdateSpecialValues(): void {
		const name = "item_orb_of_destruction"
		this.cachedArmor = this.GetSpecialValue("armor_reduction", name)
		this.cachedSpeedMelee = this.GetSpecialValue("slow_melee", name)
		this.cachedSpeedRanged = this.GetSpecialValue("slow_range", name)
	}
}
