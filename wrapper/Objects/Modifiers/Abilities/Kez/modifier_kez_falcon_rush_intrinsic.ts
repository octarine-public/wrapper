import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_kez_falcon_rush_intrinsic extends Modifier {
	protected cachedAttackRate = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_FIXED_ATTACK_RATE,
			this.GetFixedAttackRate.bind(this)
		]
	])

	public PostDataUpdate(): void {
		const owner = this.Parent
		if (owner === undefined || !owner.HasBuffByName("modifier_kez_falcon_rush")) {
			this.cachedAttackRate = 0
			return
		}
		this.cachedAttackRate = this.NetworkFadeTime
	}

	protected GetFixedAttackRate(): [number, boolean] {
		return [this.cachedAttackRate, false]
	}
}
