let canvas = document.querySelector("canvas")
let ctx = canvas.getContext("2d")
console.log(canvas);

canvas.height = window.innerHeight
canvas.width = window.innerWidth;

let cellsAmountInRow =    Number(document.querySelector("#mapWidth").value);
let cellsAmountInColumn = Number(document.querySelector("#mapHeight").value);

console.log(document.querySelector("#mapWidth").value)
console.log(document.querySelector("#mapWidth").value)

let cellWidth = 20



class Game{
   constructor(cellInRow, cellsInColumn, cellWidth,fieldStartPointX = 0,fieldStartPointY=0){
      this.cellsInRow = cellInRow
      this.cellsInColumn = cellsInColumn

      this.cellWidth = cellWidth
      this.fieldStartPointX = fieldStartPointX
      this.fieldStartPointY = fieldStartPointY
      this.isPlaying = true
      this.field =  this.getFieldMap()
      this.edgeIndexes = this.fillEdgeIndexes()
   }
   getFieldMap(){
      let end = this.cellsInRow*this.cellsInColumn
      return Array(end).fill(0,0,end)
   }
   fillEdgeIndexes(){
      let resultArray = [0];
      //индексы верхних и нижних ячеек граней поля
      for(let i = 1;i < this.cellsInRow;i++){
         resultArray.push(i);
         resultArray.push(this.field.length-i);
      }
      //индексы левых и правых ячеек граней поля
      for(let i = this.cellsInColumn-1;i<this.field.length;i=i+this.cellsInColumn ){
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
         ctx.lineTo(x,this.fieldStartPointY + this.cellWidth * this.cellsInColumn)
         ctx.stroke()
      }
      //horizontal lines
      for(let i = 0;i<=this.cellsInColumn;i++){
         let y = this.fieldStartPointY + this.cellWidth*i
         ctx.beginPath()
         ctx.strokeStyle = "#a8a8a8"
         ctx.lineWidth = 1;
         ctx.moveTo(this.fieldStartPointX, y)
         ctx.lineTo(this.fieldStartPointX + this.cellWidth * this.cellsInRow, y)
         ctx.stroke()
      }
   }
   render(){
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.field.forEach((value,index)=>{
         //определение цвета ячейки
         let color = "red"
         if(value===1){color = "black"}
         if(value===0){color = "white"}

         //определение координат
         let base = Math.floor(index/this.cellsInRow)

         let y = this.fieldStartPointY + base * cellWidth
         let x = this.fieldStartPointX + (index - base * this.cellsInRow) * this.cellWidth

         //отрисовка ячеек
         ctx.beginPath()
         ctx.fillStyle = color
         ctx.fillRect(x,y,this.cellWidth, this.cellWidth )

         //отрисовка индексов ячеек для проверки
         //ctx.strokeText(`${index}`,x+this.cellWidth/2,y+this.cellWidth/2,this.cellWidth )
      })
      this.getGrid()
   }
   renderInConsole(){
     let resultToLog = "";
      let rowCheck = 0;
      this.field.forEach((value,index)=>{
         let color = "╳╳"
         if(value===1){color = "██"}
         if(value===0){color = "░░"}

         resultToLog+=color;
         rowCheck++;

         if (rowCheck === this.cellsInRow){
            resultToLog += "\n"
            rowCheck = 0
         }
      })
      console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n")
      console.log(resultToLog)
   }
}
let game = new Game(Number(document.querySelector("#mapWidth").value),Number(document.querySelector("#mapHeight").value),cellWidth)
console.log(game.field);

game.field[125] = 1
game.field[126] = 1
game.field[127] = 1


game.render()
game.renderInConsole()

let rendreId = setInterval(()=>{
   if (game.isPlaying){
      game.killOrBorn()
      game.render()
      game.renderInConsole()
   }
},500)


document.querySelector("html").addEventListener("click",(event)=>{
   let x = Math.floor(event.x/game.cellWidth)
   let y = Math.floor(event.y/game.cellWidth)
   let pos = y * game.cellsInRow + x
   //console.log(`column is ${x}`);
   //console.log(`row is ${y}`);
   //console.log(`pos is ${pos}`);

   if (game.field[pos]){
      game.field[pos] = 0
   }else{
      game.field[pos] = 1
   }
   game.render()
   game.renderInConsole()
})
document.querySelector(".btn_pause").addEventListener("click",(event)=>{

      game.isPlaying = !game.isPlaying
      // console.log("changed");
})
document.querySelector(".btn_rand").addEventListener("click",(event)=>{
   console.log(event);
   // console.log("changed");
   for (let i = 0;i<game.field.length;i++){
         game.field[Math.floor(Math.random()*game.field.length)] = 1
      }
   game.render()
})

document.querySelector("#mapWidth").addEventListener("change",(event)=>{
   console.log(event);
   game = new Game(Number(document.querySelector("#mapWidth").value),Number(document.querySelector("#mapHeight").value),cellWidth)
   clearInterval(rendreId)
   rendreId = setInterval(()=>{
      if (game.isPlaying){
         game.killOrBorn()
         game.render()
         game.renderInConsole()
      }
   },500)
})
document.querySelector("#mapHeight").addEventListener("change",(event)=>{
   console.log(event);
   clearInterval(rendreId)
   game = new Game(Number(document.querySelector("#mapWidth").value),Number(document.querySelector("#mapHeight").value),cellWidth)
   rendreId = setInterval(()=>{
      if (game.isPlaying){
         game.killOrBorn()
         game.render()
         game.renderInConsole()
      }
   },500)
})


window.addEventListener("resize",()=>{
   canvas.height = window.innerHeight
   canvas.width = window.innerWidth
})



