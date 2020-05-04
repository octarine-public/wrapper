import { RendererSDK, Vector3, EntityManager, Hero, Creep, Team, GameRules, Vector2 } from "wrapper/Imports"
import { State, ImageSizeMinimap, ImageSizeWorld } from "./Menu"

let jungle_units: [Hero, Vector3[], number][] = []
export function GameEvent(name: string, obj: any) {
	if (name !== "entity_hurt" && name !== "entity_killed")
		return
	let ent1 = EntityManager.EntityByIndex(obj.entindex_killed),
		ent2 = EntityManager.EntityByIndex(obj.entindex_attacker)
	if (
		ent1 === undefined || ent2 === undefined
		|| !ent1.IsValid || !ent2.IsValid
		|| ent1.IsVisible || ent2.IsVisible
		|| (!(ent1 instanceof Hero) && !(ent2 instanceof Hero))
		|| (!(ent1 instanceof Creep && ent1.Team === Team.Neutral) && !(ent2 instanceof Creep && ent2.Team === Team.Neutral))
	)
		return
	let hero = ent1 instanceof Hero ? ent1 : ent2 as Hero
	let creep = hero === ent1 ? ent2 : ent1
	let ar = jungle_units.find(ar_ => ar_[0] === hero)
	if (ar !== undefined) {
		if (Vector3.GetCenter(ar[1]).Distance2D(creep.Position) > 300)
			ar[1] = []
		ar[1].push(creep.Position)
		ar[2] = GameRules?.RawGameTime ?? 0
	} else
		jungle_units.push([hero, [creep.Position], GameRules?.RawGameTime ?? 0])
}

export function Tick() {
	let time = GameRules!.RawGameTime
	jungle_units = jungle_units.filter(ar => time - ar[2] < 3)
}

export function OnDraw() {
	if (!State.value)
		return
	jungle_units.forEach(([hero, positions]) => {
		let position = Vector3.GetCenter(positions)
		RendererSDK.DrawMiniMapIcon(`minimap_heroicon_${hero.Name}`, position, ImageSizeMinimap.value * 12)
		let screen_pos = RendererSDK.WorldToScreen(position)
		if (screen_pos === undefined)
			return
		RendererSDK.Image(
			`panorama/images/heroes/icons/${hero.Name}_png.vtex_c`,
			screen_pos.SubtractScalar(ImageSizeWorld.value / 4),
			-1,
			new Vector2(ImageSizeWorld.value / 2, ImageSizeWorld.value / 2)
		)
	})
}

export function Init() {
	jungle_units = []
}
