/// <reference types="react" />
import * as React from "react";
export declare function mapChild<T, X>(children: any, f: (child: T) => X): X[];
export declare function getChildrenProps<T>(children: React.ReactNode): T[];
