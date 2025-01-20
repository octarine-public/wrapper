import { GetSpellTexture } from "../../../../Data/ImageData"
import { WrapperClassModifier } from "../../../../Decorators"
import { kez_switch_weapons } from "../../../../Objects/Abilities/Kez/kez_switch_weapons"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_kez_switch_weapons_aghs extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	public GetTexturePath(): string {
		if (!(this.Ability instanceof kez_switch_weapons)) {
			return super.GetTexturePath()
		}
		return GetSpellTexture(
			this.Ability.IsSai ? "kez_switch_weapons_sai" : "kez_switch_weapons_katana"
		)
	}

	public IsBuff(): this is IBuff {
		return true
	}
}
