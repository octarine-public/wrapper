import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_phantom_assassin_mark_of_death
	extends Modifier
	implements IBuff, IDebuff
{
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
	public readonly DebuffModifierName = this.Name

	private cachedCritDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_CRITICAL_STRIKE_BONUS,
			this.GetCriticalStrikeBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_TARGET_CRITICALSTRIKE,
			this.GetCriticalStrikeBonusTarget.bind(this)
		]
	])
	public get ForceVisible(): boolean {
		return true
	}
	public IsBuff(): this is IBuff {
		return !this.IsDebuff()
	}
	public IsDebuff(): this is IDebuff {
		return this.Parent?.IsEnemy(this.Caster) ?? false
	}
	public GetCriticalStrikeBonusTarget(params?: IModifierParams): [number, boolean] {
		const owner = this.Parent
		if (params === undefined || owner === undefined || owner === this.Caster) {
			return [0, false]
		}
		return [this.getDamage(params), false]
	}
	protected GetCriticalStrikeBonus(params?: IModifierParams): [number, boolean] {
		const owner = this.Parent
		if (params === undefined || owner === undefined || owner !== this.Caster) {
			return [0, false]
		}
		return [this.getDamage(params), false]
	}
	protected UpdateSpecialValues() {
		this.cachedCritDamage = this.GetSpecialValue(
			"crit_bonus",
			"phantom_assassin_coup_de_grace"
		)
	}

	private getDamage(params: IModifierParams) {
		if (this.IsPassiveDisabled(this.Caster) || this.IsSuppressCrit(this.Caster)) {
			return 0
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || target.IsBuilding) {
			return 0
		}
		return this.cachedCritDamage
	}
}
