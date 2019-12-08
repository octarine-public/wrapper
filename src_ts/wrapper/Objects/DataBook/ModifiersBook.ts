import Modifier from "../Base/Modifier"
import Unit from "../Base/Unit"

export default class ModifiersBook {
	public readonly Buffs: Modifier[] = []

	constructor(public readonly Owner: Unit) { }

	public GetBuffByID(id: number): Modifier {
		return this.Buffs.find(buff => buff.Index === id)
	}
	public GetBuffByName(name: string): Modifier {
		return this.Buffs.find(buff => buff.Name === name)
	}
	public GetBuffByRegexp(regex: RegExp): Modifier {
		return this.Buffs.find(buff => regex.test(buff.Name))
	}
	public GetAnyBuffByNames(names: string[]): Modifier {
		let buff: Modifier
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
