import Vector3 from "../Base/Vector3"
import Manifest from "../Managers/Manifest"
import Entity from "../Objects/Base/Entity"
import GameState from "../Utils/GameState"

export default new (class CSoundSDK {
	public PlaySound(pathVsndC: string, volume = 0.1) {
		GameState.ExecuteCommand(`playvol ${pathVsndC} ${volume}`)
	}

	public EmitStartSoundEvent(
		name: string,
		position = new Vector3(),
		sourceEntity?: Entity,
		seed = ((Math.random() * (2 ** 32 - 1)) | 0),
	): void {
		position.toIOBuffer()
		EmitStartSoundEvent(Manifest.SoundNameToHash(name), sourceEntity?.Index ?? 0, seed)
	}
})()
