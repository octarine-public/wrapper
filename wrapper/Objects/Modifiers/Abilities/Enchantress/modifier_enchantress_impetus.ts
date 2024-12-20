import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_enchantress_impetus extends Modifier {
	private cachedMultiplier = 0
	private cachedDistanceCap = 0
	private cachedDistanceDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_PURE,
			this.GetPreAttackBonusDamagePure.bind(this)
		]
	])

	protected GetPreAttackBonusDamagePure(params?: IModifierParams): [number, boolean] {
		if (params === undefined) {
			return [0, false]
		}
		const owner = this.Parent
		const isEnabled = this.Ability?.IsAutoCastEnabled ?? false,
			isReady = this.Ability?.IsReady ?? false
		if (owner === undefined || !isEnabled || !isReady) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || target.IsBuilding || !target.IsEnemy(this.Parent)) {
			return [0, false]
		}
		const distanceCap = this.cachedDistanceCap,
			distance2D = Math.min(owner.Distance2D(target), distanceCap)
		let damage = (distance2D * this.cachedDistanceDamage) / 100
		if (target.IsCreep || target.IsIllusion) {
			damage *= this.cachedMultiplier
		}
		return [damage, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "enchantress_impetus"
		this.cachedMultiplier = this.GetSpecialValue("creep_multiplier", name)
		this.cachedDistanceCap = this.GetSpecialValue("distance_cap", name)
		this.cachedDistanceDamage = this.GetSpecialValue("distance_damage_pct", name)
	}
}
