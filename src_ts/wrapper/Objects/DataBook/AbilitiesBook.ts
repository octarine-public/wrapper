import EntityManager from "../../Managers/EntityManager"
import Ability from "../Base/Ability"
import Unit from "../Base/Unit"

const MAX_SKILLS = 31

export default class AbilitiesBook {
	public Spells_: (Ability | CEntityIndex)[]

	constructor(public readonly Owner: Unit) {
		// loop-optimizer: FORWARD
		this.Spells_ = this.Owner.m_pBaseEntity.m_hAbilities.map(abil => EntityManager.GetEntityByNative(abil) as Ability || abil)
	}

	// NOTICE: idk...
	get Spells(): Nullable<Ability>[] {
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

	public GetSpell(slot: number): Nullable<Ability> {
		if (!this.Owner.IsValid || slot > MAX_SKILLS)
			return undefined

		return this.Spells[slot]
	}

	public GetAbilityByName(name: string | RegExp): Nullable<Ability> {
		return this.Spells.find(abil =>
			abil !== undefined
			&& (
				name instanceof RegExp
					? name.test(abil.Name)
					: abil.Name === name
			),
		)
	}
}
