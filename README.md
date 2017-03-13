# Edge Flow
A GPU based particle system React Component for showing data flow 

## Description

A React visual Graph component that animates particles between nodes and animates changes to the position of the nodes. This is one of the
building block visualization components for building animated diagrams. The Graph component is fixed position. A separate component layer 
on top adds automatic layout using a force based algorithm.

## Installation

Assuming you're using **webpack** or **browserify**:

```
npm install edge-flow
```

Package comes with types built in (it's written using TypeScript).

Live demo at [joewood.github.io/edge-flow](http://joewood.github.io/#edge-flow)

## Simple Directed Graph Usage

```jsx
import { EdgeFlowDag, NodeDag, EdgeDag } from "edge-flow"

:: ::

render() {
    return (
        <EdgeFlowDag style={{backgroundColor:"#0f0f0f",height:600,width:600}} run={true}>
            <NodeDag key="1" id="node-1" label="node-1' labelColor="white" >
                <EdgeDag linkTo="node-2" ratePerSecond={30} color="blue" size={2} />
            </NodeDag>
            <NodeDag key="2" id="node-2" label="node-2' labelColor="white">
                <EdgeDag linkTo="node-3" ratePerSecond={30} color="red" shape={0.2}/>
            </NodeDag>
            <NodeDag key="3" id="node-3" label="node-3' labelColor="white">
                <EdgeDag linkTo="node-1" ratePerSecond={30}  color="pink" shape={0.8} size={10} />
            </NodeDag>
        </EdgeFlowDag>
    );
}

```                     




## Usage

```jsx
import { EdgeFlow, Node, Edge } from "edge-flow"

:: ::

render() {
    return (
        <EdgeFlow style={{backgroundColor:"#0f0f0f",height:600,width:600}} run={true}>
            <Node key="1" id="node-1" label="node-1' center={{x:30,y:20}} labelColor="white" >
                <Edge linkTo="node-2" ratePerSecond={30} color="blue" size={2} />
            </Node>
            <Node key="2" id="node-2" label="node-2' center={{x:530,y:120}} labelColor="white">
                <Edge linkTo="node-3" ratePerSecond={30} variationMin={-0.01} variationMax={0.05} color="red" shape={0.2}/>
            </Node>
            <Node key="3" id="node-3" label="node-3' center={{x:330,y:520}} labelColor="white">
                <Edge linkTo="node-1" ratePerSecond={30} variationMin={-0.06} variationMax={0.06} color="pink" shape={0.8} size={10} />
            </Node>
        </EdgeFlow>
    );
}
```                     

# Components and Properties



## Animated Directed Acrylic Graph - EdgeFlowDag

For a live demo see [here](http://joewood.github.io/#network).

Prop            | Datatype | Description
----------------|----------|------------
backgroundColor | string   | Background Color of the canvas
height, width   | number   | Size of the Graph
run             | boolean  | Animate Graph 

### NodeDag

Prop            | Datatype | Description
----------------|----------|------------
id              | string   | Used to identify the node (for edges)
label?          | string   | Label attached to the Node
labelColor?     | string   | Color of the label text
symbol?         | string   | String used for a font-icon (e.g. FontAwesome)
symbolColor?    | string   | Color for symbol font-icon
symbolSize?     | number   | Size of font-icon
symbolFont?     | string   | Symbol Font name (e.g. "fontawesome")

### EdgeDag

Prop            | Datatype | Description
----------------|----------|------------
linkTo          | string   | The `id` of the node to link to
ratePerSecond   | number   | How many particles animating per second through the edge
variationMin?   | number   | The minimum width of the Edge for random dispersal (default -0.01)
variationMax?   | number   | The maximum width of the Edge for random dispersal (default 0.01)
color?          | string   | Color of the particle (or color at starting position)
endingColor?    | string   | Color of the particle at the target position (optional, defaults to starting color) 
shape?          | number   | Roundness of particle range 0..1 - 1 being circle, 0 being square
size?           | number   | Size of the particles (range 1..20)
pathColor?      | string   | Color of the edge's path (defaults to lighter shade of canvas background)
pathWidth?      | number   | Width of the line for the edge's path (default 12)
pathOpacity?    | number   | Opacity of the path for the edge (default is 0.2)
nonrandom       | boolean  | Disable random distribution of particles (evenly spaced)

## EdgeFlow

Main underlying component providing absolute positioning

Prop                  | Datatype | Description
----------------------|----------|------------
style:                | Style... |
style.backgroundColor | string   | Background Color of the canvas
style.height          | number   | Size of the Graph, pixels
style.width           | number   | Size of the Graph
run                   | boolean  | Animate Graph 

### Node

Represents a node on the Graph

Prop            | Datatype | Description
----------------|----------|------------
id              | string   | Used to identify the node (for edges)
center          | {x,y}    | Location of Node (auto-scales)
label?          | string   | Label attached to the Node
labelColor?     | string   | Color of the label text
symbol?         | string   | String used for a font-icon (e.g. FontAwesome)
symbolColor?    | string   | Color for symbol font-icon
symbolSize?     | number   | Size of font-icon
symbolFont?     | string   | Symbol Font name (e.g. "fontawesome")

## Edge

Child component of a Node. Indicates which other Nodes this Node links to.

Prop            | Datatype | Description
----------------|----------|------------
linkTo          | string   | The `id` of the node to link to
ratePerSecond   | number   | How many particles animating per second through the edge
variationMin?   | number   | The minimum width of the Edge for random dispersal (default -0.01)
variationMax?   | number   | The maximum width of the Edge for random dispersal (default 0.01)
color?          | string   | Color of the particle (or color at starting position)
endingColor?    | string   | Color of the particle at the target position (optional, defaults to starting color) 
shape?          | number   | Roundness of particle range 0..1 - 1 being circle, 0 being square
size?           | number   | Size of the particles (range 1..20)
pathColor?      | string   | Color of the edge's path (defaults to lighter shade of canvas background)
pathWidth?      | number   | Width of the line for the edge's path (default 12)
pathOpacity?    | number   | Opacity of the path for the edge (default is 0.2)
source?         | {x,y}    | Starting point of edge (defaults to the connected node)
target?         | {x,y}    | Ending point of edge (defaults to the connected node)
p2?, p3?        | {x,y}    | Cubic bezier control points
