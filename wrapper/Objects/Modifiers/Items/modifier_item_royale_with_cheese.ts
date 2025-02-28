import { GetItemTexture } from "../../../Data/ImageData"
import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_royale_with_cheese extends Modifier implements IBuff, IShield {
	public readonly IsHidden = false
	public readonly HasVisualShield = true
	public readonly BuffModifierName = this.Name
	public readonly ShieldModifierName = this.Name

	private cachedShield = 0
	protected readonly CachedAbilityName = "item_royale_with_cheese"
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK,
			this.GetTotalConstantBlock.bind(this)
		]
	])
	public get StackCount() {
		return this.cachedShield - this.NetworkArmor || super.StackCount
	}
	public IsBuff(): this is IBuff {
		return this.StackCount !== 0
	}
	public IsShield(): this is IShield {
		return this.StackCount !== 0
	}
	public GetTexturePath(): string {
		return GetItemTexture("item_royale_with_cheese")
	}
	protected GetTotalConstantBlock(): [number, boolean] {
		return [this.cachedShield - this.NetworkArmor, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedShield = this.GetSpecialValue("shield", "item_royale_with_cheese")
	}
}
