
const uuidv4 = () => {
	return parseInt(Math.random() * 1000000)
}

export const static_items = [
	{
		id: uuidv4(),
		content: "item 1",
		subItems: [
			{
				id: uuidv4(),
				content: "Submenu layer 1 elem 1",
				subItems: [
					{
						id: uuidv4(),
						content: "Submenu layer 2 elem 1",
						subItems: [
							{
								id: uuidv4(),
								content: "Submenu layer 3 elem 1",
								subItems: []
							},
							{
								id: uuidv4(),
								content: "Submenu layer 3 elem 2",
								subItems: []
							}
						]
					},
					{
						id: uuidv4(),
						content: "Submenu layer 2 elem 2",
						subItems: []
					}
				]
			}
		]
	},
	{
		id: uuidv4(),
		content: "Item 2",
		subItems:[]
	}
];
