var DEAD_CELL = 0;
var LIVE_CELL = 1;

function Board(size) {
    this.width = size;
    this.height = size;

    this.reset();
}

Board.prototype.reset = function() {
    this.rows = [];
    for ( var i = 0; i < this.height; i++ ) {
        this.addRow();
    }
}

Board.prototype.initialize = function( cells ) {
    for ( var i = 0; i < cells.length; i ++ ) {
        this.createCell( cells[i].x, cells[i].y );
    }
    this.render();
}

Board.prototype.addRow = function() {
    var row = [];
    for ( var i = 0; i < this.width; i++ ) {
        row.push(DEAD_CELL);
    }
    this.rows.push(row);
}

Board.prototype.isPositionValid = function( x, y ) {
    return ( x >= 0 && y >= 0 && x < this.width && y < this.height );
}

Board.prototype.isCellAlive = function( x, y ) {
    return this.isPositionValid( x, y ) && this.rows[y][x] === LIVE_CELL;
}

Board.prototype.createCell = function( x, y ) {
    this.rows[y][x] = LIVE_CELL;
}

Board.prototype.killCell = function( x, y ) {
    this.rows[y][x] = DEAD_CELL;
}

Board.prototype.getCellNeighboursCount = function ( x, y ) {

    var neighbours = 0;

    if ( this.isCellAlive( x - 1, y - 1  ) ) neighbours ++;
    if ( this.isCellAlive( x, y - 1 ) ) neighbours ++;
    if ( this.isCellAlive( x + 1, y - 1 ) ) neighbours ++;

    if ( this.isCellAlive( x - 1, y ) ) neighbours ++;
    if ( this.isCellAlive( x + 1, y ) ) neighbours ++;

    if ( this.isCellAlive( x - 1, y + 1 ) ) neighbours ++;
    if ( this.isCellAlive( x, y + 1 ) ) neighbours ++;
    if ( this.isCellAlive( x + 1, y + 1 ) ) neighbours ++;

    return neighbours;
}

Board.prototype.evolve = function () {
   var self = this;
   var birthsAndDeaths = [];

    self.rows.forEach( function( row, y, array ) {
        row.forEach( function( cell, x, array) {
            var neighbours = self.getCellNeighboursCount( x, y );
            if ( ( neighbours < 2 || neighbours > 3 ) && self.isCellAlive( x, y ) ) {
                birthsAndDeaths.push({ x: x, y: y, state: DEAD_CELL});
            } else if ( neighbours === 3 && !self.isCellAlive( x, y ) ) {
                birthsAndDeaths.push({ x: x, y: y, state: LIVE_CELL});
            }
        });
    });

    birthsAndDeaths.forEach( function( element ) {
        if ( element.state === DEAD_CELL ) self.killCell( element.x, element.y );
        else self.createCell( element.x, element.y );
    });
}

Board.prototype.render = function( container ) {
    var self = this;

    var boardDiv = document.createElement('div');
    var rowDiv = null;
    var cellDiv = null;

    container = container || 'container';

    self.rows.forEach(function( row, y ) {
        rowDiv = document.createElement('div');
        rowDiv.className = 'row';

        row.forEach(function( cell, x ) {
            cellDiv = document.createElement('div');
            cellDiv.className = 'cell ' + (self.isCellAlive( x, y ) ? 'live' : 'dead');
            rowDiv.appendChild(cellDiv);
        });

        boardDiv.appendChild(rowDiv);
    });
    boardDiv.className = 'board';
    document.getElementsByClassName(container)[0].innerHTML = boardDiv.outerHTML;
}

Board.prototype.getCoordinates = function( container ) {
    container = container || 'container';

    var rows = document.getElementsByClassName('row');
    var cells = null;
    var hasClass = false;
    var result = [];

    for ( var y = 0; y < rows.length; y++ ) {
        cells = rows[y].children;
        for ( var x = 0; x < cells.length; x++ ) {
            if (cells[x].classList) {
                hasClass = cells[x].classList.contains('live');
            } else {
                hasClass = new RegExp('(^| )live( |$)', 'gi').test(cells[x].className);
            }
            if ( hasClass ) {
                result.push( { x: x, y: y });
                hasClass = false;
            }
        }
    }

    return result;
}