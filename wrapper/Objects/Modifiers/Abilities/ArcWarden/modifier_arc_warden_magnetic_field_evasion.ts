import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_arc_warden_magnetic_field_evasion
	extends Modifier
	implements IBuff, IDebuff
{
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
	public readonly DebuffModifierName = this.Name

	private cachedSpeed = 0
	private cachedAttackSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return this.Parent?.IsEnemy(this.Caster) ?? false
	}
	public IsBuff(): this is IBuff {
		return !this.IsDebuff()
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return this.Parent === this.Caster
			? [0, false]
			: [-this.cachedSpeed, this.IsMagicImmune()]
	}
	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return this.Parent === this.Caster ? [this.cachedAttackSpeed, false] : [0, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "arc_warden_magnetic_field"
		this.cachedSpeed = this.GetSpecialValue("shard_slow_pct", name)
		this.cachedAttackSpeed = this.GetSpecialValue("attack_speed_bonus", name)
	}
}
