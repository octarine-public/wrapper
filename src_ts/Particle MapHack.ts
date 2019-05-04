import { CreateRGBATree, MenuManager } from "CrutchesSDK/Wrapper"
import { arrayRemove } from "Utils"

// --- Menu
const jungleMHMenu = new MenuManager("Particle MapHack")
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
//const phTechiesMineShowRange = phTechiesMine.AddToggle("Show Range");
const phTechiesMineShowTimers = phTechiesMine.AddToggle("Show Timers")

// --- Variables
let allNeutrals: C_DOTA_BaseNPC[] = [],
	allBloodTargets: C_DOTA_BaseNPC[] = [],
	allTechiesMines: Array<[Vector[], Vector, string]> = [],
	waiting_explode: Array<[number, string]> = [],
	waiting_spawn: Array<[number, string]> = [],
	latest_plant: [Vector, string]

// --- Methods

stateMain.OnActivate(() => {
	// loop-optimizer: POSSIBLE_UNDEFINED
	Entities.GetAllEntities().forEach(ent => {
		if (ent instanceof C_DOTA_BaseNPC && ent.m_bIsValid) // temp IsValid
			onNPCAdded(ent)
	})
})

function onNPCAdded(ent: C_DOTA_BaseNPC) {
	if (
		ent.m_bIsCreep
		&& !ent.m_bIsLaneCreep
		&& ent.m_iTeamNum === DOTATeam_t.DOTA_TEAM_NEUTRALS
		&& ent.m_iszUnitName.startsWith("npc_dota_neutral_")
	) {
		allNeutrals.push(ent)
	}
}

//Events.addListener("onGameStarted", lp => allNeutrals = []);
Events.addListener("onGameEnded", () => {
	allNeutrals = []
	allBloodTargets = []
	allTechiesMines = []
	waiting_explode = []
	waiting_spawn = []
	latest_plant = undefined
})

Events.addListener("onParticleCreated", console.log)
Events.addListener("onParticleCreated", (id, path, psHandle, attach, target?) => {
	let mine_name

	if ((mine_name = /^particles\/units\/heroes\/hero_techies\/(techies_remote_mine|techies_stasis_trap)_plant.vpcf$/.exec(path)) !== null) {
		if (target !== undefined && LocalDOTAPlayer !== undefined && !target.IsEnemy(LocalDOTAPlayer))
			return
		waiting_spawn.push([id, mine_name[1]])
	} else if ((mine_name = /^particles\/units\/heroes\/hero_techies\/(techies_remote_mine|techies_stasis_trap)(s_detonate|_explode).vpcf$/.exec(path)) !== null)
		waiting_explode.push([id, mine_name[1]])
})
Events.addListener("onParticleUpdatedEnt", console.log)
Events.addListener("onParticleUpdatedEnt", (id, control_point, ent, attach, attachment, position) => {
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
				if (vec.DistTo(position) !== 0)
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
// Events.addListener("onUnitAnimation", console.log)
Events.addListener("onUnitAnimation", (npc, sequenceVariant, playbackrate, castpoint, type, activity) => {

})
// Events.addListener("onUnitAnimationEnd", console.log)
Events.addListener("onUnitAnimationEnd", npc => {

})

function CalculateCenter(vecs: Vector[]): Vector {
	let new_center = [0, 0, 0],
		vec_count = vecs.length

	vecs.forEach(vec => {
		new_center[0] += vec.x
		new_center[1] += vec.y
		new_center[2] += vec.z
	})
	return new Vector (
		new_center[0] / vec_count,
		new_center[1] / vec_count,
		new_center[2] / vec_count,
	)
}

Events.addListener("onParticleUpdated", console.log)
Events.addListener("onParticleUpdated", (id: number, control_point: number, position: Vector) => {
	if (control_point === 1)
		waiting_spawn.some(([particle_id, mine_name], i) => {
			if (particle_id !== id)
				return false
			if (!allTechiesMines.some(obj => {
				if (obj[2] !== mine_name)
					return false
				let center = obj[1],
					mines = obj[0]
				if (center.DistTo(position) > 100)
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
			allTechiesMines.some(obj => {
				if (obj[2] !== mine_name)
					return false
				let mines = obj[0]
				return mines.some((vec, i) => {
					if (vec.DistTo(position) !== 0)
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

Events.addListener("onNPCCreated", onNPCAdded)

//Events.addListener("onEntityCreated", console.log);

Events.addListener("onEntityDestroyed", (ent: C_BaseEntity) => {
	if (ent instanceof C_DOTA_BaseNPC)
		arrayRemove(allNeutrals, ent)
})

Events.addListener("onBloodImpact", (target: C_BaseEntity) => {
	if (!stateMain.value || !phBloodState.value)
		return

	if (target === undefined || target.m_bIsVisible)
		return

	if (allBloodTargets.includes(target as C_DOTA_BaseNPC))
		return

	allBloodTargets.push(target as C_DOTA_BaseNPC)

	setTimeout(phBloodTimer.value * 1000, () =>
		arrayRemove(allBloodTargets, target))
})

Events.addListener("onDraw", () => {
	if (!stateMain.value)
		return

	if (campInformerState.value) {

		allNeutrals.forEach(creep => {

			let isWaitSpawn = creep.m_bIsWaitingToSpawn

			if ((!isWaitSpawn && creep.m_bIsVisible))
				return

			let wts = Renderer.WorldToScreen(creep.m_vecNetworkOrigin)

			if (wts.IsValid) {

				let name = creep.m_iszUnitName
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

				let pos = target.m_vecNetworkOrigin

				if (pos.IsZero)
					return

				let wts = Renderer.WorldToScreen(pos)

				if (wts.IsValid) {
					Renderer.Text(wts.x, wts.y, target.m_iszUnitName,
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

				let wts = Renderer.WorldToScreen(pos)

				if (wts.IsValid) {

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

Events.addListener("onTick", () => {
	if (!stateMain.value)
		return

	if (campInformerState.value) {

		allNeutrals = allNeutrals.filter(creep =>
			creep.m_bIsValid && creep.m_iTeamNum === DOTATeam_t.DOTA_TEAM_NEUTRALS)
	}
})

// [[], []]