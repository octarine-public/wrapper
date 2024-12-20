import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_ogre_magi_smash_buff extends Modifier {
	private cachedPreAttackDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PROCATTACK_INCOMING_DAMAGE_PERCENTAGE,
			this.GetProcAttackIncomingDamagePercentage.bind(this)
		]
	])

	protected GetProcAttackIncomingDamagePercentage(
		params?: IModifierParams
	): [number, boolean] {
		if (params === undefined) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || !target.IsHero) {
			return [0, false]
		}
		return [-this.cachedPreAttackDamage, false]
	}

	protected UpdateSpecialValues() {
		this.cachedPreAttackDamage = this.GetSpecialValue(
			"damage_absorb_pct",
			"ogre_magi_smash"
		)
	}
}
