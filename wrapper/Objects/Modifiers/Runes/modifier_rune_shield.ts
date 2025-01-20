import { GetRuneTexture } from "../../../Data/ImageData"
import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_rune_shield extends Modifier implements IShield {
	public readonly IsHidden = false
	public readonly HasVisualShield = true
	public readonly ShieldModifierName = this.Name

	private cachedShield = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK,
			this.GetTotalConstantBlock.bind(this)
		]
	])
	public get StackCount() {
		return this.CurrentShield || super.StackCount
	}
	public get CurrentShield() {
		return this.cachedShield - this.NetworkArmor
	}
	public GetTexturePath(small = false) {
		return GetRuneTexture("shield", small)
	}
	public IsShield(): this is IShield {
		return this.cachedShield - this.NetworkArmor !== 0
	}
	protected GetTotalConstantBlock(): [number, boolean] {
		return [this.cachedShield - this.NetworkArmor, false]
	}
	public AddModifier(): boolean {
		if (!super.AddModifier()) {
			return false
		}
		this.cachedShield = ((this.Parent?.MaxHP ?? 0) * 50) / 100
		return true
	}
}
