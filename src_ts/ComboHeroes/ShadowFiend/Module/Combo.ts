import { Game, Vector3, Ability, Unit } from "wrapper/Imports"
import { Owner } from "../Listeners"
// import { Base } from "../Extends/Helper";
// import InitItems from "../Extends/Items"

// import {
// 	State,
// 	BladeMailCancel,
// 	СomboItems,
// 	Menu_Combo_BlinkDistance,
// 	СomboAbility,
// 	array_items,
// 	array_ability,
// 	ComboHitAndRunAttack,
// 	TypeHitAndRun,
// 	StyleCombo,
// 	ComboKeyItem
// } from "../Menu";
// import { BreakInit } from "./LinkenBreaker";

// export let Target: Hero
// let BuffForCheckTarget: string[] = [
// 	"modifier_item_lotus_orb_active",
// 	"modifier_nyx_assassin_spiked_carapace",
// 	"modifier_winter_wyvern_winters_curse",
// ]
// let Sleep = new Sleeper(),
// 	SafeTarget = new Vector3()

// export let ComboActived = false
// ComboKeyItem.OnRelease(() => ComboActived = !ComboActived);

// function UseBlackKingBar(Items: InitItems) {
// 	if (СomboItems.IsEnabled("item_black_king_bar")) {
// 		var BlackingBar = Items.BlackKingBar
// 		if (BlackingBar && BlackingBar.CanBeCasted()) {
// 			BlackingBar.UseAbility(Owner)
// 		}
// 	}
// }

function GetPosition(unit: Unit, delay: number) {
	if (!delay || !unit.IsMoving || unit.IsRooted)
		return unit.Position
	return unit.InFront(unit.Speed * ((delay + Game.Ping / 1000) || 1))
}

function GetCastDelay(abil: Ability, pos: Unit | Vector3) {
	if (pos instanceof Unit)
		return abil.CastPoint + Owner.TurnTime(pos.Position) + (Game.Ping / 1000)
	return abil.CastPoint + Owner.TurnTime(pos) + (Game.Ping / 1000)
}

export function PredictionRize(ability: Ability, enemy: Unit, RazeRadius: number) {
	return enemy.IsAlive && GetPosition(enemy, GetCastDelay(ability, enemy)).IsInRange(Owner.InFront(ability.CastRange), RazeRadius + enemy.HullRadius * 1.1) // * 1.1 wtf
}

// function InitCast(ability: Ability, array: Menu.ImageSelector, name: string) {
// 	if (!Target || !array.IsEnabled(name) || Target.IsMagicImmune || Target.IsInvulnerable || !SafeTarget.IsZero()) {
// 		return;
// 	}
// 	if (!ability || ability === undefined || !ability.CanBeCasted()) {
// 		return;
// 	}
// 	if (name.includes("nevermore_shadowraze")) {
// 		if (PredictionRize(ability, Target, ability.GetSpecialValue("shadowraze_radius"))) {
// 			ability.UseAbility(Owner);
// 			Sleep.Sleep(GetDelayCast(), name)
// 			return true
// 		} else if (ability.IsInAbilityPhase && Target.IsMoving) {
// 			Owner.OrderStop(false)
// 			return false
// 		}
// 	} else {
// 		if (!ability.HasTargetTeam(2) && ability.HasTargetTeam(1)) {
// 			ability.UseAbility(Owner)
// 			Sleep.Sleep(GetDelayCast(), name)
// 			return true
// 		}
// 		ability.UseAbility(Target);
// 		Sleep.Sleep(GetDelayCast(), name)
// 		return true
// 	}
// 	return false
// }

// export function InitCombo() {
// 	if (!Base.IsRestrictions(State) || (Target = MouseTarget) === undefined || Sleep.Sleeping(Target.Index)) {
// 		return
// 	}
// 	if ((StyleCombo.selected_id === 1 && !ComboActived) || (StyleCombo.selected_id === 0 && !ComboKeyItem.is_pressed)) {
// 		return
// 	}
// 	if (Owner.Distance2D(Target) >= (1175 + 0.75 * (Owner.IdealSpeed * 0.5))) { // !isInRange
// 		Owner.MoveTo(Target.Position);
// 		Sleep.Sleep(GetDelayCast(), Target.Index)
// 		return
// 	}
// 	if (CheckBuffToReflect() || Base.IsCounterspellProtected(Target)) {
// 		return;
// 	}
// 	let Items = initItemsMap.get(Owner),
// 		Abilities = initAbilityMap.get(Owner),
// 		HitAndRun_Unit = initHitAndRunMap.get(Owner);

// 	if (Items === undefined || Abilities === undefined || HitAndRun_Unit === undefined) {
// 		return
// 	}
// 	let calc_pos_1 = Owner.Distance2D(Target) / Owner.IdealSpeed,
// 		calc_pos_2 = Abilities.Requiem.CastPoint + (Game.Ping / 1000);
// 	if (СomboItems.IsEnabled("item_blink")) {
// 		let blink = Items.Blink;
// 		let Cyclone = Items.Cyclone;
// 		if (blink && !Sleep.Sleeping(blink) && blink.CanBeCasted()) {
// 			if (Cyclone && Cyclone.CanBeCasted() && Owner.Distance2D(Target) < (1175 + 0.75 * (Owner.IdealSpeed * 0.5))) { // check
// 				if (calc_pos_1 > calc_pos_2 + 0.25) {
// 					let BPosition = Target.Position.Add(Owner.Position.SubtractForThis(Target.Position).Normalize().ScaleTo(0.75 * (Owner.IdealSpeed * 0.5)));
// 					blink.UseAbility(BPosition)
// 					Sleep.Sleep(GetDelayCast(), blink)
// 					UseBlackKingBar(Items);
// 					return
// 				}
// 			}
// 			if ((Abilities.Requiem && !Abilities.Requiem.CanBeCasted()) || (!Cyclone || !Cyclone.CanBeCasted())) {
// 				let blinkPos = Target.Position.Extend(Utils.CursorWorldVec, Menu_Combo_BlinkDistance.value);
// 				if (Owner.Distance2D(blinkPos) > blink.AOERadius)
// 					blinkPos = Owner.Position.Extend(blinkPos, blink.AOERadius - 1);
// 				if (Owner.Distance2D(Target) >= Owner.AttackRange) {
// 					blink.UseAbility(blinkPos);
// 					UseBlackKingBar(Items);
// 					Sleep.Sleep(GetDelayCast(), blink)
// 					return
// 				}
// 			}
// 		}
// 	}
// 	if (Base.IsBlockingAbilities(Target)) {
// 		BreakInit()
// 		return
// 	}
// 	if ((Abilities.Requiem && Abilities.Requiem.CanBeCasted())) {
// 		let Cyclone = Items.Cyclone;
// 		let blink = Items.Blink;
// 		if (Cyclone && СomboItems.IsEnabled(Cyclone.Name)
// 			&& (!Sleep.Sleeping(Target.Index) || !Sleep.Sleeping(Cyclone))
// 			&& Cyclone.CanBeCasted()
// 		) {
// 			SafeTarget = Target.Position
// 			if (calc_pos_1 < calc_pos_2 - 1.35) {
// 				UseBlackKingBar(Items);
// 				Owner.CastTarget(Cyclone, Target);
// 				Sleep.Sleep(GetDelayCast(), Cyclone)
// 				return
// 			}
// 			if (blink && !blink.CanBeCasted()) {
// 				Owner.MoveTo(Target.Position)
// 				Sleep.Sleep(GetDelayCast(), Target.Index)
// 				return
// 			} else {
// 				if (blink && blink.CanBeCasted()) {
// 					let BPosition = Target.Position.Add(Owner.Position.SubtractForThis(Target.Position).Normalize().ScaleTo(0.75 * (Owner.IdealSpeed * 0.5)));
// 					blink.UseAbility(BPosition)
// 					UseBlackKingBar(Items);
// 					Sleep.Sleep(GetDelayCast(), blink)
// 				}
// 			}
// 		}
// 	}

// 	let EulBuff = Target.GetBuffByName("modifier_eul_cyclone")
// 	if (EulBuff !== undefined && !Sleep.Sleeping(Target.Index)) {
// 		let GameTime = Game.RawGameTime,
// 			CastTime = (EulBuff.DieTime - GameTime) - ((Abilities.Requiem && Abilities.Requiem.CastPoint + 0.1) - Game.Ping / 2000)
// 		if (!Owner.IsInRange(SafeTarget, 64 / 2) && !Sleep.Sleeping(Target.Index)) {
// 			Owner.MoveTo(SafeTarget);
// 			Sleep.Sleep(GetDelayCast(), Target.Index)
// 			return
// 		}
// 		if (CastTime > 0 || !СomboAbility.IsEnabled(Abilities.Requiem.Name)
// 			|| (Abilities.Requiem !== undefined && !Abilities.Requiem.CanBeCasted())) {
// 			return
// 		}
// 		Owner.CastNoTarget(Abilities.Requiem)
// 		Sleep.Sleep(GetDelayCast(), Target.Index)
// 		SafeTarget = new Vector3()
// 		return
// 	}

// 	if (Base.IsAeonProtected(Target) && !Sleep.Sleeping("item_nullifier") && InitCast(Owner.GetItemByName("item_nullifier"), СomboItems, "item_nullifier"))
// 		return
// 	if (array_items.some(x => !Sleep.Sleeping(x) && x !== "item_blink" && x !== "item_cyclone" && InitCast(Owner.GetItemByName(x), СomboItems, x)))
// 		return
// 	if (array_ability.some(x => !Sleep.Sleeping(x) && x !== "nevermore_requiem" && InitCast(Owner.GetAbilityByName(x), СomboAbility, x)))
// 		return

// 	if (Target.IsEthereal && !Sleep.Sleeping(Target.Index)) {
// 		Owner.MoveTo(Target.Position);
// 		Sleep.Sleep(GetDelayCast(), Target.Index)
// 		return
// 	}
// 	if (!Owner.CanAttack(Target) || (!HitAndRun_Unit.ExecuteTo(Target, TypeHitAndRun.selected_id)
// 		&& ComboHitAndRunAttack.value) || !ComboHitAndRunAttack.value)
// 		return;

// 	Owner.AttackTarget(Target)
// 	Sleep.FullReset()
// }

// function CheckBuffToReflect() {
// 	if (BladeMailCancel.value && Target.HasBuffByName("modifier_item_blade_mail_reflect"))
// 		return true;

// 	for (var i = 0, len = BuffForCheckTarget.length; i < len; i++)
// 		if (Target.HasBuffByName(BuffForCheckTarget[i]))
// 			return BuffForCheckTarget[i] === "modifier_nyx_assassin_spiked_carapace"
// }
// export function ComboGameEnded() {
// 	Sleep.FullReset()
// 	ComboActived = false
// 	SafeTarget = new Vector3()
// }