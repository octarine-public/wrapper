import Ability from "../Base/Ability"

export default class earthshaker_echo_slam extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Earthshaker_EchoSlam

	public get AOERadius(): number {
		return this.GetSpecialValue("echo_slam_damage_range")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("earthshaker_echo_slam", earthshaker_echo_slam)
