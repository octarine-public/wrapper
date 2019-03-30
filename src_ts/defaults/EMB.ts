/*!
 * Created on Fri Feb 1 2019
 *
 * This file is part of Fusion.
 * Copyright (c) 2019 Fusion
 *
 * Fusion is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Fusion is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Fusion.  If not, see <http://www.gnu.org/licenses/>.
 */
/*
var config = {
		enabled: true
	},
	heroes: C_DOTA_BaseNPC_Hero[] = []

Events.addListener("onUpdate", () => {
	if (!config.enabled || IsPaused())
		return
	var localplayer = LocalDOTAPlayer
	// loop-optimizer: POSSIBLE_UNDEFINED
	heroes = Entities.GetAllEntities().filter(ent =>
		ent instanceof C_DOTA_BaseNPC &&
		ent.m_bIsAlive &&
		ent.m_bIsVisible &&
		ent.IsEnemy(localplayer) &&
		ent.m_bIsHero &&
		!ent.m_bIsIllusion
	) as C_DOTA_BaseNPC_Hero[]
})
Events.addListener("onDraw", () => {
	if (!config.enabled || !IsInGame())
		return
	var off_x = 0, off_y, manabar_w, manabar_h;
	{ // TODO: multiple aspect ratio support (current: 16:10)
		var screen_size = Renderer.WindowSize
		off_x = screen_size.x * -0.03095
		off_y = screen_size.z * -0.01715
		manabar_w = screen_size.x * 0.0583
		manabar_h = screen_size.z * 0.0067
	}
	heroes.forEach(hero => {
		var hero_pos = hero.m_pGameSceneNode.m_vecAbsOrigin
		var render_pos = Renderer.WorldToScreen(new Vector(hero_pos.x, hero_pos.y, hero_pos.z + hero.m_iHealthBarOffset))

		if (!render_pos.IsValid())
			return
		Renderer.FilledRect(render_pos.x + off_x, render_pos.z + off_y, manabar_w, manabar_h, 0, 0, 0) // black background
		Renderer.FilledRect(render_pos.x + off_x, render_pos.z + off_y, manabar_w * (hero.m_flMana / hero.m_flMaxMana), manabar_h, 0, 0, 0xFF)
	})
})

Menu.AddEntryEz("EnemyManaBars JS", {
	enabled: {
		name: "State:",
		value: config.enabled,
		type:  "toggle",
	},
}, (name, value) => config[name] = value)
*/