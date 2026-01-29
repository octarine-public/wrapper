/* eslint-disable no-multi-str */
/* eslint-disable @typescript-eslint/naming-convention */

interface $ {
	Msg(...args: any[]): void
	AssertHelper(...args: any[]): void
	Warning(...args: any[]): void
	DispatchEvent(...args: any[]): void
	DispatchEventAsync(...args: any[]): void
	RegisterEventHandler(...args: any[]): void
	RegisterForUnhandledEvent(...args: any[]): void
	UnregisterForUnhandledEvent(...args: any[]): void
	FindChildInContext(...args: any[]): IUIPanelJS | null
	AsyncWebRequest(...args: any[]): void
	CreatePanel(type: string, parent: IUIPanelJS, id?: string): IUIPanelJS
	CreatePanelWithProperties(...args: any[]): IUIPanelJS
	Localize(...args: any[]): string
	LocalizePlural(...args: any[]): string
	Language(): string
	Schedule(delay: number, fn: () => void): number
	CancelScheduled(handle: number): void
	FrameTime(): number
	GetContextPanel(): IUIPanelJS
	RegisterKeyBind(...args: any[]): void
	Each<T>(items: T[], fn: (item: T) => void): void
	DbgIsReloadingScript(): boolean
	HTMLEscape(str: string): string
	LogChannel(...args: any[]): void
	BImageFileExists(path: string): boolean
}

interface IUIPanelJS {
	/* === Properties (get/set) === */
	get visible(): boolean
	set visible(value: boolean)
	get text(): string
	set text(value)

	enabled(value: boolean): void
	checked(value: boolean): void
	defaultfocus(value: string): void
	inputnamespace(value: string): void
	hittest(value: boolean): void
	hittestchildren(value: boolean): void
	tabindex(value: number): void

	selectionpos_x(value: number): void
	selectionpos_y(value: number): void

	/* === Readonly getters === */
	get type(): string
	get id(): string
	layoutfile(): string

	get contentwidth(): number
	get contentheight(): number
	get desiredlayoutwidth(): number
	get desiredlayoutheight(): number
	get actuallayoutwidth(): number
	get actuallayoutheight(): number
	get actualxoffset(): number
	get actualyoffset(): number
	get scrolloffset_x(): number
	get scrolloffset_y(): number
	get actualuiscale_x(): number
	get actualuiscale_y(): number

	get style(): any
	set style(value: any)

	/* === CSS Classes === */
	AddClass(name: string): void
	AddClasses(classes: string | string[]): void
	RemoveClass(name: string): void
	RemoveClasses(classes: string | string[]): void

	BHasClass(name: string): boolean
	BAscendantHasClass(name: string): boolean

	SetHasClass(name: string, enabled: boolean): void
	ToggleClass(name: string): void
	SwitchClass(slot: string, className: string): void
	TriggerClass(name: string): void

	/* === Events === */
	SetPanelEvent(event: string, fn: (...args: any[]) => void): void
	ClearPanelEvent(event: string): void
	RunScriptInPanelContext(script: string): void

	/* === Drag & Size === */
	SetDraggable(value: boolean): void
	IsDraggable(): boolean
	IsSizeValid(): boolean

	/* === Hierarchy === */
	GetChildCount(): number
	GetChild(index: number): IUIPanelJS
	GetChildIndex(panel: IUIPanelJS): number
	Children(): IUIPanelJS[]

	GetParent(): IUIPanelJS | null
	SetParent(parent: IUIPanelJS): void

	FindChild(id: string): IUIPanelJS | null
	FindChildTraverse(id: string): IUIPanelJS
	FindChildInLayoutFile(id: string): IUIPanelJS | null
	FindPanelInThisOrParentLayoutFile(id: string): IUIPanelJS | null
	FindAncestor(type: string): IUIPanelJS | null

	RemoveAndDeleteChildren(): void
	MoveChildBefore(child: IUIPanelJS, before: IUIPanelJS): void
	MoveChildAfter(child: IUIPanelJS, after: IUIPanelJS): void

	/* === Layout & Position === */
	GetPositionWithinWindow(): { x: number; y: number }
	GetPositionWithinAncestor(panel: IUIPanelJS): { x: number; y: number }
	GetPosition(includeTransform: boolean): { x: number; y: number }

	ApplyStyles(force: boolean): void
	ClearPropertyFromCode(name: string): void
	DeleteAsync(delay: number): void

	/* === Focus & Input === */
	BAcceptsInput(): boolean
	BAcceptsFocus(): boolean
	BHasKeyFocus(): boolean
	BHasDescendantKeyFocus(): boolean
	BHasHoverStyle(): boolean

	SetAcceptsInput(value: boolean): void
	SetAcceptsFocus(value: boolean): void
	SetDisableFocusOnMouseDown(value: boolean): void
	SetFocus(): void
	UpdateFocusInContext(): void

	/* === Layout loading === */
	BLoadLayout(path: string, immediate: boolean, reload: boolean): boolean
	BLoadLayoutFromString(path: string, immediate: boolean, reload: boolean): boolean
	BLoadLayoutSnippet(name: string): boolean
	BHasLayoutSnippet(name: string): boolean
	BGetSnippetNames(out: string[]): boolean

	/* === Dialog variables === */
	SetDialogVariable(name: string, value: string): void
	SetDialogVariableInt(name: string, value: number): void
	SetDialogVariableTime(name: string, value: number): void
	SetDialogVariableLostring(name: string, value: string): void
	SetDialogVariableLostringNested(name: string, value: string): void
	SetDialogVariablePluralLostringInt(name: string, value: string, count: number): void

	/* === Scroll === */
	ScrollToTop(): void
	ScrollToBottom(): void
	ScrollToLeftEdge(): void
	ScrollToRightEdge(): void
	BCanSeeInParentScroll(): boolean

	/* === Attributes === */
	GetAttributeInt(name: string, def: number): number
	GetAttributeString(name: string, def: string): string
	GetAttributenumber(name: string, def: number): number

	SetAttributeInt(name: string, value: number): void
	SetAttributeString(name: string, value: string): void
	SetAttributenumber(name: string, value: number): void

	/* === Misc === */
	PlayPanelSound(name: string): void
	Data(...args: any[]): any

	debug: {
		description(...args: any[]): void
	}
}

type PanoramaContext = {
	$: $
	Game: any
	GameEvents: any
}

class PanoramaBridge {
	public static run(p: IUIPanel, fn: (ctx: PanoramaContext) => void) {
		const js = `
      (function () {
        const $api = $,
			$game = Game,
			$events = GameEvents;
        try {
          (${fn.toString()})({
            $: $api,
            Game: $game,
			GameEvents: $events
          });
        } catch (e) {
          $.Msg("PanoramaBridge error:", e);
        }
      })();
    `
		Panorama.ExecuteScript(p, js)
	}
}

PanoramaBridge.run(Panorama.FindRootPanel("DotaDashboard")!, ({ $ }) => {
	type Listener = (...args: any) => false | any
	class EventEmitter {
		protected readonly events = new Map<string, [Listener, number][]>()
		protected readonly eventsAfter = new Map<string, [Listener, number][]>()
		protected readonly listener2line = new WeakMap<Listener, string>()

		public on(name: string, listener: Listener, priority = 0): EventEmitter {
			this.listener2line.set(listener, new Error().stack?.split("\n")[2] ?? "")

			const listeners = this.events.get(name) ?? []
			listeners.push([listener, priority])
			this.events.set(
				name,
				listeners.sort((a, b) => a[1] - b[1])
			)

			return this
		}
		public after(name: string, listener: Listener, priority = 0): EventEmitter {
			this.listener2line.set(listener, new Error().stack?.split("\n")[2] ?? "")

			const listeners = this.eventsAfter.get(name) ?? []
			listeners.push([listener, priority])
			this.eventsAfter.set(
				name,
				listeners.sort((a, b) => a[1] - b[1])
			)

			return this
		}

		public removeListener(name: string, listener: Listener): EventEmitter {
			const listeners = this.events.get(name)
			if (listeners === undefined) {
				return this
			}
			if (listeners.removeCallback(val => val[0] === listener)) {
				this.listener2line.delete(listener)
			}
			return this
		}

		public emit(name: string, cancellable = false, ...args: any[]): boolean {
			const listeners = this.events.get(name),
				listenersAfter = this.eventsAfter.get(name)

			if (listeners !== undefined) {
				for (let index = 0; index < listeners.length; index++) {
					const [listener] = listeners[index]
					try {
						if (listener(...args) === false && cancellable) {
							return false
						}
					} catch (e: any) {
						console.error(
							e instanceof Error ? e : new Error(e),
							this.listener2line.get(listener)
						)
					}
				}
			}
			if (listenersAfter !== undefined) {
				for (let index = 0; index < listenersAfter.length; index++) {
					const [listener] = listenersAfter[index]
					try {
						listener(...args)
					} catch (e: any) {
						console.error(
							e instanceof Error ? e : new Error(e),
							this.listener2line.get(listener)
						)
					}
				}
			}
			return true
		}
		public once(name: string, listener: Listener, priority = 0): EventEmitter {
			const onceListener = (...args: any) => {
				this.removeListener(name, onceListener)
				listener(...args)
			}
			return this.on(name, onceListener, priority)
		}
	}

	const events = new EventEmitter()

	function OnUpdate() {
		$.Schedule(0, () => {
			events.emit("Update")
			OnUpdate()
		})
	}
	OnUpdate()

	events.on("Update", () => {
		$.Msg("Update event")
	})
})
