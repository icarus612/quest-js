declare module 'animejs' {
  export function animate(
    targets: HTMLElement | SVGElement,
    params: {
      x?: any;
      y?: any;
      duration?: number;
      delay?: number;
      ease?: string;
      loop?: boolean;
      fill?: string[];
      backgroundColor?: string[];
      [key: string]: any;
    }
  ): void;
}