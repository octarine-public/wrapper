import Ability from "../../Base/Ability"

export default class terrorblade_sunder extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Terrorblade_Sunder>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("terrorblade_sunder", terrorblade_sunder)