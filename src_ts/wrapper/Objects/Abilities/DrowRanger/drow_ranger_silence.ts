import Ability from "../../Base/Ability"

export default class drow_ranger_silence extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_DrowRanger_Silence
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("drow_ranger_silence", drow_ranger_silence)
