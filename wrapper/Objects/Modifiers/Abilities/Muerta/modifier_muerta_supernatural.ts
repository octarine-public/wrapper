import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_muerta_supernatural extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PROCATTACK_CONVERT_PHYSICAL_TO_MAGICAL,
			this.GetProcAttackConvertPhysicalToMagical.bind(this)
		]
	])

	protected GetProcAttackConvertPhysicalToMagical(
		params?: IModifierParams
	): [number, boolean] {
		const owner = this.Parent
		if (owner === undefined) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params?.SourceIndex ?? 0)
		const canAttack = (target?.IsEthereal ?? false) || owner.IsEthereal
		return [canAttack ? 1 : 0, false]
	}
}
