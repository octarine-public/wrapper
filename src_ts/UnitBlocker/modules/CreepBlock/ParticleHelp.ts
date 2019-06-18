import { Vector3, Game, EntityManager, Hero, EventsSDK } from "CrutchesSDK/Imports";

import { AddOrUpdateParticle, RemoveParticle } from "../../base/DrawParticle";
import { stateMain } from "../../base/MenuBase";
import { State, DrawHelpPosition, DrawState } from "./Menu";

let lastHero: Hero;
let particles: string[] = [];

let timeOut: TimeoutData = null;

export const BestPosition = [
	[
		new Vector3(-6526, -1450), // top
		new Vector3(-3933, -3426), // middle
		new Vector3(-784, -6411), // bottom
	],
	[
		new Vector3(751, 5751), // top
		new Vector3(3429, 2905), // middle
		new Vector3(6339, 849), // bottom
	]
]

export function DrawParticles() {
	if (!stateMain.value || !State.value || !DrawState.value || !DrawHelpPosition.value || !Game.IsInGame || EntityManager.LocalHero === undefined)
		return;
	
	if (Game.LevelNameShort !== "dota") {
		//console.error("UnitBlock => CreepBlock => ParticleHelp. Particles can't draw because map is not 'DOTA'")
		return;
	}
		
	lastHero = EntityManager.LocalHero;
	
	const teamParticles = BestPosition[lastHero.Team - 2];
	
	teamParticles.forEach(vec => {
		
		const name = vec.toString();
		
		AddOrUpdateParticle(name, lastHero, vec, 100);
		
		particles.push(name);
	});
	
	timeOut = setTimeout(RemoveParticles, 5 * 60 * 1000);
}

export function RemoveParticles() {
	if (timeOut !== null) {
		timeOut.Destroy();
		timeOut = null;
	}
	
	if (lastHero === undefined)
		return;
		
	particles.forEach(partcl => RemoveParticle(partcl, lastHero));
	particles = [];
}