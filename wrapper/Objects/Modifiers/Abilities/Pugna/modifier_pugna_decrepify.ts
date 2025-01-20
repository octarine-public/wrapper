import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_pugna_decrepify
	extends Modifier
	implements IDebuff, IBuff, IShield
{
	public readonly IsGhost = true
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
	public readonly ShieldModifierName = this.Name
	public readonly DebuffModifierName = this.Name

	private cachedMres = 0
	private cachedSpeed = 0
	private cachedSpeedAlly = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_DECREPIFY_UNIQUE,
			this.GetMagicalResistanceDecrepifyUnique.bind(this)
		]
	])

	public IsBuff(): this is IBuff {
		return !(this.Parent?.IsEnemy(this.Caster) ?? false)
	}
	public IsDebuff(): this is IDebuff {
		return !this.IsBuff()
	}
	public IsShield(): this is IShield {
		return true
	}
	protected GetMagicalResistanceDecrepifyUnique(): [number, boolean] {
		return this.IsDebuff() ? [this.cachedMres, this.IsMagicImmune()] : [0, false]
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		const isEnemy = this.Parent?.IsEnemy(this.Caster) ?? false
		return !isEnemy
			? [this.cachedSpeedAlly, false]
			: [this.cachedSpeed, this.IsMagicImmune()]
	}
	protected UpdateSpecialValues(): void {
		const name = "pugna_decrepify"
		this.cachedMres = this.GetSpecialValue("bonus_spell_damage_pct", name)
		this.cachedSpeed = this.GetSpecialValue("bonus_movement_speed", name)
		this.cachedSpeedAlly = this.GetSpecialValue("bonus_movement_speed_allies", name)
	}
}
