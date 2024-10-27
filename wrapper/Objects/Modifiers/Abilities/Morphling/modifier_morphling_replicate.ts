import { WrapperClassModifier } from "../../../../Decorators"
import { EventsSDK } from "../../../../Managers/EventsSDK"
import { Modifier } from "../../../Base/Modifier"
import { npc_dota_hero_morphling } from "../../../Heroes/npc_dota_hero_morphling"

@WrapperClassModifier()
export class modifier_morphling_replicate extends Modifier {
	public UnitPropertyChanged(): boolean {
		if (!super.UnitPropertyChanged()) {
			return false
		}
		const owner = this.Parent
		if (owner === undefined) {
			return false
		}
		if (owner instanceof npc_dota_hero_morphling) {
			owner.IsGuaranteedReal_ = true
		}
		EventsSDK.emit("UnitPropertyChanged", false, owner)
		return true
	}
}
