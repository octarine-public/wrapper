import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_skeleton_king_mortal_strike extends Modifier {
	private cachedCritDamage = 0
	private cachedCritDamageValue = 0
	private cachedCritDamageBonus = 0
	private cachedCanCrit = false

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_CRITICAL_STRIKE_BONUS,
			this.GetCriticalStrikeBonus.bind(this)
		]
	])

	public get ForceVisible(): boolean {
		return this.cachedCanCrit
	}
	public PostDataUpdate(): void {
		const owner = this.Parent,
			abil = this.Ability
		if (owner === undefined || abil === undefined) {
			this.cachedCritDamageBonus = 0
			return
		}
		const isDisabled = this.IsPassiveDisabled() || this.IsSuppressCrit(),
			canCrit = abil.IsReady && !isDisabled
		if (this.cachedCanCrit !== canCrit) {
			this.cachedCanCrit = canCrit
			this.Update(true)
		}
		const hasScepterBuff = owner.HasBuffByName(
			"modifier_skeleton_king_reincarnation_scepter_active"
		)
		this.cachedCritDamageBonus = hasScepterBuff ? this.cachedCritDamageValue : 0
	}

	protected GetCriticalStrikeBonus(params?: IModifierParams): [number, boolean] {
		if (params === undefined) {
			return [0, false]
		}
		if (this.IsPassiveDisabled() || this.IsSuppressCrit()) {
			return [0, false]
		}
		const ability = this.Ability,
			target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || ability === undefined || !ability.IsReady) {
			return [0, false]
		}
		if (target.IsBuilding || !target.IsEnemy(this.Caster)) {
			return [0, false]
		}
		return [this.cachedCritDamage + this.cachedCritDamageBonus, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "skeleton_king_mortal_strike"
		this.cachedCritDamage = this.GetSpecialValue("crit_mult", name)
		this.cachedCritDamageValue = this.GetSpecialValue("wraith_crit_bonus", name)
	}
}
