import { GetHeroTexture } from "../../../../Data/ImageData"
import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_rattletrap_junk_mail extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedArmor = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		]
	])
	public GetTexturePath(): string {
		return GetHeroTexture(this.Caster?.Name ?? "")
	}
	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [this.cachedArmor * this.StackCount, false]
	}
	public IsBuff(): this is IBuff {
		return true
	}
	protected UpdateSpecialValues(): void {
		this.cachedArmor = this.GetSpecialValue(
			"armor_per_chainmail",
			"rattletrap_armor_power"
		)
	}
}
