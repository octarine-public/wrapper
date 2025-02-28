import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_dragon_knight_splash_attack extends Modifier {
	private cachedDamage = 0
	private cachedAOERadius = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_AOE_BONUS_CONSTANT_STACKING,
			this.GetAoeBonusConstantStacking.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_MAGICAL,
			this.GetProcAttackBonusDamageMagical.bind(this)
		]
	])
	protected GetAoeBonusConstantStacking(): [number, boolean] {
		return [this.cachedAOERadius, false]
	}
	protected GetProcAttackBonusDamageMagical(): [number, boolean] {
		return [this.cachedDamage, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "dragon_knight_dragon_blood"
		this.cachedDamage = this.GetSpecialValue("magic_damage", name)
		this.cachedAOERadius = this.GetSpecialValue("bonus_aoe", name)
	}
}
