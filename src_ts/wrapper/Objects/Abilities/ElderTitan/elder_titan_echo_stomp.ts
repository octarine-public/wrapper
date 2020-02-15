import Ability from "../../Base/Ability"

export default class elder_titan_echo_stomp extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_Elder_Titan_EchoStomp>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("elder_titan_echo_stomp", elder_titan_echo_stomp)
