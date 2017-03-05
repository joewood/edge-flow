import * as React from "react"

export function mapChild<T, X>(children, f: (child: T) => X) {
    const childNodes = React.Children.map(children, (c: any) => c) || [];
    const nonNull = childNodes.filter(c => !!c).map(c => c.props as T);
    return nonNull.map(f) as X[];
}


export function getChildrenProps<T>(children: React.ReactNode): T[] {
    return React.Children.map<T>(children, child => (child as any).props as T) || [];
}
