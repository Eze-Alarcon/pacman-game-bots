/* ============= Notas ============= */

/*
  para ir  hacia arriba, debemos recordar como es el sistema de coordenadas en el canvas
  0,0 -> + x
  ↓
  + y
*/

/*
  Nota A-1
  player.borders.top + player.velocity.y
    Esto lo hacemos para que, antes de chocar, se frene el jugador
    EL jugador quedara a una corta distancia de la pared pero no la tocara
    Si esto no estuviera, el jugador chocaria con la pared y no permitiria continuar el juego
    ya que, al agregar esto, si el jugador, supongamos que choca con la pared superior,
    intenta moverse hacia abajo podra, ya que la velocidad ira disminuyendo permitiendo que
    el jugador se eleje, si esto no estuviera, el jugador choca contra la pared y ahi se quedara por siempre

  Lo mismo aplica para el eje x
*/

// Nota B-2
// le damos color porque sino los pinta de negro y con un fondo negro no vamos a ver nada

/*
  Nota C-2
  Descripciones de cada item:
    '-' -> equivale a una caja (box)
    ' ' -> equivale a un espacio vacio`
*/

// Nota D-4
// de esta forma indicamos que vamos a comenzar a dibujar algo (como en los svg)

/*
  Nota E-4
  en este caso vamos a dibujar un arc, el arc toma varios parametros
  this.position.x -> ancho
  this.position.y -> alto
  this.radius -> radio
  0 -> inicio del arco medido en radianes, no en grados
  Math.PI * 2 -> fin del arco (2 pi en radianes es un circulo completo)
*/

// Nota F-6
// method tells the browser that you wish to perform an animation and requests that the browser calls a specified function to update an animation right before the next repaint.

/*
  Nota G-7
  debemos limpiar el camvas en cada iteracion
  0 -> inicio en x
  0 -> inicio en y
  canvas.width -> fin en x
  canvas.height -> fin en y
*/

/* ============= Interfaces ============= */

interface InterfacePositionsXY {
  x: number
  y: number
}

interface InterfacePosition {
  position: InterfacePositionsXY
}

interface InterfaceBorders {
  top: number
  bottom: number
  left: number
  right: number
}

interface InterfacePlayer extends InterfacePosition {
  velocity: InterfacePositionsXY
  radius?: number
}

interface InterfaceCircle extends InterfacePlayer {
  velocity: InterfacePositionsXY
  radius: number
  // borders: InterfaceBorders
}

interface InterfaceRectangle {
  height: number
  width: number
  position: InterfacePositionsXY
}

interface InterfaceColitionElements {
  circle: InterfaceCircle
  rectangle: InterfaceRectangle
}

/* ============= constants ============= */

const canvas = window.document.getElementById('canvas') as HTMLCanvasElement

// canvas context
const c = canvas.getContext('2d') as CanvasRenderingContext2D

canvas.width = window.innerWidth
canvas.height = window.innerHeight

// Nota C-3

const map = [
  ['-', '-', '-', '-', '-', '-', '-'],
  ['-', ' ', ' ', ' ', ' ', ' ', '-'],
  ['-', ' ', '-', ' ', '-', ' ', '-'],
  ['-', ' ', ' ', ' ', ' ', ' ', '-'],
  ['-', '-', '-', '-', '-', '-', '-']
]

const boundaries: Boundary[] = []

/* ============= Classes ============= */

class Boundary {
  public position: InterfacePositionsXY
  public width: number
  public height: number
  static width: number = 40
  static height: number = 40
  constructor ({ position }: InterfacePosition) {
    this.position = position
    this.width = 40
    this.height = 40
  }

  draw (): void {
    // B-2
    c.fillStyle = 'blue'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}

class Player {
  public position: InterfacePositionsXY
  public velocity: InterfacePositionsXY
  public radius: number
  // public borders: InterfaceBorders
  static radius: number = 10

  constructor ({ position, velocity, radius = 15 }: InterfacePlayer) {
    this.position = position
    this.velocity = velocity
    this.radius = radius
  }

  draw (): void {
    // Nota D-4
    c.beginPath()
    // Nota E-4
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

const player = new Player({
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

function circleColideWithReactangle ({
  circle,
  rectangle
}: InterfaceColitionElements): boolean {
  // Los numeros indican cual debe comprarse con cual
  const playerBorders = {
    top: player.position.y - player.radius + circle.velocity.y, // 1
    right: player.position.x + player.radius + circle.velocity.x, // 2
    bottom: player.position.y + player.radius + circle.velocity.y, // 3
    left: player.position.x - player.radius + circle.velocity.x // 4
  }

  const boundaryBorders: InterfaceBorders = {
    bottom: rectangle.position.y + rectangle.height, // 1
    left: rectangle.position.x, // 2
    top: rectangle.position.y, // 3
    right: rectangle.position.x + rectangle.width // 4
  }

  // Nota A-1
  return playerBorders.top <= boundaryBorders.bottom &&
  playerBorders.right >= boundaryBorders.left &&
  playerBorders.bottom >= boundaryBorders.top &&
  playerBorders.left <= boundaryBorders.right
}

function animate (): void {
  // Nota F-6
  window.requestAnimationFrame(animate)
  // Nota G-7
  c.clearRect(0, 0, canvas.width, canvas.height)

  if (keys.w.pressed && lastKey === 'w') {
    // Por cada borde (boundary) compararemos si ese borde esta tocando a nuestro player
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]

      if (
        circleColideWithReactangle({
          circle: {
            ...player,
            velocity: {
              x: 0,
              y: -5
            }
          },
          rectangle: boundary
        })
      ) {
        player.velocity.y = 0
        break
      } else {
        player.velocity.y = -5
      }
    }
  } else if (keys.s.pressed && lastKey === 's') {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]

      if (
        circleColideWithReactangle({
          circle: {
            ...player,
            velocity: {
              x: 0,
              y: 5
            }
          },
          rectangle: boundary
        })
      ) {
        player.velocity.y = 0
        break
      } else {
        player.velocity.y = 5
      }
    }
  } else if (keys.a.pressed && lastKey === 'a') {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]

      if (
        circleColideWithReactangle({
          circle: {
            ...player,
            velocity: {
              x: -5,
              y: 0
            }
          },
          rectangle: boundary
        })
      ) {
        player.velocity.x = 0
        break
      } else {
        player.velocity.x = -5
      }
    }
  } else if (keys.d.pressed && lastKey === 'd') {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]

      if (
        circleColideWithReactangle({
          circle: {
            ...player,
            velocity: {
              x: 5,
              y: 0
            }
          },
          rectangle: boundary
        })
      ) {
        player.velocity.x = 0
        break
      } else {
        player.velocity.x = 5
      }
    }
  }

  boundaries.forEach((boundary) => {
    boundary.draw()

    if (
      circleColideWithReactangle({
        circle: player,
        rectangle: boundary
      })) {
      player.velocity.y = 0
      player.velocity.x = 0
    }
  })

  player.update()
  // player.velocity.y = 0
  // player.velocity.x = 0
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
