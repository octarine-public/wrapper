import { ImagePath } from "../../../../Data/PathData"
import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_dark_seer_heart_of_battle extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT,
			this.GetMoveSpeedBonusConstant.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return this.NetworkDamage !== 0
	}
	public GetTexturePath(): string {
		return ImagePath + "/hud/facets/icons/speed_png.vtex_c"
	}
	protected GetMoveSpeedBonusConstant(): [number, boolean] {
		return [this.NetworkDamage, false]
	}
}
