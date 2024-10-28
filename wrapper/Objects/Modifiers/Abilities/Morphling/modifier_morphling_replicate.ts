import { WrapperClassModifier } from "../../../../Decorators"
import { EventsSDK } from "../../../../Managers/EventsSDK"
import { Modifier } from "../../../Base/Modifier"
import { npc_dota_hero_morphling } from "../../../Heroes/npc_dota_hero_morphling"

@WrapperClassModifier()
export class modifier_morphling_replicate extends Modifier {
	public UnitPropertyChanged(changed?: boolean): boolean {
		const owner = this.Parent
		if (owner === undefined) {
			return super.UnitPropertyChanged(changed)
		}
		if (owner instanceof npc_dota_hero_morphling) {
			owner.IsGuaranteedReal_ = true
		}
		EventsSDK.emit("UnitPropertyChanged", false, owner)
		return super.UnitPropertyChanged(changed)
	}
}
