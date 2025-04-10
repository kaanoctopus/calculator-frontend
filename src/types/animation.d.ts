export type AnimationState = {
    opacity: number;
    y?: number;
    x?: number;
};

export type Transition = {
    duration: number;
    ease?: string;
    delay?: number;
};
