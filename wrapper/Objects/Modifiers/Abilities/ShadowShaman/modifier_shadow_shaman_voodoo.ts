import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_shadow_shaman_voodoo extends Modifier implements IDebuff, IDisable {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BASE_OVERRIDE,
			this.GetMoveSpeedBaseOverride.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return true
	}
	public IsDisable(): this is IDisable {
		return true
	}
	protected GetMoveSpeedBaseOverride(): [number, boolean] {
		return (this.Parent?.IsEnemy(this.Caster) ?? false)
			? [this.cachedSpeed, this.IsMagicImmune()]
			: [0, false]
	}
	protected UpdateSpecialValues() {
		const name = this.Ability?.Name ?? "shadow_shaman_voodoo"
		this.cachedSpeed = this.GetSpecialValue("movespeed", name)
	}
}
