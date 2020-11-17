let canvas = document.querySelector("canvas")
let ctx = canvas.getContext("2d")
console.log(canvas);

canvas.height = window.innerHeight
canvas.width = window.innerWidth;

let cellsAmountInRow = 50;
let cellWidth = 20

class Game{
   constructor(cellInRow,cellWidth,fieldStartPointX = 0,fieldStartPointY=0){
      this.cellsInRow = cellInRow
      this.cellWidth = cellWidth
      this.fieldStartPointX = fieldStartPointX
      this.fieldStartPointY = fieldStartPointY
      this.isPlaying = true
      this.field =  this.getFieldMap()
      this.edgeIndexes = this.fillEdgeIndexes()
   }
   getFieldMap(){
      let end = this.cellsInRow*this.cellsInRow
      return Array(end).fill(0,0,end)
   }
   fillEdgeIndexes(){
      let resultArray = [0];
      for(let i = 1;i < this.cellsInRow;i++){
         resultArray.push(i);
         resultArray.push(this.field.length-i);
      }
      for(let i = this.cellsInRow-1;i<this.field.length;i=i+this.cellsInRow ){
         resultArray.push(i);
         resultArray.push(this.field.length-i-1);
      }
      return Array.from(new Set(resultArray.sort((a,b)=>a-b)))
   }
   killOrBorn(field=this.field){
      let tempField = this.getFieldMap()
      let cellShift = this.cellsInRow
      field.forEach((element,index)=>{
         if(this.edgeIndexes.includes(index)){return}
         let sumCheckLeftRight =  field[index-1]+field[index+1]
         let sumCheckHigh = field[index-(cellShift-1)]+field[index-cellShift]+field[index-(cellShift+1)]
         let sumCheckLow = field[index+(cellShift-1)]+field[index+cellShift]+field[index+(cellShift+1)]
         let mainSum = sumCheckLeftRight + sumCheckHigh + sumCheckLow

         if (element===0&&mainSum===3){
            tempField[index] = 1
         }else if (element===1&&(mainSum===3||mainSum===2)) {
            tempField[index] = 1
         }else{
            tempField[index] = 0
         }
      })
      this.field = tempField
   }
   getGrid(){
      //vertical lines
      for(let i = 0;i<=this.cellsInRow;i++){
         let x = this.fieldStartPointX + this.cellWidth * i
         ctx.beginPath()
         ctx.strokeStyle = "#a8a8a8"
         ctx.lineWidth = 1;
         ctx.moveTo(x,this.fieldStartPointY )
         ctx.lineTo(x,this.fieldStartPointY + this.cellWidth*this.cellsInRow)
         ctx.stroke()
      }
      //horizontal lines
      for(let i = 0;i<=this.cellsInRow;i++){
         let y = this.fieldStartPointY + this.cellWidth*i
         ctx.beginPath()
         ctx.strokeStyle = "#a8a8a8"
         ctx.lineWidth = 1;
         ctx.moveTo(this.fieldStartPointX, y)
         ctx.lineTo(this.fieldStartPointX + this.cellWidth *this.cellsInRow, y)
         ctx.stroke()
      }
   }
   render(){
      this.field.forEach((value,index)=>{
         let color = "red"
         if(value===1){color = "black"}
         if(value===0){color = "white"}

         let base = Math.floor(index/this.cellsInRow)
         let y = this.fieldStartPointY +base*cellWidth
         let x = this.fieldStartPointX  + (index - base*this.cellsInRow)*this.cellWidth
         ctx.beginPath()
         ctx.fillStyle = color
         ctx.fillRect(x,y,this.cellWidth, this.cellWidth )
         // ctx.strokeText(`${index}`,x+this.cellWidth/2,y+this.cellWidth/2,this.cellWidth )
      })
      this.getGrid()
   }
}
let game = new Game(cellsAmountInRow,cellWidth)
console.log(game.field);

game.field[125] = 1
game.field[126] = 1
game.field[127] = 1

// for (let i = 0;i<game.field.length;i++){
//    game.field[Math.floor(Math.random()*game.field.length)] = 1
// }

document.querySelector("html").addEventListener("click",(event)=>{
   let x= Math.floor(event.x/game.cellWidth)
   let y= Math.floor(event.y/game.cellWidth)
   let pos = y * game.cellsInRow + x
   console.log(`column is ${x}`);
   console.log(`row is ${y}`);
   console.log(`pos is ${pos}`);

   if (game.field[pos]){
      game.field[pos] = 0
   }else{
      game.field[pos] = 1
   }
   game.render()
})
document.querySelector("html").addEventListener("keypress",(event)=>{
   console.log(event);
   if(event.code==="Space"){
      game.isPlaying = !game.isPlaying
      console.log("changed");
   }
})

game.render()

setInterval(()=>{
   if (game.isPlaying){
      game.killOrBorn()
      game.render()
   }
},500)



