import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { kez_ravens_veil } from "../../../Abilities/Kez/kez_ravens_veil"
import { kez_shodo_sai } from "../../../Abilities/Kez/kez_shodo_sai"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_kez_shodo_sai_mark extends Modifier implements IDebuff {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedSpeed = 0
	private cachedBaseCrit = 0
	private cachedBonusCrit = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_TARGET_CRITICALSTRIKE,
			this.GetPreAttackTargetCriticalStrike.bind(this)
		]
	])

	public get CritDamageBonus() {
		return (this.cachedBaseCrit + this.cachedBonusCrit) / 100
	}
	public IsDebuff(): this is IDebuff {
		return true
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [-this.cachedSpeed, this.IsMagicImmune()]
	}
	protected GetPreAttackTargetCriticalStrike(
		params?: IModifierParams
	): [number, boolean] {
		if (params === undefined) {
			return [0, false]
		}
		const source = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (source === undefined || source !== this.Caster) {
			return [0, false]
		}
		return [this.cachedBaseCrit + this.cachedBonusCrit, false]
	}
	protected UpdateSpecialValues(): void {
		if (this.Ability instanceof kez_shodo_sai) {
			// if used parry
			const name = this.Ability.Name
			this.cachedSpeed = this.GetSpecialValue("vuln_slow", name)
			this.cachedBaseCrit = this.GetSpecialValue("base_crit_pct", name)
			this.cachedBonusCrit = this.GetSpecialValue("parry_bonus_crit", name)
		}
		if (this.Ability instanceof kez_ravens_veil) {
			const sai = this.Caster?.GetAbilityByClass(kez_shodo_sai)
			this.cachedSpeed = sai?.GetSpecialValue("vuln_slow") ?? 0
			this.cachedBaseCrit = sai?.GetSpecialValue("base_crit_pct") ?? 0
		}
	}
}
