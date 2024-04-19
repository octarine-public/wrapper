import { Vector3 } from "../Base/Vector3"
import { Entity } from "../Objects/Base/Entity"

export const SoundSDK = new (class CSoundSDK {
	public EmitStartSoundEvent(
		_name: string,
		_position = new Vector3().Invalidate(),
		_sourceEntity?: Entity,
		_guid = (Math.random() * (2 ** 32 - 1)) | 0,
		_seed = (Math.random() * (2 ** 32 - 1)) | 0
	): void {
		// uncomment after fix crashes
		// position.toIOBuffer()
		// EmitStartSoundEvent(guid, name, sourceEntity?.Index ?? -1, seed)
	}

	public EmitStopSoundEvent(_guid: number): void {
		// uncomment after fix crashes
		// EmitStopSoundEvent(guid, undefined, -1)
	}

	public EmitStopSoundEventByName(_name: string, _sourceEntity?: Entity): void {
		// uncomment after fix crashes
		// EmitStopSoundEvent(0, name, sourceEntity?.Index ?? -1)
	}
})()
