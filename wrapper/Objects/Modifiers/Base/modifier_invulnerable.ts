import { AbilityImagePath } from "../../../Data/PathData"
import { WrapperClassModifier } from "../../../Decorators"
import { EventsSDK } from "../../../Managers/EventsSDK"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_invulnerable extends Modifier {
	public readonly IsHidden = false

	public UnitPropertyChanged(changed?: boolean): boolean {
		const owner = this.Parent
		if (owner === undefined) {
			return super.UnitPropertyChanged(changed)
		}
		EventsSDK.emit("UnitPropertyChanged", false, owner)
		return super.UnitPropertyChanged(changed)
	}

	public GetTexturePath(): string {
		return AbilityImagePath + "/modifier_invulnerable_png.vtex_c"
	}
}
