export interface CardInterface {
    ctx: CanvasRenderingContext2D;
    config: CardConfigTypeInterface;
    color: string;
    x: number;
    y: number;
    initialX: number;
    initialY: number;
    state: CardStateInterface;
    offsetX: number;
    offsetY: number;
    width: number;
    height: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
    update(): void;
    draw(): void;
    setPos(x: number, y: number): Record<string, number>;
    shake(): void;
    highlight(): void;
    setState(state: keyof CardStateInterface, value: number | boolean): void;
    setSizeRatio(ratio: number): number;
    isHovering(mouseX: number, mouseY: number): boolean;
    getRGB(): string;
}

export interface HandInterface {
    ctx: CanvasRenderingContext2D;
    cards: CardInterface[];
    bottomMargin: number;
    initHand(): void;
    addCard(card: CardInterface): CardInterface;
    update(): void;
    drawHand(): void;
}

export interface MousePosition {
    x: number;
    y: number;
}

export interface GameStateInterface {
    grabbedCard: CardInterface;
    hoverCard: CardInterface;
    clicking: boolean;
    mouseDownPosition: MousePosition;
    mouseUpPosition: MousePosition;
    mouseLastPosition: MousePosition;
}

export interface GameConfigInterface {
    nCards: number;
}
export interface GameEventInterface {
    type: string;
}

export interface UnoInterface {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    state: GameStateInterface;
    events: GameEventInterface[];
    gameConfig: GameConfigInterface;
    running: boolean;
    cards: CardInterface[];
    hand: HandInterface;
    start(): void;
    setContextCursor(cursor: string): string;
    grabCard(card: CardInterface): CardInterface;
}

export interface CardStateInterface {
    [state: string]: string | number | boolean;
    sizeRatio: number;
    shaking: boolean;
    highlighting: boolean;
    hovering: boolean;
    grabbing: boolean;
    rotation: number;
    animationRotationDirection: number;
    inHand: boolean;
}

export type CardActionType = 'NUMBER' | 'SKIP' | 'REVERSE' | 'DRAW_TWO' | 'WILD' | 'WILD_DRAW_FOUR';
export type CardColorType = 'RED' | 'YELLOW' | 'GREEN' | 'BLUE' | 'ANY';
export type CardNumberType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type FontFamilyType = 'Verdana' | 'Arial' | 'Arial Black' | 'Comic Sans MS';
export enum CardColorEnum {
    RED,
    YELLOW,
    GREEN,
    BLUE,
    ANY,
}
export enum CardTypeEnum {
    NUMBER,
    SKIP,
    REVERSE,
    DRAW_TWO,
    WILD,
    WILD_DRAW_FOUR,
}

export interface CardConfigTypeInterface {
    type: CardActionType;
    value?: CardNumberType;
    color: CardColorType;
}
