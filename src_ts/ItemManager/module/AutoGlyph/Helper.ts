import { Tower, Hero, Team, Game, GameSleeper, Entity, ArrayExtensions } from "wrapper/Imports"
import { StateBase } from "../../abstract/MenuBase";
import { State, TowerHP } from "./Menu";

let Me: Hero,
	Towers: Tower[] = [],
	Sleep: GameSleeper = new GameSleeper()
	
function GlyphCooldown(): number {
	if (Me === undefined)
		return 0
	if (Me.Team !== Team.Radiant) {
		return Game.GlyphCooldownDire;
	}
	return Game.GlyphCooldownRediant;
}
function GetDelayCast() {
	return (((Game.Ping / 2) + 30) + 250)
}

export function Tick() {
	if (!StateBase.value || !State.value || Sleep.Sleeping("Glyph") ) {
		return false
	}
	if (Me === undefined || GlyphCooldown() > 0) {
		return false
	}
	if (!Towers.some(x => x !== undefined && !x.IsEnemy() && x.IsAlive && x.HP <= TowerHP.value && x.Name.includes("tower1"))) {
		return false
	}
	Me.UnitGlyph()
	Sleep.Sleep(GetDelayCast(), "Glyph")
	return true
}

export function EntityCreate(x: Entity) {
	if (x instanceof Tower && x.IsTower){
		Towers.push(x)
	}
}
export function EntityDestroy(x: Entity) {
	if (Towers !== undefined || Towers.length > 0) {
		ArrayExtensions.arrayRemove(Towers, x)
	}
}

export function GameStarted(hero: Hero) {
	if (Me === undefined) {
		Me = hero
	}
}

export function GameEnded() {
	Me = undefined
	Towers = []
}