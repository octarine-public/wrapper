import Unit from "../Base/Unit";
import Modifier from "../Base/Modifier";

export default class ModifiersBook {

	private m_Unit: Unit
	m_Buffs: Modifier[] = [];
	
	constructor(ent: Unit) {
		this.m_Unit = ent;
	}
	
	get Buffs(): Modifier[] {
		if (!this.m_Unit.IsValid)
			return [];
		
		return this.m_Buffs//.filter(buff => !buff.m_pBuff.m_bMarkedForDeletion);
	}
	get CountBuffs(): number {
		if (!this.m_Unit.IsValid)
			return 0;

		return this.m_Buffs/* .filter(buff => !buff.m_pBuff.m_bMarkedForDeletion) */.length;
	}
	get Owner(): Unit {
		return this.m_Unit;
	}
	
	GetBuff(num: number): Modifier {
		if (!this.m_Unit.IsValid)
			return undefined;
		return this.m_Buffs[num];
	}
	GetBuffByName(name: string): Modifier {
		if (!this.m_Unit.IsValid)
			return undefined;
		
		return this.m_Buffs.find(buff => /* !buff.m_pBuff.m_bMarkedForDeletion && */ buff.Name === name);
	}
	GetBuffByRegexp(regex: RegExp): Modifier {
		if (!this.m_Unit.IsValid)
			return undefined;

		return this.m_Buffs.find(buff => /* !buff.m_pBuff.m_bMarkedForDeletion && */ regex.test(buff.Name));
	}
	GetAnyBuffByNames(names: string[]): Modifier {
		if (!this.m_Unit.IsValid)
			return undefined;
		
		let buff: Modifier;
		names.some(name => (buff = this.GetBuffByName(name)) !== undefined);
		return buff;
	}
	HasAnyBuffByNames(names: string[]): boolean {
		if (!this.m_Unit.IsValid)
			return undefined;
		
		return names.some(name => this.GetBuffByName(name) !== undefined);
	}
}