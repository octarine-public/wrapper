import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_viper_poison_attack_slow extends Modifier implements IDebuff {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedMres = 0
	private cachedSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
			this.GetMagicalResistanceBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return this.StackCount !== 0
	}
	protected GetMagicalResistanceBonus(): [number, boolean] {
		return [-(this.cachedMres * this.StackCount), this.IsMagicImmune()]
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [-(this.cachedSpeed * this.StackCount), this.IsMagicImmune()]
	}
	protected UpdateSpecialValues(): void {
		const name = "viper_poison_attack"
		this.cachedMres = this.GetSpecialValue("magic_resistance", name)
		this.cachedSpeed = this.GetSpecialValue("movement_speed", name)
	}
}
