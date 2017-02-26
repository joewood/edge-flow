import * as React from "react";

import { IEdge} from "./model";

export interface IEdgeDagProps extends IEdge {
}

export class Edge extends React.Component<IEdgeDagProps, any> {
    public render() { return <div>Do Not Render</div>; }
}
