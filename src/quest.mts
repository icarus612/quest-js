/// <reference path="./animejs.d.ts" />
import { animate } from 'animejs';

type Element = HTMLElement;
type ElementOrString = Element | string;
type SingleOrArray<T> = T | T[];
type SplitType = 'x' | 'y' | null;
type PathType = 'linear' | 'cubic';
type EaseType = 'linear' | 'inOutCubic';
type MovementArray = [number, number];
type ColorArray = string[];

interface PositionResult {
  x: any;
  y: any;
}

interface SplitAnimationParams {
  xMovement: MovementArray;
  yMovement: MovementArray;
  split: SplitType;
  duration?: number;
  staggerDelay?: number;
}

interface LinearSplitParams {
  isSplit: boolean;
  movement: MovementArray;
  duration: number;
  staggerDelay: number;
  totalDistance: number;
}

interface AnimateElementParams {
  element: Element;
  split: SplitType;
  path: PathType;
  index: number;
  pace: number;
  duration: number;
  partyTotal: number;
  xMovement: MovementArray;
  yMovement: MovementArray;
  colors: ColorArray;
}

interface QuestParams {
  start: ElementOrString;
  end: ElementOrString;
  members?: SingleOrArray<ElementOrString>;
  parties?: SingleOrArray<ElementOrString>;
  duration?: number;
  pace?: number;
  path?: PathType;
  split?: SplitType;
  singleton?: boolean;
  colors?: ColorArray;
}

const $ = (selector: string, singleton: boolean = false): Element | Element[] => 
  singleton ? document?.querySelector(selector) as Element : [...document?.querySelectorAll(selector)] as Element[];

const parseEl = (selector: ElementOrString, singleton: boolean = false): Element | Element[] => 
  typeof selector === 'string' ? $(selector, singleton) : selector;

const makeArray = <T,>(val: SingleOrArray<T>): T[] => 
  Array.isArray(val) ? val : [val];

const getPositionFromSelector = (target: Element, element: Element): [number, number] => {
  if (!target) throw new Error('Target element not found');

  const targetRect = target.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  const targetCenterX = (targetRect.left + targetRect.right) / 2;
  const targetCenterY = (targetRect.top + targetRect.bottom) / 2;
  const elementCenterX = (elementRect.left + elementRect.right) / 2;
  const elementCenterY = (elementRect.top + elementRect.bottom) / 2;

  return [
    targetCenterX - elementCenterX,
    targetCenterY - elementCenterY
  ];
}

// Define the type for functions that create split animations
type SplitAnimationCreator = (params: SplitAnimationParams) => PositionResult;

const createSplitAnimation = (path: PathType): SplitAnimationCreator => {
  switch (path) {
    case 'linear':
      return createLinearAnimation;
    case 'cubic':
    default:
      return createCubicAnimation;
  }
}

const getDefaultEase = (path: PathType): EaseType => {
  switch (path) {
    case 'cubic':
      return 'inOutCubic';
    case 'linear':
    default:
      return 'linear';
  }
}

const createCubicAnimation = ({
  xMovement,
  yMovement,
  split,
}: SplitAnimationParams): PositionResult => {
  // Small helper function with but loses encapsulation with split variable.
  const checkSplit = (dim: string): EaseType => dim === split ? 'inOutCubic' : 'linear';

  return {
    x: {
      to: xMovement,
      ease: checkSplit('x'),
    },
    y: {
      to: yMovement,
      ease: checkSplit('y'),
    },
  };
}

const buildFromLinearSplit = ({
  isSplit,
  movement,
  duration,
  staggerDelay,
  totalDistance
}: LinearSplitParams) => {
  const thisDistance = Math.abs(movement[1] - movement[0]);
  const newDuration = Math.round(duration * thisDistance / totalDistance);
  const remainingDuration = duration - newDuration;

  if (isSplit) {
    return {
      to: movement,
      ease: 'linear' as EaseType,
      duration: newDuration,
      delay: staggerDelay + remainingDuration / 2,
    };
  } else {
    const midpoint = movement[1] / 2;
    return [{
      to: [movement[0], midpoint] as MovementArray,
      ease: 'linear' as EaseType,
      duration: newDuration / 2,
      delay: staggerDelay,
    },
    {
      to: [midpoint, movement[1]] as MovementArray,
      ease: 'linear' as EaseType,
      duration: newDuration / 2,
      delay: remainingDuration,
    }];
  }
}

const createLinearAnimation = ({
  xMovement,
  yMovement,
  duration = 0,
  staggerDelay = 0,
  split,
}: SplitAnimationParams): PositionResult => {
  const totalDistance = Math.abs(xMovement[1] - xMovement[0]) + Math.abs(yMovement[1] - yMovement[0]);
  const checkSplit = (isSplit: boolean, movement: MovementArray) => 
    buildFromLinearSplit({ isSplit, movement, duration, staggerDelay, totalDistance });
  
  const x = checkSplit('x' === split, xMovement);
  const y = checkSplit('y' === split, yMovement);
  
  console.log({x, y});
  return { x, y };
}

const animateElement = ({
  element,
  split,
  path,
  index,
  pace,
  duration,
  partyTotal,
  xMovement,
  yMovement,
  colors,
}: AnimateElementParams): void => {
  const staggerDelay = ((duration * pace) / partyTotal) * index;
  const settings: SplitAnimationParams = {
    split,
    xMovement,
    yMovement,
    duration,
    staggerDelay,
  }
  let x = xMovement;
  let y = yMovement;

  if (split) {
    const splitAnimation = createSplitAnimation(path)(settings);
    x = splitAnimation.x;
    y = splitAnimation.y;
  }

  animate(element, {
    x,
    y,
    duration,
    fill: colors,
    ease: getDefaultEase(path),
    backgroundColor: colors,
    delay: staggerDelay,
    loop: true,
  });
}

const quest = ({
  start,
  end,
  members = [],
  parties = [],
  duration = 2000,
  pace = 1,
  path = 'cubic',
  split = 'x',
  singleton = false,
  colors = []
}: QuestParams): void => {

  const finalParty: Element[] = [
    ...makeArray(members)?.flatMap((member) => parseEl(member, singleton) as Element[]),
    ...makeArray(parties)?.flatMap((party) => 
      (parseEl(party, singleton) as Element[]).flatMap((el) => [...Array.from(el.children)] as Element[]))
  ];

  const startEl = parseEl(start, true) as Element;
  const endEl = parseEl(end, true) as Element;

  finalParty.forEach((element, index) => {
    const startPos = getPositionFromSelector(startEl, element);
    const endPos = getPositionFromSelector(endEl, element);
    const xMovement: MovementArray = [startPos[0], endPos[0]];
    const yMovement: MovementArray = [startPos[1], endPos[1]];
    const partyTotal = finalParty.length;

    animateElement({
      element,
      index,
      partyTotal,
      xMovement,
      yMovement,
      duration,
      path,
      split,
      colors,
      pace,
    });
  });
}

export default quest;