// import { Menu } from "../../wrapper/Imports"

// class Test {
// 	public Primary = -1
// 	public Secondary = -1
// 	constructor(index: number, index2: number) {
// 		this.Primary = index
// 		this.Secondary = index2
// 	}
// }

// class Test2 {
// 	public Primary = -1
// 	public Secondary = -1
// 	constructor(index: number, index2: number) {
// 		this.Primary = index
// 		this.Secondary = index2
// 	}
// }

// const arr = [...new Array(100_000).keys()]
// const arr2 = [...new Array(100_000).keys()]

// const arr: Test[] = [...new Array(10_000)].fill(new Test(0, 0))
// const arr2: Test[] = [...new Array(10_000)].fill(new Test2(2, 3))
// const arr3: Test[] = [...new Array(30)].fill(new Test(0, 0))
// const arr4: Test[] = [...new Array(30)].fill(new Test2(2, 3))

// const menu = Menu.AddEntry("Test")
// menu.SortNodes = false

// const key = menu.AddKeybind("Test except")
// const key2 = menu.AddKeybind("Test filter")
// // const key3 = menu.AddKeybind("Test pop")

// key.OnRelease(() => {
// 	const start = hrtime()
// 	const newArr = arr.except(arr2)
// 	console.log(key.InternalName, hrtime() - start, newArr)
// })

// key2.OnRelease(() => {
// 	const start = hrtime()
// 	const arrSet = new Set(arr4)
// 	const newArr = arr3.filter(x => !arrSet.has(x))
// 	console.log(key2.InternalName, hrtime() - start, newArr)
// })

// key3.OnRelease(() => {
// 	const start = hrtime()
// 	while (arr3.length > 0) {
// 		arr3.pop()
// 	}
// 	console.log(key3.InternalName, hrtime() - start)
// })

// EventsSDK.on("PostDataUpdate", () => {
// 	/** @todo */
// })
