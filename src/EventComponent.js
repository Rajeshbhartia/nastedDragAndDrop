import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const grid = 8;

const getItemStyle = (isDragging, draggableStyle, layer) => {
  let width = (500 - layer * 50) + "px"
  return ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    width: width,
    color: "#005c99",
    // change background colour if dragging
    background: isDragging ? "lightgreen" : "#FAF0E6",
    // display: "inline-flex",
    // justifyContent: "space-between",
    padding: "2px",
    margin: "0 10px 10px 0",
    border: "1px solid #ADD8E6",
    // styles we need to apply on draggables
    ...draggableStyle
  })
};

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "#B0C4DE",
  padding: grid,
  margin: "5px",
  // minHeight: "60px",
});

function MakeDropableJXS(props) {
  // console.log(props.droppableId)
  return (
    <Droppable droppableId={props.droppableId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          style={getListStyle(snapshot.isDraggingOver)}
        >
          {props.subItems.map((item, index) => (
            <Draggable key={item.id} draggableId={item.id} index={index}>
              {(provided, snapshot) => (
                <div
                  style={{
                    // display: "flex",
                    // justifyContent: "center"
                  }}
                >
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style,
                      props.layer
                    )}
                  >
                    <div
                      style={{ display: "flex", justifyContent: "space-between" }}
                    >
                      {/* <span style={{ color: "#0080ff" }}>
                        {item.eventTime}
                      </span> */}
                      <span >{item.content}</span>
                      <span
                        {...provided.dragHandleProps}
                        style={{
                          //display: "block",
                          // background: "#6B8E23",
                          // margin: "10px",
                          // padding: "2px 6px 2px 6px",
                          // border: "1px solid #000",
                          // color: "white",
                          // display: "flex",
                          // justifyContent: "center",
                          // width: "40px"
                        }}
                      >
                        Drag
                      </span>
                    </div>

                    {item.subItems && (
                      <MakeDropableJXS
                        subItems={item.subItems}
                        // type={item.id}
                        droppableId={item.id}
                        layer={props.layer + 1}
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

  )
}

export default class EventComponent extends React.Component {
  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
      <MakeDropableJXS {...this.props} layer={1} />
    );
  }
}
