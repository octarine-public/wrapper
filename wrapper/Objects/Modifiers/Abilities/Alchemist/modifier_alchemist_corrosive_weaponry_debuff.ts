import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_alchemist_corrosive_weaponry_debuff
	extends Modifier
	implements IDebuff
{
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedSpeed = 0
	private cachedDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])

	public IsDebuff(): this is IDebuff {
		return true
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [-(this.cachedSpeed * this.StackCount), this.IsMagicImmune()]
	}

	protected GetPreAttackBonusDamage(params?: IModifierParams): [number, boolean] {
		const damage = ((params?.RawDamageBase ?? 0) * this.cachedDamage) / 100
		return [-(damage * this.StackCount), this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		const name = "alchemist_corrosive_weaponry"
		this.cachedSpeed = this.GetSpecialValue("slow_per_stack", name)
		this.cachedDamage = this.GetSpecialValue("attack_damage_per_stack", name)
	}
}
