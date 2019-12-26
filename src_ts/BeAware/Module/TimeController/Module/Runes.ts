import { ArrayExtensions, Color, Entity, Game, Hero, RendererSDK, Rune, Vector2, Vector3, Unit } from "wrapper/Imports"
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

let checkTick: number = 0,
	checkTickPower: number = 0,
	bountyRunesAr = [false, false, false, false],
	bountyRunesPos: Vector3[] = [],
	PowerRunesPos: Vector3[] = [],
	bountyAlreadySeted = false,
	RunePowerTimer: boolean = true,
	RuneBountyTimerBool: boolean = true,
	Particle: Map<number, [bigint, undefined | Entity, Vector3?]> = new Map(), // TODO Radius for ability
	mt_rand_power: number,
	mt_rand_bounty: number

function mt_rand(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

export function DrawRunes() {
	if (Game.GameTime <= 0 || Game.LevelNameShort === "hero_demo_main")
		return
	// power
	let Time = Game.RawGameTime
	if (TreeRuneState.value) {
		let percent = 120
		let RunePowerTime = Game.GameTime % percent
		if (TreeNotificationPowerChat.value && RunePowerTime >= percent || RunePowerTime === 0)
			RunePowerTimer = true
		// loop-optimizer: KEEP
		PowerRunesPos.forEach(val => {
			if (mt_rand_power === 0)
				mt_rand_power = mt_rand(NotifyPowerRuneMin.value, NotifyPowerRuneMax.value)
			if (mt_rand_power !== 0 && RunePowerTime >= (percent - mt_rand_power)) {

				if (TreeNotificationPowerDrawMap.value)
					RendererSDK.DrawMiniMapIcon("minimap_ping", val, 900)

				if (Time >= checkTickPower) {
					if (RunePowerTime <= 119) {
						if (TreeNotificationBountySound.value > 0) {
							Game.ExecuteCommand("playvol ui/ping " + TreeNotificationPowerSound.value / 100)
							checkTickPower = Time + (NotifyPowerRuneMax.value / 3)
						}
						if (RunePowerTimer) {
							if (TreeNotificationPowerChat.value) {
								Game.ExecuteCommand("chatwheel_say 57")
								RunePowerTimer = false
							}
						}
						mt_rand_power = 0
					}
				}
			}
		})
	}
	// bounty
	if (PMH_Show_bounty.value) {
		let percent = 300
		let RuneBountyTime = Game.GameTime % percent
		if (!bountyAlreadySeted) {
			if (RuneBountyTime >= percent || RuneBountyTime <= 1) {
				bountyRunesAr = [true, true, true, true]
				bountyAlreadySeted = true
				if (TreeNotificationBountyChat.value) {
					RuneBountyTimerBool = true
				}
			}
		}
		// loop-optimizer: KEEP
		bountyRunesPos.forEach((val, key) => {
			if (mt_rand_bounty === 0) {
				mt_rand_bounty = mt_rand(NotifyTimeBountyMin.value, NotifyTimeBountyMax.value)
			}
			if (mt_rand_bounty !== 0 && RuneBountyTime >= (percent - mt_rand_bounty)) {
				if (TreeNotificationBountyDrawMap.value) {
					RendererSDK.DrawMiniMapIcon("minimap_ping", val, 900)
				}
				if (Time >= checkTick) {
					if (RuneBountyTime <= percent) {
						if (TreeNotificationBountySound.value > 0) {
							Game.ExecuteCommand("playvol ui/ping " + TreeNotificationBountySound.value / 100)
							checkTick = Time + (NotifyTimeBountyMax.value / 3)
						}
						mt_rand_bounty = 0
					}
					if (RuneBountyTimerBool) {
						if (TreeNotificationBountyChat.value) {
							Game.ExecuteCommand("chatwheel_say 57")
							RuneBountyTimerBool = false
						}
					}
				}
			}
			if (bountyRunesAr[key]) {
				RendererSDK.DrawMiniMapIcon("minimap_rune_bounty", val, PMH_Show_bounty_size.value * 14, PMH_Show_bountyRGBA.Color)
				DrawIcon(val, PMH_Show_bountyRGBA_mark.Color)
			}
		})
		if (Particle === undefined || Particle.size <= 0)
			return
		// loop-optimizer: KEEP
		Particle.forEach(([handle, target, position], i) => {
			if (position === undefined)
				return
			// loop-optimizer: KEEP
			bountyRunesPos.forEach((val, key) => {
				//Bounty Rune
				if (handle !== 17096352592726237548n && handle !== 16517413739925325824n)
					return
				let hero = (target as Unit),
					distance = val.Distance2D(position)
				if (distance <= 500 || (hero !== undefined && hero.Name === "npc_dota_hero_pudge" && hero.Distance2D(val) <= 10)) {
					bountyAlreadySeted = false
					bountyRunesAr[key] = false
					setTimeout(() => Particle.clear(), 1500)
				}
			})
		})
	}
}

export function EntityCreatedRune(x: Entity) {
	if (x.m_pBaseEntity instanceof C_DOTA_Item_RuneSpawner_Bounty)
		bountyRunesPos.push(x.Position)
	if (x.m_pBaseEntity instanceof C_DOTA_Item_RuneSpawner_Powerup)
		PowerRunesPos.push(x.Position)
}

export function EntityDestroyedRune(x: Entity) {

	if (x.m_pBaseEntity instanceof C_DOTA_Item_RuneSpawner_Bounty)
		ArrayExtensions.arrayRemove(bountyRunesPos, x.Position)

	if (x.m_pBaseEntity instanceof C_DOTA_Item_RuneSpawner_Powerup)
		ArrayExtensions.arrayRemove(PowerRunesPos, x.Position)

	if (x instanceof Rune) {
		// loop-optimizer: KEEP
		bountyRunesPos.some((val, key) => {
			let distance = val.Distance2D(x.Position)
			if (distance > 300)
				return false
			bountyAlreadySeted = false
			bountyRunesAr[key] = false
			setTimeout(() => Particle.clear(), 1500)
			return true
		})
		ArrayExtensions.arrayRemove(Runes, x)
	}
}

export function RuneGameEnded() {
	Particle.clear()
	PowerRunesPos = []
	bountyRunesAr = []
	bountyRunesPos = []
	mt_rand_power = 0
}

function DrawIcon(position: Vector3, color?: Color) {
	let pos_particle = RendererSDK.WorldToScreen(position)
	if (pos_particle === undefined)
		return
	RendererSDK.Image(`panorama/images/control_icons/check_png.vtex_c`,
		pos_particle.SubtractScalar(PMH_Show_bounty_size.value / 4),
		new Vector2(PMH_Show_bounty_size.value / 2, PMH_Show_bounty_size.value / 2), color,
	)
}

export function RuneParticleDestroyed(id: number) {
	if (!Particle.has(id))
		return
	Particle.delete(id)
}

export function RuneParticleCreate(id: number, entity: Nullable<Entity>, handle: bigint) {
	if (handle !== 17096352592726237548n && handle !== 16517413739925325824n)
		return
	Particle.set(id, [handle, entity instanceof Hero ? entity : undefined])
}

export function RuneParticleCreateUpdateEnt(id: number, ent: Nullable<Entity>, position: Vector3) {
	let part = Particle.get(id)
	if (part === undefined)
		return
	Particle.set(id, [part[0], ent instanceof Hero ? ent : part[1], position])
}
