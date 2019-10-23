import { Unit, LocalPlayer, GameSleeper, Game } from "wrapper/Imports";
import { State, SpinnerKey, ModeSpinner } from "./Menu";

export let Sleep: GameSleeper = new GameSleeper()
function GetDelayCast() {
	return ((Game.Ping / 2) + 15)
}
function MoveUnit(x: Unit) {
	switch (ModeSpinner.selected_id) {
		case 0: x.MoveTo(x.InFrontFromAngle(300, 1), false, true); break;
		case 1: x.MoveTo(x.InFrontFromAngle(250, 50), false, true); break;
	}
}

export function Tick() {
	if (!State.value || !SpinnerKey.is_pressed || Sleep.Sleeping("SpeenTime")) {
		return
	}
	if (LocalPlayer === undefined) {
		return
	}
	let myHero = LocalPlayer.Hero
	if (myHero.IsAlive && myHero.IsControllable && myHero.IsVisible && !myHero.IsStunned && !myHero.IsHexed && !myHero.IsInvulnerable) {
		MoveUnit(LocalPlayer.Hero)
		Sleep.Sleep(GetDelayCast(), "SpeenTime")
	}
}