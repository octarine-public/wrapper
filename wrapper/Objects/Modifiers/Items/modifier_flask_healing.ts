import { GetItemTexture } from "../../../Data/ImageData"
import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_flask_healing extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	public IsBuff(): this is IBuff {
		return true
	}
	public GetTexturePath(): string {
		const itemName = this.CachedAbilityName
		return itemName !== undefined
			? super.GetTexturePath()
			: GetItemTexture("item_flask")
	}
}
