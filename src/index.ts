interface PositionsXY {
  x: number
  y: number
}

interface Position {
  position: PositionsXY
}

const canvas = window.document.getElementById('canvas') as HTMLCanvasElement

// canvas context
const c = canvas.getContext('2d') as CanvasRenderingContext2D

canvas.width = window.innerWidth
canvas.height = window.innerHeight

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

/*
  Cada '-' equivale a una caja (box)
*/

const map = [
  ['-', '-', '-', '-', '-', '-'],
  ['-', ' ', ' ', ' ', ' ', '-'],
  ['-', ' ', '-', '-', ' ', '-'],
  ['-', ' ', ' ', ' ', ' ', '-'],
  ['-', '-', '-', '-', '-', '-']
]

const boundaries = [new Boundary({
  position: {
    x: 0,
    y: 0
  }
})]

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

boundaries.forEach((boundary) => {
  boundary.draw()
})
