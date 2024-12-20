import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_bristleback_bristleback extends Modifier {
	private cachedSideAng = 0
	private cachedBackAng = 0

	private cachedBackIncomingDmg = 0
	private cachedSideIncomingDmg = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,
			this.GetIncomingDamagePercentage.bind(this)
		]
	])

	protected GetIncomingDamagePercentage(params?: IModifierParams): [number, boolean] {
		if (params === undefined || this.IsPassiveDisabled()) {
			return [0, false]
		}
		const owner = this.Parent,
			target = EntityManager.EntityByIndex(params.SourceIndex)
		if (target === undefined || owner === undefined) {
			return [0, false]
		}
		const angle = -owner.GetSourceAngleToForward(target, false, owner.Position)
		if (angle > Math.cos(this.cachedBackAng)) {
			return [-this.cachedBackIncomingDmg, false]
		}
		if (angle > Math.cos(this.cachedSideAng)) {
			return [-this.cachedSideIncomingDmg, false]
		}
		return [0, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "bristleback_bristleback"
		this.cachedSideIncomingDmg = this.GetSpecialValue("side_damage_reduction", name)
		this.cachedBackIncomingDmg = this.GetSpecialValue("back_damage_reduction", name)
		this.cachedSideAng = Math.degreesToRadian(
			this.GetSpecialValue("side_angle", name)
		)
		this.cachedBackAng = Math.degreesToRadian(
			this.GetSpecialValue("back_angle", name)
		)
	}
}
