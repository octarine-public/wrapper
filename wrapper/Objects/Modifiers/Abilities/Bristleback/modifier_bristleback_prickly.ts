import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_bristleback_prickly extends Modifier {
	private cachedAngle = 0
	private cachedOutgoingDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE,
			this.GetDamageOutgoingPercentage.bind(this)
		]
	])

	protected GetDamageOutgoingPercentage(params?: IModifierParams): [number, boolean] {
		if (params === undefined || this.IsPassiveDisabled()) {
			return [0, false]
		}
		const owner = this.Parent
		const target = EntityManager.EntityByIndex(params.SourceIndex)
		if (owner === undefined || target === undefined) {
			return [0, false]
		}
		const angle = -owner.GetSourceAngleToForward(target, false, owner.Position)
		return angle > Math.cos(this.cachedAngle)
			? [this.cachedOutgoingDamage, false]
			: [0, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "bristleback_prickly"
		this.cachedOutgoingDamage = this.GetSpecialValue("amp_pct", name)
		this.cachedAngle = Math.degreesToRadian(this.GetSpecialValue("angle", name))
	}
}
