// import { LocalPlayer } from "wrapper/Imports"
// import { Base } from "./Extends/Helper"
// import { MouseTarget, Owner, initDrawBaseMap, initItemsMap, initAbilityMap } from "./Listeners"
// import { DrawTargetItem, State, Radius, BurningArmyRadiusColor, AttackRangeRadius, RadiusColorAttackRange } from "./Menu"

// export function Draw() {
// 	if (LocalPlayer === undefined || LocalPlayer.IsSpectator || Owner === undefined)
// 		return

// 	let Particle = initDrawBaseMap.get(Owner),
// 		Items = initItemsMap.get(Owner),
// 		Abilities = initAbilityMap.get(Owner)
// 	if (Items === undefined || Abilities === undefined || Particle === undefined)
// 		return

// 	Particle.RenderLineTarget(Base, DrawTargetItem, State, MouseTarget)
// 	Particle.RenderAttackRange(State, AttackRangeRadius, Owner.AttackRange, RadiusColorAttackRange.Color)
// 	Particle.Render(Abilities.Blink, "antimage_blink", Abilities.Blink.CastRange, Radius, State, BurningArmyRadiusColor.Color)
// 	Particle.Render(Abilities.ManaVoid, "antimage_mana_void", Abilities.Blink.CastRange, Radius, State, BurningArmyRadiusColor.Color)
// }