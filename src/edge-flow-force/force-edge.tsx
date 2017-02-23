import * as React from "react";

import { IEdge} from "./model";

export interface IEdgeProps extends IEdge {
}

export class Edge extends React.Component<IEdgeProps, any> {
    public render() { return <div>Do Not Render</div>; }
}
