import { animate, stagger, utils, createTimeline } from 'animejs';

// Animation pattern generators
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

const checkPattern = (pattern) => {
  switch (pattern) {
    case 'linear':
      return createLinearAnimation;
      case 'cubic':
      default:
        return createCubicAnimation;
  }
}

const createCubicAnimation = (
  timeline,
  settings,
) =>{
  const {
    element,
    xMovement,
    yMovement,
    duration,
    index,
    split,  
    partyTotal,
  } = settings;
  const staggerDelay = calculateStaggeredDelay(index, partyTotal, duration);
  const checkSplit = (dim) => dim === split ? 'inOutCubic' : 'linear';
  timeline.add(element, {
    x: {
      to: xMovement,
      ease: checkSplit('x'),
    },
    y: {
      to: yMovement,
      ease: checkSplit('y'),
    },
    fill: colors,
    backgroundColor: colors,
  }, staggerDelay);
}


const createLinearAnimation = (
  timeline,
  settings,
) =>{
  const {
    element,
    xMovement,
    yMovement,
    duration,
    index,
    partyTotal,
  } = settings;
  const staggerDelay = calculateStaggeredDelay(index, partyTotal, duration);
  timeline.add(element, {
    x: {
      to: xMovement,
      ease: 'linear',
    },
    y: {
      to: yMovement,
      ease: 'linear',
    },
    fill: colors,
    backgroundColor: colors,
  }, staggerDelay);
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
    split,
    pattern,
    index, 
    duration,
    partyTotal,
    xMovement,
    yMovement,
    element,
    colors,
  } = props;

  const timeline = createTimeline({ defaults: { loop: true } });
  
  const settings = {
    ...props,
    stagger: calculateStaggeredDelay(index, partyTotal, duration)
  }

  if (split) {
    const animationPattern = checkPattern(pattern);
    animationPattern(timeline, settings);
  } else {
    timeline.add(element, {
      translateX: xMovement,
      translateY: yMovement,
      fill: colors,
      backgroundColor: colors,
    }, );
  }
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

  const finalParty = [
    ...makeArray(members)?.flatMap((member) => parseEl(member, singleton)),
    ...makeArray(parties)?.flatMap((party) => parseEl(party, singleton).flatMap((el)=> [...el.children]))
  ]
  
  const startEl = parseEl(start, true);
  const endEl = parseEl(end, true);

  finalParty.forEach((element, index) => {
    const startPos = getPositionFromSelector(startEl, element);
    const endPos = getPositionFromSelector(endEl, element);
    const xMovement = [startPos[0], endPos[0]];
    const yMovement = [startPos[1], endPos[1]];
    
    animateElement({
      element,
      index,
      partyTotal: finalParty.length,
      container,
      xMovement,
      yMovement,
      duration,
      pattern,
      split,
      colors
    });
  });
}

export default quest;
