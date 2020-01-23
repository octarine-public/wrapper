import Ability from "../../Base/Ability"

export default class dark_willow_cursed_crown extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_DarkWillow_LeyConduit

	public get AOERadius(): number {
		return this.GetSpecialValue("stun_radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("dark_willow_cursed_crown", dark_willow_cursed_crown)
