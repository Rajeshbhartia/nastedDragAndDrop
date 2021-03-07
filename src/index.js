import React, { Component } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import EventComponent from "./EventComponent";
import { static_items } from "./data";
console.log("Course Organizer");
// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);
	return result;
};

const reorderChildElement = (list, id, sourceIndex, destIndex) => {
	// console.log(list, id)
	// let arr = [];
	for (let index = 0; index < list.length; index++) {
		const element = list[index];
		if (element.id === id) {
			// console.log("matched");
			element.subItems = reorder(element.subItems, sourceIndex, destIndex)
			break;
			// return element.subItems;
		} else if (element.subItems) {
			// console.log("did not matched")
			reorderChildElement(element.subItems, id, sourceIndex, destIndex)
		}
	}
	// console.log(arr);
	return list;
}

const getDragObj = (list, dragId) => {
	console.log(list, dragId)
	let obj = {}
	for (let index = 0; index < list.length; index++) {
		const element = list[index];
		console.log(element.id, dragId)
		if (element.id === dragId) {
			console.log("matched")
			obj = element;
			break;
			// return element.subItems;
		} else if (element.subItems && element.subItems.length > 0) {
			obj = getDragObj(element.subItems, dragId)
			if (obj.id)
				break;
		}
	}
	// console.log(arr);
	return obj;
}

const popDragItemFromList = (list, id, sourceIndex) => {
	console.log("sourceIndex", sourceIndex)
	// console.log(list, id)
	// let arr = [];
	for (let index = 0; index < list.length; index++) {
		const element = list[index];
		if (element.id === id) {
			// console.log("matched");
			element.subItems.splice(sourceIndex, 1);
			break;
			// return element.subItems;
		} else if (element.subItems) {
			// console.log("did not matched")
			popDragItemFromList(element.subItems, id, sourceIndex)
		}
	}
	// console.log(arr);
	return list;
}

const pushDragItemToList = (list, id, destIndex, dragObj) => {
	// console.log(list, id)
	console.log("push")
	// let arr = [];
	for (let index = 0; index < list.length; index++) {
		const element = list[index];
		if (element.id === id) {
			element.subItems.splice(destIndex, 0, dragObj);
			break;
			// return element.subItems;
		} else if (element.subItems) {
			console.log("did not matched")
			pushDragItemToList(element.subItems, id, destIndex, dragObj)
		}
	}
	// console.log(arr);
	return list;
}

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
	// some basic styles to make the items look a bit nicer
	userSelect: "none",
	padding: grid * 2,
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-between",
	margin: `0 0 ${grid}px 0`,

	// change background colour if dragging
	background: isDragging ? "lightgreen" : "#778899",

	// styles we need to apply on draggables
	...draggableStyle
});



const getListStyle = isDraggingOver => ({
	background: isDraggingOver ? "lightblue" : "#efefef",
	padding: grid,
	width: 600,
	color: "white",
	fontSize: "16px",
	minHeight: "90vh"
});

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			items: static_items
		};
		this.onDragEnd = this.onDragEnd.bind(this);
	}

	onDragEnd(result) {
		// dropped outside the list
		console.log(result);
		if (!result.destination) {
			return;
		}
		const sourceIndex = result.source.index;
		const destIndex = result.destination.index;

		let items = [...this.state.items]
		if (result.source.droppableId === result.destination.droppableId) {
			if (result.destination.droppableId === "root")
				items = reorder(this.state.items, sourceIndex, destIndex);
			else {
				items = reorderChildElement(items, result.destination.droppableId, sourceIndex, destIndex);
				console.log(items);
			}
		} else {
			let dragObj = getDragObj(items, result.draggableId);
			if (result.source.droppableId === "root") {
				items = items.filter((item) => {
					return item.id !== result.draggableId
				})
				items = pushDragItemToList(items, result.destination.droppableId, destIndex, dragObj)
			}
			else if (result.destination.droppableId === "root") {
				items = popDragItemFromList(items, result.source.droppableId, sourceIndex)
				items.splice(destIndex, 0, dragObj);
			}
			else {
				items = popDragItemFromList(items, result.source.droppableId, sourceIndex)
				items = pushDragItemToList(items, result.destination.droppableId, destIndex, dragObj)
			}
		}
		this.setState({
			items
		});

		// if (result.type === "droppableItem") {
		//   const items = reorder(this.state.items, sourceIndex, destIndex);

		//   this.setState({
		//     items
		//   });
		// } else if (result.type === "droppableSubItem") {
		//   const itemSubItemMap = this.state.items.reduce((acc, item) => {
		//     acc[item.id] = item.subItems;
		//     return acc;
		//   }, {});

		//   const sourceParentId = parseInt(result.source.droppableId);
		//   const destParentId = parseInt(result.destination.droppableId);

		//   const sourceSubItems = itemSubItemMap[sourceParentId];
		//   const destSubItems = itemSubItemMap[destParentId];

		//   let newItems = [...this.state.items];

		//   /** In this case subItems are reOrdered inside same Parent */
		//   if (sourceParentId === destParentId) {
		//     const reorderedSubItems = reorder(
		//       sourceSubItems,
		//       sourceIndex,
		//       destIndex
		//     );
		//     newItems = newItems.map(item => {
		//       if (item.id === sourceParentId) {
		//         item.subItems = reorderedSubItems;
		//       }
		//       return item;
		//     });
		//     this.setState({
		//       items: newItems
		//     });
		//   } else {
		//     let newSourceSubItems = [...sourceSubItems];
		//     const [draggedItem] = newSourceSubItems.splice(sourceIndex, 1);

		//     let newDestSubItems = [...destSubItems];
		//     newDestSubItems.splice(destIndex, 0, draggedItem);
		//     newItems = newItems.map(item => {
		//       if (item.id === sourceParentId) {
		//         item.subItems = newSourceSubItems;
		//       } else if (item.id === destParentId) {
		//         item.subItems = newDestSubItems;
		//       }
		//       return item;
		//     });
		//     this.setState({
		//       items: newItems
		//     });
		//   }
		// }
	}

	// Normally you would want to split things out into separate components.
	// But in this example everything is just done in one place for simplicity
	render() {
		return (
			<DragDropContext onDragEnd={this.onDragEnd}>
				<Droppable droppableId="root">
					{(provided, snapshot) => (
						<div
							ref={provided.innerRef}
							style={getListStyle(snapshot.isDraggingOver)}
						>
							{this.state.items.map((item, index) => (
								<Draggable key={item.id} draggableId={item.id} index={index}>
									{(provided, snapshot) => (
										<div>
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												style={getItemStyle(
													snapshot.isDragging,
													provided.draggableProps.style
												)}
											>
												<div
													style={{
														display: "flex",
														justifyContent: "space-between"
													}}
												>
													<span style={{ color: "yellow" }}>
														{/* {item.folderDate} */}
														{item.content}
													</span>{" "}
													<span
														{...provided.dragHandleProps}
													>
														Drag
                          							</span>
												</div>
												{item.subItems && (
													<EventComponent
														subItems={item.subItems}
														droppableId={item.id}
													/>
												)}
											</div>
											{provided.placeholder}
										</div>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
		);
	}
}

// Put the thing into the DOM!
ReactDOM.render(
	<section>
		<App />
	</section>,
	document.getElementById("root")
);
