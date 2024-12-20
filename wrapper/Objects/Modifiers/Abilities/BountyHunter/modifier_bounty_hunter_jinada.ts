import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { GameActivity } from "../../../../Enums/GameActivity"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_bounty_hunter_jinada extends Modifier {
	public IsAnimation = false
	public CachedDamage = 0

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
		if (owner === undefined || activity !== GameActivity.ACT_DOTA_ATTACK_EVENT) {
			this.IsAnimation = false
			return
		}
		const ability = this.Ability
		if (ability === undefined || ability.IsAutoCastEnabled) {
			this.IsAnimation = false
			return
		}
		if (owner.Target === undefined || !owner.Target.IsUnit) {
			this.IsAnimation = false
			return
		}
		const animation = owner.GetAnimation(activity, owner.NetworkSequenceIndex, false)
		if (animation === undefined) {
			this.IsAnimation = false
			return
		}
		this.IsAnimation =
			animation.name === "attack_jinada_anim" ||
			animation.name === "attack_jinada_alt_anim"
	}

	protected GetPreAttackBonusDamage(params?: IModifierParams): [number, boolean] {
		if (params === undefined) {
			return [0, false]
		}
		const ability = this.Ability,
			target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || !target.IsEnemy(this.Parent)) {
			return [0, false]
		}
		if (ability === undefined || !ability.IsReady) {
			return [0, false]
		}
		return ability.IsAutoCastEnabled || this.IsAnimation
			? [this.CachedDamage, false]
			: [0, false]
	}

	protected UpdateSpecialValues(): void {
		this.CachedDamage = this.GetSpecialValue("bonus_damage", "bounty_hunter_jinada")
	}
}
