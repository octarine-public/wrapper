import { Base } from "../Extends/Helper"
import { Owner, Creeps, initAbilityMap, initItemsMap } from "../Listeners";
import { TickSleeper } from "wrapper/Imports";
import { State, AutoDeathPactState } from "../Menu";
let Sleep = new TickSleeper
export function InitAutoDeathPact() {
	if (!Base.IsRestrictions(State) || Owner.IsInvulnerable || Owner.InvisibleLevel > 0 || !AutoDeathPactState.value || Sleep.Sleeping)
		return
	let Abilities = initAbilityMap.get(Owner),
		Items = initItemsMap.get(Owner)
	if (Abilities === undefined || Items === undefined || Abilities.DeathPact === undefined
		|| !Abilities.DeathPact.CanBeCasted())
		return
	let Creep = Creeps.find(x => x.IsValid && x.IsSpawned
		&& x.IsVisible && !x.IsAncient && !x.IsMagicImmune
		&& Abilities.DeathPact.GetSpecialValue("neutral_level") >= x.Level
		&& x.IsEnemy() && x.Distance(Owner) <= Abilities.DeathPact.CastRange)
	if (Creep === undefined)
		return
	// modifier_clinkz_death_pact
	// console.log(Owner.ModifiersBook.Buffs.map(e => e.Name))
	Abilities.DeathPact.UseAbility(Creep)
	Sleep.Sleep(Creeps.length * 1.2)
	return
}