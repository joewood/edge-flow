
export function wrapText(text: string, maxWidth: number): string[] {
    let index = 0, nextIndex = 0;
    let ret = [] as string[];
    if (!text) { return []; }
    do {
        if (text.length >= (index + maxWidth)) {
            nextIndex = text.lastIndexOf(" ", (index + maxWidth));
        }
        if (((index + maxWidth) > text.length) || (nextIndex < 0) || (nextIndex <= index)) {
            return ret.concat([text.substr(index).trim()]);
        }
        ret.push(text.substring(index, nextIndex).trim());
        index = nextIndex;
    } while (true);
}
