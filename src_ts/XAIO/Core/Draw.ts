//@ts-nocheck
import { Unit, LocalPlayer, Menu, ParticlesSDK, Vector3, Color, Hero, Ability, EventsSDK, Particle, ArrayExtensions } from "wrapper/Imports"
import { XAIOEvents } from "../bootstrap"

export let XAIOparKey: Map<Unit, Particle[]> = new Map()

export default class XAIOParticle {

	constructor(public unit?: Unit) { }


	private get IsOwnerValid(): boolean {
		return LocalPlayer !== undefined && LocalPlayer.Hero !== undefined && !LocalPlayer.IsSpectator && this.unit !== undefined
	}

	public DrawCircle(
		name: string,
		range: number = 0,
		selector?: Menu.ImageSelector | undefined,
		colors?: Color = Color.White,
		renderStyle?: number = 0,
		width?: number = 10,
		infrontUnit?: Vector3 = new Vector3
	) {
		if (!this.IsOwnerValid
			|| !this.unit.IsAlive
			|| range === 0
			|| range === Number.MAX_SAFE_INTEGER
			|| !this.unit.IsAlive
			|| renderStyle === undefined
			|| (selector !== undefined && !selector.IsEnabled(name))
		) {
			return this.RemoveParticle(name)
		}

		return this.RenderCircle(name, range, width, renderStyle, colors, infrontUnit)
	}

	public RenderCircle(
		name: string,
		range: number = 0,
		width: number = 10,
		renderStyle: number = 0,
		Colors?: Color = Color.White,
		infrontUnit?: Vector3 = new Vector3
	) {
		if (!this.IsOwnerValid)
			return
		return ParticlesSDK.DrawCircle(name + "_" + this.unit, this.unit, range, {
			Width: width,
			Color: Colors,
			Position: infrontUnit.IsZero ? this.unit : infrontUnit,
			RenderStyle: renderStyle,
		})
	}

	public DrawAttackRange(stateDraw: Menu.Toggle, color: Color, swither: Menu.Switcher): Nullable<Particle> {
		if (!this.unit.IsAlive || !stateDraw.value)
			return this.RemoveParticle("attack_range")

		return this.DrawCircle("attack_range", this.unit.AttackRange, undefined, color, swither)
	}

	public RenderLineTarget(stateDraw: Menu.Toggle, enemy: Nullable<Unit>, color: Color) {
		if (!stateDraw.value || !this.unit.IsAlive || enemy === undefined) {
			ParticlesSDK.Remove(this.unit + "_target")
			return
		}
		return ParticlesSDK.DrawLineToTarget(this.unit + "_target", this.unit, enemy, color)
	}


	public RenderConShot(State: Menu.Toggle, ability: Ability, PosShot: Menu.Slider, Units: Unit[]) {

		let Enemy: Unit = ArrayExtensions.orderBy(Units.filter(
			x => x.IsEnemy() && x.IsVisible
				&& x.IsHero && x.IsAlive && x.Distance(this.unit) <= (ability.CastRange === Number.MAX_SAFE_INTEGER ? 3000 : ability.CastRange)
		), ent => ent.Distance(this.unit))[0]

		if (Enemy === undefined || !this.unit.IsAlive || !State.value || !Enemy.IsVisible || !ability.CanBeCasted())
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

	public readonly removePartsAllByName = () => {
		if (!this.IsOwnerValid)
			return
		// loop-optimizer: KEEP
		XAIOparKey.forEach((key, unit) => {
			if (unit.Name !== this.unit.Name)
				return
			key.forEach(x => x.Destroy(true))
		})
	}

	public readonly addPartToUnit = (par: Particle) => {
		if (!this.IsOwnerValid)
			return

		let particles = XAIOparKey.get(this.unit)

		particles === undefined
			? particles = [par]
			: particles.push(par)

		XAIOparKey.set(this.unit, particles)
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
