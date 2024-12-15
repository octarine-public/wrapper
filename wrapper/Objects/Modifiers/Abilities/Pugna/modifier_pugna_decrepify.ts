import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_pugna_decrepify extends Modifier {
	public readonly IsGhost = true

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

	protected GetMagicalResistanceDecrepifyUnique(): [number, boolean] {
		const isEnemy = this.Parent?.IsEnemy(this.Caster) ?? false
		return isEnemy ? [this.cachedMres, this.IsMagicImmune()] : [0, false]
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
