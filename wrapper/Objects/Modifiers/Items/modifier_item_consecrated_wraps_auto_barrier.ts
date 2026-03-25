import { GetHeroTexture } from "../../../Data/ImageData"
import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_consecrated_wraps_auto_barrier
	extends Modifier
	implements IShield
{
	public readonly IsHidden = false
	public readonly HasVisualShield = true
	public readonly ShieldModifierName = this.Name

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK_STACKING,
			this.GetTotalConstantBlockStacking.bind(this)
		]
	])
	public IsShield(): this is IShield {
		return true
	}
	public GetTexturePath(): string {
		return GetHeroTexture(this.Caster?.Name ?? "")
	}
	protected GetTotalConstantBlockStacking(): [number, boolean] {
		return [this.NetworkArmor, false]
	}
}
