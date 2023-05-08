/* ============= Notas ============= */

/*
  para ir  hacia arriba, debemos recordar como es el sistema de coordenadas en el canvas
  0,0 -> + x
  ↓
  + y
*/

/* ============= Interfaces ============= */

interface PositionsXY {
  x: number
  y: number
}

interface Position {
  position: PositionsXY
}

interface Player extends Position {
  velocity: PositionsXY
}

/* ============= constants ============= */

const canvas = window.document.getElementById('canvas') as HTMLCanvasElement

// canvas context
const c = canvas.getContext('2d') as CanvasRenderingContext2D

canvas.width = window.innerWidth
canvas.height = window.innerHeight

/*
  Descripciones de cada item:
    '-' -> equivale a una caja (box)
    ' ' -> equivale a un espacio vacio`
*/

const map = [
  ['-', '-', '-', '-', '-', '-'],
  ['-', ' ', ' ', ' ', ' ', '-'],
  ['-', ' ', '-', '-', ' ', '-'],
  ['-', ' ', ' ', ' ', ' ', '-'],
  ['-', '-', '-', '-', '-', '-']
]

const boundaries: Boundary[] = []

/* ============= Classes ============= */

class Boundary {
  public position
  public width
  public height
  static width: number = 40
  static height: number = 40
  constructor ({ position }: Position) {
    this.position = position
    this.width = 40
    this.height = 40
  }

  draw (): void {
    // le damos color porque sino los pinta de negro y con un fondo negro no vamos a ver nada
    c.fillStyle = 'blue'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}

class PLayer {
  public position
  public velocity
  public radius
  static radius: number = 10
  constructor ({ position, velocity }: Player) {
    this.position = position
    this.velocity = velocity
    this.radius = 15
  }

  draw (): void {
    // de esta forma indicamos que vamos a comenzar a dibujar algo (como en los svg)
    c.beginPath()
    /*
      en este caso vamos a dibujar un arc, el arc toma varios parametros
      this.position.x -> ancho
      this.position.y -> alto
      this.radius -> radio
      0 -> inicio del arco medido en radianes, no en grados
      Math.PI * 2 -> fin del arco (2 pi en radianes es un circulo completo)

    */
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    c.fillStyle = 'yellow'
    c.fill()
    c.closePath()
  }

  update (): void {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

/* ============= Functions and stuff ============= */

const player = new PLayer({
  position: {
    x: Boundary.width + Boundary.width / 2,
    y: Boundary.height + Boundary.height / 2
  },
  velocity: {
    x: 0,
    y: 0
  }
})

const keys = {
  w: {
    pressed: false
  },
  a: {
    pressed: false
  },
  s: {
    pressed: false
  },
  d: {
    pressed: false
  }
}

let lastKey = ''

map.forEach((row, rowIndex) => {
  row.forEach((symbol, columnIndex) => {
    switch (symbol) {
      case '-':
        boundaries.push(new Boundary({
          position: {
            x: Boundary.width * columnIndex,
            y: Boundary.height * rowIndex
          }
        }))
        break
    }
  })
})

function animate (): void {
  // method tells the browser that you wish to perform an animation and requests that the browser calls a specified function to update an animation right before the next repaint.
  window.requestAnimationFrame(animate)

  /*
    debemos limpiar el camvas en cada iteracion
    0 -> inicio en x
    0 -> inicio en y
    canvas.width -> fin en x
    canvas.height -> fin en y
  */
  c.clearRect(0, 0, canvas.width, canvas.height)

  boundaries.forEach((boundary) => {
    boundary.draw()
  })

  player.update()

  player.velocity.y = 0
  player.velocity.x = 0

  if (keys.w.pressed && lastKey === 'w') {
    player.velocity.y = -5 // up
  } else if (keys.s.pressed && lastKey === 's') {
    player.velocity.y = 5 // down
  } else if (keys.a.pressed && lastKey === 'a') {
    player.velocity.x = -5 // left
  } else if (keys.d.pressed && lastKey === 'd') {
    player.velocity.x = 5 // right
  }
}

animate()

/* ============= Add event listeners for the keys ============= */

window.addEventListener('keydown', (event) => {
  event.preventDefault()

  const { key } = event

  switch (key) {
    case 'w':
      keys.w.pressed = true
      lastKey = 'w'
      break
    case 's':
      keys.s.pressed = true
      lastKey = 's'
      break
    case 'a':
      keys.a.pressed = true
      lastKey = 'a'
      break
    case 'd':
      keys.d.pressed = true
      lastKey = 'd'
      break
  }
})

window.addEventListener('keyup', (event) => {
  event.preventDefault()

  const { key } = event

  switch (key) {
    case 'w':
      keys.w.pressed = false
      break
    case 's':
      keys.s.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
    case 'd':
      keys.d.pressed = false
      break
  }
})
