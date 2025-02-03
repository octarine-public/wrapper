import { GetUnitTexture } from "../../../../Data/ImageData"
import { WrapperClassModifier } from "../../../../Decorators"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_spirit_breaker_charge_of_darkness_target extends Modifier {
	public get ForceVisible(): boolean {
		return true
	}
	public get Target() {
		return EntityManager.EntityByIndex<Unit>(this.NetworkArmor)
	}
	public GetTexturePath(): string {
		return GetUnitTexture(this.Target?.Name ?? "") ?? ""
	}
}
