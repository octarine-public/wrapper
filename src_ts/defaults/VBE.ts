import { MenuFactory } from "../CrutchesSDK/Wrapper"
import * as Utils from "../Utils"

let allParticles: number[] = []
let particlePath = "particles/items_fx/aura_shivas.vpcf"

const VBEMenu = MenuFactory("Visible By Enemy")

const stateMain = VBEMenu.AddToggle("State", true) // .OnValue(onStateMain)

const allyState = VBEMenu.AddToggle("Allies state", true)

function Destroy(npcID: number) {
	Particles.Destroy(allParticles[npcID], true)
	allParticles[npcID] = undefined
}

function CheckNpc(npc: C_DOTA_BaseNPC) {
	if (
		!IsInGame()
		|| !stateMain.value
		|| GameRules.m_bGamePaused
		|| LocalDOTAPlayer === undefined
		|| LocalDOTAPlayer.m_iTeamNum !== npc.m_iTeamNum
	)
		return
		
	if (!allyState.value && npc !== LocalDOTAPlayer.m_hAssignedHero)
		return

	let npcID = Entities.GetEntityID(npc),
		IsVisibleForEnemies = Utils.IsVisibleForEnemies(npc),
		IsAlive = Utils.IsAlive(npc);

	if ((IsVisibleForEnemies && allParticles[npcID] === undefined) && IsAlive)
		allParticles[npcID] = Particles.Create(particlePath, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, npc)

	if ((!IsVisibleForEnemies || !IsAlive) && allParticles[npcID] !== undefined) {
		Destroy(npcID)
	}
}

Events.on("onTeamVisibilityChanged", CheckNpc);
Events.on("onNPCCreated", CheckNpc);


Events.on("onTick", () => {

	let localTeam = LocalDOTAPlayer.m_iTeamNum

	Entities.AllEntities.forEach(ent => {
		if (!ent.m_bIsDOTANPC || ent.m_iTeamNum !== localTeam)
			return
		let entID = Entities.GetEntityID(ent)
		if (!Utils.IsAlive(ent) && allParticles[entID] !== undefined) {
			Destroy(entID)
		}
	})
})


Events.on("onGameEnded", () => {
	// loop-optimizer: POSSIBLE_UNDEFINED
	allParticles.forEach((par, index) => Destroy(index))
})
