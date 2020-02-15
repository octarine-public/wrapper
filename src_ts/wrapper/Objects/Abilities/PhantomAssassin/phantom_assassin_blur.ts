import Ability from "../../Base/Ability"

export default class phantom_assassin_blur extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_PhantomAssassin_Blur>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("phantom_assassin_blur", phantom_assassin_blur)
