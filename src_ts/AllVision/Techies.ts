
export default () => {
	var techies_mines: C_DOTA_NPC_TechiesMines[] = [],
		pars: number[] = []

	Events.addListener("onEntityCreated", (ent, id) => {
		if (ent instanceof C_DOTA_NPC_TechiesMines) {
			techies_mines.push(ent)
			var par = Particles.Create("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, ent)
			Particles.SetControlPoint(par, 1, new Vector(100, 0, 0))
			pars[id] = par
		}
	})
	Events.addListener("onEntityDestroyed", (ent, id) => {
		const index = techies_mines.indexOf(ent as C_DOTA_NPC_TechiesMines)
		if (index !== -1) {
			techies_mines.splice(index, 1)
			delete pars[id]
		}
	})

	Events.addListener("onTick", () => {
		var local_team_flag = 1 << LocalDOTAPlayer.m_iTeamNum
		// loop-optimizer: KEEP
		techies_mines.forEach((ent, i) => {
			if (ent.m_bIsAlive) {
				ent.m_iTaggedAsVisibleByTeam |= local_team_flag
				// |= 1 << 2 is EF_IN_STAGING_LIST
				// |= 1 << 4 is EF_DELETE_IN_PROGRESS
				// 1 << 5 is EF_NODRAW
				// &= ~(1 << 7) is trigger
				// 1 << 9 is EF_NODRAW???
				ent.m_pEntity.m_flags &= ~(1 << 7)
				ent.m_pEntity.m_flags |= 1 << 3
			} else {
				ent.m_pEntity.m_flags |= 1 << 7
				ent.m_pEntity.m_flags &= ~(1 << 3)
				techies_mines.splice(i, 1)
				Particles.Destroy(pars[ent.m_iID], true)
				delete pars[ent.m_iID]
			}
		})
	})

	Events.addListener("onGameEnded", () => {
		techies_mines = []
		// loop-optimizer: POSSIBLE_UNDEFINED
		pars.forEach(par => Particles.Destroy(par, true))
		pars = []
	})
	Events.addListener("onUnitAnimation", (npc, sequenceVariant, playbackrate, castpoint, type, activity) => {
		if (npc instanceof C_DOTA_Unit_Hero_Techies && activity === 1510) {
			if (pars[npc.m_iID])
				Particles.Destroy(pars[npc.m_iID], true)
			var par = Particles.Create("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, npc)
			Particles.SetControlPoint(par, 1, new Vector(100, 0, 0))
			pars[npc.m_iID] = par
		}
	})
}
