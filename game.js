
$( document ).ready(function() {

    function createGrid(dimension) {
      gameGrid = {}
      for(let row = 0; row < dimension; row++) {
        gameGrid[row] = []
        for(let col = 0; col < dimension; col++) {
          gameGrid[row].push('-')
        }
      }
      return gameGrid
    }

    function findNeighbors(grid, row, cell) {
      left = cell -1
      right = cell +1
      up = row -1
      down = row +1
      neighbors = []
      if (cell > 0 && row > 0) {
        neighbors.push(
          up + ',' + left
        )
      }
      if (cell > 0) {
        neighbors.push(
          row + ',' + left
        )
      }
      if (row > 0) {
        neighbors.push(
          up + ',' + cell
        )
      }
      if (row < (dimension - 1) && cell < (dimension - 1)) {
          neighbors.push(
            down + ',' + right
          )
      }
      if (row < (dimension - 1)) {
        neighbors.push(
          down + ',' + cell
        )
      }
      if (cell < (dimension - 1)) {
        neighbors.push(
          row + ',' + right
        )
      }
      if (row > 0 && cell < (dimension - 1)) {
          neighbors.push(
            up + ',' + right
          )
      }
      if (cell > 0 && row < (dimension - 1)) {
          neighbors.push(
            down + ',' + left
          )
      }
      return neighbors
    }

    function checkNeighborhood(neighbors, life, cell) {
      lifeCount = 0

      for (let i = 0; i < neighbors.length; i++) {
        if ( life.includes(neighbors[i]) ) {
          lifeCount++
        }
      }

      if (lifeCount < 2 && cell == 'x') {
        // 1) Any live cell with fewer than two live neighbors dies, as if caused by underpopulation.
        return "-"
      } else if (lifeCount > 3 && cell == 'x') {
        // 2) Any live cell with more than three live neighbors dies, as if by overcrowding.
        return '-'
      } else if (cell == '-' && lifeCount == 3) {
        // 4) Any dead cell with exactly three live neighbors becomes a live cell.
        return 'x'
      } else if (cell == 'x' && (lifeCount < 3 || lifeCount > 2)) {
        // 3) Any live cell with two or three live neighbors lives on to the next generation.
        return "x"
      }
    }


    function renderGrid(grid, life) {
      $('div').empty()
      $.each( grid, function(row, columns) {
        $('.game').append(`<div id=#${row}></div>`)
        for(let cell = 0; cell < columns.length; cell++) {
          // debugger
          if ( life.includes(row + "," + cell) ) {
            this[cell] = "x"
            $('div')[row].append("[x]")
          } else {
            this[cell] = "-"
            $('div')[row].append("[-]")
          }
        }
      })
    }

    function updatingLife(grid, life) {
      // takes an array of previously alive cells and returns an array of the future living cells
      let futureCells = []
      $.each( grid, function(row, columns) {
        for(let cell = 0; cell < columns.length; cell++) {
          neighbors = findNeighbors(grid, parseInt(row), cell)
          lifeStatus = checkNeighborhood(neighbors, life, grid[row][cell])
          if (lifeStatus == "x") {
            futureCells.push(row + ',' + cell)
          }
        }
      });
      return futureCells
    }

    function checkLife(grid) {
      // debugger
      let currentlyAlive = []
      $.each( grid, function(row, columns) {
        for(let i = 0; i < columns.length; i++) {
          // debugger
          if (columns[i] == 'x') {
            currentlyAlive.push(row + ',' + i)
          }
        }
      })
      return currentlyAlive;
    }

    startPosition = [
      "28,28",
      "28,29",
      "28,30",
      "27,30",
      "26,29"
    ]


    dimension = 60
    let griddle = createGrid(dimension)
    renderGrid(griddle, startPosition)

    // do this on refresh
    let currentLife = updatingLife(griddle, startPosition)

    setInterval( function(){
      life = updatingLife(griddle, checkLife(griddle))
      renderGrid(griddle, life)
    }, 300)
});
