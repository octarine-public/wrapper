import { MurmurHash2, MurmurHash64 } from "../Native/WASM"
import { parseKV } from "../Resources/ParseKV"
import { StringToUTF8, Utf8ArrayToStr } from "../Utils/ArrayBufferUtils"
import BinaryStream from "../Utils/BinaryStream"
import { ParseExternalReferences, readJSON } from "../Utils/Utils"
import Events from "./Events"
import EventsSDK from "./EventsSDK"

const Manifest = new (class CManifest {
	public readonly Directories: string[] = []
	public readonly Extensions: string[] = []
	public readonly FileNames: string[] = []
	public readonly Paths = new Map<bigint, [number, number, number]>()
	public readonly SoundHashToString = new Map<number, string>()
	public readonly PathHash32To64 = new Map<number, bigint>()
	public readonly Hash32ToString = new Map<number, string>()

	public GetPathByHash(hash: bigint): Nullable<string> {
		if (hash === 0n)
			return "<null>"
		// it's interpret as signed int64 in protobuf messages, so we need to wrap it into unsigned
		hash = BigInt.asUintN(64, hash)
		const path = this.Paths.get(hash)
		if (path === undefined) {
			// console.log(`Unknown resource hash ${hash} passed to GetPathByHash ${new Error().stack}`)
			return undefined
		}
		return `${this.Directories[path[0]]}${this.FileNames[path[1]]}.${this.Extensions[path[2]]}`
	}
	public SaveStringToken(str: string): number {
		str = str.toLowerCase()
		const hash = MurmurHash2(StringToUTF8(str))
		if (!this.PathHash32To64.has(hash) && !this.Hash32ToString.has(hash))
			this.Hash32ToString.set(hash, str)
		return hash
	}
	public LookupStringByToken(hash: number): Nullable<string> {
		if (hash === 0)
			return "<null>"
		// it's interpret as signed int32 in protobuf messages, so we need to wrap it into unsigned
		hash = hash >>> 0

		const hash64 = this.PathHash32To64.get(hash)
		if (hash64 !== undefined) {
			const path = this.Paths.get(hash64)!
			return `${this.Directories[path[0]]}${this.FileNames[path[1]]}.${this.Extensions[path[2]]}`
		}
		return this.Hash32ToString.get(hash)
	}
	public LoadSoundFile(path: string): void {
		const buf = fread(path)
		if (buf === undefined) {
			console.log(`Missing ${path}`)
			return
		}
		parseKV(buf).forEach((_, name) => this.SoundHashToString.set(this.SoundNameToHash(name), name))
	}
	public SoundNameToHash(name: string): number {
		return MurmurHash2(StringToUTF8(name.toLowerCase()), 0x53524332)
	}
	public LookupSoundNameByHash(hash: number): Nullable<string> {
		if (hash === 0)
			return "<null>"
		return this.SoundHashToString.get(hash >>> 0)
	}
})()
export default Manifest

function BufferToPathString(buf: Uint8Array): string {
	return Utf8ArrayToStr(buf).replace(/\\/g, "/").toLowerCase()
}

function ParseStringFromStream(stream: BinaryStream, ar: string[]) {
	const id = stream.ReadVarUintAsNumber(),
		size = stream.ReadVarUintAsNumber()
	if (id === ar.length)
		ar[id] = BufferToPathString(stream.ReadSlice(size))
	else
		stream.RelativeSeek(size)
}
Events.on("ServerMessage", (msg_id, buf_) => {
	const buf = new Uint8Array(buf_)
	switch (msg_id) {
		case 9: { // we have custom parsing for CNETMsg_SpawnGroup_Load & CNETMsg_SpawnGroup_ManifestUpdate
			const stream = new BinaryStream(new DataView(buf.buffer, buf.byteOffset, buf.byteLength))
			for (let i = 0, end = stream.ReadVarUintAsNumber(); i < end; i++)
				ParseStringFromStream(stream, Manifest.Extensions)
			for (let i = 0, end = stream.ReadVarUintAsNumber(); i < end; i++)
				ParseStringFromStream(stream, Manifest.Directories)
			for (let i = 0, end = stream.ReadVarUintAsNumber(); i < end; i++) {
				const path_id = stream.ReadVarUintAsNumber(),
					dir_id = stream.ReadVarUintAsNumber(),
					ext_id = stream.ReadVarUintAsNumber(),
					file_id = stream.ReadVarUintAsNumber(),
					file_size = stream.ReadVarUintAsNumber()
				if (file_id === Manifest.FileNames.length)
					Manifest.FileNames[file_id] = BufferToPathString(stream.ReadSlice(file_size))
				else
					stream.RelativeSeek(file_size)
				if (path_id !== Manifest.Paths.size)
					continue
				const path = `${Manifest.Directories[dir_id]}${Manifest.FileNames[file_id]}.${Manifest.Extensions[ext_id]}`
				if (Manifest.Extensions[ext_id] === "vsndevts")
					Manifest.LoadSoundFile(`${path}_c`)
				const hash64 = MurmurHash64(StringToUTF8(path))
				Manifest.Paths.set(hash64, [dir_id, file_id, ext_id])
				Manifest.PathHash32To64.set(MurmurHash2(StringToUTF8(path.toLowerCase())), hash64)
			}
			break
		}
		default:
			break
	}
})

function ReadStringTokenDatabase(): void {
	const buf = fread("stringtokendatabase.txt")
	if (buf === undefined)
		return
	const stream = new BinaryStream(new DataView(
		buf.buffer,
		buf.byteOffset,
		buf.byteLength,
	))
	if (stream.ReadUint8() !== 0x21 || stream.ReadUint8() !== 0x0A)
		return
	while (!stream.Empty()) {
		stream.RelativeSeek(6)
		let str = ""
		for (let i = stream.ReadUint8(); i !== 0x0A; i = stream.ReadUint8())
			str += String.fromCharCode(i)
		Manifest.SaveStringToken(str)
	}
}

function ReadSoundManifest(): void {
	const manifest = fread("soundevents/soundevents_manifest.vrman_c")
	if (manifest === undefined) {
		console.log("Sound manifest not found.")
		return
	}
	ParseExternalReferences(manifest, true).forEach(path => {
		if (path.endsWith(".vsndevts_c"))
			Manifest.LoadSoundFile(path)
	})
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
	const known_strings = readJSON("known_strings.json") as string[]
	known_strings.forEach(str => Manifest.SaveStringToken(str))

	ReadStringTokenDatabase()
	ReadSoundManifest()
}
