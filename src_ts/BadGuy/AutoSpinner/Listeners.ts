import { Unit, LocalPlayer } from "wrapper/Imports";
import { State, SpinnerKey, ModeSpinner } from "./Menu";

function MoveUnit(x: Unit) {
	switch (ModeSpinner.selected_id) {
		case 0: x.MoveTo(x.InFrontFromAngle(300, 1), false, true); break;
		case 1: x.MoveTo(x.InFrontFromAngle(250, 50), false, true); break;
	}
}

export function Tick() {
	if (!State.value || !SpinnerKey.is_pressed) {
		return
	}
	if (LocalPlayer === undefined) {
		return
	}
	let myHero = LocalPlayer.Hero
	if (myHero.IsAlive && myHero.IsControllable && myHero.IsVisible && !myHero.IsStunned && !myHero.IsHexed && !myHero.IsInvulnerable) {
		MoveUnit(LocalPlayer.Hero)
	}
}