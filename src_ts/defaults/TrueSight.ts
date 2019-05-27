import { MenuManager, Utils, EventsSDK, Game, EntityManager, Unit } from "../CrutchesSDK/Imports";

const ParticleStyles = [
	"particles/econ/wards/portal/ward_portal_core/ward_portal_eye_sentry.vpcf",
	"particles/items_fx/aura_shivas.vpcf",
];

var particle = "",
	npcs: Unit[] = [],
	particles: number[] = [];

const TrueSightMenu = MenuManager.MenuFactory("TrueSight Detector");

const stateMain = TrueSightMenu.AddToggle("State").OnValue(deleteAllParticles);

const particleStylesCombo =TrueSightMenu.AddComboBox("Particle", [
	"Sentry ward particle",
	"Shiva's Guard (DotA 1 effect)",
]).OnValue(value => {
	deleteAllParticles();
	particles = [];
	
	particle = ParticleStyles[value];
})

particle = ParticleStyles[particleStylesCombo.selected_id];

EventsSDK.on("onGameEnded", deleteAllParticles);

function deleteAllParticles() {
	// loop-optimizer: POSSIBLE_UNDEFINED
	particles.forEach((par, index) => Destroy(index));
}

function Destroy(npcID: number) {
	Particles.Destroy(particles[npcID], true);
	delete particles[npcID];
}

EventsSDK.on("onEntityCreated", npc => {
	if (npc instanceof Unit && !npc.IsEnemy())
		npcs.push(npc);
})
EventsSDK.on("onEntityDestroyed", ent => {
	if (ent instanceof Unit)
		Utils.arrayRemove(npcs, ent);
})
EventsSDK.on("onTick", () => {
	if (!stateMain.value || Game.IsPaused || !Game.IsInGame)
		return

	npcs.forEach(npc => {
		let index = npc.Index, 
			is_truesighted = npc.IsTrueSightedForEnemies,
			alive = npc.IsAlive;

		if (is_truesighted && particles[index] === undefined && alive)
			particles[index] = Particles.Create(particle, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, npc.m_pBaseEntity)
		else if ((!alive || !is_truesighted) && particles[index] !== undefined)
			Destroy(index);
	})
})