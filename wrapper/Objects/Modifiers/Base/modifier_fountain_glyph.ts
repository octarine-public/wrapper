import { AbilityImagePath } from "../../../Data/PathData"
import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_fountain_glyph extends Modifier implements IShield {
	public readonly IsHidden = false
	public readonly ShieldModifierName = this.Name

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ABSOLUTE_NO_DAMAGE_PURE,
			this.GetAbsoluteNoDamagePure.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ABSOLUTE_NO_DAMAGE_MAGICAL,
			this.GetAbsoluteNoDamageMagical.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ABSOLUTE_NO_DAMAGE_PHYSICAL,
			this.GetAbsoluteNoDamagePhysical.bind(this)
		]
	])
	public IsShield(): this is IShield {
		return true
	}
	public GetTexturePath(): string {
		return AbilityImagePath + "/modifier_invulnerable_png.vtex_c"
	}
	protected GetAbsoluteNoDamagePure(): [number, boolean] {
		return [1, false]
	}
	protected GetAbsoluteNoDamageMagical(): [number, boolean] {
		return [1, false]
	}
	protected GetAbsoluteNoDamagePhysical(): [number, boolean] {
		return [1, false]
	}
}
