import Ability from "../../Base/Ability"

export default class enigma_malefice extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Enigma_Malefice>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("enigma_malefice", enigma_malefice)
