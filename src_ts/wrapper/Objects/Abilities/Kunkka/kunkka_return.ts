import Ability from "../../Base/Ability"

export default class kunkka_return extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Kunkka_Return>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("kunkka_return", kunkka_return)
