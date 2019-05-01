import { MenuManager, CreateRGBTree } from "../CrutchesSDK/Wrapper";
import { arrayRemove } from "../Utils"

let registeredEvents = {
	onNPCCreated: undefined,
	onEntityDestroyed: undefined,
	//onParticleCreated: undefined,
	//onParticleUpdated: undefined,
	onDraw: undefined,
	onTick: undefined
}

let allNeutrals: C_DOTA_BaseNPC[] = []
	/* allPartciles: Array<[number, Vector]> = []; */

// rename me
const jungleMHMenu = new MenuManager("Jungle MapHack");
const stateMain = jungleMHMenu.AddToggle("State")
	.OnValue(onStateMain)

const campInformerMenu = jungleMHMenu.AddTree("Camp Informer")
	.SetToolTip("Blue - creep waiting to spawn. Green - creep already spawned");
const campInformerState = campInformerMenu.AddToggle("State")

const campInformerSize = campInformerMenu.AddSlider("Font Size", 12, 5, 25);

/* const particleHackMenu = jungleMHMenu.AddTree("Particle Hack");
const particleHackState = particleHackMenu.AddToggle("State");
const particleHackTimer = particleHackMenu.AddSlider("Timer", 6, 1, 10)
	.SetToolTip("Timer before delete draw");
const particleHackColor = CreateRGBTree(particleHackMenu, "Text color");
const particleHackSize = particleHackMenu.AddSlider("Font Size", 12, 5, 25);
 */

// --- Methods

function onStateMain(state: boolean = stateMain.value) {
	if (!state)
		destroyEvents()
	else
		registerEvents()
}

function registerEvents() {
	
	registeredEvents.onNPCCreated = Events.addListener("onNPCCreated", onCheckEntity)
	registeredEvents.onEntityDestroyed = Events.addListener("onEntityDestroyed", onEntityDestroyed)
	//registeredEvents.onParticleCreated = Events.addListener("onParticleCreated", onParticleCreated);
	//registeredEvents.onParticleUpdated = Events.addListener("onParticleUpdated", onParticleUpdated);
	registeredEvents.onDraw = Events.addListener("onDraw", onDraw)
	registeredEvents.onTick = Events.addListener("onTick", onTick);
	// loop-optimizer: POSSIBLE_UNDEFINED
	Entities.GetAllEntities().forEach(ent => {
		if (ent instanceof C_DOTA_BaseNPC)
			onCheckEntity(ent);
	})
}

function destroyEvents() {

	Object.keys(registeredEvents).forEach(name => {
		let listenerID = registeredEvents[name]
		if (listenerID !== undefined) {
			Events.removeListener(name, listenerID)
			registeredEvents[name] = undefined
		}
	});
	
	allNeutrals = [];
}


function onCheckEntity(ent: C_DOTA_BaseNPC) {
	if (
		ent.m_bIsCreep 
		&& !ent.m_bIsLaneCreep 
		&& ent.m_iTeamNum === DOTATeam_t.DOTA_TEAM_NEUTRALS
		&& ent.m_iszUnitName.startsWith("npc_dota_neutral_")
	) {
		allNeutrals.push(ent);
	}
}

Events.addListener("onGameStarted", lp => onStateMain());
Events.addListener("onGameEnded", () => onStateMain(false));

function onEntityDestroyed(ent: C_BaseEntity) {
	if (ent instanceof C_DOTA_BaseNPC)
		arrayRemove(allNeutrals, ent);
}

/* 
function onParticleCreated(id: number, path: string, particleSystemHandle: bigint, attach: ParticleAttachment_t, target?: C_BaseEntity) {

	if (!particleHackState.value)
		return;
	
	if (target === undefined || target.m_bIsVisible)
		return;
		
	if (!/generic_hit_blood/.test(path) || /npc_dota_neutral_|npc_dota_roshan$/.test((target as C_DOTA_BaseNPC).m_iszUnitName))
		return;

	if (allPartciles.some(partcl => partcl[0] === id))
		return;
		
	allPartciles.push([id, new Vector()]);
	
	setTimeout(particleHackTimer.value * 1000, () => {
		allPartciles = allPartciles.filter(partcl => partcl[0] !== id);
	});
}

function onParticleUpdated(id: number, control_point: number, vec: Vector) {
	if (!particleHackState.value || control_point !== 0)
		return;
	
	if (!allPartciles.some(partcl => partcl[0] === id))
		allPartciles.push([id, vec]);
}
*/
function onDraw() {
	
	if (campInformerState.value) {

		allNeutrals.forEach(creep => {

			let isWaitSpawn = creep.m_bIsWaitingToSpawn;

			if ((!isWaitSpawn && creep.m_bIsVisible))
				return;
			
			// check for fps
			//let { x, y, IsValid } = Renderer.WorldToScreen(creep.m_vecNetworkOrigin);
			let wts = Renderer.WorldToScreen(creep.m_vecNetworkOrigin);

			//console.log(campInformerSize.value);
			
			if (wts.IsValid) {
				Renderer.Text(wts.x, wts.y, creep.m_iszUnitName, 0,
					isWaitSpawn ? 0 : 255,
					isWaitSpawn ? 255 : 0, 255, 
					"Arial", campInformerSize.value);
			}
		});
	}
	
	/* if (particleHackState.value) {
		
		allPartciles.forEach(partcl => {
			
			let [ id, vector ] = partcl;
			
			if (vector.IsZero)
				return;
			
			let { x, y, IsValid } = Renderer.WorldToScreen(vector);

			if (IsValid) {
				Renderer.Text(x, y, "Enemy", 
					particleHackColor.R.value,
					particleHackColor.G.value, 
					particleHackColor.B.value,
					255,
					"Arial", campInformerSize.value);
			}
		});
		
	} */
}

function onTick() {
	
	if (campInformerState.value) {

		allNeutrals = allNeutrals.filter(creep => 
			creep.m_bIsValid && creep.m_iTeamNum === DOTATeam_t.DOTA_TEAM_NEUTRALS);
	}
}