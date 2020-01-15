import { Entity } from "../../wrapper/Imports"

export interface Module {
	OnState: (state: boolean) => void

	EntityCreated?: (ent: Entity) => void
	EntityDestroyed?: (ent: Entity) => void

	Tick?: () => void
	Draw?: () => void
}

export const Modules: Module[] = []

export const RegisterModule = (module: Module) => Modules.push(module)