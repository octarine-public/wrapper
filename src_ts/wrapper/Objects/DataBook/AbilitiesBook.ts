import EntityManager from "../../Managers/EntityManager"
import Ability from "../Base/Ability"
import Unit from "../Base/Unit"

const MAX_SKILLS = 31

export default class AbilitiesBook {
	public Spells_: Array<Ability | number>

	constructor(public readonly Owner: Unit) {
		// loop-optimizer: FORWARD
		this.Spells_ = this.Owner.m_pBaseEntity.m_hAbilities.map(abil => EntityManager.GetEntityByNative(abil) as Ability || (abil instanceof C_BaseEntity ? abil.m_pEntity.m_iIndex : abil))
	}

	get Spells(): Ability[] {
		// loop-optimizer: FORWARD
		return (this.Spells_ = EntityManager.GetEntitiesByNative(this.Spells_)).map(abil => abil instanceof Ability ? abil : undefined)
	}

	/* get ValidSpells(): Ability[] {
		let spells: Ability[] = [];

		if (this.m_Unit.IsValid) {
			let abilsNative = this.NativeAbilities

			for (let i = 0, len = abilsNative.length; i < len; i++) {
				let abil = EntityManager.GetEntityByNative(abilsNative[i]) as Ability;

				if (abil === undefined || abil.AbilityType === ABILITY_TYPES.ABILITY_TYPE_ATTRIBUTES)
					spells.push(abil);
			}
		}
		return spells;
	} */

	GetSpell(slot: number): Ability {
		if (!this.Owner.IsValid || slot > MAX_SKILLS)
			return undefined

		return this.Spells[slot]
	}

	GetAbilityByName(name: string | RegExp): Ability {
		return this.Spells.find(abil =>
			abil !== undefined
			&& (
				name instanceof RegExp
					? name.test(abil.Name)
					: abil.Name === name
			),
		)
	}

	GetAbilityByNativeClass(class_: any): Ability {
		return this.Spells.find(abil => abil !== undefined && abil.m_pBaseEntity instanceof class_)
	}
}
