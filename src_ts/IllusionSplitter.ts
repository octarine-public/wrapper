import { Menu as MenuSDK, Hero, GameSleeper, Utils, item_bottle, EntityManager, Game, EventsSDK, LocalPlayer } from "wrapper/Imports"

const Menu = MenuSDK.AddEntry(["Utility", "Illusion Splitter"])
const AngleRandomizer = Menu.AddToggle("Random Split Angle", true)
const IllusionsRange = Menu.AddSlider("Illusions Range", 600, 100, 2000)
const IllusionsMinMoveRange = Menu.AddSlider("Minimun Move Range", 800, 100, 2000)
const MoveMainHero = Menu.AddToggle("Move Hero", true)
const Hotkey = Menu.AddKeybind("Hotkey")

let arr_abil: string[] = [
	"item_bottle_illusion",
	"item_manta",
	"naga_siren_mirror_image",
	"terrorblade_conjure_image",
	"phantom_lancer_doppelwalk"
]
const UseAbility = Menu.AddImageSelector("Usage", arr_abil, new Map(arr_abil.map(name => [name, true])))

const Sleep = new GameSleeper()
const Delay = (((Game.Ping / 2) + 30) + 250)

const DegreesToRadians = (deg: number) => deg * 0.0174532924

EventsSDK.on("Tick", () => {

	if (LocalPlayer!.Hero === undefined || !Hotkey.is_pressed)
		return

	let Owner = LocalPlayer!.Hero

	if (Sleep.Sleeping(Owner))
		return

	let illusions = EntityManager.GetEntitiesByClass(Hero).filter(x =>
		x.IsIllusion
		&& x.IsAlive
		&& x.IsControllable
		&& !x.UnitState.some(x => x & 524288) // Anti mage restrict talant 
		&& (x.Distance2D(Owner) < IllusionsRange.value)
	)

	const unitCount = illusions.length + 1
	const angleUnit = 360 / unitCount

	if (MoveMainHero.value && !Sleep.Sleeping("owner_move")) {
		Owner.MoveTo(Utils.CursorWorldVec)
		Sleep.Sleep(Delay, "owner_move")
	}

	let Direction = MoveMainHero.value
		? Utils.CursorWorldVec.SubtractForThis(Owner.Position)
		: Owner.InFront(250).SubtractForThis(Owner.Position)

	let midPosition = illusions.reduce((current, illusion) =>
		illusion.Position.AddForThis(current), Owner.Position)

	midPosition.DivideScalarForThis(unitCount)

	illusions.forEach(illusion => {

		let randomAngle = Math.floor(Math.random() * Math.floor(angleUnit / unitCount) + 1)

		Direction = AngleRandomizer.value
			? Direction.Rotated(DegreesToRadians(angleUnit + randomAngle))
			: Direction.Rotated(DegreesToRadians(angleUnit))

		let movePos = midPosition.Add(
			Direction.Normalize().MultiplyScalarForThis(IllusionsMinMoveRange.value)
		)

		if (Sleep.Sleeping(illusion))
			return

		illusion.MoveTo(movePos)
		Sleep.Sleep(Delay, illusion)
		return
	})

	if (Owner.IsInvulnerable || Owner.IsStunned)
		return

	// ###### usage ability
	if (!arr_abil.some(x => {

		let bottle = Owner.GetItemByName("item_bottle"),
			abil = Owner.GetAbilityByName(x) ?? Owner.GetItemByName(x)

		if (
			bottle !== undefined
			&& bottle.CanBeCasted()
			&& UseAbility.IsEnabled("item_bottle_illusion")
		) {
			let bottleStored = bottle as item_bottle
			if (bottleStored.StoredRune === DOTA_RUNES.DOTA_RUNE_ILLUSION) {
				Owner.CastNoTarget(bottle)
				Sleep.Sleep(Delay, Owner)
				return true
			}
		}

		if (
			abil === undefined
			|| !abil.CanBeCasted()
			|| !UseAbility.IsEnabled(x)
		)
			return false

		let delay_defualt = !x.startsWith("item_")
			? abil.CastPoint * 1000 + Delay
			: Delay

		if (abil.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT)) {
			let pos = Utils.CursorWorldVec.Subtract(Owner.Position)
			if (pos.Length > abil.CastRange)
				pos.Normalize().MultiplyScalarForThis(abil.CastRange)

			Owner.CastPosition(abil, Owner.Position.AddForThis(pos))
			Sleep.Sleep((abil.CastPoint + abil.GetSpecialValue("delay")) * 1000 + Delay, Owner)
			return true
		}

		if (x.startsWith("naga_")) {
			Owner.CastNoTarget(abil)
			Sleep.Sleep((abil.CastPoint + abil.GetSpecialValue("invuln_duration")) * 1000 + Delay, Owner)
			return true
		}

		Owner.CastNoTarget(abil)
		Sleep.Sleep(delay_defualt, Owner)
		return true

	})) return
})