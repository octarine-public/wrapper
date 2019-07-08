import { EventsSDK, Game, LocalPlayer, MenuManager, Unit } from "wrapper/Imports"

const ParticleStyles = [
	"particles/econ/wards/portal/ward_portal_core/ward_portal_eye_sentry.vpcf",
	"particles/items_fx/aura_shivas.vpcf",
]

var particlePath = "",
	allUnitsAsMap = new Map<Unit, number>()
	/* allUnits: Unit[] = [],
	allParticles: number[] = []; */

const TrueSightMenu = MenuManager.MenuFactory("TrueSight Detector"),
	stateMain = TrueSightMenu.AddToggle("State").OnValue(() => OnChangeValue()),
	allyState = TrueSightMenu.AddToggle("Allies state", true).OnValue(() => OnChangeValue())

const particleStylesCombo = TrueSightMenu.AddComboBox("Particle", [
	"Sentry ward particle",
	"Shiva's Guard (DotA 1 effect)",
]).OnValue(value => {
	particlePath = ParticleStyles[value]
	OnChangeValue(true)
})

function OnChangeValue(destroy: boolean = !stateMain.value || !allyState.value) {
	if (destroy)
		DestroyAll()

	if (stateMain.value)
		// loop-optimizer: KEEP
		allUnitsAsMap.forEach((particle, unit) => CheckUnit(unit))
}

function DestroyAll() {
	// loop-optimizer: KEEP	// because this is Map
	allUnitsAsMap.forEach(Destroy)
}

function Destroy(particleID: number, unit: Unit) {
	if (particleID === -1)
		return

	Particles.Destroy(particleID, true)
	allUnitsAsMap.set(unit, -1)
}

EventsSDK.on("GameEnded", DestroyAll)

EventsSDK.on("EntityCreated", npc => {
	if (npc instanceof Unit && npc.IsAlly())
		allUnitsAsMap.set(npc, -1)
})

EventsSDK.on("EntityDestroyed", ent => {
	if (ent instanceof Unit)
		allUnitsAsMap.delete(ent)
})

EventsSDK.on("TrueSightedChanged", CheckUnit)

EventsSDK.on("Tick", () => {
	if (!stateMain.value || Game.IsPaused)
		return

	// loop-optimizer: KEEP
	allUnitsAsMap.forEach((particle, unit) => !unit.IsAlive && Destroy(particle, unit))
})

function CheckUnit(unit: Unit, isTrueSighted: boolean = unit.IsTrueSightedForEnemies) {

	if (!stateMain.value || unit.IsEnemy())
		return

	if (!allyState.value && unit !== LocalPlayer.Hero)
		return

	let isAlive = unit.IsAlive,
		particleID = allUnitsAsMap.get(unit)

	if (particleID === undefined)
		return

	if ((isTrueSighted && particleID === -1) && isAlive) {
		allUnitsAsMap.set(unit, Particles.Create(
			particlePath || (particlePath = ParticleStyles[particleStylesCombo.selected_id]),
			ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, unit.m_pBaseEntity))
	}
	else if ((!isTrueSighted || !isAlive) && particleID !== -1) {
		Destroy(particleID, unit)
	}
}