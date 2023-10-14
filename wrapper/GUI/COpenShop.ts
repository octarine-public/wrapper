import { Color } from "../Base/Color"
import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { RendererSDK } from "../Native/RendererSDK"
import { ScaleHeight, ScaleWidth } from "./Helpers"

export class COpenShop {
	private static readonly MainPanelMiniWidth = 360
	private static readonly MainPanelLargeWidth = 400

	private static readonly HeaderAndItemsHeight = 650
	private static readonly HeaderHeight = 84
	private static readonly ItemsHeight =
		COpenShop.HeaderAndItemsHeight - COpenShop.HeaderHeight
	// TODO: this only works correctly on FulLHD
	private static readonly PinnedItemsHeight = 74
	private static readonly ItemCombinesHeight = 90

	public readonly Header = new Rectangle()
	public readonly Items = new Rectangle()
	public readonly PinnedItems = new Rectangle()
	public readonly ItemCombines = new Rectangle()
	public readonly GuideFlyout = new Rectangle()

	constructor(large: boolean, screenSize: Vector2, hudFlipped: boolean) {
		this.CalculateMainPanel(large, screenSize, hudFlipped)
	}

	public DebugDraw(): void {
		RendererSDK.FilledRect(this.Header.pos1, this.Header.Size, Color.White.SetA(128))
		RendererSDK.FilledRect(this.Items.pos1, this.Items.Size, Color.Green.SetA(128))
		RendererSDK.FilledRect(
			this.PinnedItems.pos1,
			this.PinnedItems.Size,
			Color.Yellow.SetA(128)
		)
		RendererSDK.FilledRect(
			this.ItemCombines.pos1,
			this.ItemCombines.Size,
			Color.Blue.SetA(128)
		)
		RendererSDK.FilledRect(
			this.GuideFlyout.pos1,
			this.GuideFlyout.Size,
			Color.BlackGray.SetA(128)
		)
	}
	public HasChanged(): boolean {
		return false
	}

	private CalculateMainPanel(
		large: boolean,
		screenSize: Vector2,
		hudFlip: boolean
	): void {
		const headerHeight = ScaleHeight(COpenShop.HeaderHeight, screenSize),
			itemsHeight = ScaleHeight(COpenShop.ItemsHeight, screenSize),
			pinnedItemsHeight = ScaleHeight(COpenShop.PinnedItemsHeight, screenSize),
			itemCombinesHeight = ScaleHeight(COpenShop.ItemCombinesHeight, screenSize),
			shopBottomMargin = ScaleHeight(206, screenSize)

		const mainPanel = new Rectangle()
		mainPanel.Width = ScaleWidth(
			large ? COpenShop.MainPanelLargeWidth : COpenShop.MainPanelMiniWidth,
			screenSize
		)
		mainPanel.Height =
			headerHeight + itemsHeight + pinnedItemsHeight + itemCombinesHeight

		mainPanel.x = hudFlip ? 0 : screenSize.x - mainPanel.Width
		mainPanel.y = screenSize.y - shopBottomMargin - mainPanel.Height

		if (large) {
			this.GuideFlyout.Width = ScaleWidth(210, screenSize)
			this.GuideFlyout.Height = ScaleHeight(814, screenSize)
			this.GuideFlyout.x = hudFlip
				? mainPanel.pos2.x
				: mainPanel.x - this.GuideFlyout.Width
			this.GuideFlyout.y = mainPanel.y
		}

		this.Header.Width = mainPanel.Width
		this.Header.Height = headerHeight
		this.Header.x = mainPanel.x
		this.Header.y = mainPanel.y

		this.Items.Width = mainPanel.Width
		this.Items.Height = itemsHeight
		this.Items.x = mainPanel.x
		this.Items.y = this.Header.y + this.Header.Height

		this.PinnedItems.Width = mainPanel.Width
		this.PinnedItems.Height = pinnedItemsHeight
		this.PinnedItems.x = mainPanel.x
		this.PinnedItems.y = this.Items.y + this.Items.Height

		this.ItemCombines.Width = mainPanel.Width
		this.ItemCombines.Height = itemCombinesHeight
		this.ItemCombines.x = mainPanel.x
		this.ItemCombines.y = this.PinnedItems.y + this.PinnedItems.Height
	}
}
