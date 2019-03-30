
export default () => {
	var treant_eyes: C_DOTA_NPC_Treant_EyesInTheForest[] = [],
		pars: number[] = []

	Events.addListener("onEntityCreated", (ent, id) => {
		if (ent instanceof C_DOTA_NPC_Treant_EyesInTheForest) {
			treant_eyes.push(ent)
			var par = Particles.Create("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, ent)
			Particles.SetControlPoint(par, 1, new Vector(100, 0, 0))
			pars[id] = par
		}
	})
	Events.addListener("onEntityDestroyed", (ent, id) => {
		const index = treant_eyes.indexOf(ent as C_DOTA_NPC_Treant_EyesInTheForest)
		if (index !== -1) {
			treant_eyes.splice(index, 1)
			delete pars[id]
		}
	})

	Events.addListener("onTick", () => {
		var local_team_flag = 1 << LocalDOTAPlayer.m_iTeamNum
		// loop-optimizer: KEEP
		treant_eyes.forEach((ent, i) => {
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
				treant_eyes.splice(i, 1)
				Particles.Destroy(pars[ent.m_iID], true)
				delete pars[ent.m_iID]
			}
		})
	})

	Events.addListener("onGameEnded", () => {
		treant_eyes = []
		// loop-optimizer: POSSIBLE_UNDEFINED
		pars.forEach(par => Particles.Destroy(par, true))
		pars = []
	})
}
