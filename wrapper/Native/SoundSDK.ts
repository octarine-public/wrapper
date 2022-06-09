import Vector3 from "../Base/Vector3"
import Manifest from "../Managers/Manifest"
import Entity from "../Objects/Base/Entity"

export default new (class CSoundSDK {
	/**
	 * @deprecated
	 */
	public PlaySound(path: string) {
		if (path.endsWith("_c"))
			path = path.substring(0, path.length - 2)
		if (!path.endsWith(".vsnd"))
			path += ".vsnd"
		let hash = Manifest.SoundPathToHash.get(path)
		if (hash === undefined && !path.startsWith("sounds/"))
			hash = Manifest.SoundPathToHash.get("sounds/" + path)
		if (hash !== undefined) {
			new Vector3().Invalidate().toIOBuffer()
			EmitStartSoundEvent(hash, -1, (Math.random() * (2 ** 32 - 1)) | 0)
		} else
			console.error(new Error(`unknown sound path ${path}`).stack)
	}

	public EmitStartSoundEvent(
		name: string,
		position = new Vector3().Invalidate(),
		sourceEntity?: Entity,
		seed = ((Math.random() * (2 ** 32 - 1)) | 0),
	): void {
		position.toIOBuffer()
		EmitStartSoundEvent(Manifest.SoundNameToHash(name), sourceEntity?.Index ?? -1, seed)
	}
})()
