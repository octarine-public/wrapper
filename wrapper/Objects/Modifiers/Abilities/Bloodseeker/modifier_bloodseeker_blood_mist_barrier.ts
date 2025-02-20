import { GetHeroTexture } from "../../../../Data/ImageData"
import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_bloodseeker_blood_mist_barrier extends Modifier implements IShield {
	public readonly IsHidden = false
	public readonly HasVisualShield = true
	public readonly ShieldModifierName = this.Name

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK,
			this.GetTotalConstantBlock.bind(this)
		]
	])

	public get StackCount(): number {
		return this.CreationTime || super.StackCount
	}
	public IsShield(): this is IShield {
		return true
	}
	public GetTexturePath(): string {
		return GetHeroTexture(this.Caster?.Name ?? "")
	}
	protected GetTotalConstantBlock(): [number, boolean] {
		return [this.CreationTime, false] // wtf
	}
}
