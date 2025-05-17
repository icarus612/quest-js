import { animate, stagger, utils, createTimeline } from 'animejs';

// Animation pattern generators
const $ = (selector, singleton = false) => singleton ? [document?.querySelector(selector)] : [...document?.querySelectorAll(selector)];
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

const createMovementAnimation = (
  movement,
  duration,
  pattern
) =>{
  switch (pattern) {
    case 'cubic':
      return [{
        value: movement,
        duration: duration * 2.5,
        ease: 'inOutCubic'
      }];

    case 'linear':
      return [{
        value: movement,
        duration: duration * 1.5,
        ease: 'linear',
        delay: duration / 2
      }];

    case 'split':
      const midpoint = (movement[0] + movement[1]) / 2;
      return [
        {
          value: [movement[0], midpoint],
          duration: duration,
          ease: 'linear'
        },
        {
          value: [midpoint, movement[1]],
          duration: duration,
          ease: 'linear',
          delay: duration
        }
      ];

    default:
      return [{
        value: movement,
        duration: duration * 2,
        ease: 'inOutCubic'
      }];
  }
}

const createColorAnimation = (colors, duration) => {
  return colors.map((color, index) => ({
    value: color,
    duration: duration / colors.length,
    ease: 'linear',
    delay: index === 0 ? stagger(duration / 4) : duration / colors.length
  }));
}

const animateElement = (props) => {
  const {
    element,
    index,
    container,
    xMovement,
    yMovement,
    duration,
    pattern,
    colors
  } = props;

  const timeline = createTimeline({ defaults: { loop: true } });

  timeline.add({
    targets: element,
    translateX: createMovementAnimation(xMovement, duration, pattern),
    translateY: createMovementAnimation(yMovement, duration, pattern),
    fill: createColorAnimation(colors, duration),
    backgroundColor: createColorAnimation(colors, duration),
    complete: () => timeline.restart()
  }, calculateStaggeredDelay(index, container.children.length, duration));
}

function calculateStaggeredDelay(index, totalElements, duration) {
  return (duration * 2.5) / totalElements * index;
}

const quest = (options) => {
  const {
    members = [],
    parties = [],
    start,
    end,
    duration,
    pattern = 'cubic',
    split = 'x',
    singleton = false,
    colors = ['#000', '#555']
  } = options;

  const targets = [
    ...makeArray(members)?.flatMap((member) => parseEl(member, singleton)),
    ...makeArray(parties)?.flatMap((party) => parseEl(party, singleton).flatMap((el)=> [...el.children]))
  ]
  const startEl = parseEl(start, singleton=true);
  const endEl = parseEl(end, singleton=true);
  const startPos = getPositionFromSelector(startEl);
  const endPos = getPositionFromSelector(endEl);
  const xMovement = [startPos[0], endPos[0]];
  const yMovement = [startPos[1], endPos[1]];

  targets.forEach((element, index) => {
    animateElement({
      element,
      index,
      container,
      xMovement,
      yMovement,
      duration,
      pattern,
      colors
    });
  });
}

export default quest;
