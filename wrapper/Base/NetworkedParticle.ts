import { ParticleAttachment } from "../Enums/ParticleAttachment"
import { EntityManager } from "../Managers/EntityManager"
import { EventsSDK } from "../Managers/EventsSDK"
import { Ability } from "../Objects/Base/Ability"
import { FakeUnit } from "../Objects/Base/FakeUnit"
import { Item } from "../Objects/Base/Item"
import { Unit } from "../Objects/Base/Unit"
import { AllNetworkParticleAbilities } from "../Objects/NativeToSDK"
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
	public AbilityIndex: Nullable<number> = undefined
	public SourceIndex: Nullable<number> = undefined
	public TargetIndex: Nullable<number> = undefined

	public Released = false
	public ShouldDraw = true
	public FrozenAt = -1
	public Text = ""

	constructor(
		public readonly Index: number,
		public readonly Path: string,
		public readonly ParticleSystemHandle: bigint,
		public readonly Attach: ParticleAttachment,
		public AttachedTo: Nullable<Unit | FakeUnit>,
		public ModifiersAttachedTo: Nullable<Unit | FakeUnit>
	) {
		this.PathNoEcon = GetOriginalParticlePath(this.Path)
		this.AbilityIndex = this.getAbilityIndex(this.PathNoEcon)
		this.setEntityData(this.PathNoEcon)
		NetworkedParticle.Instances.set(this.Index, this)
		this.EndTime = ApproximateParticleLifetime(this.Path)
		if (this.EndTime !== -1) {
			this.EndTime += GameState.RawGameTime
		}
	}
	public get Target(): Nullable<Unit> {
		return EntityManager.EntityByIndex<Unit>(this.TargetIndex)
	}
	public get Ability(): Nullable<Ability> {
		return EntityManager.EntityByIndex<Ability>(this.AbilityIndex)
	}
	public get Source(): Nullable<Unit> {
		return EntityManager.EntityByIndex<Unit>(this.SourceIndex)
	}
	public Destroy(): void {
		NetworkedParticle.Instances.delete(this.Index)
		EventsSDK.emit("ParticleDestroyed", false, this)
	}
	public UpdateData(pathNoEcon: string) {
		this.setEntityData(pathNoEcon)
		this.AbilityIndex = this.getAbilityIndex(pathNoEcon)
	}
	private getAbilityIndex(pathNoEcon: string) {
		const obj = this.extractEntityData(pathNoEcon)
		if (obj === undefined) {
			return undefined
		}
		const [caster, target, options, constructor] = obj
		this.SourceIndex = caster?.Index
		this.TargetIndex = target?.Index
		if (options.FindCaster && caster !== undefined) {
			return EntityManager.GetEntitiesByClass(constructor).find(
				x => x.Owner?.Team === caster.Team
			)?.Index
		}
		return constructor.prototype instanceof Item
			? caster?.GetItemByClass(constructor as Constructor<Item>)?.Index
			: caster?.GetAbilityByClass(constructor)?.Index
	}
	private setEntityData(pathNoEcon: string) {
		const obj = this.extractEntityData(pathNoEcon)
		if (obj !== undefined) {
			const [caster, target] = obj
			this.SourceIndex = caster?.Index
			this.TargetIndex = target?.Index
		}
	}
	private extractEntityData(
		pathNoEcon: string
	): Nullable<
		[Nullable<Unit>, Nullable<Unit>, IWrapperClassOptions, Constructor<Ability>]
	> {
		const obj = AllNetworkParticleAbilities.get(pathNoEcon)
		if (obj === undefined) {
			return undefined
		}
		const [constructor, options] = obj
		let attach = -1
		if (!Array.isArray(options.Attachs)) {
			attach = options.Attachs
		} else {
			for (let i = 0; i < options.Attachs.length; i++) {
				if (options.Attachs[i] === this.Attach) {
					attach = options.Attachs[i]
					break
				}
			}
		}
		if (attach === -1 || attach !== this.Attach) {
			return undefined
		}
		let caster: Nullable<Unit>, target: Nullable<Unit>
		if (options.IsAttachedTo && this.AttachedTo instanceof Unit) {
			caster = this.AttachedTo
		}
		if (options.IsModifiersAttachedTo && this.ModifiersAttachedTo instanceof Unit) {
			caster = this.ModifiersAttachedTo
		}
		if (options.SourceCP !== undefined) {
			const ent = this.ControlPointsEnt.get(options.SourceCP)?.[0]
			caster = ent instanceof Unit ? ent : undefined
		}
		if (options.TargetCP !== undefined) {
			const ent = this.ControlPointsEnt.get(options.TargetCP)?.[0]
			target = ent instanceof Unit ? ent : undefined
		}
		return [caster, target, options, constructor]
	}
}
