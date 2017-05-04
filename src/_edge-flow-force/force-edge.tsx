import * as React from "react";

import { IEdge} from "./model";

export interface IEdgeForceProps extends IEdge {
}

export class Edge extends React.Component<IEdgeForceProps, any> {
    public render() { return <div>Do Not Render</div>; }
}
