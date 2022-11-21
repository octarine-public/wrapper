import { EntityPropertiesNode } from "./EntityProperties"

export class TreeModelReplacement {
	constructor(public readonly properties: EntityPropertiesNode) {}

	public get BinaryObjectID(): number {
		return this.properties.get("m_nBinaryObjectID") as number
	}
	public get Model(): string {
		return this.properties.get("m_szModel") as string
	}

	public toJSON(): any {
		return {
			BinaryObjectID: this.BinaryObjectID,
			Model: this.Model,
		}
	}
}
