import Ability from "../../Base/Ability"

export default class queenofpain_blink extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_QueenOfPain_Blink>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("queenofpain_blink", queenofpain_blink)
