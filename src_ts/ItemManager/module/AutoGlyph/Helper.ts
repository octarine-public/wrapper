import { ArrayExtensions, Building, Entity, Game, GameSleeper, LocalPlayer, Player, Team, Unit } from "wrapper/Imports"
import { StateBase } from "../../abstract/MenuBase"
import { State, TowerHP, TowerSwitcher } from "./Menu"

let Towers: Building[] = [],
	Sleep: GameSleeper = new GameSleeper,
	Units: Unit[] = []

function GetDelayCast() {
	return (((Game.Ping / 2) + 30) + 250)
}
export function Tick() {
	if (!StateBase.value || !State.value || Sleep.Sleeping("Glyph")
		|| LocalPlayer === undefined || LocalPlayer.IsSpectator) {
		return false
	}
	let Time = LocalPlayer.Team === Team.Radiant
		? Game.GlyphCooldownRediant
		: Game.GlyphCooldownDire
	if (Time !== 0) {
		return
	}
	let include_name = "tower1"
	switch (TowerSwitcher.selected_id) {
		case 0: include_name = "tower1"; break;
		case 1: include_name = "tower2"; break;
		case 2: include_name = "tower3"; break;
		case 3: include_name = "tower4"; break;
		case 4: include_name = "tower"; break;
		case 5: include_name = "npc_dota_"; break;
	}
	if (!Towers.some(x => x !== undefined && !x.IsEnemy()
		&& x.IsAlive && x.HP <= TowerHP.value && x.Name.includes(include_name)
		&& Units.some(unit =>
			unit !== undefined && unit.IsVisible && unit.IsAlive
			&& unit.IsEnemy() && (unit.IsCreep || unit.IsHero)
			&& unit.IsInRange(x, unit.AttackRange + (unit.HullRadius * 2))))
	) {
		return
	}
	if (Player !== undefined) {
		Player.Glyph()
	}
	Sleep.Sleep(GetDelayCast(), "Glyph")
	return
}

export function EntityCreate(x: Entity) {
	if (x instanceof Unit)
		Units.push(x)
	if (x instanceof Building && !x.IsShop && !x.IsShrine)
		Towers.push(x)
}

export function EntityDestroy(x: Entity) {
	if (x instanceof Unit)
		Units.push(x)
	if (x instanceof Building && !x.IsShop && !x.IsShrine)
		ArrayExtensions.arrayRemove(Towers, x)
}

export function GameEnded() {
	Towers = []
	Sleep.FullReset()
}