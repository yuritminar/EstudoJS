const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const scoreEL = document.querySelector('#scoreEL')

canvas.width = innerWidth
canvas.height = innerHeight

class Boundary {
    static width = 40
    static height = 40
    constructor({ position, image }) {
        this.position = position
        this.width = 40
        this.height = 40
        this.image = image
    }

    draw() {
       /* c.fillStyle = 'blue'
        c.fillRect(this.position.x, this.position.y, this.width, this.height
        )*/
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class Player {
//cria o personagem do jogador
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.radians = 0.75 //ângulo que faz abrir a boca
        this.openRate = 0.12 //tempo de abertura
        this.rotation = 0 //para mudar a rotação do pacman
    }

    draw(){
        c.save()
        c.translate(this.position.x, this.position.y)
        c.rotate(this.rotation) //função global do canvas para girar tudo
        c.translate(-this.position.x, -this.position.y)
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, this.radians, Math.PI * 2 -this.radians)
        //boca totalmente fechada
        c.lineTo(this.position.x, this.position.y)
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath()
        c.restore()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.radians < 0 || this.radians > .75) this.openRate = -this.openRate
        //condição que faz inverter entre abrir e fechar 
        this.radians += this.openRate
    }
}

class Ghost {
//cria os npcs
    static speed = 2
    constructor({position, velocity, color = 'red'}) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.color = color
        this.prevCollisions = []
        this.speed = 2
        this.scared = false
    }

    draw(){
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = this.scared ? 'blue' : this.color
        c.fill()
        c.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Pellet {
    //desenha os pontos no mapa
    constructor({ position }) {
        this.position = position
        this.radius = 3
    }

    draw(){
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'white'
        c.fill()
        c.closePath()
    }


}

class PowerUp {
    //para adicionar PowerUp no mapa
    constructor({ position }) {
        this.position = position
        this.radius = 8
    }

    draw(){
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'white'
        c.fill()
        c.closePath()
    }


}

const pellets = []
const boundaries = []
const powerUps = []
const ghosts = [
    new Ghost({
        //cria novo fantasma
        position: {
            x: Boundary.width * 6 + Boundary.width /2,
            y: Boundary.height * 3 + Boundary.height /2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        }
    }),
    new Ghost({
        //cria novo fantasma
        position: {
            x: Boundary.width * 6 + Boundary.width /2,
            y: Boundary.height + Boundary.height /2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        },
        color: 'pink'
    })
]
const player = new Player({
    position: {
        x: Boundary.width + Boundary.width /2,
        y: Boundary.height + Boundary.height /2
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
let score = 0

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
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3'],
]


function createImage(src){
    const image = new Image()
    image.src = src
    return image
}


/*
    ler para entender um pouco melhor o gerador
    de mapa.
*/
map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch (symbol) {
            case '-':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage(
                        './img/pipeHorizontal.png')
                    })
                )
            break
            case '|':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image:  createImage(
                            './img/pipeVertical.png')
                    })
                )
            break
            case '1':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image:  createImage(
                            './img/pipeCorner1.png')
                    })
                )
            break
            case '2':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width *j,
                            y: Boundary.height* i
                        },
                        image:  createImage(
                            './img/pipeCorner2.png')
                    })
                )
            break
            case '3':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image:  createImage(
                            './img/pipeCorner3.png')
                    })
                )
            break
            case '4':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image:  createImage(
                            './img/pipeCorner4.png')
                    })
                )
            break
            case 'b':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image:  createImage(
                            './img/block.png')
                    })
                )
            break
            case ']':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image:  createImage(
                            './img/capRight.png')
                    })
                )
            break
            case '[':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image:  createImage(
                            './img/capLeft.png')
                    })
                )
            break
            case '^':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image:  createImage(
                            './img/capTop.png')
                    })
                )
            break
            case '5':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image:  createImage(
                            './img/pipeConnectorTop.png')
                    })
                )
            break
            case '7':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image:  createImage(
                            './img/pipeConnectorbottom.png')
                    })
                )
            break
            case '+':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image:  createImage(
                            './img/pipeCross.png')
                    })
                )
            break
            case '_':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image:  createImage(
                            './img/capBottom.png')
                    })
                )
            break
            case '6':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image:  createImage(
                            './img/pipeConnectorRight.png')
                    })
                )
            break
            case '8':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image:  createImage(
                            './img/pipeConnectorLeft.png')
                    })
                )
            break
            case '.':
                pellets.push(
                    new Pellet({
                        position: {
                            x: Boundary.width * j + Boundary.width /2,
                            y: Boundary.height * i + Boundary.height /2
                        }

                    })
                )
            break
            case 'p':
                powerUps.push(
                    new PowerUp({
                        position: {
                            x: Boundary.width * j + Boundary.width /2,
                            y: Boundary.height * i + Boundary.height /2
                        }

                    })
                )
            break
        }
    })
})


function circleCollideWithRectangle({circle, rectangle})
{   //bloco que configura quando é considerado uma colisão de bloco
    const padding = Boundary.width /2 - circle.radius -1
    
    return (circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding && circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding && circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding && circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding)
}

let animationId
function animate() {
    //função de animação
    animationId = requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)

    if (keys.w.pressed && lastKey === 'w'){
        for (let i= 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollideWithRectangle({
                circle: {...player, velocity: {
                    x:  0,
                    y: -5
                }},
                rectangle: boundary
            })
            ) {
                player.velocity.y = 0 
                break 
            } else {
                player.velocity.y = -5
            }
        }
    } else if (keys.a.pressed && lastKey === 'a'){
        for (let i= 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollideWithRectangle({
                circle: {...player, velocity: {
                    x: -5,
                    y: 0
                }},
                rectangle: boundary
            })
            ) {
                player.velocity.x = 0 
                break 
            } else {
                player.velocity.x = -5
            }
        }
    } else if (keys.s.pressed && lastKey === 's'){
        for (let i= 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollideWithRectangle({
                circle: {...player, velocity: {
                    x:  0,
                    y: 5
                }},
                rectangle: boundary
            })
            ) {
                player.velocity.y = 0 
                break 
            } else {
                player.velocity.y = 5
            }
        }
    } else if (keys.d.pressed && lastKey === 'd'){
        for (let i= 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollideWithRectangle({
                circle: {...player, velocity: {
                    x: 5,
                    y: 0
                }},
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

    window.addEventListener('keydown', ({key}) => {
        switch (key) {
            case 'w':
                keys.w.pressed = true
                lastKey = 'w'
                break
            case 'a':
                keys.a.pressed = true
                lastKey = 'a'
                break
            case 's':
                keys.s.pressed = true
                lastKey = 's'
                break
            case 'd':
                keys.d.pressed = true
                lastKey = 'd'
                break
        }
    })
    
    window.addEventListener('keyup', ({key}) => {
        switch (key) {
            case 'w':
                keys.w.pressed = false
                break
            case 'a':
                keys.a.pressed = false
                break
            case 's':
                keys.s.pressed = false
                break
            case 'd':
                keys.d.pressed = false
                break
        }
    })
   
 /* Como fazer controle simples de movimento e parada
    
        window.addEventListener('keydown', ({key}) => {
            switch (key) {
                case 'w':
                    player.velocity.y = -5
                    break
                case 'a':
                    player.velocity.x = -5
                    break
                case 's':
                    player.velocity.y = 5
                    break
                case 'd':
                    player.velocity.x = 5
                    break
            }
        console.log(player.velocity)
        })
        window.addEventListener('keyup', ({key}) => {
        switch (key) {
            case 'w':
                player.velocity.y = 0
                break
            case 'a':
                player.velocity.x = 0
                break
            case 's':
                player.velocity.y = 0
                break
            case 'd':
                player.velocity.x = 0
                break
        }
        console.log(player.velocity)
        })
    
    */
    for (let i = ghosts.length - 1; 0 <= i; i-- ) {
        //detecta a colisão entre fantasma e jogador
        const ghost = ghosts[i]
        if (Math.hypot(
            ghost.position.x - player.position.x, ghost.position.y - player.position.y) < ghost.radius + player.radius
            //detecção do fantasma batendo no jogador
        ){

            if (ghost.scared) {
                ghosts.splice(i, 1)

            } else{
                cancelAnimationFrame(animationId)
                //para a animação
                console.log('you lose') 
            }
        }
    }

    if (pellets.length === 0) {
    //condições para ganhar
    console.log('you win')
    cancelAnimationFrame(animationId)    
    }

    for (let i = powerUps.length - 1; 0 <= i; i-- ) {
        //parte de toque do PowerUp
        const powerUP = powerUps[i]
        powerUP.draw()

        //jogador colide com o powerUp
        if (Math.hypot(
            powerUP.position.x - player.position.x, powerUP.position.y - player.position.y) < powerUP.radius + player.radius
        ){
            powerUps.splice(i, 1)
            //remove os powerUps do mapa

            //condição do fantasma
            ghosts.forEach(ghost => {
                ghost.scared = true
                //assustado
                setTimeout(() => {ghost.scared = false
                //normal
                }, 5000)
            })
        }
    }
    
    for (let i = pellets.length - 1; 0 <= i; i-- ) {
        //parte de toque dos pellets
        
        /*
         feito dessa forma impede que a tela pisque quando um pellet é removido :)
         */
        const pellet = pellets[i]
        pellet.draw()

        if (Math.hypot(
            pellet.position.x - player.position.x, pellet.position.y - player.position.y) < pellet.radius + player.radius
        ){
            pellets.splice(i, 1)
            //remove os pellets do mapa
            
            score += 10
            scoreEL.innerHTML = score
            //atualiza o score, adicionando 10
        }
    }
   
  
    

    boundaries.forEach((boundary) => {
        boundary.draw()

        if (circleCollideWithRectangle({
            circle: player,
            rectangle: boundary
        })) {
            player.velocity.x = 0
            player.velocity.y = 0
        }
    })
    player.update()

    ghosts.forEach((ghost) => {
        ghost.update()
        //atualiza a posição do fantasma


       
      
      const collisions = []
      boundaries.forEach(boundary => {
        //detecção de colisão
        
        
        if (
            !collisions.includes('right') &&
            circleCollideWithRectangle({
            //detecção para direita
            circle: {...ghost, velocity: {
                x: 5,
                y: 0
            }},
            rectangle: boundary
        })
        ) {
            collisions.push('right')
        }

        if (
            !collisions.includes('left') &&
            circleCollideWithRectangle({
            //detecção para esquerda
            circle: {...ghost, velocity: {
                x: -5,
                y: 0
            }},
            rectangle: boundary
        })
        ) {
            collisions.push('left')
        }

        if (
            !collisions.includes('up') &&
            circleCollideWithRectangle({
            //detecção para cima
            circle: {...ghost, velocity: {
                x: 0,
                y: -ghost.speed
            }},
            rectangle: boundary
        })
        ) {
            collisions.push('up')
        }
        if (
            !collisions.includes('down') &&
            circleCollideWithRectangle({
            //detecção para baixo
            circle: {...ghost, velocity: {
                x: 0,
                y: ghost.speed
            }},
            rectangle: boundary
        })
        ) {
            collisions.push('down')
        }

      })
      //começo da tomada de decisões
      if (collisions.length > ghost.prevCollisions.length)
        ghost.prevCollisions = collisions

      if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)){
        
     
        //bloco de testagem de caminho (pathway)
        if (ghost.velocity.x > 0) ghost.prevCollisions.push('right')
        else if (ghost.velocity.x < 0) ghost.prevCollisions.push('left')
        else if (ghost.velocity.y < 0) ghost.prevCollisions.push('up')
        else if (ghost.velocity.y > 0) ghost.prevCollisions.push('down')

        //bloco de decisão com base na testagem de caminho
        const pathways = ghost.prevCollisions.filter((collision) => {
            return !collisions.includes(collision)
        })
        
        const direction = pathways[Math.floor(Math.random() * pathways.length)]
       

        
        switch (direction) {
            //movimentação conforme a decisão
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
        
        ghost.prevCollisions = []
        //para resetar a prevCollisions
      }
     
    })

    if (player.velocity.x > 0) player.rotation = 0
     else if (player.velocity.x < 0) player.rotation = Math.PI
     else if (player.velocity.y > 0) player.rotation = Math.PI /2
     else if (player.velocity.y < 0) player.rotation = Math.PI * 1.5
}//final da animação

animate()




