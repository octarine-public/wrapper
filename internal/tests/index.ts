// import { Menu } from "../../wrapper/Imports"

// // // class Test {
// // // 	public Primary = -1
// // // 	public Secondary = -1
// // // 	constructor(index: number, index2: number) {
// // // 		this.Primary = index
// // // 		this.Secondary = index2
// // // 	}
// // // }

// // // /** one */
// // // const arr = [
// // // 	new Test(1, 2),
// // // 	new Test(0, 1),
// // // 	new Test(2, 1),
// // // 	new Test(2, 0),
// // // 	new Test(0, 2),
// // // 	new Test(0, 3)
// // // ]

// const arr = [...new Array(100_000).keys()]
// const arr2 = [...new Array(100_000).keys()]
// // // const arr2 = [...new Array(100_000)]
// const menu = Menu.AddEntry("Test")

// // menu.SortNodes = false

// const key = menu.AddKeybind("Test 1")
// const key2 = menu.AddKeybind("Test 2")

// const newItems: number[] = []
// key.OnRelease(() => {
// 	const start = hrtime()
// 	newItems.push(...arr)
// 	console.log("newItems", hrtime() - start)
// })

// let newItems2: number[] = []
// key2.OnRelease(() => {
// 	const start = hrtime()
// 	newItems2 = [...arr2]
// 	console.log("newItems2", hrtime() - start)
// })

// // key2.OnRelease(() => {
// // 	const start = hrtime()
// // 	arr2.filter(x => x > 1000)
// // 	console.log("filter", hrtime() - start)
// // })

// // // key3.OnRelease(() => {
// // // 	const start = hrtime()
// // // 	for (let index = arr.length - 1; index > -1; index--) {
// // // 		const element = arr[index]
// // // 		/** */
// // // 	}
// // // 	console.log("for--", hrtime() - start)
// // // })

// // // key4.OnRelease(() => {
// // // 	const start = hrtime()
// // // 	arr.forEach(element => {
// // // 		/** */
// // // 	})
// // // 	console.log("forEach", hrtime() - start)
// // // })
