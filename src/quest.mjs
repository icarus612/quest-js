import { animate } from 'animejs';
import { stagger, utils, createTimeline } from 'animejs';

const $ = (selector, singleton = false) => singleton ? document?.querySelector(selector) : [...document?.querySelectorAll(selector)];
const parseEl = (selector, singleton = false) => typeof selector === 'string' ? $(selector, singleton) : selector;
const makeArray = (val) => Array.isArray(val) ? val : [val];

const getPositionFromSelector = (target, element) => {
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

const createSplitAnimation = (path) => {
  switch (path) {
    case 'linear':
      return createLinearAnimation;
    case 'cubic':
    default:
      return createCubicAnimation;
  }
}

const getDefaultEase = (path) => {
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
}) => {
  // Small helper function with but loses encapsulation with split variable.
  const checkSplit = (dim) => dim === split ? 'inOutCubic' : 'linear';

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
}) => {
  const thisDistance = Math.abs(movement[1] - movement[0]);
  const newDuration = Math.round(duration * thisDistance / totalDistance);
  const remainingDuration = duration - newDuration;

  if (isSplit) {
    return {
      to: movement,
      ease: 'linear',
      duration: newDuration,
      delay: staggerDelay + remainingDuration / 2,
    };
  } else {
    const midpoint = movement[1] / 2;
    return [{
      to: [movement[0], midpoint],
      ease: 'linear',
      duration: newDuration / 2,
      delay: staggerDelay,
    },
    {
      to: [midpoint, movement[1]],
      ease: 'linear',
      duration: newDuration / 2,
      delay: remainingDuration,
    }];
  }
}

const createLinearAnimation = ({
  xMovement,
  yMovement,
  duration,
  staggerDelay,
  split,
}) => {
  const totalDistance = Math.abs(xMovement[1] - xMovement[0]) + Math.abs(yMovement[1] - yMovement[0]);
  const checkSplit = (isSplit, movement) => buildFromLinearSplit({ isSplit, movement, duration, staggerDelay, totalDistance })
  let x = checkSplit('x' === split, xMovement);
  let y = checkSplit('y' === split, yMovement);
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
}) => {
  const staggerDelay = ((duration * pace) / partyTotal) * index;
  const settings = {
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
}) => {

  const finalParty = [
    ...makeArray(members)?.flatMap((member) => parseEl(member, singleton)),
    ...makeArray(parties)?.flatMap((party) => parseEl(party, singleton).flatMap((el) => [...el.children]))
  ]

  const startEl = parseEl(start, true);
  const endEl = parseEl(end, true);

  finalParty.forEach((element, index) => {
    const startPos = getPositionFromSelector(startEl, element);
    const endPos = getPositionFromSelector(endEl, element);
    const xMovement = [startPos[0], endPos[0]];
    const yMovement = [startPos[1], endPos[1]];
    const partyTotal = finalParty.length;

    animateElement({
      element,
      index,
      partyTotal,
      container,
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
