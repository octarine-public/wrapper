import { GetHeroTexture } from "../../../../Data/ImageData"
import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_axe_coat_of_blood extends Modifier implements IBuff {
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

	public IsBuff(): this is IBuff {
		return this.StackCount !== 0
	}

	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [this.cachedArmor * this.StackCount, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedArmor = this.GetSpecialValue("armor_per_kill", "axe_coat_of_blood")
	}
}
