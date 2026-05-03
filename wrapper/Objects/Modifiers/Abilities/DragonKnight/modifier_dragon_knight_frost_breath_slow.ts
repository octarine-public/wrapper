import { AbilityImagePath } from "../../../../Data/PathData"
import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
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
		return true
	}
	public GetTexturePath(): string {
		return AbilityImagePath + "/dragon_knight_frost_png.vtex_c"
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [-this.cachedSpeed, this.IsMagicImmune()]
	}
	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [-this.cachedAttackSpeed, this.IsMagicImmune()]
	}
	protected UpdateSpecialValues(): void {
		const name = "dragon_knight_dragon_blood"
		this.cachedSpeed = this.GetSpecialValue("frost_bonus_movement_speed", name)
		this.cachedAttackSpeed = this.GetSpecialValue("frost_bonus_attack_speed", name)
	}
}
