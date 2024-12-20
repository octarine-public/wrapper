import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"
import { modifier_antimage_empowered_mana_break } from "./modifier_antimage_empowered_mana_break"

@WrapperClassModifier()
export class modifier_antimage_mana_break extends Modifier {
	private cachedDamage = 0
	private cachedMaxBurn = 0
	private cachedManaBurnDamage = 0
	private CachedBonusManaBurn = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])

	public PostDataUpdate(): void {
		const owner = this.Parent
		if (owner === undefined) {
			this.CachedBonusManaBurn = 0
			return
		}
		const modifier = owner.GetBuffByClass(modifier_antimage_empowered_mana_break)
		if (modifier === undefined) {
			this.CachedBonusManaBurn = 0
			return
		}
		this.CachedBonusManaBurn = modifier.CachedBonusManaBurn
	}

	protected GetPreAttackBonusDamage(params?: IModifierParams): [number, boolean] {
		if (params === undefined || this.IsPassiveDisabled()) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || target.MaxMana <= 0 || !target.IsEnemy(this.Parent)) {
			return [0, false]
		}
		if (target.IsMagicImmune || target.IsDebuffImmune) {
			return [0, false]
		}
		const baseDamage = this.cachedDamage,
			maxBurn = this.cachedMaxBurn + this.CachedBonusManaBurn,
			damage = baseDamage + (target.MaxMana * maxBurn) / 100
		return [damage * (1 - this.cachedManaBurnDamage / 100), false]
	}

	protected UpdateSpecialValues() {
		const name = "antimage_mana_break"
		this.cachedDamage = this.GetSpecialValue("mana_per_hit", name)
		this.cachedMaxBurn = this.GetSpecialValue("mana_per_hit_pct", name)
		this.cachedManaBurnDamage = this.GetSpecialValue("percent_damage_per_burn", name)
	}
}
