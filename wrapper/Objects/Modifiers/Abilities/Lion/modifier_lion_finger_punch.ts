import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lion_finger_punch extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedRange = 0
	private cachedBaseDamage = 0
	private cachedPerStackDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MAX_ATTACK_RANGE,
			this.GetMaxAttackRange.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetMaxAttackRange(): [number, boolean] {
		return [this.cachedRange, false]
	}
	protected GetPreAttackBonusDamage(_params?: IModifierParams): [number, boolean] {
		const owner = this.Parent
		if (owner === undefined) {
			return [0, false]
		}
		const damage = this.cachedBaseDamage
		const counter = owner.GetBuffByName("modifier_lion_finger_of_death_kill_counter")
		if (counter === undefined || counter.StackCount === 0) {
			return [damage, false]
		}
		return [damage + counter.StackCount * this.cachedPerStackDamage, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "lion_finger_of_death"
		this.cachedRange = this.GetSpecialValue("punch_attack_range", name)
		this.cachedBaseDamage = this.GetSpecialValue("punch_bonus_damage_base", name)
		this.cachedPerStackDamage = this.GetSpecialValue(
			"punch_bonus_damage_per_stack",
			name
		)
	}
}
