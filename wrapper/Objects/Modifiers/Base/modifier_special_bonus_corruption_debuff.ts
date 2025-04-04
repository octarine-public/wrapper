import { AbilityImagePath } from "../../../Data/PathData"
import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_special_bonus_corruption_debuff
	extends Modifier
	implements IDebuff
{
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedArmor = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		]
	])
	public GetTexturePath(): string {
		return AbilityImagePath + "/phantom_assassin_armor_corruption_debuff_png.vtex_c"
	}
	public IsDebuff(): this is IDebuff {
		return true
	}
	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [-this.cachedArmor, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedArmor = this.GetSpecialValue("value", this.CachedAbilityName ?? "")
	}
}
