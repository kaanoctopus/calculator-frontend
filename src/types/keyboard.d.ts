export type HandleKeyPress = {
    (key: string): void;
}

export type KeyboardEventHandler = {
    (e: KeyboardEvent): void;
}

export type KeypadProps = {
    onKeyPress: (key: string) => void;
}