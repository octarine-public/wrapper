import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { GameActivity } from "../../../../Enums/GameActivity"
import { EntityManager } from "../../../../Managers/EntityManager"
import { kunkka_tidebringer } from "../../../../Objects/Abilities/Kunkka/kunkka_tidebringer"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_kunkka_tidebringer extends Modifier {
	private hasAnimated = false
	private cachedBonusDamage = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])

	public PostDataUpdate(): void {
		const owner = this.Parent,
			activity = owner?.NetworkActivity
		if (owner === undefined || activity !== GameActivity.ACT_DOTA_ATTACK) {
			this.hasAnimated = false
			return
		}
		if (owner.Target === undefined || !owner.Target.IsUnit) {
			this.hasAnimated = false
			return
		}
		const ability = this.Ability
		if (!(ability instanceof kunkka_tidebringer) || ability.IsAutoCastEnabled) {
			this.hasAnimated = false
			return
		}
		const animation = owner.GetAnimation(
			owner.NetworkActivity,
			owner.NetworkSequenceIndex,
			false
		)
		if (animation === undefined) {
			this.hasAnimated = false
			return
		}
		for (let i = animation.activities.length - 1; i > -1; i--) {
			const animationActivity = animation.activities[i]
			if (animationActivity.name === "tidebringer") {
				this.hasAnimated = true
				break
			}
		}
	}

	protected GetPreAttackBonusDamage(params?: IModifierParams): [number, boolean] {
		const ability = this.Ability
		if (params === undefined || !(ability instanceof kunkka_tidebringer)) {
			return [0, false]
		}
		const owner = this.Parent
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (owner === undefined || target === undefined || target.IsBuilding) {
			return [0, false]
		}
		if (!ability.IsAutoCastEnabled && !this.hasAnimated) {
			return [0, false]
		}
		return [this.cachedBonusDamage, false]
	}

	protected UpdateSpecialValues() {
		this.cachedBonusDamage = this.GetSpecialValue(
			"damage_bonus",
			"kunkka_tidebringer"
		)
	}
}
