import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_broodmother_incapacitating_bite_orb
	extends Modifier
	implements IDebuff
{
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedSpeed = 0
	private cachedDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_TARGET,
			this.GetPreAttackBonusDamagePercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return true
	}
	protected GetPreAttackBonusDamagePercentage(): [number, boolean] {
		const target = this.Parent
		if (target === undefined || !target.IsEnemy(this.Caster)) {
			return [0, false]
		}
		return [this.cachedDamage, this.IsMagicImmune()]
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, this.IsMagicImmune()]
	}
	protected UpdateSpecialValues(): void {
		const name = "broodmother_incapacitating_bite"
		this.cachedSpeed = this.GetSpecialValue("bonus_movespeed", name)
		this.cachedDamage = this.GetSpecialValue("attack_damage", name)
	}
}
