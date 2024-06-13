import { Base, IMenu } from "./Base"

export class DummyJson<T> extends Base {
	public value: T

	constructor(
		parent: IMenu,
		name: string,
		public readonly defaultValue: T
	) {
		super(parent, name, "")
		this.value = defaultValue
	}

	public get ConfigValue() {
		return this.value
	}
	public set ConfigValue(value) {
		if (this.ShouldIgnoreNewConfigValue) {
			return
		}
		this.value = value
	}
}
