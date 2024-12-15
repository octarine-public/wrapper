import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_viper_nethertoxin extends Modifier {
	private cachedAttackSpeed = 0
	private cachedMaxDuration = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	public get EffMultiplier(): number {
		const maxDuration = this.Ability?.MaxDuration ?? this.cachedMaxDuration
		return Math.remapRange(this.ElapsedTime, 0, maxDuration, 0, 1)
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return this.Parent === this.Caster
			? [0, false]
			: [-this.cachedAttackSpeed, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		const name = "viper_nethertoxin"
		this.cachedAttackSpeed = this.GetSpecialValue("attack_slow", name)
		this.cachedMaxDuration = this.GetSpecialValue("max_duration", name)
	}
}
