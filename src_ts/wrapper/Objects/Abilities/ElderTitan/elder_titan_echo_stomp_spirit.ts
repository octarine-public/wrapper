import Ability from "../../Base/Ability"

export default class elder_titan_echo_stomp_spirit extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_Elder_Titan_EchoStomp_Spirit>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("elder_titan_echo_stomp_spirit", elder_titan_echo_stomp_spirit)
