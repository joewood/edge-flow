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

Live demo at (joewood.github.io/edge-flow)[http://joewood.github.io/edge-flow]

## Usage

```typescript
import { EdgeFlow, Node, Edge } from "edge-flow"

:: ::

    render() {
        return (
            <EdgeFlow backgroundColor="#0f0f0f" height={600} width={600} run={true}>
                <Node key="1" id="node-1" label="node-1' x={30} y={20} labelColor="white">
                    <Edge linkTo="node-2" ratePerSecond={30} color="blue" />
                </Node>
                <Node key="2" id="node-2" label="node-2' x={530} y={120} labelColor="white">
                    <Edge linkTo="node-3" ratePerSecond={30} variationMin={-0.01} variationMax={0.05} color="red" />
                </Node>
                <Node key="3" id="node-3" label="node-3' x={330} y={520} labelColor="white">
                    <Edge linkTo="node-1" ratePerSecond={30} variationMin={-0.06} variationMax={0.06} color="pink" />
                </Node>
            </EdgeFlow>
        );
    }
```                     

## Components and Properties

### EdgeFlow

Main component representing the Graph.

Prop            | Datatype | Description
----------------|----------|------------
backgroundColor | string   | Background Color of the canvas
height, width   | number   | Size of the Graph
run             | boolean  | Animate Graph 

### Node

Represents a node on the Graph

Prop            | Datatype | Description
----------------|----------|------------
id              | string   | Used to identify the node (for edges)
x,y             | number   | Location of Node (auto-scales)
label?          | string   | Label attached to the Node
labelColor?     | string   | Color of the label text

## Edge

Child component of a Node. Indicates which other Nodes this Node links to.

Prop            | Datatype | Description
----------------|----------|------------
linkTo          | string   | The `id` of the node to link to
ratePerSecond   | number   | How many particles animating per second through the edge
variationMin?   | number   | The minimum width of the Edge for random dispersal (default -0.01)
variationMax?   | number   | The maximum width of the Edge for random dispersal (default 0.01)
color?          | string   | Color of the particle 