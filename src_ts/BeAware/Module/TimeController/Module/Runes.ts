import { ArrayExtensions, Color, Entity, Game, RendererSDK, Rune, Vector2, Vector3, GameSleeper } from "wrapper/Imports"
import { Runes } from "../Entities"

import {
	NotifyPowerRuneMax,
	NotifyPowerRuneMin,
	NotifyTimeBountyMax,
	NotifyTimeBountyMin,
	PMH_Show_bounty,
	PMH_Show_bounty_size,
	PMH_Show_bountyRGBA,
	PMH_Show_bountyRGBA_mark,
	TreeNotificationBountyChat,
	TreeNotificationBountyDrawMap,
	TreeNotificationBountySound,
	TreeNotificationPowerChat,
	TreeNotificationPowerDrawMap,
	TreeNotificationPowerSound,
	TreeRuneState
} from "../Menu"

let bountyRunesAr = [false, false, false, false],
	bountyRunesSpawners: Entity[] = [],
	powerRunesSpawners: Entity[] = [],
	Particle: Map<number, [bigint, Nullable<Entity>, Vector3?]> = new Map(), // TODO Radius for ability
	game_sleeper = new GameSleeper(),
	mt_rand_bounty = 0,
	mt_rand_power = 0

function GetBountyRunesPos(): Vector3[] {
	return bountyRunesSpawners.map(x => x.Position)
}

function GetPowerRunesPos(): Vector3[] {
	return powerRunesSpawners.map(x => x.Position)
}

function mt_rand(min: number, max: number) {
	return Math.random() * (max - min) + min
}

export function DrawRunes() {
	if (Game.MapName.startsWith("hero_demo") || Game.GameTime <= 0)
		return

	let dota_minimap_ping_duration = ConVars.GetInt("dota_minimap_ping_duration")

	// power
	if (TreeRuneState.value) {
		let spawns_every = 120
		let RunePowerTime = Game.GameTime % spawns_every
		if (mt_rand_power === 0)
			mt_rand_power = mt_rand(NotifyPowerRuneMin.value, NotifyPowerRuneMax.value)
		if (RunePowerTime >= (spawns_every - mt_rand_power)) {
			// loop-optimizer: KEEP
			GetPowerRunesPos().forEach(val => {
				if (TreeNotificationPowerDrawMap.value && !game_sleeper.Sleeping(val.Length)) {
					RendererSDK.DrawMiniMapPing(val, Color.White, Game.RawGameTime + dota_minimap_ping_duration * 2, val.Length)
					game_sleeper.Sleep(dota_minimap_ping_duration * 1000, val.Length)
				}

				if (RunePowerTime > 119)
					return
				if (TreeNotificationBountySound.value > 0 && !game_sleeper.Sleeping("power_sound")) {
					Game.ExecuteCommand("playvol ui/ping " + TreeNotificationPowerSound.value / 100)
					game_sleeper.Sleep(dota_minimap_ping_duration * 1000, "power_sound")
				}
				if (TreeNotificationPowerChat.value && !game_sleeper.Sleeping("chat_wheel")) {
					Game.ExecuteCommand("chatwheel_say 57")
					game_sleeper.Sleep(NotifyPowerRuneMax.value * 1000, "chat_wheel")
				}
			})
		}
	}

	// bounty
	if (PMH_Show_bounty.value) {
		let spawns_every = 300
		let RuneBountyTime = Game.GameTime % spawns_every
		if (RuneBountyTime < 1 && !game_sleeper.Sleeping("bounty_spawn")) {
			bountyRunesAr = [true, true, true, true]
			game_sleeper.Sleep(1500, "bounty_spawn")
		}
		// loop-optimizer: KEEP
		GetBountyRunesPos().forEach((val, key) => {
			if (bountyRunesAr[key]) {
				RendererSDK.DrawMiniMapIcon("minimap_rune_bounty", val, PMH_Show_bounty_size.value * 14, PMH_Show_bountyRGBA.Color)
				DrawIcon(val, PMH_Show_bountyRGBA_mark.Color)
			}
		})
		if (mt_rand_bounty === 0)
			mt_rand_bounty = mt_rand(NotifyTimeBountyMin.value, NotifyTimeBountyMax.value)
		if (RuneBountyTime >= (spawns_every - mt_rand_bounty)) {
			mt_rand_bounty = mt_rand(NotifyTimeBountyMin.value, NotifyTimeBountyMax.value)
			// loop-optimizer: KEEP
			GetBountyRunesPos().forEach((val, key) => {
				if (TreeNotificationBountyDrawMap.value && !game_sleeper.Sleeping(val.Length)) {
					RendererSDK.DrawMiniMapPing(val, Color.White, Game.RawGameTime + dota_minimap_ping_duration * 2, val.Length)
					game_sleeper.Sleep(dota_minimap_ping_duration * 1000, val.Length)
				}
				if (TreeNotificationBountySound.value > 0 && !game_sleeper.Sleeping("bounty_sound")) {
					Game.ExecuteCommand("playvol ui/ping " + TreeNotificationBountySound.value / 100)
					game_sleeper.Sleep(dota_minimap_ping_duration * 1000, "bounty_sound")
				}
				if (TreeNotificationBountyChat.value && !game_sleeper.Sleeping("chat_wheel")) {
					Game.ExecuteCommand("chatwheel_say 57")
					game_sleeper.Sleep(NotifyTimeBountyMax.value * 1000, "chat_wheel")
				}
			})
		}
	}

	// loop-optimizer: KEEP
	Particle.forEach(([handle, target, position], i) => {
		if (position === undefined)
			return
		if (handle !== 17096352592726237548n && handle !== 16517413739925325824n)
			return
		// loop-optimizer: KEEP
		GetBountyRunesPos().forEach((val, key) => {
			if (val.Distance2D(position) <= 500 || (target !== undefined && target.Distance2D(val) <= 10)) {
				bountyRunesAr[key] = false
				Particle.delete(i)
			}
		})
	})
}

export function EntityCreatedRune(x: Entity) {
	if (x.m_pBaseEntity instanceof C_DOTA_Item_RuneSpawner_Bounty)
		bountyRunesSpawners.push(x)
	if (x.m_pBaseEntity instanceof C_DOTA_Item_RuneSpawner_Powerup)
		powerRunesSpawners.push(x)
}

export function EntityDestroyedRune(x: Entity) {
	if (x.m_pBaseEntity instanceof C_DOTA_Item_RuneSpawner_Bounty)
		ArrayExtensions.arrayRemove(bountyRunesSpawners, x)

	if (x.m_pBaseEntity instanceof C_DOTA_Item_RuneSpawner_Powerup)
		ArrayExtensions.arrayRemove(powerRunesSpawners, x)

	if (x instanceof Rune) {
		// loop-optimizer: KEEP
		GetBountyRunesPos().some((val, key) => {
			let distance = val.Distance2D(x.Position)
			if (distance > 300)
				return false
			bountyRunesAr[key] = false
			return true
		})
		ArrayExtensions.arrayRemove(Runes, x)
	}
}

export function RuneGameEnded() {
	Particle.clear()
	bountyRunesAr = [false, false, false, false]
	game_sleeper.FullReset()
}

function DrawIcon(position: Vector3, color?: Color) {
	let w2s = RendererSDK.WorldToScreen(position)
	if (w2s === undefined)
		return
	RendererSDK.Image(`panorama/images/control_icons/check_png.vtex_c`,
		w2s.SubtractScalar(PMH_Show_bounty_size.value / 4),
		new Vector2(PMH_Show_bounty_size.value / 2, PMH_Show_bounty_size.value / 2), color,
	)
}

export function RuneParticleDestroyed(id: number) {
	Particle.delete(id)
}

export function RuneParticleCreate(id: number, entity: Nullable<Entity>, handle: bigint) {
	if (handle !== 17096352592726237548n && handle !== 16517413739925325824n)
		return
	Particle.set(id, [handle, entity])
}

export function RuneParticleCreateUpdateEnt(id: number, ent: Nullable<Entity>, position: Vector3) {
	let part = Particle.get(id)
	if (part === undefined)
		return
	part[2] = position
}

export function OnNotifyTimingsChanged() {
	mt_rand_bounty = mt_rand_power = 0
}
