import { EventEmitter, Unit } from "wrapper/Imports"

export const XAIOEvents: XAIOEvents = new EventEmitter()

export interface XAIOEvents extends EventEmitter {
	on(name: "removeControllable", callback: (unit: Unit) => void): EventEmitter
}