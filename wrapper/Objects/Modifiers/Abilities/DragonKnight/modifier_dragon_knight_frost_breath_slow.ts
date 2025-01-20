import { AbilityImagePath } from "../../../../Data/PathData"
import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { dragon_knight_elder_dragon_form } from "../../../Abilities/DragonKnight/dragon_knight_elder_dragon_form"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_dragon_knight_frost_breath_slow
	extends Modifier
	implements IDebuff
{
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedSpeed = 0
	private cachedAttackSpeed = 0

	private cachedResultMoveSpeed = 0
	private cachedResultAttackSpeed = 0

	protected readonly CanPostDataUpdate = true
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

	private get amplifierForm(): number {
		if (this.Caster === undefined) {
			return 1
		}
		const modifier = this.Caster.GetBuffByName("modifier_dragon_knight_dragon_form")
		const abil = modifier?.Ability
		if (!(abil instanceof dragon_knight_elder_dragon_form)) {
			return 1
		}
		const level = !this.Caster.HasScepter
			? abil.Level
			: Math.min(abil.Level + 1, abil.MaxLevel + 1)
		return 1 + abil.GetSpecialValue("frost_breath_effect_bonus", level) / 100
	}
	public IsDebuff(): this is IDebuff {
		return true
	}
	public GetTexturePath(): string {
		return AbilityImagePath + "/dragon_knight_frost_png.vtex_c"
	}
	public PostDataUpdate(): void {
		this.cachedResultMoveSpeed = this.cachedSpeed * this.amplifierForm
		this.cachedResultAttackSpeed = this.cachedAttackSpeed * this.amplifierForm
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedResultMoveSpeed, this.IsMagicImmune()]
	}
	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedResultAttackSpeed, this.IsMagicImmune()]
	}
	protected UpdateSpecialValues(): void {
		const name = "dragon_knight_dragon_blood"
		this.cachedSpeed = this.GetSpecialValue("frost_bonus_movement_speed", name)
		this.cachedAttackSpeed = this.GetSpecialValue("frost_bonus_attack_speed", name)
	}
}
