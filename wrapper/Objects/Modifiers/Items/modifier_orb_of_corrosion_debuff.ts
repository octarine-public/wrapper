import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_orb_of_corrosion_debuff extends Modifier implements IDebuff {
	private static readonly modifiers = [
		"modifier_desolator_buff",
		"modifier_desolator_2_buff"
	]

	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private slowMelee = 0
	private slowRanged = 0
	private cachedArmor = 0
	private isDesolator = false

	protected readonly CanPostDataUpdate = true
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
	public PostDataUpdate(): void {
		this.isDesolator =
			this.Parent?.HasAnyBuffByNames(modifier_orb_of_corrosion_debuff.modifiers) ??
			false
	}
	protected GetPhysicalArmorBonus(): [number, boolean] {
		return !this.isDesolator && !this.IsMagicImmune()
			? [this.cachedArmor, false]
			: [0, false]
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [
			this.HasMeleeAttacksBonuses() ? this.slowMelee : this.slowRanged,
			this.IsMagicImmune()
		]
	}
	protected UpdateSpecialValues(): void {
		const name = "item_orb_of_corrosion"
		this.slowMelee = this.GetSpecialValue("slow_melee", name)
		this.slowRanged = this.GetSpecialValue("slow_ranged", name)
		this.cachedArmor = this.GetSpecialValue("corruption_armor", name)
		this.Parent?.GetBuffByName("modifier_orb_of_frost_debuff")?.Update(true)
	}
}
