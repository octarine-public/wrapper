import Modifier from "../Base/Modifier"
import Unit from "../Base/Unit"

export default class ModifiersBook {
	public readonly Buffs: Modifier[] = []

	constructor(public readonly Owner: Unit) { }

	public GetBuffByID(id: number): Nullable<Modifier> {
		return this.Buffs.find(buff => buff.Index === id)
	}
	public GetBuffByName(name: string): Nullable<Modifier> {
		return this.Buffs.find(buff => buff.Name === name)
	}
	public HasBuffByName(name: string): boolean {
		return this.Buffs.some(buff => buff.Name === name)
	}
	public GetBuffByRegexp(regex: RegExp): Nullable<Modifier> {
		return this.Buffs.find(buff => regex.test(buff.Name))
	}
	public GetAnyBuffByNames(names: string[]): Nullable<Modifier> {
		let buff: Nullable<Modifier>
		names.some(name => (buff = this.GetBuffByName(name)) !== undefined)
		return buff
	}
	public HasAnyBuffByNames(names: string[]): boolean {
		return names.some(name => this.GetBuffByName(name) !== undefined)
	}
}
