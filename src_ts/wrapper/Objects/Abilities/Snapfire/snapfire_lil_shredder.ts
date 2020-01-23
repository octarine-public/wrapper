import Ability from "../../Base/Ability"

export default class snapfire_lil_shredder extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_Snapfire_LilShredder>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("snapfire_lil_shredder", snapfire_lil_shredder)
