import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lion_mana_drain extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private cachedSpeed = 0
	private cachedSpeedAlly = 0

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		const isEnemy = this.Parent?.IsEnemy(this.Caster) ?? false
		return isEnemy
			? [-this.cachedSpeed, this.IsMagicImmune()]
			: [this.cachedSpeed * this.cachedSpeedAlly, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "lion_mana_drain"
		this.cachedSpeed = this.GetSpecialValue("movespeed", name)
		this.cachedSpeedAlly = this.GetSpecialValue("ally_pct", name) / 100
	}
}