import { GetHeroTexture } from "../../../../Data/ImageData"
import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_slark_armor_reduction_debuff extends Modifier implements IDebuff {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedArmor = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return true
	}
	public GetTexturePath(): string {
		return GetHeroTexture(this.Caster?.Name ?? "")
	}
	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [this.cachedArmor, this.IsMagicImmune()]
	}
	protected UpdateSpecialValues(): void {
		this.cachedArmor = this.GetSpecialValue("corruption_armor", "slark_barracuda")
	}
}
