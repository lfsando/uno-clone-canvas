interface GameConfig {
  nCards: number
};
interface GameEvent {

};

interface MousePosition {
  x: number
  y: number
}

interface GameState {
  grabbedCard: Card
  hoverCard: Card
  clicking: boolean
  mouseDownPosition: MousePosition
  mouseUpPosition: MousePosition
  mouseLastPosition: MousePosition
};

interface CardState {
  [state: string]: any
  sizeRatio: number
  shaking: boolean
  movingTop: boolean
  hovering: boolean
  grabbing: boolean
  rotation: number
  animationRotationDirection: number
  inHand: boolean
};



type CardType = 'NUMBER' | 'SKIP' | 'REVERSE' | 'DRAW_TWO' | 'WILD' | 'WILD_DRAW_FOUR';
type CardColor = 'RED' | 'YELLOW' | 'GREEN' | 'BLUE' | 'ANY';
enum CardColorEnum {
  RED,
  YELLOW,
  GREEN,
  BLUE,
  ANY
}
enum CardTypeEnum {
  NUMBER,
  SKIP,
  REVERSE,
  DRAW_TWO,
  WILD,
  WILD_DRAW_FOUR

}

type CardValueType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
interface CardConfigType {
  type: CardType
  value?: CardValueType
  color: CardColor
};

type FontFamilyType = 'Verdana' | 'Arial' | 'Arial Black' | 'Comic Sans MS';