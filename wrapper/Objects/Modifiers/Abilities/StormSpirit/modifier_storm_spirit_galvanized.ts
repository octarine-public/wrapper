import { GetHeroTexture } from "../../../../Data/ImageData"
import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_storm_spirit_galvanized extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedMPPerKill = 0

	public get ManaRegenPerKill() {
		return this.cachedMPPerKill * this.StackCount
	}
	public IsBuff(): this is IBuff {
		return this.ManaRegenPerKill !== 0
	}
	public GetTexturePath(): string {
		return GetHeroTexture(this.Caster?.Name ?? "")
	}
	protected UpdateSpecialValues() {
		this.cachedMPPerKill = this.GetSpecialValue(
			"mp_per_kill",
			"storm_spirit_galvanized"
		)
	}
}
