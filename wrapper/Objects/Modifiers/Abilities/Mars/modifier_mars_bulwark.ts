import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_mars_bulwark extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedSideAng = 0
	private cachedForwardAng = 0

	private cachedSideIncomingDmg = 0
	private cachedForwardIncomingDmg = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_INCOMING_PHYSICAL_DAMAGE_PERCENTAGE,
			this.GetIncomingPhysicalDamagePercentage.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetIncomingPhysicalDamagePercentage(
		params?: IModifierParams
	): [number, boolean] {
		if (params === undefined || this.IsPassiveDisabled()) {
			return [0, false]
		}
		const owner = this.Parent,
			target = EntityManager.EntityByIndex(params.SourceIndex)
		if (target === undefined || owner === undefined) {
			return [0, false]
		}
		const angle = owner.GetSourceAngleToForward(target, false, owner.Position)
		if (angle >= Math.cos(this.cachedForwardAng / 2)) {
			return [-this.cachedForwardIncomingDmg, false]
		}
		if (angle >= Math.cos(this.cachedSideAng / 2)) {
			return [-this.cachedSideIncomingDmg, false]
		}
		return [0, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "mars_bulwark"
		this.cachedSideIncomingDmg = this.GetSpecialValue(
			"physical_damage_reduction_side",
			name
		)
		this.cachedForwardIncomingDmg = this.GetSpecialValue(
			"physical_damage_reduction",
			name
		)
		this.cachedSideAng = Math.degreesToRadian(
			this.GetSpecialValue("side_angle", name)
		)
		this.cachedForwardAng = Math.degreesToRadian(
			this.GetSpecialValue("forward_angle", name)
		)
	}
}
