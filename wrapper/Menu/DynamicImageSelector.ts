import { Color } from "../Base/Color"
import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { GUIInfo } from "../GUI/GUIInfo"
import { EventsSDK } from "../Managers/EventsSDK"
import { InputEventSDK, InputManager, VKeys } from "../Managers/InputManager"
import { RendererSDK } from "../Native/RendererSDK"
import { AbilityData } from "../Objects/DataBook/AbilityData"
import { Base, IMenu } from "./Base"

type IDefaultValues = Map<
	string,
	[
		boolean /** default state */,
		boolean /** default static show */,
		boolean /** show */,
		number /** priority */
	]
>

// every icon: 32x32, 1x1 border
export class DynamicImageSelector extends Base {
	public static ServicePriorityToggle = false

	public static OnWindowSizeChanged(): void {
		DynamicImageSelector.imageBorderWidth = GUIInfo.ScaleWidth(2)
		DynamicImageSelector.imageGap = GUIInfo.ScaleWidth(2)
		DynamicImageSelector.baseImageHeight = GUIInfo.ScaleHeight(32)
		DynamicImageSelector.randomHeightValue = GUIInfo.ScaleHeight(40)
	}

	private static imageBorderWidth = 0
	private static imageGap = 0
	private static baseImageHeight = 0
	private static randomHeightValue = 0
	private static readonly elementsPerRow = 5
	private static readonly imageActivatedBorderColor = new Color(104, 4, 255)

	public enabledValues: IDefaultValues

	protected readonly itemDrop = new Map<string, number>()
	protected readonly imageSize = new Vector2()
	protected renderedPaths = new Map<string, string>()
	protected QueueImages = new Map<string, [boolean, boolean]>()

	private autoPriority = 0

	constructor(
		parent: IMenu,
		name: string,
		public values: string[],
		defaultValues: IDefaultValues = new Map(),
		public createdDefaultState = false,
		tooltip = ""
	) {
		super(parent, name, tooltip)
		this.enabledValues = defaultValues
	}

	// TODO: check current state
	public get IsZeroSelected(): boolean {
		let state = false
		this.enabledValues.forEach((_, value) => {
			if (value) {
				return
			}
			state = true
		})
		return state
	}

	public get IconsRect() {
		const basePos = this.Position.Add(this.textOffset).AddScalarY(this.nameSize.y + 3)
		return new Rectangle(
			basePos,
			basePos
				.Add(
					this.imageSize
						.AddScalar(
							DynamicImageSelector.imageBorderWidth * 2 +
								DynamicImageSelector.imageGap
						)
						.MultiplyScalarX(
							Math.min(
								this.values.length,
								DynamicImageSelector.elementsPerRow
							)
						)
						.MultiplyScalarY(
							Math.ceil(
								this.values.length / DynamicImageSelector.elementsPerRow
							)
						)
				)
				.SubtractScalar(
					(DynamicImageSelector.elementsPerRow - 1) *
						DynamicImageSelector.imageGap
				)
		)
	}

	public get ConfigValue() {
		return Array.from(this.enabledValues.entries())
	}

	public set ConfigValue(value) {
		if (
			this.ShouldIgnoreNewConfigValue ||
			value === undefined ||
			!Array.isArray(value)
		) {
			return
		}

		this.enabledValues = new Map(value)

		this.enabledValues.forEach(() => {
			this.autoPriority++
		})

		this.QueueImages.forEach(([defaultState, defaultShow], name) => {
			const hasInConfig = this.enabledValues.get(name)
			if (hasInConfig !== undefined) {
				this.QueueImages.delete(name)
				return
			}
			this.enabledValues.set(name, [
				defaultState,
				defaultShow,
				defaultShow,
				this.autoPriority++
			])
			this.QueueImages.delete(name)
		})

		this.values = [
			...Array.from([...this.enabledValues.keys()])
				.filter(name => this.IsVisibleImage(name))
				.orderBy(x => this.GetPriority(x))
		]
	}

	public get ClassPriority(): number {
		return 6
	}

	public Update(): boolean {
		if (!super.Update()) {
			return false
		}

		this.values = [
			...Array.from([...this.enabledValues.keys()])
				.filter(name => this.IsVisibleImage(name))
				.orderBy(x => this.GetPriority(x))
		]

		this.renderedPaths.clear()
		this.imageSize.x = this.imageSize.y = DynamicImageSelector.baseImageHeight

		for (let index = this.values.length - 1; index > -1; index--) {
			const name = this.values[index]
			if (!this.IsVisibleImage(name)) {
				continue
			}
			let path = name
			if (path.startsWith("rune_")) {
				path = `panorama/images/spellicons/${path}_png.vtex_c`
			} else if (path.startsWith("item_bottle_")) {
				path = `panorama/images/items/${path.substring(5)}_png.vtex_c`
			} else if (!path.startsWith("npc_dota_hero_")) {
				const abil = AbilityData.GetAbilityByName(path)
				if (abil !== undefined) {
					path = abil.TexturePath
				}
			} else {
				path = `panorama/images/heroes/${path}_png.vtex_c`
			}
			const pathIamgeSize = RendererSDK.GetImageSize(path)
			this.imageSize.x = Math.max(
				this.imageSize.x,
				DynamicImageSelector.baseImageHeight * (pathIamgeSize.x / pathIamgeSize.y)
			)
			this.renderedPaths.set(name, path)
		}

		this.Size.x =
			Math.max(
				this.nameSize.x,
				Math.min(this.renderedPaths.size, DynamicImageSelector.elementsPerRow) *
					(this.imageSize.x +
						DynamicImageSelector.imageBorderWidth * 2 +
						DynamicImageSelector.imageGap)
			) +
			this.textOffset.x * 2

		this.Size.y =
			Math.ceil(this.renderedPaths.size / DynamicImageSelector.elementsPerRow) *
				(this.imageSize.y +
					DynamicImageSelector.imageBorderWidth * 2 +
					DynamicImageSelector.imageGap) +
			DynamicImageSelector.randomHeightValue

		return true
	}

	public GetPriority(value: string): number {
		const state = this.enabledValues.get(value)
		if (state === undefined) {
			return Number.MAX_SAFE_INTEGER
		}
		return state[3]
	}

	public IsVisibleImage(value: string): boolean {
		const state = this.enabledValues.get(value)
		if (state === undefined) {
			return false
		}
		return state[1] || state[2]
	}

	public IsEnabled(value: string): boolean {
		const state = this.enabledValues.get(value)
		if (state === undefined) {
			return false
		}
		return state[0]
	}

	public IsEnabledID(id: number): boolean {
		return this.IsEnabled(this.values[id])
	}

	public OnAddNewImage(name: string, defaultState = true, defaultShow = false) {
		if (this.QueuedUpdate && !this.values.includes(name)) {
			this.QueueImages.set(name, [defaultState, defaultShow])
			return
		}

		if (!this.values.includes(name)) {
			this.values.push(name)
		}

		const enabledValues = this.enabledValues.get(name)
		if (enabledValues === undefined || !Array.isArray(enabledValues)) {
			this.enabledValues.set(name, [
				defaultState,
				defaultShow,
				true,
				this.autoPriority++
			])
			this.Update()
			return
		}

		enabledValues[2] = true
		this.Update()
	}

	public OnHideImages(names?: string[]) {
		if (names === undefined) {
			for (let index = this.values.length - 1; index > -1; index--) {
				const name = this.values[index]
				const enabledValues = this.enabledValues.get(name)
				if (enabledValues === undefined || enabledValues[1]) {
					continue
				}
				enabledValues[2] = false
				this.Update()
			}
			return
		}

		for (let index = names.length - 1; index > -1; index--) {
			const name = names[index]
			const enabledValues = this.enabledValues.get(name)
			if (enabledValues !== undefined && !enabledValues[1]) {
				enabledValues[2] = false
				this.Update()
			}
		}
	}

	public Render(): void {
		super.Render()
		this.RenderTextDefault(this.Name, this.Position.Add(this.textOffset))

		const basePos = this.IconsRect.pos1
		for (let index = this.values.length - 1; index > -1; index--) {
			const value = this.values[index]
			if (!this.IsVisibleImage(value)) {
				continue
			}

			const imagePath = this.renderedPaths.get(value)
			if (imagePath === undefined || this.itemDrop.has(value)) {
				continue
			}

			const size = this.imageSize,
				pos = new Vector2(
					index % DynamicImageSelector.elementsPerRow,
					Math.floor(index / DynamicImageSelector.elementsPerRow)
				)
					.Multiply(
						this.imageSize.AddScalar(
							DynamicImageSelector.imageBorderWidth * 2 +
								DynamicImageSelector.imageGap
						)
					)
					.Add(basePos)

			RendererSDK.Image(
				imagePath,
				pos,
				-1,
				size,
				Color.White,
				0,
				undefined,
				!this.IsEnabled(value)
			)

			if (this.IsEnabled(value)) {
				RendererSDK.FilledRect(
					pos.Add(new Vector2(0, size.y / 1.5)),
					size.Subtract(new Vector2(0, size.y / 1.5)),
					Color.Black.SetA(180)
				)
			}

			if (
				InputManager.IsKeyDown(VKeys.CONTROL) ||
				DynamicImageSelector.ServicePriorityToggle
			) {
				RendererSDK.FilledRect(pos, size, Color.Black.SetA(150))

				RendererSDK.Image(
					"panorama/images/control_icons/share_profile_psd.vtex_c",
					pos.Add(size.DivideScalar(4)),
					-1,
					size.DivideScalar(2),
					Color.White
				)
			}

			if (DynamicImageSelector.ServicePriorityToggle) {
				this.DrawTextRealPriority(this.enabledValues.get(value), pos, size)
			}

			this.DrawTextPriority(index + 1, pos, size)

			if (this.IsEnabled(value)) {
				RendererSDK.OutlinedRect(
					pos,
					size,
					DynamicImageSelector.imageBorderWidth,
					DynamicImageSelector.imageActivatedBorderColor
				)
			}
		}

		// over all images
		this.itemDrop.forEach((_, name) => {
			const imagePath = this.renderedPaths.get(name)
			if (imagePath === undefined) {
				return
			}
			const size = this.imageSize
			const pos = this.MousePosition.Subtract(this.imageSize.DivideScalar(2))
			RendererSDK.Image(
				imagePath,
				pos,
				-1,
				this.imageSize,
				Color.White,
				0,
				undefined,
				!this.IsEnabled(name)
			)
			if (this.IsEnabled(name)) {
				RendererSDK.OutlinedRect(
					pos,
					size,
					DynamicImageSelector.imageBorderWidth,
					DynamicImageSelector.imageActivatedBorderColor
				)
			}
		})
	}

	public OnMouseLeftDown(): boolean {
		const rect = this.IconsRect,
			off = rect.GetOffset(this.MousePosition)

		if (InputManager.IsKeyDown(VKeys.CONTROL)) {
			this.ImageValueChanged(off, value => {
				const enabledValues = this.enabledValues.get(value)
				if (enabledValues === undefined || !this.IsVisibleImage(value)) {
					return
				}
				this.itemDrop.set(value, enabledValues[3])
			})
		}

		return !rect.Contains(this.MousePosition)
	}

	public OnMouseLeftUp(): boolean {
		const rect = this.IconsRect,
			off = rect.GetOffset(this.MousePosition)

		this.itemDrop.forEach((dragPriority, dragName) => {
			this.ImageValueChanged(off, (currName, _, currPriority) => {
				const dragNameValue = this.enabledValues.get(dragName)
				const currNameValue = this.enabledValues.get(currName)

				if (
					dragNameValue === undefined ||
					currNameValue === undefined ||
					dragPriority === currPriority
				) {
					return
				}

				// todo need improved
				if (dragPriority > currPriority) {
					dragNameValue[3] = currPriority
					currNameValue[3] = currNameValue[3] + 1
					this.InsertIncrease(currName, dragName, currPriority)
				} else if (dragPriority < currPriority) {
					dragNameValue[3] = currPriority
					currNameValue[3] = currNameValue[3] - 1
					this.InsertDecrease(currName, dragName, currPriority)
				}

				this.Update()
			})

			this.itemDrop.delete(dragName)
		})

		if (!rect.Contains(this.MousePosition) || InputManager.IsKeyDown(VKeys.CONTROL)) {
			return false
		}

		this.ImageValueChanged(off, value => {
			const enabledValues = this.enabledValues.get(value)
			if (enabledValues === undefined || !this.IsVisibleImage(value)) {
				return
			}
			enabledValues[0] = !this.IsEnabled(value)
			this.TriggerOnValueChangedCBs()
		})

		return false
	}

	private ImageValueChanged(
		off: Vector2,
		callback: (value: string, state: boolean, priority: number) => void
	) {
		for (let index = this.values.length - 1; index > -1; index--) {
			const value = this.values[index]
			const enabledValues = this.enabledValues.get(value)
			if (enabledValues === undefined || !this.IsVisibleImage(value)) {
				return
			}
			const basePos = new Vector2(
				index % DynamicImageSelector.elementsPerRow,
				Math.floor(index / DynamicImageSelector.elementsPerRow)
			).Multiply(
				this.imageSize.AddScalar(
					DynamicImageSelector.imageBorderWidth * 2 +
						DynamicImageSelector.imageGap
				)
			)
			if (!new Rectangle(basePos, basePos.Add(this.imageSize)).Contains(off)) {
				continue
			}
			callback(value, enabledValues[0], enabledValues[3])
			break
		}
	}

	private InsertDecrease(currName: string, dragName: string, currPriority: number) {
		const entriesEnables = [...this.enabledValues.entries()]
		const decrease = entriesEnables.filter(([name, [, , , priority]]) =>
			this.FilterDecrease(name, currName, dragName, currPriority, priority)
		)
		for (let index = decrease.length - 1; index > -1; index--) {
			const [insertName] = decrease[index]
			const insert = this.enabledValues.get(insertName)
			if (insert === undefined) {
				continue
			}
			insert[3] = insert[3] - 1
		}
	}

	private InsertIncrease(currName: string, dragName: string, currPriority: number) {
		const entriesEnables = [...this.enabledValues.entries()]

		const increase = entriesEnables.filter(([name, [, , , priority]]) =>
			this.FilterIncrease(
				name,
				currName,
				dragName,
				currPriority,
				priority,
				entriesEnables.length
			)
		)

		for (let index = increase.length - 1; index > -1; index--) {
			const [insertName] = increase[index]
			const insert = this.enabledValues.get(insertName)
			if (insert === undefined) {
				continue
			}
			insert[3] = insert[3] + 1
		}
	}

	private FilterDecrease(
		name: string,
		currName: string,
		dragName: string,
		currPriority: number,
		priority: number
	) {
		return (
			name !== currName &&
			name !== dragName &&
			currPriority > priority &&
			priority > 0
		)
	}

	private FilterIncrease(
		name: string,
		currName: string,
		dragName: string,
		currPriority: number,
		priority: number,
		maxPriority: number
	) {
		return (
			name !== currName &&
			name !== dragName &&
			currPriority <= priority &&
			priority < maxPriority - 1
		)
	}

	private DrawTextPriority(id: number, position: Vector2, size: Vector2) {
		const text = `${id}`
		const textSize = size.y / 2.75
		const textName = RendererSDK.DefaultFontName

		const textSizePosition = Vector2.FromVector3(
			RendererSDK.GetTextSize(text, textName, textSize)
		)
			.MultiplyScalarForThis(-1)
			.AddScalarX(size.x)
			.AddScalarY(size.y)

		const textPosition = textSizePosition
			.DivideScalarForThis(2)
			.AddScalarX(position.x + textSizePosition.x)
			.AddScalarY(position.y + textSizePosition.y)
			.RoundForThis()

		RendererSDK.Text(text, textPosition, Color.White, textName, textSize)
	}

	/** service */
	private DrawTextRealPriority(
		enabled: Nullable<
			[
				boolean,
				/** default state */ boolean,
				/** default show */ boolean,
				/** show */ number /** priority */
			]
		>,
		position: Vector2,
		size: Vector2
	) {
		if (enabled === undefined) {
			return
		}

		const text = `${enabled[3]}`
		const textSize = size.y / 1.3
		const textName = RendererSDK.DefaultFontName

		const textSizePosition = Vector2.FromVector3(
			RendererSDK.GetTextSize(text, textName, textSize)
		)
			.MultiplyScalarForThis(-1)
			.AddScalarX(size.x)
			.AddScalarY(size.y)

		const textPosition = textSizePosition
			.DivideScalarForThis(2)
			.AddScalarX(position.x)
			.AddScalarY(position.y)
			.RoundForThis()

		RendererSDK.Text(text, textPosition, Color.White, textName, textSize)
	}
}

EventsSDK.on("WindowSizeChanged", () => DynamicImageSelector.OnWindowSizeChanged())

InputEventSDK.on("KeyDown", key => {
	if (
		(key !== VKeys.MENU && key !== VKeys.KEY_K) ||
		!(InputManager.IsKeyDown(VKeys.MENU) && InputManager.IsKeyDown(VKeys.KEY_K))
	) {
		return true
	}
	DynamicImageSelector.ServicePriorityToggle =
		!DynamicImageSelector.ServicePriorityToggle
	return !(InputManager.IsKeyDown(VKeys.MENU) && InputManager.IsKeyDown(VKeys.KEY_K))
})
