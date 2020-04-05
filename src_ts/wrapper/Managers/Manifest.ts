import Events from "./Events"
import BinaryStream from "../Utils/BinaryStream"
import { Utf8ArrayToStr, StringToUTF8, ParseExternalReferences } from "../Utils/Utils"
import { MurmurHash64, MurmurHash2 } from "../Native/WASM"
import { parseKV } from "../Utils/ParseKV"

const Manifest = new (class CManifest {
	public readonly Directories: string[] = []
	public readonly Extensions: string[] = []
	public readonly FileNames: string[] = []
	public readonly Paths = new Map<bigint, [number, number, number]>()
	public readonly SoundHashToString = new Map<number, string>()
	/*public readonly PathHash32To64 = new Map<number, bigint>()
	public readonly Hash32ToString = new Map<number, string>()*/

	public GetPathByHash(hash: bigint): Nullable<string> {
		if (hash === 0n)
			return "<null>"
		// it's interpret as signed int64 in protobuf messages, so we need to wrap it into unsigned
		hash = BigInt.asUintN(64, hash)
		let path = this.Paths.get(hash)
		if (path === undefined) {
			console.log(`Unknown resource hash ${hash} passed to GetPathByHash ${new Error().stack}`)
			return undefined
		}
		return `${this.Directories[path[0]]}${this.FileNames[path[1]]}.${this.Extensions[path[2]]}`
	}
	/*public SaveStringToken(str: string): number {
		let hash = MurmurHash2(StringToUTF8(str.toLowerCase()).buffer)
		if (!this.PathHash32To64.has(hash) && !this.Hash32ToString.has(hash))
			this.Hash32ToString.set(hash, str)
		return hash
	}
	public LookupStringByToken(hash: number): Nullable<string> {
		if (hash === 0)
			return "<null>"
		// it's interpret as signed int32 in protobuf messages, so we need to wrap it into unsigned
		hash = hash >>> 0

		let hash64 = this.PathHash32To64.get(hash)
		if (hash64 !== undefined) {
			let path = this.Paths.get(hash64)!
			return `${this.Directories[path[0]]}${this.FileNames[path[1]]}.${this.Extensions[path[2]]}`
		}
		return this.Hash32ToString.get(hash)
	}*/
	public LoadSoundFile(path: string): void {
		let buf = readFile(path)
		if (buf === undefined) {
			console.log(`Missing ${path}`)
			return
		}
		// loop-optimizer: KEEP
		parseKV(buf).forEach((_, name) => this.SoundHashToString.set(MurmurHash2(StringToUTF8(name.toLowerCase()), 0x53524332), name))
	}
	public LookupSoundNameByHash(hash: number): Nullable<string> {
		if (hash === 0)
			return "<null>"
		return this.SoundHashToString.get(hash >>> 0)
	}
})
export default Manifest

function BufferToPathString(buf: ArrayBuffer): string {
	return Utf8ArrayToStr(new Uint8Array(buf)).replace(/\\/g, "/").toLowerCase()
}

function ParseStringFromStream(stream: BinaryStream, ar: string[]) {
	let id = stream.ReadVarUintAsNumber(),
		size = stream.ReadVarUintAsNumber()
	if (id === ar.length)
		ar[id] = BufferToPathString(stream.ReadSlice(size))
	else
		stream.RelativeSeek(size)
}

function InitManifest() {
	Manifest.Directories.splice(0)
	Manifest.Extensions.splice(0)
	Manifest.FileNames.splice(0)
	Manifest.Paths.clear()
	// Manifest.PathHash32To64.clear()
	Manifest.SoundHashToString.clear()

	let manifest = readFile("soundevents/soundevents_manifest.vrman_c")
	if (manifest === undefined) {
		console.log("Sound manifest not found.")
		return
	}
	ParseExternalReferences(manifest).forEach(path => {
		if (path.endsWith("vsndevts"))
			Manifest.LoadSoundFile(path + "_c")
	})
}

Events.on("ServerMessage", (msg_id, buf) => {
	switch (msg_id) {
		case 9: { // we have custom parsing for CNETMsg_SpawnGroup_Load & CNETMsg_SpawnGroup_ManifestUpdate
			let stream = new BinaryStream(new DataView(buf))
			for (let i = 0, end = stream.ReadVarUintAsNumber(); i < end; i++)
				ParseStringFromStream(stream, Manifest.Extensions)
			for (let i = 0, end = stream.ReadVarUintAsNumber(); i < end; i++)
				ParseStringFromStream(stream, Manifest.Directories)
			for (let i = 0, end = stream.ReadVarUintAsNumber(); i < end; i++) {
				let path_id = stream.ReadVarUintAsNumber(),
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
				let path = `${Manifest.Directories[dir_id]}${Manifest.FileNames[file_id]}.${Manifest.Extensions[ext_id]}`
				if (Manifest.Extensions[ext_id] === "vsndevts")
					Manifest.LoadSoundFile(`${path}_c`)
				let hash64 = MurmurHash64(StringToUTF8(path).buffer)
				Manifest.Paths.set(hash64, [dir_id, file_id, ext_id])
				// Manifest.PathHash32To64.set(MurmurHash2(StringToUTF8(path.toLowerCase()).buffer), hash64)
			}
			break
		}
		case 40: // reset Manifest on CSVCMsg_ServerInfo
			InitManifest()
			break
		default:
			break
	}
})

/*
Manifest.SaveStringToken("")
Manifest.SaveStringToken("invalid_hitbox")
Manifest.SaveStringToken("invalid_bone")
Manifest.SaveStringToken("default")

let buf = readFile("stringtokendatabase.txt")
if (buf !== undefined) {
	let stream = new BinaryStream(new DataView(buf))
	if (stream.Next() === 0x21 && stream.Next() === 0x0A) {
		while (!stream.Empty()) {
			stream.RelativeSeek(6)
			let str = ""
			for (let i = stream.Next(); i !== 0x0A; i = stream.Next())
				str += String.fromCharCode(i)
			Manifest.SaveStringToken(str)
		}
	}
}
*/
