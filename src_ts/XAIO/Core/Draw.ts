import { Unit, LocalPlayer, Menu, ParticlesSDK, Vector3, Color, Ability, EventsSDK, Particle, ArrayExtensions, Item } from "wrapper/Imports"
import { XAIOEvents } from "./Events"

export let XAIOparKey: Map<Unit, Particle[]> = new Map()

export default class XAIOParticle {

	constructor(public unit?: Unit) { }

	private get IsOwnerValid(): boolean {
		return LocalPlayer !== undefined
			&& LocalPlayer.Hero !== undefined
			&& !LocalPlayer.IsSpectator
			&& this.unit !== undefined
	}

	public DrawCircle(
		abil: string,
		patern_name: string,
		range_radius: number = 0,
		selector?: Nullable<Menu.ImageSelector>,
		colors: Color = Color.White,
		renderStyle: number = 0,
		width: number = 10,
		infrontUnit: Vector3 = new Vector3
	) {
		if (!this.IsOwnerValid || !this.unit!.IsAlive || (selector !== undefined && !selector.IsEnabled(abil))) {
			this.RemoveParticle(patern_name)
			return
		}

		return this.RenderCircle(patern_name, range_radius, width, renderStyle, colors, infrontUnit)
	}

	public RenderCircle(
		name: string,
		range: number = 0,
		width: number = 10,
		renderStyle: number = 0,
		Colors: Color = Color.White,
		infrontUnit: Vector3 = new Vector3
	) {
		if (!this.IsOwnerValid)
			return
		return ParticlesSDK.DrawCircle(name + "_" + this.unit, this.unit!, range, {
			Width: width,
			Color: Colors,
			Position: infrontUnit.IsZero ? this.unit : infrontUnit,
			RenderStyle: renderStyle,
		})
	}

	public RenderAbilityItems(
		class_abilityItems: Constructor<Ability>[],
		RadiusesSelector: Menu.ImageSelector,
		XAIORangeRadiusesStyle: Menu.Switcher,
		changeColor: (abil: Ability, defColor: Color) => Color
	) {
		if (!this.IsOwnerValid)
			return

		class_abilityItems.forEach(class_name => {
			let abil = this.unit!.GetAbilityByClass(class_name) ?? this.unit!.GetItemByClass(class_name as Constructor<Item>)

			let nameAbil = class_name.name

			if (abil === undefined) {
				this.RemoveParticle(this.unit + nameAbil)
				return
			}

			let Radius = abil.CastRange

			if (Radius <= 0)
				Radius = abil.AOERadius

			if (Radius <= 0 || Radius === Number.MAX_SAFE_INTEGER)
				return

			let par = this.DrawCircle(
				nameAbil,
				this.unit + nameAbil,
				Radius,
				RadiusesSelector,
				changeColor(abil, Color.Red),
				XAIORangeRadiusesStyle.selected_id
			)

			if (par === undefined)
				return

			this.addPartToUnit(par!)
		})
	}

	public DrawAttackRange(stateDraw: Menu.Toggle, color: Color, swither: Menu.Switcher): Nullable<Particle> {
		if (!this.IsOwnerValid)
			return
		if (!this.unit!.IsAlive || !stateDraw.value) {
			this.RemoveParticle("attack_range")
			return
		}
		return this.DrawCircle("attack_range", "attack_range", this.unit!.AttackRange, undefined, color, swither.selected_id)
	}

	public RenderLineTarget(stateDraw: Menu.Toggle, enemy: Nullable<Unit>, color: Color) {
		if (!this.IsOwnerValid)
			return
		if (!stateDraw.value || !this.unit!.IsAlive || enemy === undefined) {
			ParticlesSDK.Remove(this.unit + "_target")
			return
		}
		return ParticlesSDK.DrawLineToTarget(this.unit + "_target", this.unit!, enemy, color)
	}

	public RenderConShot(State: Menu.Toggle, ability: Ability, PosShot: Menu.Slider, Units: Unit[]) {
		if (!this.IsOwnerValid)
			return
		let Enemy: Unit = ArrayExtensions.orderBy(Units.filter(
			x => x.IsEnemy() && x.IsVisible
				&& x.IsHero && x.IsAlive && x.Distance(this.unit!) <= (ability.CastRange === Number.MAX_SAFE_INTEGER ? 3000 : ability.CastRange)
		), ent => ent.Distance(this.unit!))[0]

		if (Enemy === undefined || !this.unit!.IsAlive || !State.value || !Enemy.IsVisible || !ability.CanBeCasted())
			return this.RemoveParticle(ability.Name + ability.Index)

		return this.CreateConShot(ability.Name + ability.Index, Enemy, PosShot)
	}

	private CreateConShot(name: string, enemy: Unit, PosShot: Menu.Slider) {
		return ParticlesSDK.AddOrUpdate(
			name + "_" + this.unit,
			"particles/units/heroes/hero_skywrath_mage/skywrath_mage_concussive_shot.vpcf",
			ParticleAttachment_t.PATTACH_CUSTOMORIGIN, enemy,
			0, enemy.Position.AddScalarZ(PosShot.value),
			1, enemy.Position.AddScalarZ(PosShot.value),
			2, new Vector3(3000)
		)
	}

	public removePartsAllByName() {
		// loop-optimizer: KEEP
		XAIOparKey.forEach(key => {
			key.forEach(x => x.Destroy(true))
		})
	}

	public readonly addPartToUnit = (par: Particle) => {
		if (!this.IsOwnerValid)
			return

		let particles = XAIOparKey.get(this.unit!)

		if (particles === undefined) {
			particles = [par]
		}
		else {
			if (particles.includes(par))
				return
			particles.push(par)
		}

		XAIOparKey.set(this.unit!, particles)
	}

	public RemoveParticle(name: string) {
		if (!this.IsOwnerValid || name === undefined)
			return
		ParticlesSDK.Remove(name + "_" + this.unit)
	}
}

XAIOEvents.on("removeControllable", (unit) => {
	if (!unit.IsHero)
		return
	// loop-optimizer: KEEP
	XAIOparKey.get(unit)?.forEach(x => x.Destroy(true))
})

EventsSDK.on("GameEnded", () => {
	XAIOparKey.clear()
})