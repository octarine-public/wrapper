import { GetHeroTexture } from "../../../../Data/ImageData"
import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_dazzle_innate_weave_armor_counter
	extends Modifier
	implements IDebuff, IBuff
{
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
	public readonly DebuffModifierName = this.Name

	private cachedArmor = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return !this.IsDebuff()
	}
	public IsDebuff(): this is IDebuff {
		return (this.Parent?.IsEnemy(this.Caster) ?? false) && this.StackCount !== 0
	}
	public GetTexturePath(): string {
		return GetHeroTexture(this.Caster?.Name ?? "")
	}
	protected GetPhysicalArmorBonus(): [number, boolean] {
		const owner = this.Parent,
			caster = this.Caster
		if (owner === undefined || caster === undefined) {
			return [0, false]
		}
		const isEnemy = owner.IsEnemy(caster)
		const value = isEnemy ? -this.cachedArmor : this.cachedArmor
		return [value * this.StackCount, isEnemy ? this.IsMagicImmune() : false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedArmor = this.GetSpecialValue("armor_change", "dazzle_innate_weave")
	}
}
