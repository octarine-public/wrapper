import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_magnataur_empower extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedDamage = 0
	private cachedMultiplier = 0
	private multiplierPerStack = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_PERCENTAGE,
			this.GetPreAttackBonusDamagePercentage.bind(this)
		]
	])

	public PostDataUpdate(): void {
		const owner = this.Parent
		if (owner === undefined) {
			this.multiplierPerStack = 0
			return
		}
		const modifier = owner.GetBuffByName("modifier_magnataur_empower_stack_counter")
		this.multiplierPerStack = modifier?.StackCount ?? 0
	}

	public IsBuff(): this is IBuff {
		return true
	}
	protected GetPreAttackBonusDamagePercentage(
		_params?: IModifierParams
	): [number, boolean] {
		const owner = this.Parent,
			caster = this.Caster
		if (owner === undefined || caster === undefined) {
			return [0, false]
		}
		if (owner !== caster) {
			return [this.cachedDamage, false]
		}
		const mul = 1 + (this.cachedMultiplier + this.multiplierPerStack) / 100
		return [this.cachedDamage * mul, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "magnataur_empower"
		this.cachedDamage = this.GetSpecialValue("bonus_damage_pct", name)
		this.cachedMultiplier = this.GetSpecialValue("self_multiplier", name)
	}
}
