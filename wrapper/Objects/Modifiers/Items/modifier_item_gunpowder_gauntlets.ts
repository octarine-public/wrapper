import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { EntityManager } from "../../../Managers/EntityManager"
import { Modifier } from "../../Base/Modifier"
import { Unit } from "../../Base/Unit"

@WrapperClassModifier()
export class modifier_item_gunpowder_gauntlets extends Modifier {
	private cachedDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_MAGICAL,
			this.GetProcAttackBonusDamageMagical.bind(this)
		]
	])
	protected GetProcAttackBonusDamageMagical(
		params?: IModifierParams
	): [number, boolean] {
		if (params === undefined) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || target.IsBuilding || !target.IsEnemy(this.Caster)) {
			return [0, false]
		}
		return [this.Ability?.IsCooldownReady ? this.cachedDamage : 0, false]
	}
	protected UpdateSpecialValues() {
		this.cachedDamage = this.GetSpecialValue(
			"bonus_damage",
			"item_gunpowder_gauntlets"
		)
	}
}
