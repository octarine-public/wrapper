import { Vector3 } from "../Base/Vector3"
import { Manifest } from "../Managers/Manifest"
import { Entity } from "../Objects/Base/Entity"

export const SoundSDK = new (class CSoundSDK {
	public EmitStartSoundEvent(
		name: string,
		position = new Vector3().Invalidate(),
		sourceEntity?: Entity,
		guid = (Math.random() * (2 ** 32 - 1)) | 0,
		seed = (Math.random() * (2 ** 32 - 1)) | 0
	): void {
		position.toIOBuffer()
		EmitStartSoundEventNew(
			guid,
			Manifest.SoundNameToHash(name),
			sourceEntity?.Index ?? -1,
			seed
		)
	}

	public EmitStopSoundEvent(guid: number): void {
		EmitStopSoundEvent(guid, -1, -1)
	}

	public EmitStopSoundEventByName(name: string, sourceEntity?: Entity): void {
		EmitStopSoundEvent(
			0,
			Manifest.SoundNameToHash(name),
			sourceEntity?.Index ?? -1
		)
	}
})()
