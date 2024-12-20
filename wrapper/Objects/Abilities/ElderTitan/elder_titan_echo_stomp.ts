import { WrapperClass } from "../../../Decorators"
import { DAMAGE_TYPES } from "../../../Enums/DAMAGE_TYPES"
import { Ability } from "../../Base/Ability"
import { npc_dota_elder_titan_ancestral_spirit } from "../../Units/npc_dota_elder_titan_ancestral_spirit"

@WrapperClass("elder_titan_echo_stomp")
export class elder_titan_echo_stomp extends Ability {
	public get DamageType(): DAMAGE_TYPES {
		return this.Owner instanceof npc_dota_elder_titan_ancestral_spirit
			? DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
			: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("stomp_damage", level)
	}
}
