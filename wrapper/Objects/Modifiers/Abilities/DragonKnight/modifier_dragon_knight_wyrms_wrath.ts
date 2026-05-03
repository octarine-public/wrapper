import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_dragon_knight_wyrms_wrath extends Modifier {
	private cachedDamage = 0
	private cachedAOERadius = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_AOE_BONUS_CONSTANT,
			this.GetAOEBounusConstant.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_MAGICAL,
			this.GetProcAttackBonusDamageMagical.bind(this)
		]
	])
	protected GetAOEBounusConstant(): [number, boolean] {
		return [this.cachedAOERadius, false]
	}
	protected GetProcAttackBonusDamageMagical(
		params?: IModifierParams
	): [number, boolean] {
		if (params === undefined) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || target.IsBuilding) {
			return [0, false]
		}
		if ((target.IsHero && target.IsCreep) || !target.IsEnemy(this.Caster)) {
			return [0, false]
		}
		return [this.cachedDamage, false]
	}
	protected UpdateSpecialValues() {
		const name = "dragon_knight_wyrms_wrath"
		this.cachedDamage = this.GetSpecialValue("magic_damage", name)
		this.cachedAOERadius = this.GetSpecialValue("bonus_aoe", name)
	}
}
