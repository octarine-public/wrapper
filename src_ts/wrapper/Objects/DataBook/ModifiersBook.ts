import Modifier, { ModifierNullable } from "../Base/Modifier"
import Unit from "../Base/Unit"

export default class ModifiersBook {
	public readonly Buffs: Modifier[] = []

	constructor(public readonly Owner: Unit) { }

	public GetBuffByID(id: number): ModifierNullable {
		return this.Buffs.find(buff => buff.Index === id)
	}
	public GetBuffByName(name: string): ModifierNullable {
		return this.Buffs.find(buff => buff.Name === name)
	}
	public GetBuffByRegexp(regex: RegExp): ModifierNullable {
		return this.Buffs.find(buff => regex.test(buff.Name))
	}
	public GetAnyBuffByNames(names: string[]): ModifierNullable {
		let buff: ModifierNullable
		names.some(name => (buff = this.GetBuffByName(name)) !== undefined)
		return buff
	}
	public HasBuffByName(name: string): boolean {
		return this.Buffs.some(buff => buff.Name === name)
	}
	public HasAnyBuffByNames(names: string[]): boolean {
		return names.some(name => this.GetBuffByName(name) !== undefined)
	}
}
