"use strict";
/* ============= Notes ============= */
/* ============= constants ============= */
const canvas = window.document.getElementById('canvas');
// const scoreEl = window.document.getElementById('score') as HTMLSpanElement
// canvas context
const c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
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
];
const boundaries = [];
const pellets = [];
const powerUps = [];
// const keys = {
//   up: {
//     pressed: false
//   },
//   left: {
//     pressed: false
//   },
//   down: {
//     pressed: false
//   },
//   right: {
//     pressed: false
//   }
// }
// let lastKey = ''
// const score = 0
// let animationID: number
// const GAME_KEYS = {
//   UP: 'w',
//   DOWN: 's',
//   RIGHT: 'd',
//   LEFT: 'a'
// }
/* ============= Add event listeners for the keys ============= */
// window.addEventListener('keydown', (event) => {
//   event.preventDefault()
//   const { key } = event
//   switch (key) {
//     case GAME_KEYS.UP:
//       keys.up.pressed = true
//       lastKey = GAME_KEYS.UP
//       break
//     case GAME_KEYS.DOWN:
//       keys.down.pressed = true
//       lastKey = GAME_KEYS.DOWN
//       break
//     case GAME_KEYS.RIGHT:
//       keys.right.pressed = true
//       lastKey = GAME_KEYS.RIGHT
//       break
//     case GAME_KEYS.LEFT:
//       keys.left.pressed = true
//       lastKey = GAME_KEYS.LEFT
//       break
//   }
// })
// window.addEventListener('keyup', (event) => {
//   event.preventDefault()
//   const { key } = event
//   switch (key) {
//     case GAME_KEYS.UP:
//       keys.up.pressed = false
//       break
//     case GAME_KEYS.DOWN:
//       keys.down.pressed = false
//       break
//     case GAME_KEYS.RIGHT:
//       keys.right.pressed = false
//       break
//     case GAME_KEYS.LEFT:
//       keys.left.pressed = false
//       break
//   }
// })
/* ============= Classes ============= */
class Boundary {
    constructor({ position, image }) {
        this.position = position;
        this.width = 40;
        this.height = 40;
        this.image = image;
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y);
    }
}
Boundary.width = 40;
Boundary.height = 40;
// class Player {
//   public position: InterfacePositionsXY
//   public velocity: InterfacePositionsXY
//   public radius: number
//   public radiands: number
//   public openRate: number
//   public rotation: number
//   static speed: number = 5
//   constructor ({ position, velocity, radius = 15 }: InterfacePlayer) {
//     this.position = position
//     this.velocity = velocity
//     this.radius = radius
//     this.radiands = 0.75
//     this.openRate = 0.08
//     this.rotation = 0
//   }
//   draw (): void {
//     c.save()
//     c.translate(this.position.x, this.position.y)
//     c.rotate(this.rotation)
//     c.translate(-this.position.x, -this.position.y)
//     // Note D-1
//     c.beginPath()
//     // Note D-2
//     c.arc(
//       this.position.x,
//       this.position.y,
//       this.radius,
//       this.radiands,
//       Math.PI * 2 - this.radiands
//     )
//     // Note D-3
//     c.lineTo(this.position.x, this.position.y)
//     c.fillStyle = 'yellow'
//     c.fill()
//     c.closePath()
//     c.restore()
//   }
//   update (): void {
//     this.draw()
//     this.position.x += this.velocity.x
//     this.position.y += this.velocity.y
//     // Note D-4
//     if (this.radiands < 0 || this.radiands > 0.75) {
//       this.openRate = -this.openRate
//     }
//     this.radiands += this.openRate
//   }
// }
class Ghost {
    constructor({ position, velocity, radius = 15, color = 'red' }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;
        this.prevCollision = [];
        this.speed = 2;
    }
    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = Ghost.scared ? 'blue' : this.color;
        c.fill();
        c.closePath();
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}
Ghost.initialSpeed = 2;
Ghost.scared = false;
class Pellet {
    constructor({ position }) {
        this.position = position;
        this.radius = 3;
    }
    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = 'white';
        c.fill();
        c.closePath();
    }
}
class PowerUp {
    constructor({ position }) {
        this.position = position;
        this.radius = 6;
    }
    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = 'white';
        c.fill();
        c.closePath();
    }
}
/* ============= Functions and stuff ============= */
// const player = new Player({
//   position: {
//     x: Boundary.width + (Boundary.width / 2),
//     y: Boundary.height + (Boundary.height / 2)
//   },
//   velocity: {
//     x: 0,
//     y: 0
//   }
// })
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
];
function createImage(src) {
    const image = new Image();
    image.src = `./images/${src}`;
    return image;
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
                }));
                break;
            case '|':
                boundaries.push(new Boundary({
                    position: {
                        x: Boundary.width * columnIndex,
                        y: Boundary.height * rowIndex
                    },
                    image: createImage('pipeVertical.png')
                }));
                break;
            case '1':
                boundaries.push(new Boundary({
                    position: {
                        x: Boundary.width * columnIndex,
                        y: Boundary.height * rowIndex
                    },
                    image: createImage('pipeCorner1.png')
                }));
                break;
            case '2':
                boundaries.push(new Boundary({
                    position: {
                        x: Boundary.width * columnIndex,
                        y: Boundary.height * rowIndex
                    },
                    image: createImage('pipeCorner2.png')
                }));
                break;
            case '3':
                boundaries.push(new Boundary({
                    position: {
                        x: Boundary.width * columnIndex,
                        y: Boundary.height * rowIndex
                    },
                    image: createImage('pipeCorner3.png')
                }));
                break;
            case '4':
                boundaries.push(new Boundary({
                    position: {
                        x: Boundary.width * columnIndex,
                        y: Boundary.height * rowIndex
                    },
                    image: createImage('pipeCorner4.png')
                }));
                break;
            case 'b':
                boundaries.push(new Boundary({
                    position: {
                        x: Boundary.width * columnIndex,
                        y: Boundary.height * rowIndex
                    },
                    image: createImage('block.png')
                }));
                break;
            case '[':
                boundaries.push(new Boundary({
                    position: {
                        x: Boundary.width * columnIndex,
                        y: Boundary.height * rowIndex
                    },
                    image: createImage('capLeft.png')
                }));
                break;
            case ']':
                boundaries.push(new Boundary({
                    position: {
                        x: Boundary.width * columnIndex,
                        y: Boundary.height * rowIndex
                    },
                    image: createImage('capRight.png')
                }));
                break;
            case '_':
                boundaries.push(new Boundary({
                    position: {
                        x: Boundary.width * columnIndex,
                        y: Boundary.height * rowIndex
                    },
                    image: createImage('capBottom.png')
                }));
                break;
            case '^':
                boundaries.push(new Boundary({
                    position: {
                        x: Boundary.width * columnIndex,
                        y: Boundary.height * rowIndex
                    },
                    image: createImage('capTop.png')
                }));
                break;
            case '+':
                boundaries.push(new Boundary({
                    position: {
                        x: Boundary.width * columnIndex,
                        y: Boundary.height * rowIndex
                    },
                    image: createImage('pipeCross.png')
                }));
                break;
            case '5':
                boundaries.push(new Boundary({
                    position: {
                        x: Boundary.width * columnIndex,
                        y: Boundary.height * rowIndex
                    },
                    // color: 'blue',
                    image: createImage('pipeConnectorTop.png')
                }));
                break;
            case '6':
                boundaries.push(new Boundary({
                    position: {
                        x: Boundary.width * columnIndex,
                        y: Boundary.height * rowIndex
                    },
                    // color: 'blue',
                    image: createImage('pipeConnectorRight.png')
                }));
                break;
            case '7':
                boundaries.push(new Boundary({
                    position: {
                        x: Boundary.width * columnIndex,
                        y: Boundary.height * rowIndex
                    },
                    // color: 'blue',
                    image: createImage('pipeConnectorBottom.png')
                }));
                break;
            case '8':
                boundaries.push(new Boundary({
                    position: {
                        x: Boundary.width * columnIndex,
                        y: Boundary.height * rowIndex
                    },
                    image: createImage('pipeConnectorLeft.png')
                }));
                break;
            case '.':
                pellets.push(new Pellet({
                    position: {
                        x: Boundary.width * columnIndex + Boundary.width / 2,
                        y: Boundary.height * rowIndex + Boundary.height / 2
                    }
                }));
                break;
            case 'p':
                powerUps.push(new PowerUp({
                    position: {
                        x: Boundary.width * columnIndex + Boundary.width / 2,
                        y: Boundary.height * rowIndex + Boundary.height / 2
                    }
                }));
                break;
        }
    });
});
// Function to detect collisions between a circle and a square
function circleCollideWithReactangle({ circle, rectangle }) {
    const padding = Boundary.width / 2 - circle.radius - 1;
    // Note A-1
    // The numbers indicate which should be compared with which.
    // basically it's one end of the circle with the opposite end of the square
    // Note A-2
    const circleBorders = {
        top: circle.position.y - circle.radius + circle.velocity.y,
        right: circle.position.x + circle.radius + circle.velocity.x,
        bottom: circle.position.y + circle.radius + circle.velocity.y,
        left: circle.position.x - circle.radius + circle.velocity.x // 4
    };
    const boundaryBorders = {
        bottom: rectangle.position.y + rectangle.height + padding,
        left: rectangle.position.x - padding,
        top: rectangle.position.y - padding,
        right: rectangle.position.x + rectangle.width + padding // 4
    };
    // Note A-3
    return circleBorders.top <= boundaryBorders.bottom &&
        circleBorders.right >= boundaryBorders.left &&
        circleBorders.bottom >= boundaryBorders.top &&
        circleBorders.left <= boundaryBorders.right;
}
function animate() {
    // Note F-1
    // animationID = window.requestAnimationFrame(animate)
    window.requestAnimationFrame(animate);
    // Note G-1
    c.clearRect(0, 0, canvas.width, canvas.height);
    // if (keys.up.pressed && lastKey === GAME_KEYS.UP) {
    //   // For each edge (boundary) we will compare if that edge is touching our player
    //   for (let i = 0; i < boundaries.length; i++) {
    //     const boundary = boundaries[i]
    //     if (
    //       circleCollideWithReactangle({
    //         circle: {
    //           ...player,
    //           velocity: {
    //             x: 0,
    //             y: -Player.speed
    //           }
    //         },
    //         rectangle: boundary
    //       })
    //     ) {
    //       player.velocity.y = 0
    //       break
    //     } else {
    //       player.velocity.y = -Player.speed
    //     }
    //   }
    // } else if (keys.down.pressed && lastKey === GAME_KEYS.DOWN) {
    //   for (let i = 0; i < boundaries.length; i++) {
    //     const boundary = boundaries[i]
    //     if (
    //       circleCollideWithReactangle({
    //         circle: {
    //           ...player,
    //           velocity: {
    //             x: 0,
    //             y: Player.speed
    //           }
    //         },
    //         rectangle: boundary
    //       })
    //     ) {
    //       player.velocity.y = 0
    //       break
    //     } else {
    //       player.velocity.y = Player.speed
    //     }
    //   }
    // } else if (keys.left.pressed && lastKey === GAME_KEYS.LEFT) {
    //   for (let i = 0; i < boundaries.length; i++) {
    //     const boundary = boundaries[i]
    //     if (
    //       circleCollideWithReactangle({
    //         circle: {
    //           ...player,
    //           velocity: {
    //             x: -Player.speed,
    //             y: 0
    //           }
    //         },
    //         rectangle: boundary
    //       })
    //     ) {
    //       player.velocity.x = 0
    //       break
    //     } else {
    //       player.velocity.x = -Player.speed
    //     }
    //   }
    // } else if (keys.right.pressed && lastKey === GAME_KEYS.RIGHT) {
    //   for (let i = 0; i < boundaries.length; i++) {
    //     const boundary = boundaries[i]
    //     if (
    //       circleCollideWithReactangle({
    //         circle: {
    //           ...player,
    //           velocity: {
    //             x: Player.speed,
    //             y: 0
    //           }
    //         },
    //         rectangle: boundary
    //       })
    //     ) {
    //       player.velocity.x = 0
    //       break
    //     } else {
    //       player.velocity.x = Player.speed
    //     }
    //   }
    // }
    // render pellets
    // Note h-1
    // for (let i = pellets.length - 1; i >= 0; i--) {
    // const pellet = pellets[i]
    // pellet.draw()
    // touch pellets
    // Note H-2
    // if ((Math.hypot(
    //   pellet.position.x - player.position.x,
    //   pellet.position.y - player.position.y
    // ) < pellet.radius + player.radius)) {
    //   pellets.splice(i, 1)
    //   score += 10
    //   scoreEl.innerText = `${score}`
    // }
    // }
    // detect collision beteween ghost and player
    // for (let i = ghosts.length - 1; i >= 0; i--) {
    // const ghost = ghosts[i]
    // player lose condition
    // if ((Math.hypot(ghost.position.x - player.position.x,
    //   ghost.position.y - player.position.y)) <
    //   (ghost.radius + player.radius)) {
    //   if (Ghost.scared) {
    //     ghosts.splice(i, 1)
    //   } else {
    //     cancelAnimationFrame(animationID)
    //     console.log('GAME OVER (F)')
    //   }
    // }
    // }
    // win condition
    // if (pellets.length === 0) {
    //   console.log('YOU WIN')
    //   cancelAnimationFrame(animationID)
    // }
    // render power up
    // for (let i = powerUps.length - 1; i >= 0; i--) {
    //   const powerUp = powerUps[i]
    //   powerUp.draw()
    //   // touch powerUps
    //   if ((Math.hypot(
    //     powerUp.position.x - player.position.x,
    //     powerUp.position.y - player.position.y
    //   ) < powerUp.radius + player.radius)) {
    //     powerUps.splice(i, 1)
    //     // make ghost scared
    //     Ghost.scared = true
    //     // reset property scared
    //     setTimeout(() => { Ghost.scared = false }, 3000)
    //   }
    // }
    // Stop player if the player hit a wall
    // boundaries.forEach((boundary) => {
    //   boundary.draw()
    //   if (
    //     circleCollideWithReactangle({
    //       circle: player,
    //       rectangle: boundary
    //     })) {
    //     player.velocity.y = 0
    //     player.velocity.x = 0
    //   }
    // })
    // player.update()
    // remder ghost
    ghosts.forEach((ghost) => {
        ghost.update();
        const collisions = [];
        // ghost touch player
        boundaries.forEach(boundary => {
            if (!collisions.includes('right') && circleCollideWithReactangle({
                circle: Object.assign(Object.assign({}, ghost), { velocity: { x: ghost.speed, y: 0 } }),
                rectangle: boundary
            })) {
                collisions.push('right');
            }
            if (!collisions.includes('left') && circleCollideWithReactangle({
                circle: Object.assign(Object.assign({}, ghost), { velocity: { x: -ghost.speed, y: 0 } }),
                rectangle: boundary
            })) {
                collisions.push('left');
            }
            if (!collisions.includes('up') && circleCollideWithReactangle({
                circle: Object.assign(Object.assign({}, ghost), { velocity: { x: 0, y: -ghost.speed } }),
                rectangle: boundary
            })) {
                collisions.push('up');
            }
            if (!collisions.includes('down') && circleCollideWithReactangle({
                circle: Object.assign(Object.assign({}, ghost), { velocity: { x: 0, y: ghost.speed } }),
                rectangle: boundary
            })) {
                collisions.push('down');
            }
        });
        if (collisions.length > ghost.prevCollision.length)
            ghost.prevCollision = collisions;
        // we compare the collisions vs the previous collisions
        if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollision)) {
            if (ghost.velocity.x > 0)
                ghost.prevCollision.push('right');
            else if (ghost.velocity.x < 0)
                ghost.prevCollision.push('left');
            else if (ghost.velocity.y < 0)
                ghost.prevCollision.push('up');
            else if (ghost.velocity.y > 0)
                ghost.prevCollision.push('down');
            const pathways = ghost.prevCollision.filter(collision => !collisions.includes(collision));
            // ghost chooses a random direction
            const direction = pathways[Math.floor(Math.random() * pathways.length)];
            switch (direction) {
                case 'down':
                    ghost.velocity.y = ghost.speed;
                    ghost.velocity.x = 0;
                    break;
                case 'up':
                    ghost.velocity.y = -ghost.speed;
                    ghost.velocity.x = 0;
                    break;
                case 'right':
                    ghost.velocity.y = 0;
                    ghost.velocity.x = ghost.speed;
                    break;
                case 'left':
                    ghost.velocity.y = 0;
                    ghost.velocity.x = -ghost.speed;
                    break;
            }
            ghost.prevCollision = [];
        }
    });
    // Note D-5
    // if (player.velocity.x > 0) player.rotation = 0
    // else if (player.velocity.x < 0) player.rotation = Math.PI
    // else if (player.velocity.y > 0) player.rotation = Math.PI / 2
    // else if (player.velocity.y < 0) player.rotation = Math.PI * 1.5
}
animate();
