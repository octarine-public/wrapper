import { Base } from "./Extends/Helper"

import { AutoComboDisableWhen, AutoComboState, AutoDisableState, ComboKey,
	ComboStartWith, ConShotPoaitionPosShot, DrawingtargetState, DrawingtargetStateShot,
	SmartArcaneAutoBoltState, State, TextItem,
	TextSize, TextXItem, TextYItem } from "./Menu"

import { ArrayExtensions, Color, Game, Hero, LocalPlayer, ParticlesSDK, RendererSDK, Vector2, Vector3 } from "wrapper/Imports"
import { Heroes, MouseTarget, MyHero } from "./Listeners"
let Shot: number,
	Enemy: Hero,
	CurShot: Hero,
	targetParticle: number

export function DrawDestroyAll() {
	if (Shot !== undefined) {
		ParticlesSDK.Destroy(Shot, true)
		if (Shot !== undefined) {
			Shot = undefined
		}
		if (CurShot !== undefined) {
			CurShot = undefined
		}
		if (Enemy !== undefined) {
			Enemy = undefined
		}
	}
}
export function Draw() {
	if (LocalPlayer === undefined) {
		return false
	}
	if (!Base.IsRestrictions(State) || Game.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME || LocalPlayer.IsSpectator) {
		return false
	}
	if (MyHero === undefined || !MyHero.IsAlive)
		return false
	if (DrawingtargetStateShot.value) {
		Enemy = ArrayExtensions.orderBy(Heroes.filter(x => x.IsEnemy()
			&& x.Distance(MyHero) <= Base.ConShot.CastRange
			&& x.IsAlive && x.IsVisible), ent => ent.Distance(MyHero))[0]

		if (!Base.ConShot.IsReady
			|| (Enemy === undefined && Shot !== undefined)
			|| (CurShot !== Enemy && Shot !== undefined)) {
			if (Shot !== undefined) {
				ParticlesSDK.Destroy(Shot, true)
			}
			Shot = undefined
			CurShot = Enemy
		}
		if (Shot === undefined && Enemy !== undefined && Base.ConShot.IsReady) {
			Shot = ParticlesSDK.Create("particles/units/heroes/hero_skywrath_mage/skywrath_mage_concussive_shot.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN)
		}
		if (Shot !== undefined && Base.ConShot.IsReady) {
			let pos = Enemy.Position
			pos.AddScalarZ(ConShotPoaitionPosShot.value)
			ParticlesSDK.SetControlPoint(Shot, 0, pos)
			ParticlesSDK.SetControlPoint(Shot, 1, pos)
			ParticlesSDK.SetControlPoint(Shot, 2, new Vector3(3000))
		}
	}
	if (DrawingtargetState.value) {
		if (targetParticle === undefined && MouseTarget !== undefined) {
			targetParticle = ParticlesSDK.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, MouseTarget)
		}
		if (targetParticle !== undefined) {
			if (MouseTarget === undefined) {
				ParticlesSDK.Destroy(targetParticle, true)
				targetParticle = undefined
			} else {
				ParticlesSDK.SetControlPoint(targetParticle, 2, MyHero.Position)
				ParticlesSDK.SetControlPoint(targetParticle, 6, new Vector3(1))
				ParticlesSDK.SetControlPoint(targetParticle, 7, MouseTarget.Position)
			}
		}
	}

	if (TextItem.value) {
		let Combo = ComboKey.is_pressed,
			autoArcaneBolt = !Combo && SmartArcaneAutoBoltState.value,
			AutoCombo = AutoComboState.value && (!AutoComboDisableWhen.value || !Combo),
			AutoDisable = !Combo && AutoDisableState.value

		let wSize = RendererSDK.WindowSize,
			text: Array<[string, boolean, boolean]> = [
				["Combo: ", Combo, true],
				["Auto Bolt: ", autoArcaneBolt, true],
				["Start Mute: ", ComboStartWith.value, false],
				["Auto Combo: ", AutoCombo, true],
				["Auto Disable: ", AutoDisable, true],
			]

		let i = 0
		// loop-optimizer: KEEP
		text.forEach(([name, value, render_disabled]) => {
			if (!render_disabled && !value)
				return
			let pos = new Vector2 (
				wSize.x / 100 * TextXItem.value,
				wSize.y / 100 * TextYItem.value + (i * TextSize.value),
			)
			RendererSDK.Text(
				name,
				pos,
				new Color(255, 255, 255, 255),
				"Consoles",
				TextSize.value,
				FontFlags_t.ANTIALIAS,
			)
			RendererSDK.Text(
				value ? "ON": "OFF",
				pos.AddScalarX(RendererSDK.GetTextSize(name, "Consoles", TextSize.value, FontFlags_t.ANTIALIAS).x),
				new Color(value ? 0 : 255, value ? 255 : 0, 0, 255),
				"Consoles",
				TextSize.value,
				FontFlags_t.ANTIALIAS,
			)
			i++
		})
	}
}
