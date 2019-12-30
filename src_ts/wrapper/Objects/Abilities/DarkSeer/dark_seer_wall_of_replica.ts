import Ability from "../../Base/Ability"

export default class dark_seer_wall_of_replica extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_DarkSeer_WallOfReplica

	public get AOERadius(): number {
		return this.Owner?.HasScepter
			? this.GetSpecialValue("width") * this.GetSpecialValue("scepter_length_multiplier")
			: this.GetSpecialValue("width")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("dark_seer_wall_of_replica", dark_seer_wall_of_replica)
