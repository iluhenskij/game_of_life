let canvas = document.querySelector("canvas")
let c = canvas.getContext("2d")
console.log(canvas);
canvas.height = window.innerHeight
canvas.width = window.innerWidth


let mouseData = {
   needToHandle:false,
   x:undefined,
   y:undefined
}
canvas.addEventListener("mousemove",(event)=>{
   // console.log(event);
   mouseData.needToHandle = true
   mouseData.x=event.x
   mouseData.y=event.y
   console.log(mouseData)
})
window.addEventListener("resize",()=>{
   canvas.height = window.innerHeight
   canvas.width = window.innerWidth
})
/*function getCircles(radius) {
   setInterval(() => {
      c.beginPath()
      c.strokeStyle = getColor()
      c.arc(getCoordinateX(), getCoordinateY(), radius, 0, Math.PI * 2, false)
      c.stroke()
   }, 1)
}
function getLines() {
   setInterval(() => {
      c.beginPath()
      c.moveTo(getCoordinateX(), getCoordinateY())

      c.strokeStyle = getColor()

      c.lineTo(getCoordinateX(), getCoordinateY())

      c.stroke()
   }, 100)
}
function getRects() {
   setInterval(() => {
      c.beginPath()
      c.fillStyle = getColor()
      let side = /!*Math.random()**!/50
      c.fillRect(getCoordinateX(), getCoordinateX(), side, side)
   }, 50)
}*/

function getColor() {
   return `#${Math.floor(Math.random() * 16777216).toString(16)}`
}

function getCoordinateX(radius) {
   let coordinate = Math.floor(Math.random() * (canvas.width - radius * 3) + radius * 2)

   //if (coordinate<radius*3) {
   //   coordinate = radius*3
   //}
   //if (coordinate>canvas.width-radius*2) {
   //   coordinate = coordinate - radius * 3
   //}
   return coordinate
}

function getCoordinateY(radius) {
   let coordinate = Math.floor(Math.random() * (canvas.height - radius * 3) + radius * 2)
   //if (coordinate<(radius*3)) {
   //   coordinate = radius*3+1
   //}
   //if (coordinate>canvas.height-radius*3) {
   //   coordinate = coordinate - radius * 3
   //}
   return coordinate
}

function getSpeed(speedIndex = 3) {
   let speed = Math.floor((Math.random() + 1) * speedIndex)
   return Math.random() > 0.5 ? speed : -speed;
}

function getRadius(radiusIndex = 30) {
   return Math.floor(Math.random() * radiusIndex)
}

class Circle {
   constructor(radius = getRadius(70),
               x = getCoordinateX(radius),
               y = getCoordinateY(radius),
               color = getColor(),
               speedX = getSpeed(2),
               speedY = getSpeed(2)) {
      this.radius = radius;
      this.x = x;
      this.y = y;
      this.color = color;
      this.speedX = speedX;
      this.speedY = speedY;
      this.originalRadius = this.radius
   }
/*
   cursorFollow() {
      let coordinateDifX = mouseData.x-this.x
      if(Math.abs(coordinateDifX)<=50){
         this.speedX = coordinateDifX/5
      }
      let coordinateDifY = mouseData.y-this.y
      if(Math.abs(coordinateDifY)<=20){
         this.speedY = coordinateDifY/5
      }

   }
*/
   update() {
      this.x += this.speedX
      this.y += this.speedY
      if (this.x > (canvas.width - this.radius) || this.x < (0 + this.radius)) {
         this.speedX = -this.speedX
      }
      if (this.y > (canvas.height - this.radius) || this.y < (0 + this.radius)) {
         this.speedY = -this.speedY
      }

   }
   hoverEffect(touchIndex = 2,radiusChangeIndex = 2 ,growMaxIndex = 3){
      let spaceBetweenX = Math.abs(mouseData.x - this.x )
      let spaceBetweenY = Math.abs(mouseData.y - this.y )
      if (spaceBetweenX <= this.radius*touchIndex
          && spaceBetweenY <= this.radius*touchIndex
          && this.radius<this.originalRadius*growMaxIndex) {
         this.radius += radiusChangeIndex
      }
      else if (this.radius > this.originalRadius) {
         this.radius -=radiusChangeIndex
      }
   }
   render() {
      c.beginPath()
      c.strokeStyle = this.color
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      c.fillStyle = this.color;
      c.fill()
      c.stroke()
   }
}

let arrayCircles = []
for (let i = 0; i < 100; i++) {
   arrayCircles.push(new Circle())
}

// arrayCircles.push(new Circle(50,200,100,undefined,0,10))
console.log(arrayCircles);

function animate() {
   requestAnimationFrame(animate)
   c.clearRect(0, 0, canvas.width, canvas.height)
   c.fillStyle = "#151d34";
   c.fillRect(0, 0, canvas.width, canvas.height);
   arrayCircles.forEach((element) => {
      element.update()
      element.hoverEffect(2,2,3)

      element.render()
   })
   mouseData.needToHandle = false

   /*for(let i = 0;i<arrayCircles.length;i++){
      c.beginPath()
      c.strokeStyle = arrayCircles[i].color
      c.arc(arrayCircles[i].x,arrayCircles[i].y,arrayCircles[i].radius, 0, Math.PI*2);
      c.stroke()
   }*/
}

animate()
