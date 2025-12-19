import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_slark_saltwater_shiv_effect
	extends Modifier
	implements IDebuff, IBuff
{
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name
	public readonly BuffModifierName = this.Name

	private cachedSpeed = 0
	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT,
			this.GetMoveSpeedBonusConstant.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return !this.IsDebuff()
	}
	public IsDebuff(): this is IDebuff {
		return this.Parent?.IsEnemy(this.Caster) ?? false
	}
	protected GetMoveSpeedBonusConstant(): [number, boolean] {
		return [-(this.cachedSpeed * this.StackCount), false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedSpeed = this.GetSpecialValue("ms_steal", "slark_saltwater_shiv")
	}
}
