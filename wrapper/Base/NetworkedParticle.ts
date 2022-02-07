import { ParticleAttachment_t } from "../Enums/ParticleAttachment_t"
import * as EconHelper from "../Managers/EconHelper"
import EventsSDK from "../Managers/EventsSDK"
import FakeUnit from "../Objects/Base/FakeUnit"
import Unit from "../Objects/Base/Unit"
import { parseKVFile } from "../Resources/ParseKV"
import { GetMapNumberProperty, GetMapStringProperty } from "../Resources/ParseUtils"
import GameState from "../Utils/GameState"
import QAngle from "./QAngle"
import Vector3 from "./Vector3"

function ApproximateParticleLifetimeInternal(path: string): number {
	if (!path.endsWith("_c"))
		path += "_c"
	const kv = parseKVFile(path)
	if (kv.size === 0) {
		console.log(`Failed parsing particle KV at ${path}`)
		return 0
	}

	let res = 0
	const m_Initializers = kv.get("m_Initializers")
	if (Array.isArray(m_Initializers) || m_Initializers instanceof Map)
		m_Initializers.forEach((initializer: RecursiveMapValue) => {
			if (!(initializer instanceof Map))
				return
			const _class = initializer.get("_class")
			switch (_class) {
				case "C_INIT_RandomLifeTime": {
					let min = GetMapNumberProperty(initializer, "m_fLifetimeMin"),
						max = GetMapNumberProperty(initializer, "m_fLifetimeMax")
					const old_min = min
					if (min > max) {
						min = max
						max = old_min
					}
					res += min + Math.random() * (max - min)
					break
				}
				default:
					break
			}
		})

	let has_decay = false
	const m_Operators = kv.get("m_Operators")
	if (Array.isArray(m_Operators) || m_Operators instanceof Map)
		m_Operators.forEach((operator: RecursiveMapValue) => {
			if (!(operator instanceof Map))
				return
			const _class = operator.get("_class")
			switch (_class) {
				case "C_OP_Decay":
					res += GetMapNumberProperty(operator, "m_flOpStartFadeInTime")
					has_decay = true
					break
				case "C_OP_FadeAndKill":
					has_decay = true
					break
				default:
					break
			}
		})

	if (!has_decay)
		return -1

	let max_child_res = 0
	const m_Children = kv.get("m_Children")
	if (Array.isArray(m_Children) || m_Children instanceof Map)
		m_Children.forEach((child: RecursiveMapValue) => {
			if (!(child instanceof Map) || child.get("m_bDisableChild"))
				return
			const childRes = ApproximateParticleLifetime(GetMapStringProperty(child, "m_ChildRef"))
			if (childRes === -1)
				return -1
			max_child_res = Math.max(max_child_res, childRes)
		})
	return res + max_child_res
}

const ParticlesLifetimeCache = new Map<string, number>()
function ApproximateParticleLifetime(path: string): number {
	if (ParticlesLifetimeCache.has(path))
		return ParticlesLifetimeCache.get(path)!
	const res = ApproximateParticleLifetimeInternal(path)
	ParticlesLifetimeCache.set(path, res)
	return res
}

export default class NetworkedParticle {
	public static readonly Instances = new Map<number, NetworkedParticle>()
	public readonly ControlPoints = new Map<number, Vector3>()
	public readonly ControlPointsSnapshot = new Map<number, string>()
	public readonly ControlPointsModel = new Map<number, string>()
	public readonly ControlPointsForward = new Map<number, Vector3>()
	public readonly ControlPointsFallback = new Map<number, Vector3>()
	public readonly ControlPointsOrient = new Map<number, [Vector3, Vector3, Vector3]>()
	public readonly ControlPointsOffset = new Map<number, [Vector3, QAngle]>()
	public readonly ControlPointsEnt = new Map<number, [Unit | FakeUnit, ParticleAttachment_t, number, boolean]>()
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
		public readonly Attach: ParticleAttachment_t,
		public AttachedTo: Nullable<Unit | FakeUnit>,
	) {
		const orig = EconHelper.Particles.repl2orig.get(this.Path)
		this.PathNoEcon = orig !== undefined && orig.length !== 0
			? orig[0]
			: this.Path
		NetworkedParticle.Instances.set(this.Index, this)
		this.EndTime = ApproximateParticleLifetime(this.Path)
		if (this.EndTime !== -1)
			this.EndTime += GameState.RawGameTime
	}

	public async Destroy(): Promise<void> {
		NetworkedParticle.Instances.delete(this.Index)
		await EventsSDK.emit(
			"ParticleDestroyed",
			false,
			this,
		)
	}
}

EventsSDK.after("EntityCreated", async ent => {
	if (!(ent instanceof Unit))
		return
	for (const par of NetworkedParticle.Instances.values()) {
		let changed_anything = false
		if (par.AttachedTo?.EntityMatches(ent)) {
			par.AttachedTo = ent
			changed_anything = true
		}
		for (const data of par.ControlPointsEnt.values())
			if (data[0].EntityMatches(ent)) {
				data[0] = ent
				changed_anything = true
			}
		if (changed_anything)
			await EventsSDK.emit(
				"ParticleUpdated",
				false,
				par,
			)
	}
})
EventsSDK.on("EntityDestroyed", async ent => {
	const destroyedParticles: NetworkedParticle[] = []
	for (const par of NetworkedParticle.Instances.values())
		if (par.AttachedTo === ent)
			destroyedParticles.push(par)
	for (const par of destroyedParticles)
		await par.Destroy()
	for (const par of NetworkedParticle.Instances.values()) {
		let changed_anything = false
		const destroyedCPsEnt: number[] = []
		for (const [cp, data] of par.ControlPointsEnt)
			if (data[0] === ent) {
				destroyedCPsEnt.push(cp)
				changed_anything = true
			}
		for (const cp of destroyedCPsEnt)
			par.ControlPointsEnt.delete(cp)
		if (changed_anything)
			await EventsSDK.emit(
				"ParticleUpdated",
				false,
				par,
			)
	}
})

EventsSDK.on("Tick", async () => {
	const destroyedParticles: NetworkedParticle[] = []
	for (const par of NetworkedParticle.Instances.values())
		if (par.Released && par.EndTime !== -1 && par.EndTime <= GameState.RawGameTime)
			destroyedParticles.push(par)
	for (const par of destroyedParticles)
		await par.Destroy()
})
