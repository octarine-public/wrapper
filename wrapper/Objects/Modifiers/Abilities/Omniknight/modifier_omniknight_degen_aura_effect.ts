import { WrapperClassModifier } from "../../../../Decorators"
import { EDOTASpecialBonusOperation } from "../../../../Enums/EDOTASpecialBonusOperation"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_omniknight_degen_aura_effect extends Modifier implements IDebuff {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,
			this.GetIncomingDamagePercentage.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return true
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		const caster = this.Caster
		if (caster === undefined || !this.NetworkAuraWithInRange) {
			return [0, false]
		}
		return [-this.cachedSpeed, this.IsPassiveDisabled(caster) || this.IsMagicImmune()]
	}
	protected GetIncomingDamagePercentage(): [number, boolean] {
		return [this.StackCount, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "omniknight_degen_aura",
			lvl = Math.max(this.Ability?.Level ?? this.AbilityLevel, 1)
		this.cachedSpeed = this.GetSpecialValue("speed_bonus", name, lvl, {
			lvlup: { operation: EDOTASpecialBonusOperation.SPECIAL_BONUS_ADD }
		})
	}
}
