import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_lycan_summonwolves_hamstring_damageamp
	extends Modifier
	implements IDebuff
{
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_TARGET,
			this.GetPreAttackIncomingDamageBonus.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return this.StackCount !== 0
	}
	protected GetPreAttackIncomingDamageBonus(
		params?: IModifierParams
	): [number, boolean] {
		const caster = this.Caster
		if (params === undefined || caster === undefined) {
			return [0, false]
		}
		const source = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (source === undefined || this.StackCount === 0) {
			return [0, false]
		}
		if (!caster.IsControllableByPlayer(source.PlayerID)) {
			return [0, false]
		}
		return [this.cachedDamage, false]
	}
	protected UpdateSpecialValues() {
		this.cachedDamage = this.GetSpecialValue(
			"damage_boost",
			"lycan_summon_wolves_hamstring"
		)
	}
}
