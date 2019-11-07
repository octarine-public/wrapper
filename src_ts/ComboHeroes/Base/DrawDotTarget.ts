import { Unit, LocalPlayer, Menu, ParticlesSDK, Vector3, Color, Hero } from "wrapper/Imports"
let allParticles = new Map<string, number>()
let EnemyParticle = new Map<string, number>()

export default class DrawTarget {
	public owner: Unit
	constructor(owner?: Unit) {
		this.owner = owner
	}
	private get IsOwnerValid(): boolean {
		return LocalPlayer !== undefined && !LocalPlayer.IsSpectator && this.owner !== undefined
	}
	public UpdateLineDot(name: string, Base: any, State: Menu.Toggle, target: Hero) {
		if (!this.IsOwnerValid) {
			return
		}
		let particle = allParticles.get(name)
		if (particle === undefined && target !== undefined) {
			particle = ParticlesSDK.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, target)
			ParticlesSDK.SetControlPoint(particle, 6, new Vector3(1))
			allParticles.set(name, particle)
		}
		if (!EnemyParticle.has(name)) {
			if (target === undefined || !this.owner.IsAlive || !Base.IsRestrictions(State)) {
				this.RemoveParticle(name)
			} else {
				ParticlesSDK.SetControlPoint(particle, 2, this.owner.Position)
				ParticlesSDK.SetControlPoint(particle, 7, target.Position)
			}
		}
	}

	public UpdateCircle(name: string, range: number, Colors: Color = new Color(255, 255, 255)) {
		if (!this.IsOwnerValid) {
			return
		}
		let particle = allParticles.get(name)
		if (particle === undefined) {
			particle = ParticlesSDK.Create("particles/ui_mouseactions/drag_selected_ring.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.owner)
			allParticles.set(name, particle)
		}
		if (name) {
			ParticlesSDK.SetControlPoint(particle, 0, this.owner.Position)
			ParticlesSDK.SetControlPoint(particle, 1, new Vector3(Colors.r, Colors.g, Colors.b))
			ParticlesSDK.SetControlPoint(particle, 2, new Vector3(range * 1.111, 255, 0))
		}
	}

	public RemoveParticle(name: string) {
		if (!this.IsOwnerValid) {
			return
		}
		let particle = allParticles.get(name)
		if (particle !== undefined) {
			ParticlesSDK.Destroy(particle, true)
			allParticles.delete(name)
		}
		let _particle = EnemyParticle.get(name)
		if (_particle !== undefined) {
			ParticlesSDK.Destroy(_particle, true)
			EnemyParticle.delete(name)
		}
	}
}