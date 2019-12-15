import { TickSleeper, EntityManager, Creep } from "wrapper/Imports";
import { Base } from "../Extends/Helper"
import { State, AutoDeathPactState } from "../Menu";
import { Owner, initAbilityMap, initItemsMap } from "../Listeners";

let Sleep = new TickSleeper
export function InitAutoDeathPact() {
	if (!Base.IsRestrictions(State) || Owner.IsInvulnerable || Owner.InvisibleLevel > 0 || !AutoDeathPactState.value || Sleep.Sleeping)
		return
	let Abilities = initAbilityMap.get(Owner),
		Items = initItemsMap.get(Owner)
	if (Abilities === undefined || Items === undefined || Abilities.DeathPact === undefined
		|| !Abilities.DeathPact.CanBeCasted())
		return
	let Creeps = EntityManager.GetEntitiesByClass<Creep>(Creep, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY)
	let Creep_enemy = Creeps.find(x => x.IsValid
		&& x.IsSpawned
		&& x.IsVisible && !x.IsAncient && !x.IsMagicImmune
		&& Abilities.DeathPact.GetSpecialValue("neutral_level") >= x.Level
		&& x.Distance(Owner) <= Abilities.DeathPact.CastRange)
	if (Creep_enemy === undefined)
		return
	// modifier_clinkz_death_pact
	// console.log(Owner.ModifiersBook.Buffs.map(e => e.Name))
	Abilities.DeathPact.UseAbility(Creep_enemy)
	Sleep.Sleep(Creeps.length * 1.2)
	return
}