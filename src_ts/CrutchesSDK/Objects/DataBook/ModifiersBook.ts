import ModifierManager from "../../Managers/ModifierManager";
import Unit from "../Base/Unit";
import Modifier from "../Base/Modifier";

export default class ModifiersBook {

	private m_Unit: Unit
	m_hBuffs: CDOTA_Buff[] = []
	
	constructor(ent: Unit) {
		this.m_Unit = ent;
	}
	
	get Buffs(): Modifier[] {
		
		let buffs: Modifier[] = [];

		if (this.m_Unit.IsValid) {
			let buffsNative = this.m_hBuffs

			for (let i = 0, len = buffsNative.length; i < len; i++) {

				/* let buffNative = buffsNative[i];

				if (buffNative.m_bMarkedForDeletion)
					continue */

				let buff = ModifierManager.GetModifierByNative(/* buffNative */buffsNative[i]);

				if (buff !== undefined)
					buffs.push(buff);
			}
		}
		return buffs;
	}
	get CountBuffs(): number {
		if (!this.m_Unit.IsValid)
			return 0;

		return this.m_hBuffs.length;
	}
	get Owner(): Unit {
		return this.m_Unit;
	}
	
	GetBuff(num: number): Modifier {
		if (!this.m_Unit.IsValid)
			return undefined;
		return ModifierManager.GetModifierByNative(this.m_hBuffs[num]);
	}
	GetBuffByName(name: string): Modifier {
		if (this.m_Unit.IsValid) {
			let buffsNative = this.m_hBuffs

			for (let i = 0, len = buffsNative.length; i < len; i++) {

				/* let buffNative = buffsNative[i];

				if (buffNative.m_bMarkedForDeletion)
					continue */

				let buff = ModifierManager.GetModifierByNative(/* buffNative */buffsNative[i]);

				if (buff !== undefined && buff.Name === name)
					return buff;
			}
		}
		return undefined;
	}
	GetBuffByRegexp(regex: RegExp): Modifier {
		if (this.m_Unit.IsValid) {
			let buffsNative = this.m_hBuffs

			for (let i = 0, len = buffsNative.length; i < len; i++) {

				/* let buffNative = buffsNative[i];

				if (buffNative.m_bMarkedForDeletion)
					continue */

				let buff = ModifierManager.GetModifierByNative(/* buffNative */buffsNative[i]);

				if (buff !== undefined && regex.test(buff.Name))
					return buff;
			}
		}
		return undefined;
	}
	GetAnyBuffByNames(names: string[]): Modifier {
		let buff: Modifier;
		names.some(name => (buff = this.GetBuffByName(name)) !== undefined);
		return buff;
	}
	HasAnyBuffByNames(names: string[]): boolean {
		return names.some(name => this.GetBuffByName(name) !== undefined);
	}
}