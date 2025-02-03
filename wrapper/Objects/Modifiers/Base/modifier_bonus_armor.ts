import { GetSpellTexture } from "../../../Data/ImageData"
import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier() // stamina statue bonus
export class modifier_bonus_armor extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	public GetTexturePath(): string {
		return GetSpellTexture("tower_armor_aura")
	}
	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [2, false] // hardcoded special_bonus_armor_2
	}
}
