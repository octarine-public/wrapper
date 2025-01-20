import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"
import { modifier_ursa_maul } from "./modifier_ursa_maul"

@WrapperClassModifier()
export class modifier_ursa_fury_swipes_damage_increase
	extends Modifier
	implements IDebuff
{
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedDamagePerStack = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_TARGET,
			this.GetPreAttackIncomingDamageBonus.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return this.StackCount !== 0
	}
	public Remove(): boolean {
		if (!super.Remove()) {
			return false
		}
		this.UpdateMaulDamage(false)
		return true
	}
	protected AddModifier(): boolean {
		if (!super.AddModifier()) {
			return false
		}
		this.UpdateMaulDamage(true)
		return true
	}
	protected GetPreAttackIncomingDamageBonus(
		params?: IModifierParams
	): [number, boolean] {
		const caster = this.Caster
		if (params === undefined || caster === undefined) {
			return [0, false]
		}
		const source = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (source === undefined || source !== caster) {
			return [0, false]
		}
		let stackCount = this.StackCount
		if (!this.IsPassiveDisabled(caster)) {
			stackCount++
		}
		return [this.cachedDamagePerStack * stackCount, false]
	}
	protected UpdateSpecialValues() {
		this.cachedDamagePerStack = this.GetSpecialValue(
			"damage_per_stack",
			"ursa_fury_swipes"
		)
	}
	protected UpdateMaulDamage(state: boolean) {
		const modifier = this.Caster?.GetBuffByClass(modifier_ursa_maul)
		if (modifier !== undefined) {
			modifier.HasFurrySwipes = state
			modifier.ForceUpdateSpecialValues()
		}
	}
}
