import Ability from "../../Base/Ability"

export default class razor_eye_of_the_storm extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Razor_EyeOfTheStorm>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("razor_eye_of_the_storm", razor_eye_of_the_storm)
