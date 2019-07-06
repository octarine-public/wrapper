import Item from "../Base/Item";
import Unit from "../Base/Unit";
import EntityManager from "../../Managers/EntityManager";
import Ability from "../Base/Ability";

const MAX_SKILLS = 30;

export default class AbilitiesBook {
	readonly Owner: Unit
	readonly m_hAbilities: C_DOTABaseAbility[]

	constructor(ent: Unit) {
		this.Owner = ent;
		this.m_hAbilities = this.Owner.m_pBaseEntity.m_hAbilities as C_DOTABaseAbility[]
	}
	
	get CountSpells(): number {
		if (!this.Owner.IsValid)
			return 0;
		
		return this.m_hAbilities.length;
	}

	get Spells(): Ability[] {
		return this.Owner.IsValid
			? EntityManager.GetEntitiesByNative(this.m_hAbilities) as Ability[]
			: []
	}

	SpellsByOwner(excludeNativeSpells: boolean = false): Ability[] {
		let owner = this.Owner,
			abilsNative = this.m_hAbilities;
		
		return EntityManager.AllEntities.filter(entity => 
			entity instanceof Ability
			&& !(entity.m_pBaseEntity instanceof C_DOTA_Ability_Morphling_Waveform)
			&& !(entity instanceof Item)
			&& !entity.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_PASSIVE)
			&& entity.Owner === owner
			&& (!excludeNativeSpells || !abilsNative.includes(entity.m_pBaseEntity))
		) as Ability[];
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

	SetSpell(slot: number, ability: Ability) {
		this.m_hAbilities[slot] = ability.m_pBaseEntity;
	}

	GetSpell(slot: number): Ability {
		if (!this.Owner.IsValid || slot > MAX_SKILLS)
			return undefined;

		return EntityManager.GetEntityByNative(this.m_hAbilities[slot]) as Ability;
	}

	GetAbilityByName(name: string | RegExp): Ability {
		return this.Spells.find(abil =>
			abil !== undefined
			&& (
				name instanceof RegExp
					? name.test(abil.AbilityData.Name)
					: abil.AbilityData.Name === name
			)
		)
	}
}
