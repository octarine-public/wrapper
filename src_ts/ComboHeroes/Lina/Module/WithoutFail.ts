import { Ability, ExecuteOrder } from "wrapper/Imports";
import InitAbility from "../Extends/Abilities"
import { Owner } from "../Listeners";
export function OnExecuteOrder(order: ExecuteOrder) {
	let Abilities = new InitAbility(Owner),
		Ability = order.Ability as Ability
	if (Abilities.DragonSlave !== undefined && Ability.Index === Abilities.DragonSlave.Index && Abilities.DragonSlave.IsInAbilityPhase) {
		return false
	} else if (Abilities.LightStrikeArray !== undefined && Ability.Index === Abilities.LightStrikeArray.Index && Abilities.LightStrikeArray.IsInAbilityPhase) {
		return false
	} else if (Abilities.LagunaBlade !== undefined && Ability.Index === Abilities.LagunaBlade.Index && Abilities.LagunaBlade.IsInAbilityPhase) {
		return false
	}
	return true
}