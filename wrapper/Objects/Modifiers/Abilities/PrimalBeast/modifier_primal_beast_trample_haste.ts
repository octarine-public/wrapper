import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_primal_beast_trample_haste extends Modifier {
	private isActive = false
	private cachedSpeed = 0
	private cachedSpeedSelf = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	public PostDataUpdate(): void {
		const name = "modifier_primal_beast_trample"
		this.isActive = this.Caster?.HasBuffByName(name) ?? false
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		if (!this.isActive) {
			return [0, false]
		}
		return this.Parent !== this.Caster
			? [this.cachedSpeed, false]
			: [this.cachedSpeedSelf, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "primal_beast_trample"
		this.cachedSpeed = this.GetSpecialValue("bonus_movespeed_pct_allies", name)
		this.cachedSpeedSelf = this.GetSpecialValue("bonus_movespeed_pct_self", name)
	}
}
