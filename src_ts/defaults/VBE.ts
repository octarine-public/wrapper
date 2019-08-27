import {
	EventsSDK,
	Game,
	LocalPlayer,
	Menu,
	ParticlesSDK,
	Unit,
} from "wrapper/Imports"

let allUnits = new Map<Unit, number>() // <Unit, Particle>
let particlePath = "particles/items_fx/aura_shivas.vpcf"

const VBEMenu = Menu.AddEntry(["Visual", "Visible By Enemy"]),
	stateMain = VBEMenu.AddToggle("State", true).OnValue(OnChangeValue)

function OnChangeValue(caller: Menu.Toggle) {
	if (!caller.value)
		DestroyAll()

	if (caller.value) {
		// loop-optimizer: KEEP	// because this is Map
		allUnits.forEach((particle, unit) => CheckUnit(unit))
	}
}

function DestroyAll() {
	// loop-optimizer: KEEP	// because this is Map
	allUnits.forEach(Destroy)
}

function Destroy(particleID: number, unit: Unit) {
	if (particleID === -1)
		return

	ParticlesSDK.Destroy(particleID, true)
	allUnits.set(unit, -1)
}

EventsSDK.on("GameEnded", DestroyAll)

EventsSDK.on("EntityCreated", ent => {
	if (ent instanceof Unit && !ent.IsEnemy())
		allUnits.set(ent, -1)
})

EventsSDK.on("EntityDestroyed", ent => {
	if (ent instanceof Unit)
		allUnits.delete(ent)
})

EventsSDK.on("TeamVisibilityChanged", CheckUnit)

EventsSDK.on("Tick", () => {
	if (!stateMain.value || Game.IsPaused)
		return
	// loop-optimizer: KEEP	// because this is Map
	allUnits.forEach((particle, unit) => !unit.IsAlive && Destroy(particle, unit))
})

function CheckUnit(unit: Unit, isVisibleForEnemies: boolean = unit.IsVisibleForEnemies) {
	if (!stateMain.value || unit.IsEnemy())
		return

	let isAlive = unit.IsAlive,
		particleID = allUnits.get(unit)

	if (particleID === undefined)
		return

	if ((isVisibleForEnemies && particleID === -1) && isAlive)
		allUnits.set(unit, ParticlesSDK.Create(particlePath, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, unit))
	else if ((!isVisibleForEnemies || !isAlive) && particleID !== -1)
		Destroy(particleID, unit)
}
