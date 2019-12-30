import Ability from "../../Base/Ability"

export default class elder_titan_echo_stomp extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_Elder_Titan_EchoStomp

	public get AOERadius(): number {
		return this.GetSpecialValue("radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("elder_titan_echo_stomp", elder_titan_echo_stomp)
