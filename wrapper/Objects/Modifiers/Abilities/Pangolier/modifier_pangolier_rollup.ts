import { AbilityImagePath } from "../../../../Data/PathData"
import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_pangolier_rollup extends Modifier implements IBuff, IShield {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
	public readonly ShieldModifierName = this.Name

	private cachedMres: number = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ABSOLUTE_NO_DAMAGE_PURE,
			this.GetAbsoluteNoDamagePure.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_DISABLE_TURNING,
			this.GetDisableTurning.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
			this.GetMagicalResistanceBonus.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	public IsShield(): this is IShield {
		return true
	}
	public GetTexturePath(): string {
		return AbilityImagePath + "/modifier_magicimmune_png.vtex_c"
	}
	protected GetAbsoluteNoDamagePure(): [number, boolean] {
		return [1, false]
	}
	protected GetDisableTurning(): [number, boolean] {
		return [1, false]
	}
	protected GetMagicalResistanceBonus(params?: IModifierParams): [number, boolean] {
		const ignoreMagicResist = params?.IgnoreMagicResist ?? false
		return !ignoreMagicResist ? [this.cachedMres, false] : [0, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedMres = this.GetSpecialValue("magic_resistance", "pangolier_rollup")
	}
}
