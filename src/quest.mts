import { stagger, createTimeline } from 'animejs';

type Position = [number, number];
type EasingType = 'linear' | 'inOutCubic' | string;
type AnimationPattern = 'cubic' | 'linear' | 'split';

interface AnimationSegment {
  value: [number, number];
  duration: number;
  ease: EasingType;
  delay?: number;
}

interface AnimationOptions {
  target: Element | Element[];
  start: string | Position;
  end: string | Position;
  duration: number;
  pattern?: AnimationPattern;
  colors?: string[];
}

/**
 * Creates animation for SVG elements between positions
 */
export const quest = (options: AnimationOptions): void => {
  const { 
    target, 
    start, 
    end, 
    duration, 
    pattern = 'cubic', 
    colors = ['#000', '#555']
  } = options;

  const targets = Array.isArray(target) ? target : [target];
  
  targets.forEach(container => {
    Array.from(container.children).forEach((element, index) => {
      // Calculate movement vectors
      const startPos = typeof start === 'string' 
        ? getPositionFromSelector(start, element) 
        : start;
        
      const endPos = typeof end === 'string' 
        ? getPositionFromSelector(end, element) 
        : end;

      const xMovement: Position = [startPos[0], endPos[0]];
      const yMovement: Position = [startPos[1], endPos[1]];
      
      // Create and start animation
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
  });
};

// Core animation functions
interface ElementAnimationProps {
  element: Element;
  index: number;
  container: Element;
  xMovement: Position;
  yMovement: Position;
  duration: number;
  pattern: AnimationPattern;
  colors: string[];
}

function animateElement(props: ElementAnimationProps): void {
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

function calculateStaggeredDelay(index: number, totalElements: number, duration: number): number {
  return (duration * 2.5) / totalElements * index;
}

function getPositionFromSelector(selector: string, element: Element): Position {
  const target = document.querySelector(selector);
  if (!target) return [0, 0];
  
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

// Animation pattern generators
function createMovementAnimation(
  movement: Position, 
  duration: number, 
  pattern: AnimationPattern
): AnimationSegment[] {
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

function createColorAnimation(colors: string[], duration: number) {
  return colors.map((color, index) => ({
    value: color,
    duration: duration / colors.length,
    ease: 'linear',
    delay: index === 0 ? stagger(duration / 4) : duration / colors.length
  }));
}