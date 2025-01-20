import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_force_boots_active
	extends Modifier
	implements IBuff, IDebuff, IDisable
{
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
	public readonly DebuffModifierName = this.Name

	private cachedSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return this.Parent?.IsEnemy(this.Caster) ?? false
	}
	public IsDebuff(): this is IDebuff {
		return !this.IsBuff()
	}
	public IsDisable(): this is IDisable {
		return !this.IsBuff()
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, this.IsMagicImmune()]
	}
	protected UpdateSpecialValues() {
		this.cachedSpeed = this.GetSpecialValue("slow", "item_ogre_seal_totem")
	}
}
