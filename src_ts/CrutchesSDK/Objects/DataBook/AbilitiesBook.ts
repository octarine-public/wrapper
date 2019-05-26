import Item from "../Base/Item";
import Unit from "../Base/Unit";
import EntityManager from "../../Managers/EntityManager";
import Ability from "../Base/Ability";

const MAX_SKILLS = 24;

export default class AbilitiesBook {
	
	protected m_Unit: Unit
	m_hAbilities: C_DOTABaseAbility[]

	constructor(ent: Unit) {
		this.m_Unit = ent;
		this.m_hAbilities = ent.m_pBaseEntity.m_hAbilities as C_DOTABaseAbility[];
	}
	
	get CountSpells(): number {
		if (!this.m_Unit.IsValid)
			return 0;
		
		return this.m_hAbilities.length;
	}
	get Owner(): Unit {
		return this.m_Unit;
	}
	get Spells(): Ability[] {
		let spells: Ability[] = [];
		
		if (this.m_Unit.IsValid)
			spells = EntityManager.GetEntitiesByNative(this.m_hAbilities) as Ability[];
			
		return spells;
	}
	/* get ValidSpells(): Ability[] {
		let spells: Ability[] = [];

		if (this.m_Unit.IsValid) {
			let abilsNative = this.m_hAbilities

			for (let i = 0, len = abilsNative.length; i < len; i++) {
				let abil = EntityManager.GetEntityByNative(abilsNative[i]) as Ability;

				if (abil === undefined || abil.AbilityType === ABILITY_TYPES.ABILITY_TYPE_ATTRIBUTES)
					spells.push(abil);
			}
		}
		return spells;
	} */
	
	GetSpell(slot: number): Ability {
		if (!this.m_Unit.IsValid || slot > MAX_SKILLS)
			return undefined;

		return EntityManager.GetEntityByNative(this.m_hAbilities[slot]) as Ability;
	}
	GetAbilityByName(name: string): Ability {
		if (this.m_Unit.IsValid) {
			
			let abilsNative = this.m_hAbilities

			for (let i = 0, len = abilsNative.length; i < len; i++) {
				let abil = EntityManager.GetEntityByNative(abilsNative[i]) as Ability;

				if (abil !== undefined && abil.AbilityData.Name === name)
					return abil;
			}
		}
		return undefined
	}
	GetItemByRegexp(regex: RegExp): Ability {
		if (this.m_Unit.IsValid) {

			let abilsNative = this.m_hAbilities

			for (let i = 0, len = abilsNative.length; i < len; i++) {
				let abil = EntityManager.GetEntityByNative(abilsNative[i]) as Ability;

				if (abil !== undefined && regex.test(abil.AbilityData.Name))
					return abil;
			}
		}
		return undefined;
	}
}