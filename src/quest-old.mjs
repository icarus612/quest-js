import anime from 'animejs';

const where = (e) => {
  return (e[1] + e[0]) / 2;
}

const translateY = (mv, t, crv) => {
  switch (crv) {

    case "cubic":
      return (
        [
          {
            value: [mv[0], mv[1]],
            duration: t * 3.5,
            easing: "easeInOutCubic",
          },
        ]
      )
      break;
    case "cubicY":
      return (
        [
          {
            value: [mv[0], mv[1]],
            duration: t * 3.5,
            easing: "easeInOutCubic",
          },
        ]
      )
      break;
    case "cubicX":
      return (
        [
          {
            value: [mv[0], mv[1]],
            duration: t * 3.5,
            easing: "linear",
          },
        ]
      )
      break;
    case "linear":
      return (
        [
          {
            value: [mv[0], mv[1]],
            duration: t * 1.5,
            easing: "linear",
            delay: t,
          },
        ]
      )
      break;
    case "linearX":
      return (
        [
          {
            value: [mv[0], where(mv)],
            duration: t,
            easing: "linear",
          },
          {
            value: [where(mv), mv[1]],
            duration: t,
            delay: t * 1.5,
            easing: "linear",
          },
        ]
      )
      break;
    case "linearY":
      return (
        [
          {
            value: [mv[0], mv[1]],
            duration: t * 1.5,
            easing: "linear",
            delay: t,
          },
        ]
      )
      break;

    default:
      return (
        [
          {
            value: [mv[0], where(mv)],
            duration: t,
            easing: "linear",
          },
          {
            value: [where(mv), mv[1]],
            duration: t,
            delay: t * 1.5,
            easing: "linear",
          },
        ]
      )
      break;
  }
}

const translateX = (mv, t, crv) => {
  switch (crv) {
    case "cubic":
      return (
        [
          {
            value: [mv[0], mv[1]],
            duration: t * 3.5,
            easing: "easeInOutCubic",
          },
        ]
      )
      break;
    case "cubicX":
      return (
        [
          {
            value: [mv[0], mv[1]],
            duration: t * 3.5,
            easing: "easeInOutCubic",
          },
        ]
      )
      break;
    case "cubicY":
      return (
        [
          {
            value: [mv[0], mv[1]],
            duration: t * 3.5,
            easing: "linear",
          },
        ]
      )
      break;
    case "linear":
      return (
        [
          {
            value: [mv[0], mv[1]],
            duration: t * 1.5,
            easing: "linear",
            delay: anime.stagger(t / 2, { start: t }),
          },
        ]
      )
      break;
    case "linearX":
      return (
        [
          {
            value: [mv[0], mv[1]],
            duration: t * 1.5,
            easing: "linear",
            delay: anime.stagger(t / 2, { start: t }),
          },
        ]
      )
      break;
    case "linearY":
      return (
        [
          {
            value: [mv[0], where(mv)],
            duration: t,
            easing: "linear",
          },
          {
            value: [where(mv), mv[1]],
            duration: t,
            delay: t * 1.5,
            easing: "linear",
          },
        ]
      )
      break;
    default:
      return (
        [
          {
            value: [mv[0], mv[1]],
            duration: t * 1.5,
            easing: "linear",
            delay: t,
          },
        ]
      )
      break;
  }
}

let fillColor = (e, t, svg) => {
  let el = svg.children
  for (let i = 0; i < svg.children.length; i++) {
    el[i].style.fill = e[0];
    el[i].style.backgroundColor = e[0];
  }

  let obj = [
    {
      value: e[0],
      duration: (t * 1.5) / e.length,
      easing: "linear",
      delay: anime.stagger(t / 2)
    },
  ]

  for (let i = 1; i < e.length; i++) {
    obj.push({
      value: e[i],
      duration: (t * 1.5) / e.length,
      easing: "linear",
      delay: t / e.length
    });
  }
  return obj;


}
const whereTarget = (po, el) => {
  let start = document.querySelector(po).getBoundingClientRect()
  let element = el.getBoundingClientRect()
  let x = ((start.left + start.right) / 2 - (element.left + element.right) / 2);
  let y = ((start.top + start.bottom) / 2 - (element.top + element.bottom) / 2);
  return [x, y]
}
let animation = (e, t, svg, mvX, mvY, crv, clr, d) => {

  let animate = anime.timeline({

  }).add({
    targets: svg.children[e],
    translateX: translateX(mvX, t, crv),
    translateY: translateY(mvY, t, crv),
    fill: fillColor(clr, t, svg),
    backgroundColor: fillColor(clr, t, svg),
    complete: function (anim) {
      try {
        animate.reset()
        animation(e, t, svg, mvX, mvY, crv, clr, 0)
      } catch (err) {
        console.error(err)
      }
    },
  }, d);

  return animate

}

export const quest = (params) => {
	const {
		startEl,
		endEl,
	} = params

  let delay = (el, time, n) => {
    return 3.5 * time / el.children.length * n
  }
  //mobile functions for distance
  let loopThrough = (e) => {
    for (let i = 0; i < e.children.length; i++) {
      let distX = [];
      let distY = [];
      if (typeof params.start === "string") {
        let start = whereTarget(params.start, e.children[i]);
        distX[0] = start[0];
        distY[0] = start[1];
      } else {
        distX[0] = params.start[0];
        distY[0] = params.start[1];
      }
      if (typeof params.end === "string") {
        let end = whereTarget(params.end, e.children[i]);
        distX[1] = end[0];
        distY[1] = end[1];
      } else {
        distX[1] = params.end[0];
        distY[1] = params.end[1];
      }
      animation(i, params.time, e, distX, distY, params.curve, params.color, delay(e, params.time, i))
    }
  }
  if (typeof params.target.length == 'undefined') {
    loopThrough(params.target)
  } else {
    for (let j = 0; j < params.target.length; j++) {
      loopThrough(params.target[j])
    }
  }
}
