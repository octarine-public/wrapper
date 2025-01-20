import { ImagePath } from "../../../../Data/PathData"
import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_juggernaut_bladeform extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])
	public GetTexturePath(): string {
		return ImagePath + "/hud/facets/icons/agility_png.vtex_c"
	}
	public IsBuff(): this is IBuff {
		return this.StackCount !== 0
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.StackCount, false]
	}
}
