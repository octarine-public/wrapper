import BinaryStream from "../Utils/BinaryStream"

class AdditionalRelatedFile {
	public readonly relative_filename: string
	public readonly search_path: string
	constructor(stream: BinaryStream) {
		this.relative_filename = stream.ReadOffsetString()
		this.search_path = stream.ReadOffsetString()
	}
}

class ChildResourceReference {
	public readonly id: bigint
	public readonly name: string
	constructor(stream: BinaryStream) {
		this.id = stream.ReadUint64()
		this.name = stream.ReadOffsetString()
		stream.RelativeSeek(4) // unknown
	}
}

class ArgumentDependency {
	public readonly name: string
	public readonly type: string
	public readonly fingerprint: number
	public readonly fingerprint_default: number
	constructor(stream: BinaryStream) {
		this.name = stream.ReadOffsetString()
		this.type = stream.ReadOffsetString()
		this.fingerprint = stream.ReadUint32()
		this.fingerprint_default = stream.ReadUint32()
	}
}

class ExtraFloatData {
	public readonly name: string
	public readonly value: number
	constructor(stream: BinaryStream) {
		this.name = stream.ReadOffsetString()
		this.value = stream.ReadFloat32()
	}
}

class ExtraIntData {
	public readonly name: string
	public readonly value: number
	constructor(stream: BinaryStream) {
		this.name = stream.ReadOffsetString()
		this.value = stream.ReadInt32()
	}
}

class ExtraStringData {
	public readonly name: string
	public readonly value: string
	constructor(stream: BinaryStream) {
		this.name = stream.ReadOffsetString()
		this.value = stream.ReadOffsetString()
	}
}

class InputDependency {
	public readonly relative_filename: string
	public readonly search_path: string
	public readonly crc: number
	public readonly flags: number
	constructor(stream: BinaryStream) {
		this.relative_filename = stream.ReadOffsetString()
		this.search_path = stream.ReadOffsetString()
		this.crc = stream.ReadUint32()
		this.flags = stream.ReadUint32()
	}
}

class SpecialDependency {
	public readonly str: string
	public readonly compiler_identifier: string
	public readonly fingerprint: number
	public readonly user_data: number
	constructor(stream: BinaryStream) {
		this.str = stream.ReadOffsetString()
		this.compiler_identifier = stream.ReadOffsetString()
		this.fingerprint = stream.ReadUint32()
		this.user_data = stream.ReadUint32()
	}
}

class CustomDependency {
	constructor(_: BinaryStream) {
		throw "CustomDependency is not handled at the moment"
	}
}

class ResourceEditInfo {
	public readonly InputDependencies: InputDependency[] = []
	public readonly AdditionalInputDependencies: InputDependency[] = []
	public readonly ArgumentDependencies: ArgumentDependency[] = []
	public readonly SpecialDependencies: SpecialDependency[] = []
	public readonly CustomDependencies: CustomDependency[] = []
	public readonly AdditionalRelatedFiles: AdditionalRelatedFile[] = []
	public readonly ChildResourceList: ChildResourceReference[] = []
	public readonly ExtraIntDataList: ExtraIntData[] = []
	public readonly ExtraFloatDataList: ExtraFloatData[] = []
	public readonly ExtraStringDataList: ExtraStringData[] = []

	constructor(stream: BinaryStream) {
		this.ReadBlocks(stream, this.InputDependencies, InputDependency)
		this.ReadBlocks(stream, this.AdditionalInputDependencies, InputDependency)
		this.ReadBlocks(stream, this.ArgumentDependencies, ArgumentDependency)
		this.ReadBlocks(stream, this.SpecialDependencies, SpecialDependency)
		this.ReadBlocks(stream, this.CustomDependencies, CustomDependency)
		this.ReadBlocks(stream, this.AdditionalRelatedFiles, AdditionalRelatedFile)
		this.ReadBlocks(stream, this.ChildResourceList, ChildResourceReference)
		this.ReadBlocks(stream, this.ExtraIntDataList, ExtraIntData)
		this.ReadBlocks(stream, this.ExtraFloatDataList, ExtraFloatData)
		this.ReadBlocks(stream, this.ExtraStringDataList, ExtraStringData)
	}
	private ReadBlocks<T>(stream: BinaryStream, ar: T[], block: Constructor<T>): void {
		const blocks_pos = stream.pos + stream.ReadUint32(),
			count = stream.ReadUint32()
		const prev_pos = stream.pos
		stream.pos = blocks_pos
		for (let i = 0; i < count; i++)
			ar.push(new block(stream))
		stream.pos = prev_pos
	}
}

export function ParseREDI(buf: Uint8Array): ResourceEditInfo {
	return new ResourceEditInfo(new BinaryStream(new DataView(
		buf.buffer,
		buf.byteOffset,
		buf.byteLength,
	)))
}
