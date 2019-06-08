import { 
	MenuManager, 
	Game,
	LocalPlayer,
	EventsSDK,
	Unit
} from "../CrutchesSDK/Imports"

let allUnits = new Map<Unit, number>(); // <Unit, Particle>
let particlePath = "particles/items_fx/aura_shivas.vpcf"

const VBEMenu = MenuManager.MenuFactory("Visible By Enemy"),
	stateMain = VBEMenu.AddToggle("State").OnValue(OnChangeValue),
	allyState = VBEMenu.AddToggle("Allies state", true).OnValue(OnChangeValue);

function OnChangeValue() {
	if (!stateMain.value || !allyState.value)
		DestroyAll();
	
	if (stateMain.value) {
		// loop-optimizer: KEEP	// because this is Map
		allUnits.forEach((particle, unit) => CheckUnit(unit));
	}
}

function DestroyAll() {
	// loop-optimizer: KEEP	// because this is Map
	allUnits.forEach(Destroy);
}

function Destroy(particleID: number, unit: Unit) {
	if (particleID === -1)
		return;

	Particles.Destroy(particleID, true);
	allUnits.set(unit, -1);
}

EventsSDK.on("onGameEnded", DestroyAll);

EventsSDK.on("onEntityCreated", ent => {
	if (ent instanceof Unit && ent.IsAlly())
		allUnits.set(ent, -1);
})

EventsSDK.on("onEntityDestroyed", ent => {
	if (ent instanceof Unit)
		allUnits.delete(ent);
})

EventsSDK.on("onTeamVisibilityChanged", CheckUnit);

EventsSDK.on("onTick", () => {
	if (!stateMain.value || Game.IsPaused)
		return;
	// loop-optimizer: KEEP	// because this is Map
	allUnits.forEach((particle, unit) => !unit.IsAlive && Destroy(particle, unit));
})

function CheckUnit(unit: Unit, isVisibleForEnemies: boolean = unit.IsVisibleForEnemies) {
	if (!stateMain.value || unit.IsEnemy())
		return
		
	if (!allyState.value && unit !== LocalPlayer.Hero)
		return

	let isAlive = unit.IsAlive,
		particleID = allUnits.get(unit);

	if (particleID === undefined)
		return;

	if ((isVisibleForEnemies && particleID === -1) && isAlive)
		allUnits.set(unit, Particles.Create(particlePath, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, unit.m_pBaseEntity))

	else if ((!isVisibleForEnemies || !isAlive) && particleID !== -1)
		Destroy(particleID, unit)
}