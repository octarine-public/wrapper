import { parseKVBlock } from "./ParseKV"
import { GetMapNumberProperty, GetMapStringProperty } from "./ParseUtils"

class AdditionalRelatedFile {
	public relative_filename = ""
	public search_path = ""

	public ReadV1(stream: ReadableBinaryStream): void {
		this.relative_filename = stream.ReadOffsetString()
		this.search_path = stream.ReadOffsetString()
	}
	public ReadV2(map: RecursiveMap): this {
		return this
	}
}

class ChildResourceReference {
	public id = 0n
	public name = ""

	public ReadV1(stream: ReadableBinaryStream): void {
		this.id = stream.ReadUint64()
		this.name = stream.ReadOffsetString()
		stream.RelativeSeek(4) // unknown
	}
	public ReadV2(map: RecursiveMap): this {
		return this
	}
}

class ArgumentDependency {
	public name = ""
	public type = ""
	public fingerprint = 0
	public fingerprint_default = 0

	public ReadV1(stream: ReadableBinaryStream): void {
		this.name = stream.ReadOffsetString()
		this.type = stream.ReadOffsetString()
		this.fingerprint = stream.ReadUint32()
		this.fingerprint_default = stream.ReadUint32()
	}
	public ReadV2(map: RecursiveMap): this {
		return this
	}
}

class ExtraFloatData {
	public name = ""
	public value = 0

	public ReadV1(stream: ReadableBinaryStream): void {
		this.name = stream.ReadOffsetString()
		this.value = stream.ReadFloat32()
	}
	public ReadV2(map: RecursiveMap): this {
		return this
	}
}

class ExtraIntData {
	public name = ""
	public value = 0

	public ReadV1(stream: ReadableBinaryStream): void {
		this.name = stream.ReadOffsetString()
		this.value = stream.ReadInt32()
	}
	public ReadV2(map: RecursiveMap): this {
		return this
	}
}

class ExtraStringData {
	public name = ""
	public value = ""

	public ReadV1(stream: ReadableBinaryStream): void {
		this.name = stream.ReadOffsetString()
		this.value = stream.ReadOffsetString()
	}
	public ReadV2(map: RecursiveMap): this {
		return this
	}
}

class InputDependency {
	public relative_filename = ""
	public search_path = ""
	public crc = 0
	public flags = 0

	public ReadV1(stream: ReadableBinaryStream): void {
		this.relative_filename = stream.ReadOffsetString()
		this.search_path = stream.ReadOffsetString()
		this.crc = stream.ReadUint32()
		this.flags = stream.ReadUint32()
	}
	public ReadV2(map: RecursiveMap): this {
		return this
	}
}

class SpecialDependency {
	public str = ""
	public compiler_identifier = ""
	public fingerprint = 0
	public user_data = 0

	public ReadV1(stream: ReadableBinaryStream): void {
		this.str = stream.ReadOffsetString()
		this.compiler_identifier = stream.ReadOffsetString()
		this.fingerprint = stream.ReadUint32()
		this.user_data = stream.ReadUint32()
	}
	public ReadV2(map: RecursiveMap): this {
		this.str = GetMapStringProperty(map, "m_String")
		this.compiler_identifier = GetMapStringProperty(map, "m_CompilerIdentifier")
		this.fingerprint = GetMapNumberProperty(map, "m_nFingerprint")
		this.user_data = GetMapNumberProperty(map, "m_nUserData")
		return this
	}
}

class CustomDependency {
	public ReadV1(_: ReadableBinaryStream): void {
		throw "CustomDependency is not handled at the moment"
	}
	public ReadV2(map: RecursiveMap): this {
		throw "CustomDependency is not handled at the moment"
	}
}

interface REDIBlock {
	ReadV1(stream: ReadableBinaryStream): void
	ReadV2(map: RecursiveMap): this
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

	public ReadV1(stream: ReadableBinaryStream): void {
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
	public ReadV2(map: Nullable<RecursiveMap>): void {
		if (map === undefined)
			return
		const specialDependencies = map.get("m_SpecialDependencies")
		if (Array.isArray(specialDependencies))
			specialDependencies.forEach(el => {
				if (el instanceof Map)
					this.SpecialDependencies.push(new SpecialDependency().ReadV2(el))
			})
	}
	private ReadBlocks<T extends REDIBlock>(stream: ReadableBinaryStream, ar: T[], block: Constructor<T>): void {
		const blocks_pos = stream.pos + stream.ReadUint32(),
			count = stream.ReadUint32()
		const prev_pos = stream.pos
		stream.pos = blocks_pos
		for (let i = 0; i < count; i++) {
			const el = new block()
			el.ReadV1(stream)
			ar.push(el)
		}
		stream.pos = prev_pos
	}
}

export function ParseREDI(stream: Nullable<ReadableBinaryStream>): Nullable<ResourceEditInfo> {
	if (stream === undefined)
		return undefined
	const REDI = new ResourceEditInfo()
	REDI.ReadV1(stream)
	return REDI
}

export function ParseRED2(stream: Nullable<ReadableBinaryStream>): Nullable<ResourceEditInfo> {
	if (stream === undefined)
		return undefined
	const REDI = new ResourceEditInfo()
	REDI.ReadV2(parseKVBlock(stream))
	return REDI
}
