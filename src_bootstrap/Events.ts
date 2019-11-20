/// internal declarations
/// you may use ONLY this ones & default V8 things
declare function setFireEvent(func: (event_name: string, cancellable: boolean, ...args: any) => boolean): void
declare var global: any

/// actual code
global.EventEmitter = class EventEmitter {
	private readonly events = new Map<string, Listener[]>()
	private readonly events_after = new Map<string, Listener[]>()

	public on(name: string, listener: Listener): EventEmitter {
		let listeners = this.events.get(name)
		if (listeners === undefined)
			this.events.set(name, listeners = [])

		listeners.push(listener)
		return this
	}
	public after(name: string, listener: Listener): EventEmitter {
		let listeners = this.events_after.get(name)
		if (listeners === undefined)
			this.events_after.set(name, listeners = [])

		listeners.push(listener)
		return this
	}

	public removeListener(name: string, listener: Listener): EventEmitter {
		let listeners = this.events.get(name)
		if (listeners === undefined)
			return

		const idx = listeners.indexOf(listener)
		if (idx > -1)
			listeners.splice(idx, 1)
		return this
	}

	public emit(name: string, cancellable: boolean = false, ...args: any[]): boolean {
		let listeners = this.events.get(name),
			listeners_after = this.events_after.get(name)

		let ret = listeners === undefined || !listeners.some(listener => {
			try {
				return listener.apply(this, args) === false && cancellable
			} catch (e) {
				console.log(e.stack || new Error(e).stack)
				return false
			}
		})
		if (listeners_after !== undefined && ret)
			listeners_after.forEach(listener => {
				try {
					listener.apply(this, args)
				} catch (e) {
					console.log(e.stack || new Error(e).stack)
				}
			})
		return ret
	}

	public once(name: string, listener: Listener): EventEmitter {
		const once_listener = (...args: any) => {
			this.removeListener(name, once_listener)
			listener(...args)
		}
		return this.on(name, once_listener)
	}
}

global.Events = new EventEmitter()
setFireEvent((name, cancellable, ...args) => Events.emit(name, cancellable, ...args))
