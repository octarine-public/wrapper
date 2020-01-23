import Ability from "../../Base/Ability"

export default class death_prophet_carrion_swarm extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_DeathProphet_CarrionSwarm

	public get AOERadius(): number {
		return this.GetSpecialValue("start_radius")
	}

	public get EndRadius(): number {
		return this.GetSpecialValue("end_radius")
	}

	public get Range(): number {
		return this.GetSpecialValue("range")
	}

	public get Speed(): number {
		return this.GetSpecialValue("speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("death_prophet_carrion_swarm", death_prophet_carrion_swarm)
