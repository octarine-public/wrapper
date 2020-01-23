import Ability from "../../Base/Ability"

export default class razor_static_link extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Razor_StaticLink>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("razor_static_link", razor_static_link)
