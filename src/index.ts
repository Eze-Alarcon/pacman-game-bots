/* ============= Notes ============= */

/*
  Keep in mind how is the coordinate system on the web
  0,0 -> + x
  ↓
  + y
*/

/*
  Note A-1

  The padding is to avoid that, if the ghost moves slowly,
    the collision system does not give us an error direction when thinking that
    has room to move in one direction

    the padding would be the remaining space between the object being moved and the boundary

  Note A-2

  circle.position.y - circle.radius + circle.velocity.y

  where:
  circle.position.y - circle.radius = upper edge of the circle

  and:
  circle.velocity.y = object velocity in the y-axis

  This is so that, before colliding, the player will stop.

    The player will be a short distance from the wall but will not touch it.
    If this did not exist, the player would collide with the wall and would not be allowed to continue the game because the condition would continue to be true.

    suppose the player collides with the upper wall,

      - By adding the speed, we allow the player tomove downwards he will be able to, as the speed will be decreasing allowing the player to move upwards,

      - If we do not add velocity to the equation, the player hits the wall and stays there forever.

  The same applies to the x-axis

  Note A-3

  compares if both objects (circle and square) are touching and returns true or false
*/

/*
  Note C-1
  Item descriptions:
    '-' -> x-axis boundary
    ' ' -> free space
    | -> y-axis boundary
    . -> game point (pellet)
    numbers ( 1,2,3,4) -> corners
    b -> box
    p -> power up
    [ and ] -> used to create larger boxes
    5 and 7 -> used to create T-box shapes
    + -> used to create cross box shapes
*/

/*
  Note D-1
  in this way we indicate we start drawing something (works like in svg)

  Note D-2
  c.arc(
    this.position.x,
    this.position.y,
    this.radius,
    this.radiands,
    Math.PI * 2 - this.radiands
  )

  in this case we are going to draw an arc, the arc takes various parameters
  this.position.x -> width
  this.position.y -> height
  this.radius -> radius
  0 -> start of the arc measured in radians, not degrees
  Math.PI * 2 -> end of the arc (2 pi in radians is a full circle)

  Note D-3, Note D-4 and Note D-5
  c.lineTo(this.position.x, this.position.y)

  if (this.radiands < 0 || this.radiands > 0.75) {
      this.openRate = -this.openRate
    }
    this.radiands += this.openRate

  This is for drawing the mouth
*/

/*
  Note F-1

  method tells the browser that you wish to perform an animation and requests that the browser calls a specified function to update an animation right before the next repaint.

  Returns an ID which is the ID of the frame, we use this value to pause the canvas updates.
*/

/*
  Note G-1
  clean the canvas before each iteration
  0 -> start on x-axis
  0 -> start on y-axis
  canvas.width -> end on x-axis
  canvas.height -> end on y-axis
*/

/*
    Note H-1

    array.forEach() was not implemented because it caused a flashing effect on our points. By doing the for we can iterate in reverse (from the end to the beginning) and avoid this effect

    for is for removing items from the end to the beginning to avoid a flashing effect

    Note H-2

    hypot is an static method returns the square root of the sum of squares of its arguments
*/

/* ============= Interfaces ============= */

interface InterfacePositionsXY {
  x: number
  y: number
}

interface InterfaceBorders {
  top: number
  bottom: number
  left: number
  right: number
}

interface InterfacePlayer {
  position: InterfacePositionsXY
  velocity: InterfacePositionsXY
  radius?: number
  color?: string
}

interface InterfacePellet {
  position: InterfacePositionsXY
  radius?: number
}

interface InterfaceBoundary {
  position: InterfacePositionsXY
  image: HTMLImageElement
}

interface InterfaceCircle extends InterfacePlayer {
  velocity: InterfacePositionsXY
  radius: number
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

const scoreEl = window.document.getElementById('score') as HTMLSpanElement

// canvas context
const c = canvas.getContext('2d') as CanvasRenderingContext2D

canvas.width = window.innerWidth
canvas.height = window.innerHeight

// Note C-1

const map = [
  ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
  ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
  ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
  ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
  ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
  ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
  ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
  ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
  ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
  ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
]

const boundaries: Boundary[] = []
const pellets: Pellet[] = []
const powerUps: PowerUp[] = []

const keys = {
  up: {
    pressed: false
  },
  left: {
    pressed: false
  },
  down: {
    pressed: false
  },
  right: {
    pressed: false
  }
}

let lastKey = ''

let score = 0

let animationID: number

const GAME_KEYS = {
  UP: 'w',
  DOWN: 's',
  RIGHT: 'd',
  LEFT: 'a'
}

/* ============= Classes ============= */

class Boundary {
  public position: InterfacePositionsXY
  public width: number
  public height: number
  public image: HTMLImageElement
  static width: number = 40
  static height: number = 40
  constructor ({ position, image }: InterfaceBoundary) {
    this.position = position
    this.width = 40
    this.height = 40
    this.image = image
  }

  draw (): void {
    c.drawImage(this.image, this.position.x, this.position.y)
  }
}

class Player {
  public position: InterfacePositionsXY
  public velocity: InterfacePositionsXY
  public radius: number
  public radiands: number
  public openRate: number
  public rotation: number
  static speed: number = 5

  constructor ({ position, velocity, radius = 15 }: InterfacePlayer) {
    this.position = position
    this.velocity = velocity
    this.radius = radius
    this.radiands = 0.75
    this.openRate = 0.08
    this.rotation = 0
  }

  draw (): void {
    c.save()
    c.translate(this.position.x, this.position.y)
    c.rotate(this.rotation)
    c.translate(-this.position.x, -this.position.y)
    // Note D-1
    c.beginPath()
    // Note D-2
    c.arc(
      this.position.x,
      this.position.y,
      this.radius,
      this.radiands,
      Math.PI * 2 - this.radiands
    )
    // Note D-3
    c.lineTo(this.position.x, this.position.y)
    c.fillStyle = 'yellow'
    c.fill()
    c.closePath()
    c.restore()
  }

  update (): void {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    // Note D-4
    if (this.radiands < 0 || this.radiands > 0.75) {
      this.openRate = -this.openRate
    }
    this.radiands += this.openRate
  }
}

class Ghost {
  public position: InterfacePositionsXY
  public velocity: InterfacePositionsXY
  public radius: number
  public color: string
  public prevCollision: string[]
  public speed: number
  static initialSpeed: number = 2
  static scared: boolean = false

  constructor ({ position, velocity, radius = 15, color = 'red' }: InterfacePlayer) {
    this.position = position
    this.velocity = velocity
    this.radius = radius
    this.color = color
    this.prevCollision = []
    this.speed = 2
  }

  draw (): void {
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    c.fillStyle = Ghost.scared ? 'blue' : this.color
    c.fill()
    c.closePath()
  }

  update (): void {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

class Pellet {
  public position: InterfacePositionsXY
  public radius: number

  constructor ({ position }: InterfacePellet) {
    this.position = position
    this.radius = 3
  }

  draw (): void {
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    c.fillStyle = 'white'
    c.fill()
    c.closePath()
  }
}

class PowerUp {
  public position: InterfacePositionsXY
  public radius: number

  constructor ({ position }: InterfacePellet) {
    this.position = position
    this.radius = 6
  }

  draw (): void {
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    c.fillStyle = 'white'
    c.fill()
    c.closePath()
  }
}

/* ============= Functions and stuff ============= */

const player = new Player({
  position: {
    x: Boundary.width + (Boundary.width / 2),
    y: Boundary.height + (Boundary.height / 2)
  },
  velocity: {
    x: 0,
    y: 0
  }
})

const ghosts = [
  new Ghost({
    position: {
      x: (Boundary.width * 6) + (Boundary.width / 2),
      y: Boundary.height + (Boundary.height / 2)
    },
    velocity: {
      x: Ghost.initialSpeed,
      y: 0
    }
  }),
  new Ghost({
    position: {
      x: Boundary.width + (Boundary.width / 2),
      y: (Boundary.height * 9) + (Boundary.height / 2)
    },
    velocity: {
      x: Ghost.initialSpeed,
      y: 0
    },
    color: 'pink'
  }),
  new Ghost({
    position: {
      x: (Boundary.width * 7) + (Boundary.width / 2),
      y: Boundary.height * 11 + (Boundary.height / 2)
    },
    velocity: {
      x: Ghost.initialSpeed,
      y: 0
    },
    color: 'green'
  })
]

function createImage (src: string): HTMLImageElement {
  const image = new Image()
  image.src = `./images/${src}`
  return image
}

// Render images on the map

map.forEach((row, rowIndex) => {
  row.forEach((symbol, columnIndex) => {
    switch (symbol) {
      case '-':
        boundaries.push(new Boundary({
          position: {
            x: Boundary.width * columnIndex,
            y: Boundary.height * rowIndex
          },
          image: createImage('pipeHorizontal.png')
        }))
        break
      case '|':
        boundaries.push(new Boundary({
          position: {
            x: Boundary.width * columnIndex,
            y: Boundary.height * rowIndex
          },
          image: createImage('pipeVertical.png')
        }))
        break
      case '1':
        boundaries.push(new Boundary({
          position: {
            x: Boundary.width * columnIndex,
            y: Boundary.height * rowIndex
          },
          image: createImage('pipeCorner1.png')
        }))
        break
      case '2':
        boundaries.push(new Boundary({
          position: {
            x: Boundary.width * columnIndex,
            y: Boundary.height * rowIndex
          },
          image: createImage('pipeCorner2.png')
        }))
        break
      case '3':
        boundaries.push(new Boundary({
          position: {
            x: Boundary.width * columnIndex,
            y: Boundary.height * rowIndex
          },
          image: createImage('pipeCorner3.png')
        }))
        break
      case '4':
        boundaries.push(new Boundary({
          position: {
            x: Boundary.width * columnIndex,
            y: Boundary.height * rowIndex
          },
          image: createImage('pipeCorner4.png')
        }))
        break
      case 'b':
        boundaries.push(new Boundary({
          position: {
            x: Boundary.width * columnIndex,
            y: Boundary.height * rowIndex
          },
          image: createImage('block.png')
        }))
        break
      case '[':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * columnIndex,
              y: Boundary.height * rowIndex
            },
            image: createImage('capLeft.png')
          })
        )
        break
      case ']':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * columnIndex,
              y: Boundary.height * rowIndex
            },
            image: createImage('capRight.png')
          })
        )
        break
      case '_':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * columnIndex,
              y: Boundary.height * rowIndex
            },
            image: createImage('capBottom.png')
          })
        )
        break
      case '^':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * columnIndex,
              y: Boundary.height * rowIndex
            },
            image: createImage('capTop.png')
          })
        )
        break
      case '+':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * columnIndex,
              y: Boundary.height * rowIndex
            },
            image: createImage('pipeCross.png')
          })
        )
        break
      case '5':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * columnIndex,
              y: Boundary.height * rowIndex
            },
            // color: 'blue',
            image: createImage('pipeConnectorTop.png')
          })
        )
        break
      case '6':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * columnIndex,
              y: Boundary.height * rowIndex
            },
            // color: 'blue',
            image: createImage('pipeConnectorRight.png')
          })
        )
        break
      case '7':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * columnIndex,
              y: Boundary.height * rowIndex
            },
            // color: 'blue',
            image: createImage('pipeConnectorBottom.png')
          })
        )
        break
      case '8':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * columnIndex,
              y: Boundary.height * rowIndex
            },
            image: createImage('pipeConnectorLeft.png')
          })
        )
        break
      case '.':
        pellets.push(
          new Pellet({
            position: {
              x: Boundary.width * columnIndex + Boundary.width / 2,
              y: Boundary.height * rowIndex + Boundary.height / 2
            }
          })
        )
        break
      case 'p':
        powerUps.push(
          new PowerUp({
            position: {
              x: Boundary.width * columnIndex + Boundary.width / 2,
              y: Boundary.height * rowIndex + Boundary.height / 2
            }
          })
        )
        break
    }
  })
})

// Function to detect collisions between a circle and a square
function circleCollideWithReactangle ({
  circle,
  rectangle
}: InterfaceColitionElements): boolean {
  const padding = Boundary.width / 2 - circle.radius - 1

  // Note A-1
  // The numbers indicate which should be compared with which.
  // basically it's one end of the circle with the opposite end of the square

  // Note A-2
  const playerBorders = {
    top: circle.position.y - circle.radius + circle.velocity.y, // 1
    right: circle.position.x + circle.radius + circle.velocity.x, // 2
    bottom: circle.position.y + circle.radius + circle.velocity.y, // 3
    left: circle.position.x - circle.radius + circle.velocity.x // 4
  }

  const boundaryBorders: InterfaceBorders = {
    bottom: rectangle.position.y + rectangle.height + padding, // 1
    left: rectangle.position.x - padding, // 2
    top: rectangle.position.y - padding, // 3
    right: rectangle.position.x + rectangle.width + padding // 4
  }

  // Note A-3

  return playerBorders.top <= boundaryBorders.bottom &&
  playerBorders.right >= boundaryBorders.left &&
  playerBorders.bottom >= boundaryBorders.top &&
  playerBorders.left <= boundaryBorders.right
}

function animate (): void {
  // Note F-1
  animationID = window.requestAnimationFrame(animate)
  // Note G-1
  c.clearRect(0, 0, canvas.width, canvas.height)

  if (keys.up.pressed && lastKey === GAME_KEYS.UP) {
    // For each edge (boundary) we will compare if that edge is touching our player
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]

      if (
        circleCollideWithReactangle({
          circle: {
            ...player,
            velocity: {
              x: 0,
              y: -Player.speed
            }
          },
          rectangle: boundary
        })
      ) {
        player.velocity.y = 0
        break
      } else {
        player.velocity.y = -Player.speed
      }
    }
  } else if (keys.down.pressed && lastKey === GAME_KEYS.DOWN) {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]

      if (
        circleCollideWithReactangle({
          circle: {
            ...player,
            velocity: {
              x: 0,
              y: Player.speed
            }
          },
          rectangle: boundary
        })
      ) {
        player.velocity.y = 0
        break
      } else {
        player.velocity.y = Player.speed
      }
    }
  } else if (keys.left.pressed && lastKey === GAME_KEYS.LEFT) {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]

      if (
        circleCollideWithReactangle({
          circle: {
            ...player,
            velocity: {
              x: -Player.speed,
              y: 0
            }
          },
          rectangle: boundary
        })
      ) {
        player.velocity.x = 0
        break
      } else {
        player.velocity.x = -Player.speed
      }
    }
  } else if (keys.right.pressed && lastKey === GAME_KEYS.RIGHT) {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]

      if (
        circleCollideWithReactangle({
          circle: {
            ...player,
            velocity: {
              x: Player.speed,
              y: 0
            }
          },
          rectangle: boundary
        })
      ) {
        player.velocity.x = 0
        break
      } else {
        player.velocity.x = Player.speed
      }
    }
  }

  // render pellets
  // Note h-1
  for (let i = pellets.length - 1; i >= 0; i--) {
    const pellet = pellets[i]

    pellet.draw()

    // touch pellets
    // Note H-2
    if ((Math.hypot(
      pellet.position.x - player.position.x,
      pellet.position.y - player.position.y
    ) < pellet.radius + player.radius)) {
      pellets.splice(i, 1)
      score += 10
      scoreEl.innerText = `${score}`
    }
  }

  // detect collision beteween ghost and player
  for (let i = ghosts.length - 1; i >= 0; i--) {
    const ghost = ghosts[i]

    // player lose condition
    if ((Math.hypot(ghost.position.x - player.position.x,
      ghost.position.y - player.position.y)) <
      (ghost.radius + player.radius)) {
      if (Ghost.scared) {
        ghosts.splice(i, 1)
      } else {
        cancelAnimationFrame(animationID)
        console.log('GAME OVER (F)')
      }
    }
  }

  // win condition

  if (pellets.length === 0) {
    console.log('YOU WIN')
    cancelAnimationFrame(animationID)
  }

  // render power up
  for (let i = powerUps.length - 1; i >= 0; i--) {
    const powerUp = powerUps[i]

    powerUp.draw()

    // touch powerUps
    if ((Math.hypot(
      powerUp.position.x - player.position.x,
      powerUp.position.y - player.position.y
    ) < powerUp.radius + player.radius)) {
      powerUps.splice(i, 1)

      // make ghost scared
      Ghost.scared = true

      // reset property scared
      setTimeout(() => { Ghost.scared = false }, 3000)
    }
  }

  // Stop player if the player hit a wall
  boundaries.forEach((boundary) => {
    boundary.draw()

    if (
      circleCollideWithReactangle({
        circle: player,
        rectangle: boundary
      })) {
      player.velocity.y = 0
      player.velocity.x = 0
    }
  })

  player.update()

  // remder ghost
  ghosts.forEach((ghost) => {
    ghost.update()

    const collisions: string[] = []

    // ghost touch player
    boundaries.forEach(boundary => {
      if (!collisions.includes('right') && circleCollideWithReactangle({
        circle: {
          ...ghost,
          velocity: { x: ghost.speed, y: 0 }
        },
        rectangle: boundary
      })
      ) { collisions.push('right') }

      if (!collisions.includes('left') && circleCollideWithReactangle({
        circle: {
          ...ghost,
          velocity: { x: -ghost.speed, y: 0 }
        },
        rectangle: boundary
      })
      ) {
        collisions.push('left')
      }

      if (!collisions.includes('up') && circleCollideWithReactangle({
        circle: {
          ...ghost,
          velocity: { x: 0, y: -ghost.speed }
        },
        rectangle: boundary
      })
      ) { collisions.push('up') }

      if (!collisions.includes('down') && circleCollideWithReactangle({
        circle: {
          ...ghost,
          velocity: { x: 0, y: ghost.speed }
        },
        rectangle: boundary
      })
      ) { collisions.push('down') }
    })

    if (collisions.length > ghost.prevCollision.length) ghost.prevCollision = collisions

    // we compare the collisions vs the previous collisions
    if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollision)) {
      if (ghost.velocity.x > 0) ghost.prevCollision.push('right')
      else if (ghost.velocity.x < 0) ghost.prevCollision.push('left')
      else if (ghost.velocity.y < 0) ghost.prevCollision.push('up')
      else if (ghost.velocity.y > 0) ghost.prevCollision.push('down')

      const pathways = ghost.prevCollision.filter(collision => !collisions.includes(collision))

      // ghost chooses a random direction
      const direction = pathways[Math.floor(Math.random() * pathways.length)]

      switch (direction) {
        case 'down':
          ghost.velocity.y = ghost.speed
          ghost.velocity.x = 0
          break
        case 'up':
          ghost.velocity.y = -ghost.speed
          ghost.velocity.x = 0
          break
        case 'right':
          ghost.velocity.y = 0
          ghost.velocity.x = ghost.speed
          break
        case 'left':
          ghost.velocity.y = 0
          ghost.velocity.x = -ghost.speed
          break
      }

      ghost.prevCollision = []
    }
  })

  // Note D-5
  if (player.velocity.x > 0) player.rotation = 0
  else if (player.velocity.x < 0) player.rotation = Math.PI
  else if (player.velocity.y > 0) player.rotation = Math.PI / 2
  else if (player.velocity.y < 0) player.rotation = Math.PI * 1.5
}

animate()

/* ============= Add event listeners for the keys ============= */

window.addEventListener('keydown', (event) => {
  event.preventDefault()

  const { key } = event

  switch (key) {
    case GAME_KEYS.UP:
      keys.up.pressed = true
      lastKey = GAME_KEYS.UP
      break
    case GAME_KEYS.DOWN:
      keys.down.pressed = true
      lastKey = GAME_KEYS.DOWN
      break
    case GAME_KEYS.RIGHT:
      keys.right.pressed = true
      lastKey = GAME_KEYS.RIGHT
      break
    case GAME_KEYS.LEFT:
      keys.left.pressed = true
      lastKey = GAME_KEYS.LEFT
      break
  }
})

window.addEventListener('keyup', (event) => {
  event.preventDefault()

  const { key } = event

  switch (key) {
    case GAME_KEYS.UP:
      keys.up.pressed = false
      break
    case GAME_KEYS.DOWN:
      keys.down.pressed = false
      break
    case GAME_KEYS.RIGHT:
      keys.right.pressed = false
      break
    case GAME_KEYS.LEFT:
      keys.left.pressed = false
      break
  }
})
