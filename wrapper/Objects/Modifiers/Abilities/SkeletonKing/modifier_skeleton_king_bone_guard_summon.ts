import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_skeleton_king_bone_guard_summon extends Modifier {
	private cachedDamageHero = 0
	private cachedDamageBuilding = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])

	protected GetPreAttackBonusDamage(params?: IModifierParams): [number, boolean] {
		if (params === undefined || params.RawDamageBase === undefined) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined) {
			return [0, false]
		}
		let multiplier = 0
		if (target.IsHero) {
			multiplier = this.cachedDamageHero / 100
		} else if (target.IsBuilding) {
			multiplier = this.cachedDamageBuilding / -100
		}
		return [params.RawDamageBase * multiplier, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "skeleton_king_bone_guard_summon"
		this.cachedDamageHero = this.GetSpecialValue("skeleton_bonus_hero_damage", name)
		this.cachedDamageBuilding = this.GetSpecialValue(
			"skeleton_building_damage_reduction",
			name
		)
	}
}
