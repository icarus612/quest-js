# Quest.js

A lightweight JavaScript animation library for creating smooth element transitions along paths between two points. Built on top of Anime.js, Quest.js specializes in orchestrating group animations with customizable movement patterns and staggered timing.

## Features

- **Path-based animations**: Move elements from one point to another with linear or cubic easing
- **Split animations**: Control X and Y movement independently for more complex trajectories  
- **Staggered timing**: Animate multiple elements with configurable delays
- **Flexible targeting**: Animate individual elements or entire groups
- **Color transitions**: Smoothly transition colors during movement
- **Looping animations**: Built-in support for repeating animations

## Quick Start

### Basic Installation

To use the library in your own project:

```bash
npm install @dev-dae/quest-js
```

### Downloading the Repo

Clone the project run the included examples:

1. Clone the repository
```bash
git clone https://github.com/icarus612/quest-js.git
cd quest-js
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

This will start a local server on port 3000 and serve the example.html file, which demonstrates various animation patterns and usages of Quest.js.

You can examine the example.html file in the examples directory to see practical implementations of the library.

## API Reference

### quest(options)

The main function to create animations.

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `start` | string/Element | **required** | Selector or element defining the starting position |
| `end` | string/Element | **required** | Selector or element defining the ending position |
| `members` | string/Element/Array | `[]` | Individual elements to animate (animates before parties) |
| `parties` | string/Element/Array | `[]` | Parent elements whose children will be animated (animates after members) |
| `duration` | number | `2000` | Animation duration in milliseconds |
| `pace` | number | `1` | Stagger timing multiplier (*note: when pace < 1 there will be an uneven gap between the last element end and first element restart) |
| `path` | string | `'cubic'` | Animation easing type: `'linear'` or `'cubic'` |
| `split` | string/boolean | `'x'` | Split animation control: `'x'`, `'y'`, or `false` |
| `singleton` | boolean | `false` | Whether selectors should return single elements |
| `colors` | Array | `[]` | Array of colors to transition through |

### Animation Paths

#### Linear Path (`path: 'linear'`)
Elements move in straight lines with constant velocity. When combined with split animations, creates L-shaped movements.

#### Cubic Path (`path: 'cubic'`)
Elements move with cubic easing (slow start, fast middle, slow end). The split axis uses cubic easing while the other uses linear.

### Split Animation

Split animations allow you to control X and Y movement independently:

- `split: 'x'` - X-axis uses the specified easing, Y-axis is linear
- `split: 'y'` - Y-axis uses the specified easing, X-axis is linear  
- `split: false` - Both axes move together with the specified easing

```javascript
// Create an L-shaped movement (horizontal then vertical)
quest({
    members: '.dots',
    start: '.start',
    end: '.end',
    path: 'linear',
    split: 'y'  // Y movement is delayed, creating L-shape
});
```

### Members vs Parties

- **Members**: Individual elements that will be animated directly
- **Parties**: Container elements whose children will be animated

```javascript
quest({
    members: '.individual-dot',  // Animates these specific elements
    parties: '.dot-container',   // Animates all children of these containers
    start: '.start',
    end: '.end'
});
```

## Examples

### Basic Linear Animation

```javascript
quest({
    members: '.dot',
    start: '.start-point',
    end: '.end-point',
    duration: 1500,
    path: 'linear'
});
```

### Staggered Cubic Animation with Colors

```javascript
quest({
    members: '.particle',
    start: '.origin',
    end: '.destination',
    duration: 2000,
    path: 'cubic',
    pace: 0.5,  // Faster stagger
    colors: ['#ff0000', '#00ff00', '#0000ff']
});
```

### L-Shaped Movement

```javascript
quest({
    parties: '.dot-group',
    start: '.corner-start',
    end: '.corner-end',
    path: 'linear',
    split: 'y',  // Move horizontally first, then vertically
    duration: 1000
});
```

### Complex Multi-Group Animation

```javascript
// Animate multiple groups with different timing
quest({
    members: '.group-a .dot',
    start: '.start-a',
    end: '.end-a',
    duration: 1000,
    split: 'x'
});

quest({
    members: '.group-b .dot',
    start: '.start-b', 
    end: '.end-b',
    duration: 1500,
    path: 'cubic',
    split: false
});
```

## Browser Support

Quest.js requires ES6 module support and works with:
- Chrome 61+
- Firefox 60+
- Safari 10.1+
- Edge 16+

## Dependencies

- [Anime.js](https://animejs.com/) v4.0.2+

## License

MIT

## Contributing

Issues and pull requests are welcome on [GitHub](https://github.com/icarus612/quest-js).

---

*Quest.js - Bringing elements together, one animation at a time.*