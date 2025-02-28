import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_dawnbreaker_luminosity_blaze_buff
	extends Modifier
	implements IBuff
{
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedSpeedAlly = 0
	private cachedSpeedSelf = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return this.Parent === this.Caster
			? [this.cachedSpeedSelf * this.NetworkArmor, false]
			: [this.cachedSpeedAlly * this.NetworkArmor, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "dawnbreaker_fire_wreath"
		this.cachedSpeedAlly = this.GetSpecialValue("movespeed_bonus_ally_max", name)
		this.cachedSpeedSelf = this.GetSpecialValue("movespeed_bonus_self_max", name)
	}
}
