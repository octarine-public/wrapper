import { GetSpellTexture, GetUnitTexture } from "../../../Data/ImageData"
import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("legion_commander_outfight_them")
export class legion_commander_outfight_them extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
	public get TexturePath(): string {
		const owner = this.Owner
		const abilityTexture = GetSpellTexture(this.Name)
		if (owner === undefined) {
			return abilityTexture
		}
		return GetUnitTexture(owner.Name) ?? abilityTexture
	}
}
