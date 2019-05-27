import { 
	MenuManager, 
	Game, 
	EntityManager,
	LocalPlayer,
	EventsSDK,
	Unit
} from "../CrutchesSDK/Imports"

let allParticles: number[] = []
let particlePath = "particles/items_fx/aura_shivas.vpcf"

const VBEMenu = MenuManager.MenuFactory("Visible By Enemy"),
	stateMain = VBEMenu.AddToggle("State").OnValue(OnChangeValue),
	allyState = VBEMenu.AddToggle("Allies state", true).OnValue(OnChangeValue);

function OnChangeValue() {
	if (!stateMain.value || !allyState.value)
		DestroyAll();
	
	if (stateMain.value)
		EntityManager.AllEntities.forEach(CheckNpc);
}

function DestroyAll() {
	// loop-optimizer: POSSIBLE_UNDEFINED
	allParticles.forEach((par, index) => Destroy(index));
}

function Destroy(npcID: number) {
	Particles.Destroy(allParticles[npcID], true);
	delete allParticles[npcID];
}

function CheckNpc(npc: Unit) {
	if (
		!stateMain.value
		|| !(npc instanceof Unit)
		|| LocalPlayer === undefined
		||	LocalPlayer.Team !== npc.Team
		|| Game.IsPaused
	)
		return
		
	if (!allyState.value && npc !== LocalPlayer.Hero)
		return

	let npcIndex = npc.Index,
		IsVisibleForEnemies = npc.IsVisibleForEnemies,
		IsAlive = npc.IsAlive;

	if ((IsVisibleForEnemies && allParticles[npcIndex] === undefined) && IsAlive)
		allParticles[npcIndex] = Particles.Create(particlePath, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, npc.m_pBaseEntity)

	if ((!IsVisibleForEnemies || !IsAlive) && allParticles[npcIndex] !== undefined) {
		Destroy(npcIndex)
	}
}

EventsSDK.on("onTeamVisibilityChanged", CheckNpc);
EventsSDK.on("onEntityCreated", CheckNpc);

EventsSDK.on("onTick", () => {
	let localTeam = LocalPlayer.Team

	EntityManager.AllEntities.forEach(ent => {
		if (!ent.IsDOTANPC || ent.Team !== localTeam)
			return

		if (!ent.IsAlive && allParticles[ent.Index] !== undefined) {
			Destroy(ent.Index)
		}
	})
})

EventsSDK.on("onGameEnded", DestroyAll);