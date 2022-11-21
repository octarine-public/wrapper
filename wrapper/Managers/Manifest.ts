import { FileBinaryStream } from "../Utils/FileBinaryStream"
import { ParseExternalReferences, readJSON } from "../Utils/Utils"
import { ViewBinaryStream } from "../Utils/ViewBinaryStream"
import { Events } from "./Events"

export const Manifest = new (class CManifest {
	public readonly Directories: string[] = []
	public readonly Extensions: string[] = []
	public readonly FileNames: string[] = []
	public readonly Paths = new Map<bigint, [number, number, number]>()
	public readonly SoundHashToString = new Map<number, string>()
	public readonly SoundPathToHash = new Map<string, number>()
	public readonly PathHash32To64 = new Map<number, bigint>()
	public readonly Hash32ToString = new Map<number, string>()

	public GetPathByHash(hash: bigint): Nullable<string> {
		if (hash === 0n) return "<null>"
		// it's interpret as signed int64 in protobuf messages, so we need to wrap it into unsigned
		hash = BigInt.asUintN(64, hash)
		const path = this.Paths.get(hash)
		if (path === undefined) {
			// console.log(`Unknown resource hash ${hash} passed to GetPathByHash ${new Error().stack}`)
			return undefined
		}
		return `${this.Directories[path[0]]}${this.FileNames[path[1]]}.${
			this.Extensions[path[2]]
		}`
	}
	public SaveStringToken(str: string): number {
		str = str.toLowerCase()
		const hash = MurmurHash2(str, 0x31415926) >>> 0
		if (!this.PathHash32To64.has(hash) && !this.Hash32ToString.has(hash))
			this.Hash32ToString.set(hash, str)
		return hash
	}
	public LookupStringByToken(hash: number): Nullable<string> {
		if (hash === 0) return "<null>"
		// it's interpret as signed int32 in protobuf messages, so we need to wrap it into unsigned
		hash = hash >>> 0

		const hash64 = this.PathHash32To64.get(hash)
		if (hash64 !== undefined) {
			const path = this.Paths.get(hash64)!
			return `${this.Directories[path[0]]}${this.FileNames[path[1]]}.${
				this.Extensions[path[2]]
			}`
		}
		return this.Hash32ToString.get(hash)
	}
	public LoadSoundFile(path: string): void {
		const kv = parseKV(path)
		if (kv.size === 0) {
			console.log(`Missing ${path}`)
			return
		}
		for (const [k, v] of kv) {
			const hash = this.SoundNameToHash(k, true)
			this.SoundHashToString.set(hash, k)
			if (!(v instanceof Map)) continue
			if (v.has("vsnd_files")) {
				const vsndFiles = v.get("vsnd_files")
				if (typeof vsndFiles === "string")
					this.SoundPathToHash.set(vsndFiles, hash)
				if (Array.isArray(vsndFiles))
					for (const vsndFile of vsndFiles)
						if (typeof vsndFile === "string")
							this.SoundPathToHash.set(vsndFile, hash)
				if (vsndFiles instanceof Map)
					for (const vsndFile of vsndFiles.values())
						if (typeof vsndFile === "string")
							this.SoundPathToHash.set(vsndFile, hash)
			}
			if (v.has("operator_stacks")) {
				const operatorStacks = v.get("operator_stacks")
				if (operatorStacks instanceof Map) {
					const updateStack = operatorStacks.get("update_stack")
					if (updateStack instanceof Map) {
						const referenceOperator = updateStack.get("operator_stacks")
						if (referenceOperator instanceof Map) {
							const vsndFiles = referenceOperator.get("vsnd_files")
							if (vsndFiles instanceof Map) {
								const value = vsndFiles.get("value")
								if (value instanceof Map)
									for (const vsndFile of value.values())
										if (typeof vsndFile === "string")
											this.SoundPathToHash.set(vsndFile, hash)
							}
						}
					}
				}
			}
		}
	}
	public SoundNameToHash(name: string, isLoading = false): number {
		const hash = MurmurHash2(name.toLowerCase(), 0x53524332) >>> 0
		if (!isLoading && !this.SoundHashToString.has(hash))
			console.log(
				`Sound path "${name}" isn't in SoundHashToString and will likely fail`
			)
		return hash
	}
	public LookupSoundNameByHash(hash: number): Nullable<string> {
		if (hash === 0) return "<null>"
		return this.SoundHashToString.get(hash >>> 0)
	}
})()

function ReadPathString(stream: ReadableBinaryStream, size: number): string {
	return stream.ReadUtf8String(size).replace(/\\/g, "/").toLowerCase()
}

function ParseStringFromStream(stream: ReadableBinaryStream, ar: string[]) {
	const id = stream.ReadVarUintAsNumber(),
		size = stream.ReadVarUintAsNumber()
	if (id === ar.length) ar[id] = ReadPathString(stream, size)
	else stream.RelativeSeek(size)
}

Events.on("ServerMessage", (msgID, buf_) => {
	const buf = new Uint8Array(buf_)
	switch (msgID) {
		case 9: {
			// we have custom parsing for manifest updates
			const stream = new ViewBinaryStream(
				new DataView(buf.buffer, buf.byteOffset, buf.byteLength)
			)
			for (let i = 0, end = stream.ReadVarUintAsNumber(); i < end; i++)
				ParseStringFromStream(stream, Manifest.Extensions)
			for (let i = 0, end = stream.ReadVarUintAsNumber(); i < end; i++)
				ParseStringFromStream(stream, Manifest.Directories)
			for (let i = 0, end = stream.ReadVarUintAsNumber(); i < end; i++) {
				const pathID = stream.ReadVarUintAsNumber(),
					dirID = stream.ReadVarUintAsNumber(),
					extID = stream.ReadVarUintAsNumber(),
					fileID = stream.ReadVarUintAsNumber(),
					fileSize = stream.ReadVarUintAsNumber()
				if (fileID === Manifest.FileNames.length)
					Manifest.FileNames[fileID] = ReadPathString(stream, fileSize)
				else stream.RelativeSeek(fileSize)
				if (pathID !== Manifest.Paths.size) continue
				const path = `${Manifest.Directories[dirID]}${Manifest.FileNames[fileID]}.${Manifest.Extensions[extID]}`
				if (Manifest.Extensions[extID] === "vsndevts")
					Manifest.LoadSoundFile(`${path}_c`)
				const hash64 = MurmurHash64(path, 0xedabcdef)
				Manifest.Paths.set(hash64, [dirID, fileID, extID])
				Manifest.PathHash32To64.set(
					MurmurHash2(path.toLowerCase(), 0x31415926) >>> 0,
					hash64
				)
			}
			break
		}
		default:
			break
	}
})

function ReadStringTokenDatabase(): void {
	const buf = fopen("stringtokendatabase.txt")
	if (buf === undefined) return
	try {
		const stream = new FileBinaryStream(buf)
		if (stream.ReadUint8() === 0x21 && stream.ReadUint8() === 0x0a)
			while (!stream.Empty()) {
				stream.RelativeSeek(6)
				let str = ""
				for (let i = stream.ReadUint8(); i !== 0x0a; i = stream.ReadUint8())
					str += String.fromCharCode(i)
				Manifest.SaveStringToken(str)
			}
	} finally {
		buf.close()
	}
}

function ReadSoundManifest(path: string): void {
	const manifest = fopen(path)
	if (manifest === undefined) {
		console.log("Sound manifest not found.")
		return
	}
	try {
		ParseExternalReferences(new FileBinaryStream(manifest), true).forEach(
			refPath => {
				if (refPath.endsWith(".vsndevts_c")) Manifest.LoadSoundFile(refPath)
				if (refPath.endsWith(".vrman_c")) ReadSoundManifest(refPath)
			}
		)
	} finally {
		manifest.close()
	}
}

// reset Manifest on new connection
Events.on("NewConnection", () => {
	Manifest.Directories.splice(0)
	Manifest.Extensions.splice(0)
	Manifest.FileNames.splice(0)
	Manifest.Paths.clear()
	Manifest.PathHash32To64.clear()
	Manifest.SoundHashToString.clear()
})
export function LoadManifest() {
	// strings present in dota, but not present in stringtokendatabase for some reason
	const knownStrings = readJSON("known_strings.json") as string[]
	knownStrings.forEach(str => Manifest.SaveStringToken(str))

	ReadStringTokenDatabase()
	ReadSoundManifest("soundevents/soundevents_manifest.vrman_c")
}
