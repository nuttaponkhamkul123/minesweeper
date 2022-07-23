let bombTotal = 5;
let bomb = ["A", "B"];
let table = document.getElementsByClassName("table");
let revealedList = [];
let bombFound = 0;
let totalBombGlobal = 0;
document.getElementById("bombtotal").innerHTML = bombTotal;

function bombGenerate(totalBomb , gridSize) {
  const bombPos = [];
  for (let bombIndex = 0; bombIndex < totalBomb; bombIndex++) {
    const xPos = Math.round(Math.random() * (gridSize - 1));
    const yPos = Math.round(Math.random() * (gridSize - 1));
    bombPos.push({ xPos, yPos });
  }
  console.log('bombPos' , bombPos)
  return bombPos;
}
function flagBomb(x, y) {
  if (!generatedGrid[x][y].component.style.backgroundColor) {
    
    if(generatedGrid[x][y].isBomb){
      bombFound += 1;
      // generatedGrid[x][y].isReveal =true;
      if(bombFound >= totalBombGlobal) {
        
        alert('You win!!');
        revealAll();
      }
    }
    generatedGrid[x][y].component.style.backgroundColor = "black";
  } else {
    if (!generatedGrid[x][y].isReveal) {
      generatedGrid[x][y].component.style.backgroundColor = null;
    }
  }
}

function generateGrid(gridSize, bombPercent) {
  const gridTotal = Math.pow(gridSize, 2);
  const totalBomb = (bombPercent / 100) * gridTotal
  console.log('totalBomb ' , totalBomb)
  totalBombGlobal = totalBomb;
  const gridTable = [];
  const bombPos = bombGenerate(totalBomb , gridSize);
  console.log('bombPos' , bombPos.length)
  for (let row = 0; row < gridSize; row++) {
    const rowItem = [];
    for (let column = 0; column < gridSize; column++) {
      const isBombPosition =
        bombPos.findIndex(
          (bombPos) => bombPos.xPos === row && bombPos.yPos === column
        ) > -1;
      const gridPosition = {
        x: row,
        y: column,
        isBomb: isBombPosition,
        nearByBombCounter: 0,
      };
      rowItem.push(gridPosition);
    }
    gridTable.push(rowItem);
  }

  return gridTable;
}
function tableIterate(gridTable) {
  console.log("tableIterate");
  for (let row = 0; row < gridTable.length; row++) {
    for (let column = 0; column < gridTable.length; column++) {
      surroundingCheck(row, column, gridTable);
    }
  }
}
function adjacentNoBombCheck(x, y) {
  for (let row = x - 1; row <= x + 1; row++) {
    for (let column = y - 1; column <= y + 1; column++) {
      if (
        column >= 0 &&
        column < generatedGrid.length &&
        row >= 0 &&
        row < generatedGrid.length
      ) {
        if (column !== y || row !== x) {
          if (row === x || column === y) {
            if (
              !generatedGrid[row][column].isBomb &&
              generatedGrid[row][column].nearByBombCounter === 0 &&
              !generatedGrid[row][column].isReveal
            ) {
                
                generatedGrid[row][column].isReveal = true;
                revealedList.push(generatedGrid[row][column])
              expand(row, column);
            } else {
              if (
                generatedGrid[row][column].nearByBombCounter > 0 &&
                !generatedGrid[row][column].isReveal
              ) {
                
                generatedGrid[row][column].isReveal = true;
                revealedList.push(generatedGrid[row][column])
                reveal(row, column);
              }
            }
          } else {
            if (
              !generatedGrid[row][column].isBomb &&
              !generatedGrid[row][column].isReveal
            ) {
              if (generatedGrid[row][column].nearByBombCounter > 0) {
                
                generatedGrid[row][column].isReveal = true;
              
                reveal(row, column);
              }
            }
          }
        }
      }
    }
  }
}
function surroundingCheck(x, y, gridTable) {
  for (let row = x - 1; row <= x + 1; row++) {
    for (let column = y - 1; column <= y + 1; column++) {
      if (
        column >= 0 &&
        column < gridTable.length &&
        row >= 0 &&
        row < gridTable.length
      ) {
        if (column !== y || row !== x) {
          if (gridTable[row][column].isBomb) {
            gridTable[x][y].nearByBombCounter++;
          }
        }
      }
    }
  }
}
function revealAll() {
  for (let row = 0; row < generatedGrid.length; row++) {
    for (let column = 0; column < generatedGrid.length; column++) {
      const currentComponent = generatedGrid[row][column];
      if (currentComponent.isBomb  && !currentComponent.isReveal) {
        currentComponent.component.style.backgroundColor = "violet";
      } else if (currentComponent.nearByBombCounter === 0) {
        expand(row, column);
      } else {
        reveal(row, column);
      }
    }
  }
}
function click(x, y) {
  const currentPos = generatedGrid[x][y];

  if (currentPos.isBomb) {
    revealAll();
    alert("Game Over");
  } else {
    if (currentPos.nearByBombCounter === 0) {
      expand(x, y);
    } else {
      reveal(x, y);
    }
  }
}
function reveal(x, y) {
  const component = generatedGrid[x][y].component;
  showNumber(x,y)
  component.style.backgroundColor =
    component.nearByBombCounter === 0 ? "green" : "yellow";
}
function showNumber(x,y) {
  const revealNumber = generatedGrid[x][y].component.querySelector('h2');
  revealNumber.style.display = 'block';
}
function expand(x, y) {
  const component = generatedGrid[x][y].component;
  component.style.backgroundColor = "green";
  showNumber(x,y)
  adjacentNoBombCheck(x, y);
}
function draw(generatedGrid) {
  const tableDiv = document.getElementById("table");
  tableDiv.style.gridTemplateColumns = `repeat(${generatedGrid[0].length} , 80px)`;
  tableDiv.style.gridTemplateRows = `repeat(${generatedGrid[0].length} , 80px)`;
  // grid-template-columns: repeat(5,50px);
  // grid-template-rows: repeat(5,50px);
  console.log("tableDiv ", tableDiv);
  for (let gridRow = 0; gridRow < generatedGrid[0].length; gridRow++) {
    for (
      let gridColumn = 0;
      gridColumn < generatedGrid[0].length;
      gridColumn++
    ) {
      console.log(
        "generating ... ",
        `INDEX [${gridRow} , ${gridColumn}]`,
        generatedGrid[gridRow][gridColumn]
      );
      const currentGrid = generatedGrid[gridRow][gridColumn];
      const component = document.createElement("div");
      const bombCounter = document.createElement("h2");
      component.classList.add("block");
      bombCounter.style.display = 'none';
      bombCounter.innerHTML = currentGrid.nearByBombCounter;
      // component.innerHTML = `[${gridRow} , ${gridColumn}] \n
      //        ${currentGrid.isBomb} \n`;
      if (!currentGrid.isBomb) {
        component.appendChild(bombCounter);
      }
      const { x, y } = currentGrid;
      currentGrid.component = component;
    
     
      
      component.addEventListener("click", () => {
        console.log("componentcomponent ", component);
        click(x, y);
      });
      component.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        flagBomb(x, y);
      });
      tableDiv.appendChild(component);
    }
  }
}
let totalBomba = 5;
const generatedGrid = generateGrid(10, 5);

tableIterate(generatedGrid);
draw(generatedGrid);
