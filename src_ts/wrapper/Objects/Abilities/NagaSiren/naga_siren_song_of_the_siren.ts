import Ability from "../../Base/Ability"

export default class naga_siren_song_of_the_siren extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_NagaSiren_SongOfTheSiren>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("naga_siren_song_of_the_siren", naga_siren_song_of_the_siren)
