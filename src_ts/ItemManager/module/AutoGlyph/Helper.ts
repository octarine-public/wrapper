import { Game, TickSleeper, LocalPlayer, Player, Team } from "wrapper/Imports"
import { EnemyUnits, AlliesBuildings } from "Core/Listeners"
import ItemManagerBase from "abstract/Base"
import { StateBase } from "abstract/MenuBase"
import { State, TowerHP, TowerSwitcher } from "Menu"


let Sleep: TickSleeper = new TickSleeper
let Base: ItemManagerBase = new ItemManagerBase

export function Init() {
	if (!StateBase.value || !State.value || Sleep.Sleeping
		|| LocalPlayer === undefined || Player === undefined || LocalPlayer.IsSpectator) {
		return
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
	if (!AlliesBuildings.some(x => !x.IsShop && !x.IsShrine && x.IsAlive && x.HP <= TowerHP.value
		&& x.Name.includes(include_name)
		&& EnemyUnits.some(unit => unit.IsVisible
			&& unit.IsAlive && (unit.IsCreep || unit.IsHero)
			&& unit.IsInRange(x, unit.AttackRange + (unit.HullRadius * 2)))))
		return

	Player.Glyph()
	Sleep.Sleep(Base.GetDelayCast)
	return
}
export function GameEnded() {
	Sleep.ResetTimer()
}