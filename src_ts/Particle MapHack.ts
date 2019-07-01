import { ArrayExtensions, MenuManager, EventsSDK, EntityManager, Entity, Unit, Vector3, Creep, RendererSDK, Debug } from "wrapper/Imports"


let { MenuFactory, CreateRGBATree } = MenuManager;

// --- Menu
const jungleMHMenu = MenuFactory("Particle MapHack")
const stateMain = jungleMHMenu.AddToggle("State")

// Camp Informer
const campInformerMenu = jungleMHMenu.AddTree("Camp Informer")
	.SetToolTip("Blue - creep waiting to spawn. Green - creep already spawned")
const campInformerState = campInformerMenu.AddToggle("State")
const campInformerSize = campInformerMenu.AddSlider("Font Size", 15, 10, 50)
const campInformerAlpha = campInformerMenu.AddSlider("Font Alpha", 255, 0, 255)

// Particle Hack
const particleHackMenu = jungleMHMenu.AddTree("Particle Hack")
const particleHackState = particleHackMenu.AddToggle("State")

const phBlood = particleHackMenu.AddTree("Blood")
const phBloodState = particleHackMenu.AddToggle("State Blood")

const phBloodTimer = phBlood.AddSlider("Timer", 6, 1, 10)
	.SetToolTip("Timer before delete draw")
const phBloodColor = CreateRGBATree(phBlood, "Text color")
const phBloodSize = phBlood.AddSlider("Font Size", 20, 5, 50)

const phTechiesMine = particleHackMenu.AddTree("Techies mines")
const phTechiesMineState = phTechiesMine.AddToggle("State Techies mines", true)
// need auto parse data by name
// const phTechiesMineShowRange = phTechiesMine.AddToggle("Show Range");
const phTechiesMineShowTimers = phTechiesMine.AddToggle("Show Timers")

// --- Variables
let allNeutrals: Creep[] = [],
	allBloodTargets: Unit[] = [],
	allTechiesMines: Array<[Vector3[], Vector3, string]> = [],
	waiting_explode: Array<[number, string]> = [],
	waiting_spawn: Array<[number, string]> = [],
	latest_plant: [Vector3, string]

// --- Methods

stateMain.OnActivate(() => {
	EntityManager.AllEntities.forEach(onEntityAdded)
})

function onEntityAdded(ent: Entity) {
	if (
		ent instanceof Creep
		&& !ent.IsLaneCreep // facepalm
		&& ent.Team === DOTATeam_t.DOTA_TEAM_NEUTRALS
	) {
		allNeutrals.push(ent)
	}
}

// EventsSDK.on("GameStarted", lp => allNeutrals = []);
EventsSDK.on("GameEnded", () => {
	allNeutrals = []
	allBloodTargets = []
	allTechiesMines = []
	waiting_explode = []
	waiting_spawn = []
	latest_plant = undefined
})

// EventsSDK.on("ParticleCreated", console.log)
EventsSDK.on("ParticleCreated", (id, path, psHandle, attach, target: Entity) => {
	let mine_name
	
	if ((mine_name = /^particles\/units\/heroes\/hero_techies\/(techies_remote_mine|techies_stasis_trap)_plant.vpcf$/.exec(path)) !== null) {
		if (target === undefined || !target.IsEnemy())
			return
		waiting_spawn.push([id, mine_name[1]])
	} else if ((mine_name = /^particles\/units\/heroes\/hero_techies\/(techies_remote_mine|techies_stasis_trap)(s_detonate|_explode).vpcf$/.exec(path)) !== null)
		waiting_explode.push([id, mine_name[1]])
})
// EventsSDK.on("ParticleUpdatedEnt", console.log)
EventsSDK.on("ParticleUpdatedEnt", (id, control_point, ent, attach, attachment, position: Vector3) => {
	if (control_point !== 0 || attach !== ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
		return false
	waiting_explode.some(([particle_id, mine_name], i) => {
		if (particle_id !== id)
			return false
		allTechiesMines.some(obj => {
			if (obj[2] !== mine_name)
				return false
			let mines = obj[0]
			return mines.some((vec, i) => {
				if (vec.Distance(position) !== 0)
					return false
				mines.splice(i, 1)
				obj[1] = CalculateCenter(mines)
				return true
			})
		})
		waiting_explode.splice(i, 1)
		return true
	})
})
// EventsSDK.on("UnitAnimation", console.log)
// EventsSDK.on("UnitAnimation", (npc, sequenceVariant, playbackrate, castpoint, type, activity) => {

// })
// EventsSDK.on("UnitAnimationEnd", console.log)
// EventsSDK.on("UnitAnimationEnd", npc => {

// })

function CalculateCenter(vecs: Vector3[]): Vector3 {
	return Vector3.GetCenter(vecs)
}

// EventsSDK.on("ParticleUpdated", console.log)
EventsSDK.on("ParticleUpdated", (id, control_point, position: Vector3) => {
	if (control_point === 1)
		waiting_spawn.some(([particle_id, mine_name], i) => {
			if (particle_id !== id)
				return false
			if (!allTechiesMines.some(obj => {
				if (obj[2] !== mine_name)
					return false
				let center = obj[1],
					mines = obj[0]
				if (center.Distance(position) > 100)
					return false
				mines.push(position)
				obj[1] = CalculateCenter(mines)
				return true
			}))
				allTechiesMines.push([[position], position, mine_name])
			waiting_spawn.splice(i, 1)
			return true
		})
	if (control_point === 0)
		waiting_explode.some(([particle_id, mine_name], i) => {
			if (particle_id !== id)
				return false
			allTechiesMines.some((obj, i) => {
				if (obj[2] !== mine_name)
					return false
				let mines = obj[0]
				return mines.some((vec, j) => {
					if (vec.Distance(position) !== 0)
						return false
					if (mines.length !== 1) {
						mines.splice(j, 1)
						obj[1] = CalculateCenter(mines)
					} else
						allTechiesMines.splice(i, 1)
					return true
				})
			})
			waiting_explode.splice(i, 1)
			return true
		})
})

EventsSDK.on("EntityCreated", onEntityAdded)

EventsSDK.on("EntityDestroyed", (ent: Entity) => {
	if (ent instanceof Creep)
		ArrayExtensions.arrayRemove(allNeutrals, ent)
})

EventsSDK.on("BloodImpact", (target: Entity) => {
	if (!stateMain.value || !phBloodState.value)
		return

	if (target === undefined || target.IsVisible)
		return

	if (allBloodTargets.includes(target as Unit))
		return

	allBloodTargets.push(target as Unit)

	setTimeout(() => ArrayExtensions.arrayRemove(allBloodTargets, target), 
		phBloodTimer.value * 1000)
})

EventsSDK.on("Draw", () => {
	if (!stateMain.value)
		return

	if (campInformerState.value) {
		
		allNeutrals.forEach(creep => {

			let isWaitSpawn = creep.IsWaitingToSpawn

			if ((!isWaitSpawn && creep.IsVisible))
				return

			let wts = RendererSDK.WorldToScreen(creep.Position)

			if (wts !== undefined) {
				let name = creep.Name
					.replace("npc_dota_neutral_", "")
					.split("_")
					.join(" ")

				Renderer.Text(wts.x, wts.y, name, 0,
					isWaitSpawn ? 0 : 255,
					isWaitSpawn ? 255 : 0,
					campInformerAlpha.value,
					"Arial", campInformerSize.value, 200)
			}
		})
	}

	if (particleHackState.value) {

		if (phBloodState.value) {

			allBloodTargets.forEach(target => {

				if (!target.IsValid || target.IsVisible)
					return;
				
				let pos = target.Position
				
				if (pos.IsZero())
					return

				let wts = RendererSDK.WorldToScreen(pos)

				if (wts !== undefined) {
					Renderer.Text(wts.x, wts.y, target.Name,
						phBloodColor.R.value,
						phBloodColor.G.value,
						phBloodColor.B.value,
						phBloodColor.A.value,
						"Arial", phBloodSize.value)
				}
			})
		}

		if (phTechiesMineState.value) {

			allTechiesMines.forEach(([allMines, pos, name]) => {

				let wts = RendererSDK.WorldToScreen(pos)

				if (wts !== undefined) {

					Renderer.Image(`~/other/npc_dota_${name}.png`, wts.x - 64 / 4, wts.y - 87 / 4, 64 / 2, 87 / 2)

					Renderer.Text(wts.x + (64 / 4), wts.y, "x" + allMines.length,
						phBloodColor.R.value,
						phBloodColor.G.value,
						phBloodColor.B.value,
						phBloodColor.A.value,
						"Arial", phBloodSize.value)
				}
			})
		}
	}

})

EventsSDK.on("Tick", () => {
	if (!stateMain.value)
		return

	if (campInformerState.value) {

		allNeutrals = allNeutrals.filter(creep =>
			creep.IsValid && creep.Team === DOTATeam_t.DOTA_TEAM_NEUTRALS)
	}
})
