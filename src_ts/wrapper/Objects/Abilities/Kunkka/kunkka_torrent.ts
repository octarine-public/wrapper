import Ability from "../../Base/Ability"

export default class kunkka_torrent extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Kunkka_Torrent>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("kunkka_torrent", kunkka_torrent)
