import { ParticleAttachment } from "../Enums/ParticleAttachment"
import * as EconHelper from "../Managers/EconHelper"
import { Events } from "../Managers/Events"
import { EventsSDK } from "../Managers/EventsSDK"
import { FakeUnit } from "../Objects/Base/FakeUnit"
import { Unit } from "../Objects/Base/Unit"
import { GetMapNumberProperty, GetMapStringProperty } from "../Resources/ParseUtils"
import { GameState } from "../Utils/GameState"
import { QAngle } from "./QAngle"
import { Vector3 } from "./Vector3"
import { Vector4 } from "./Vector4"

function ApproximateParticleLifetimeInternal(path: string): number {
	if (!path.endsWith("_c")) {
		path += "_c"
	}
	const kv = parseKV(path)
	if (kv.size === 0) {
		console.log(`Failed parsing particle KV at ${path}`)
		return 0
	}

	let res = 0
	const initializers = kv.get("m_Initializers")
	if (Array.isArray(initializers) || initializers instanceof Map) {
		initializers.forEach((initializer: RecursiveMapValue) => {
			if (!(initializer instanceof Map)) {
				return
			}
			switch (initializer.get("_class")) {
				case "C_INIT_RandomLifeTime": {
					let min = GetMapNumberProperty(initializer, "m_fLifetimeMin"),
						max = GetMapNumberProperty(initializer, "m_fLifetimeMax")
					const oldMin = min
					if (min > max) {
						min = max
						max = oldMin
					}
					res += min + Math.random() * (max - min)
					break
				}
				default:
					break
			}
		})
	}

	let hasDecay = false
	const operators = kv.get("m_Operators")
	if (Array.isArray(operators) || operators instanceof Map) {
		operators.forEach((operator: RecursiveMapValue) => {
			if (!(operator instanceof Map)) {
				return
			}
			switch (operator.get("_class")) {
				case "C_OP_Decay":
					res += GetMapNumberProperty(operator, "m_flOpStartFadeInTime")
					hasDecay = true
					break
				case "C_OP_FadeAndKill":
					hasDecay = true
					break
				default:
					break
			}
		})
	}

	if (!hasDecay) {
		return -1
	}

	let maxChildRes = 0
	const children = kv.get("m_Children")
	if (Array.isArray(children) || children instanceof Map) {
		children.forEach((child: RecursiveMapValue) => {
			if (!(child instanceof Map) || child.get("m_bDisableChild")) {
				return
			}
			const childRes = ApproximateParticleLifetime(
				GetMapStringProperty(child, "m_ChildRef")
			)
			if (childRes === -1) {
				return -1
			}
			maxChildRes = Math.max(maxChildRes, childRes)
		})
	}
	return res + maxChildRes
}

const ParticlesLifetimeCache = new Map<string, number>()
function ApproximateParticleLifetime(path: string): number {
	if (ParticlesLifetimeCache.has(path)) {
		return ParticlesLifetimeCache.get(path)!
	}
	const res = ApproximateParticleLifetimeInternal(path)
	ParticlesLifetimeCache.set(path, res)
	return res
}

export class NetworkedParticle {
	public static readonly Instances = new Map<number, NetworkedParticle>()
	public readonly ControlPoints = new Map<number, Vector3>()
	public readonly ControlPointsSnapshot = new Map<number, string>()
	public readonly ControlPointsModel = new Map<number, string>()
	public readonly ControlPointsForward = new Map<number, Vector3>()
	public readonly ControlPointsQuaternion = new Map<number, Vector4>()
	public readonly ControlPointsFallback = new Map<number, Vector3>()
	public readonly ControlPointsOrient = new Map<number, [Vector3, Vector3, Vector3]>()
	public readonly ControlPointsOffset = new Map<number, [Vector3, QAngle]>()
	public readonly ControlPointsEnt = new Map<
		number,
		[Unit | FakeUnit, ParticleAttachment, number, boolean]
	>()
	public readonly TextureAttributes = new Map<string, string>()
	public readonly EndTime: number
	public readonly PathNoEcon: string
	public Released = false
	public ShouldDraw = true
	public FrozenAt = -1
	public Text = ""

	constructor(
		public readonly Index: number,
		public readonly Path: string,
		public readonly ParticleSystemHandle: bigint,
		public readonly Attach: ParticleAttachment,
		public AttachedTo: Nullable<Unit | FakeUnit>
	) {
		const orig = EconHelper.Particles.repl2orig.get(this.Path)
		this.PathNoEcon = orig !== undefined && orig.length !== 0 ? orig[0] : this.Path
		NetworkedParticle.Instances.set(this.Index, this)
		this.EndTime = ApproximateParticleLifetime(this.Path)
		if (this.EndTime !== -1) {
			this.EndTime += GameState.RawGameTime
		}
	}

	public Destroy(): void {
		NetworkedParticle.Instances.delete(this.Index)
		EventsSDK.emit("ParticleDestroyed", false, this)
	}
}

EventsSDK.after("EntityCreated", ent => {
	if (!(ent instanceof Unit)) {
		return
	}

	for (const par of NetworkedParticle.Instances.values()) {
		let changedAnything = false
		if (par.AttachedTo?.EntityMatches(ent)) {
			par.AttachedTo = ent
			changedAnything = true
		}
		for (const data of par.ControlPointsEnt.values()) {
			if (data[0].EntityMatches(ent)) {
				data[0] = ent
				changedAnything = true
			}
		}
		if (changedAnything) {
			EventsSDK.emit("ParticleUpdated", false, par)
		}
	}
})
EventsSDK.on("EntityDestroyed", ent => {
	const destroyedParticles: NetworkedParticle[] = []
	for (const par of NetworkedParticle.Instances.values()) {
		if (par.AttachedTo === ent) {
			destroyedParticles.push(par)
		}
	}
	for (const par of destroyedParticles) {
		par.Destroy()
	}
	for (const par of NetworkedParticle.Instances.values()) {
		let changedAnything = false
		const destroyedCPsEnt: number[] = []
		for (const [cp, data] of par.ControlPointsEnt) {
			if (data[0] === ent) {
				destroyedCPsEnt.push(cp)
				changedAnything = true
			}
		}
		for (const cp of destroyedCPsEnt) {
			par.ControlPointsEnt.delete(cp)
		}
		if (changedAnything) {
			EventsSDK.emit("ParticleUpdated", false, par)
		}
	}
})

EventsSDK.on("Tick", () => {
	const destroyedParticles: NetworkedParticle[] = []
	for (const par of NetworkedParticle.Instances.values()) {
		if (par.Released && par.EndTime !== -1 && par.EndTime <= GameState.RawGameTime) {
			destroyedParticles.push(par)
		}
	}
	for (let index = 0, end = destroyedParticles.length; index < end; index++) {
		destroyedParticles[index].Destroy()
	}
})

Events.on("NewConnection", () => {
	const instances = NetworkedParticle.Instances
	if (instances.size === 0) {
		return
	}
	const destroyedParticles: NetworkedParticle[] = []
	for (const par of instances.values()) {
		destroyedParticles.push(par)
	}
	for (let index = destroyedParticles.length - 1; index > -1; index--) {
		destroyedParticles[index].Destroy()
	}
})

// return after move icore
// EventsSDK.after("EntityCreated", ent => {
// 	if (!(ent instanceof Unit)) {
// 		return
// 	}
// 	NetworkedParticle.Instances.forEach(par => {
// 		let changedAnything = false
// 		if (par.AttachedTo?.EntityMatches(ent)) {
// 			par.AttachedTo = ent
// 			changedAnything = true
// 		}
// 		par.ControlPointsEnt.forEach(data => {
// 			if (data[0].EntityMatches(ent)) {
// 				data[0] = ent
// 				changedAnything = true
// 			}
// 		})
// 		if (changedAnything) {
// 			EventsSDK.emit("ParticleUpdated", false, par)
// 		}
// 	})
// })
// EventsSDK.on("EntityDestroyed", ent => {
// 	NetworkedParticle.Instances.forEach(par => {
// 		let changedAnything = false
// 		if (par.AttachedTo === ent) {
// 			par.Destroy()
// 		}
// 		par.ControlPointsEnt.forEach((data, cp) => {
// 			if (data[0] === ent) {
// 				par.ControlPointsEnt.delete(cp)
// 				changedAnything = true
// 			}
// 		})
// 		if (changedAnything) {
// 			EventsSDK.emit("ParticleUpdated", false, par)
// 		}
// 	})
// })

// EventsSDK.on("Tick", () => {
// 	NetworkedParticle.Instances.forEach(par => {
// 		if (par.EndTime !== -1 && par.EndTime <= GameState.RawGameTime) {
// 			par.Destroy()
// 		}
// 	})
// })
