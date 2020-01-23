import Ability from "../../Base/Ability"

export default class riki_smoke_screen extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Riki_SmokeScreen>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("riki_smoke_screen", riki_smoke_screen)
