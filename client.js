function startTetris() {
    document.getElementById("selectionButtons").style.display = "none"

    const pieces = ["Z", "L", "O", "S", "I", "J", "T"];
    const colors = [
        "#000000",
        "#555555",
        "#FF0100",
        "#FEAA00",
        "#FFFE02",
        "#00EA01",
        "#00DDFF",
        "#0000FF",
        "#AA00FE",
    ];
    const piece_matrix = {
        Z: [
            [2, 2, 0],
            [0, 2, 2],
            [0, 0, 0],
        ],
        L: [
            [0, 0, 3],
            [3, 3, 3],
            [0, 0, 0],
        ],
        O: [
            [4, 4],
            [4, 4]
        ],
        S: [
            [0, 5, 5],
            [5, 5, 0],
            [0, 0, 0],
        ],
        I: [
            [0, 0, 0, 0],
            [6, 6, 6, 6],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
        J: [
            [7, 0, 0],
            [7, 7, 7],
            [0, 0, 0],
        ],
        T: [
            [9, 8, 9],
            [8, 8, 8],
            [0, 0, 0],
        ],
        null: [[0]],
    };

    const wallkicks = {
        "0-1": [
            [0, 0],
            [-1, 0],
            [-1, -1],
            [0, 2],
            [-1, 2],
        ], //special
        "1-0": [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, -2],
            [1, -2],
        ],
        "1-2": [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, -2],
            [1, -2],
        ],
        "2-1": [
            [0, 0],
            [-1, 0],
            [-1, -1],
            [0, 2],
            [-1, 2],
        ],
        "2-3": [
            [0, 0],
            [1, 0],
            [1, -1],
            [0, 2],
            [1, 2],
        ], //special
        "3-2": [
            [0, 0],
            [-1, 0],
            [-1, 1],
            [0, -2],
            [-1, -2],
        ],
        "3-0": [
            [0, 0],
            [-1, 0],
            [-1, 1],
            [0, -2],
            [-1, -2],
        ],
        "0-3": [
            [0, 0],
            [1, 0],
            [1, -1],
            [0, 2],
            [1, 2],
        ],
    };

    const i_wallkicks = {
        "0-1": [
            [0, 0],
            [-2, 0],
            [1, 0],
            [-2, 1],
            [1, -2],
        ],
        "1-0": [
            [0, 0],
            [2, 0],
            [-1, 0],
            [2, -1],
            [-1, 2],
        ],
        "1-2": [
            [0, 0],
            [-1, 0],
            [2, 0],
            [-1, -2],
            [2, 1],
        ],
        "2-1": [
            [0, 0],
            [1, 0],
            [-2, 0],
            [1, 2],
            [-2, -1],
        ],
        "2-3": [
            [0, 0],
            [2, 0],
            [-1, 0],
            [2, -1],
            [-1, 2],
        ],
        "3-2": [
            [0, 0],
            [-2, 0],
            [1, 0],
            [-2, 1],
            [1, -2],
        ],
        "3-0": [
            [0, 0],
            [1, 0],
            [-2, 0],
            [1, 2],
            [-2, -1],
        ],
        "0-3": [
            [0, 0],
            [-1, 0],
            [2, 0],
            [-1, -2],
            [2, 1],
        ],
        "0-2": [
            [0, 0],
            [-1, 0],
            [-2, 0],
            [1, 0],
            [2, 0],
            [0, 1],
        ], // 0>>2─ ┐
        "1-3": [
            [0, 0],
            [0, 1],
            [0, 2],
            [0, -1],
            [0, -2],
            [-1, 0],
        ], // 1>>3─ ┼ ┐
        "2-0": [
            [0, 0],
            [1, 0],
            [2, 0],
            [-1, 0],
            [-2, 0],
            [0, -1],
        ], // 2>>0─ ┘ │
        "3-1": [
            [0, 0],
            [0, 1],
            [0, 2],
            [0, -1],
            [0, -2],
            [1, 0],
        ], // 3>>1─ ─ ┘
    };

    const empty_line = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    const combo_table = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 6];
    var board
    var piece
    var held
    var queue
    var rotation
    var pieceX
    var pieceY
    var lastMoveRotate;
    var boardCanvas = document.getElementById("board");
    var boardWidth = boardCanvas.width;
    var boardHeight = boardCanvas.height;
    var boardContext = boardCanvas.getContext("2d")
    var holdCanvas = document.getElementById("hold");
    var holdWidth = holdCanvas.width;
    var holdHeight = holdCanvas.height;
    var holdContext = holdCanvas.getContext("2d")
    var queueCanvas = document.getElementById("queue");
    var queueWidth = queueCanvas.width;
    var queueHeight = queueCanvas.height;
    var queueContext = queueCanvas.getContext("2d")
    var controls = {"move_left":[37,"ArrowLeft"],"move_right":[39,"ArrowRight"],"rotate_left":[65,"a"],"rotate_right":[38,"ArrowUp"],"rotate_180":[16,"Shift"],"softdrop":[40,"ArrowDown"],"harddrop":[32,"Spacebar"],"hold":[68,"d"],"restart":[82,"r"], "DAS": 67, "ARR": 10, "grav_ARR":0}
    var b2b
    var combo;


    function init() {
        board = [];
        queue = generateQueue();
        piece = queue.shift();
        held = null;
        rotation = 0;
        initPiecePos();
        lastMoveRotate = false;
        combo = 0;
        b2b = false;

        render();
    }

    function shuffleArray(array) {
        let curId = array.length;
        // There remain elements to shuffle
        while (0 !== curId) {
            // Pick a remaining element
            let randId = Math.floor(Math.random() * curId);
            curId -= 1;
            // Swap it with the current element.
            let tmp = array[curId];
            array[curId] = array[randId];
            array[randId] = tmp;
        }
        return array;
    }

    function generateQueue() {
        bag = [...pieces];
        shuffleArray(bag);
        return bag;
    }

    function initPiecePos() {
        rotation = 0;
        if (piece == "O") {
            pieceX = 4;
        }
        else {
            pieceX = 3;
        }
        pieceY = 20;
    }

    function render() {
        boardContext.fillStyle = "#000000";
        boardContext.fillRect(0, 0, boardWidth, boardHeight)
        pieceMatrix = generatePieceMatrix(piece, rotation)
        boardContext.globalAlpha = .3;

        var tempY = pieceY;
        while (!collide(piece, pieceX, tempY - 1, rotation)) {
            tempY--;
        }
        for (let i = 0; i < pieceMatrix.length; i++) {
            for (let j = 0; j < pieceMatrix[i].length; j++) {
                if (pieceMatrix[i][j] != 0 && pieceMatrix[i][j] != 9) {
                    boardContext.fillStyle = colors[pieceMatrix[i][j]];
                    boardContext.fillRect((j + pieceX) * 32, 640 - (tempY - i) * 32, 32, 32)
                }
            }
        }
        boardContext.globalAlpha = 1;

        for (let i = 0; i < pieceMatrix.length; i++) {
            for (let j = 0; j < pieceMatrix[i].length; j++) {
                if (pieceMatrix[i][j] != 0 && pieceMatrix[i][j] != 9) {
                    boardContext.fillStyle = colors[pieceMatrix[i][j]];
                    boardContext.fillRect((j + pieceX) * 32, 640 - (pieceY - i) * 32, 32, 32)
                }
            }
        }
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] != 0) {
                    boardContext.fillStyle = colors[board[i][j]];
                    boardContext.fillRect((j) * 32, 640 - (i) * 32, 32, 32)
                }
            }
        }

        if (held) {
            
        holdContext.fillStyle = "#000000";
        holdContext.fillRect(0,0,holdWidth,holdHeight);
        holdMatrix = generatePieceMatrix(held, 0);
        for (let i = 0; i < holdMatrix.length; i++) {
            for (let j = 0; j < holdMatrix[i].length; j++) {
                if (holdMatrix[i][j] != 0) {
                    holdContext.fillStyle = colors[holdMatrix[i][j]];
                    holdContext.fillRect((j) * 32 + 12, (i) * 32 + 12, 32, 32)
                }
            }
        }
        }


        queueContext.fillStyle = "#000000";
        queueContext.fillRect(0,0,queueWidth,queueHeight);
        for (let h = 0; h < queue.length; h++) {
            queueMatrix = generatePieceMatrix(queue[h])
        }

    }

    function collide(piece, x, y, rotation) {
        pieceMatrix = generatePieceMatrix(piece, rotation)
        for (let i = 0; i < pieceMatrix.length; i++) {
            for (let j = 0; j < pieceMatrix[i].length; j++) {
                if (pieceMatrix[i][j] == 0 || pieceMatrix[i][j] == 9) {
                    continue;
                }
                if (j + x < 0 || j + x > 9) {
                    return true;
                }
                if (y - i <= 0) {
                    return true;
                }
                if (y - i < board.length) {
                    if (board[y - i][j + x] != 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function tryWallKicks(rotation1, rotation2){
        if (piece == "I") {
            for (let i = 0; i < i_wallkicks[rotation1+"-"+rotation2].length; i++) {
                const coords = i_wallkicks[rotation1+"-"+rotation2][i];
                if (!collide(piece, pieceX+coords[0], pieceY+coords[1], rotation2)) {
                    pieceX += coords[0]
                    pieceY += coords[1]
                    return true;
                }
            }
        }
        else{
            for (let i = 0; i < wallkicks[rotation1+"-"+rotation2].length; i++) {
                const coords = wallkicks[rotation1+"-"+rotation2][i];
                if (!collide(piece, pieceX+coords[0], pieceY-coords[1], rotation2)) {
                    pieceX += coords[0]
                    pieceY -= coords[1]
                    return true;
                }
            }
        }
        return false;
    }

    function generatePieceMatrix(piece, rotation) {
        tempMatrix = JSON.parse(JSON.stringify(piece_matrix[piece]));
        for (let i = 0; i < rotation; i++) {
            rotateMatrix(tempMatrix);
        }
        return tempMatrix;
    }

    var rotateMatrix = function (matrix) {
        flipMajorDiagonal(matrix);
        reverseEachRow(matrix);
        return matrix;
    }

    var flipMajorDiagonal = function (matrix) {
        for (let i = 0; i < matrix.length; i++) {
            for (let j = i; j < matrix[0].length; j++) {
                let temp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = temp;
            }
        }
        return matrix;
    }

    var reverseEachRow = function (matrix) {
        for (let i = 0; i < matrix.length; i++) {
            matrix[i].reverse();
        }
        return matrix;
    }

    function pieceGravity() {
        if (collide(piece, pieceX, pieceY - 1, rotation)) {
            placePiece();
        }
        else {
            pieceY--;
            render();
            lastMoveRotate = false;
        }
    }

    function placePiece() {
        var tspin = false;
        var cornersFilled = 0;
        var mini = false;
        pieceMatrix = generatePieceMatrix(piece, rotation)
        for (let i = 0; i < pieceMatrix.length; i++) {
            for (let j = 0; j < pieceMatrix[i].length; j++) {
                while ((pieceY - i) >= board.length) {
                    board.push([...empty_line])
                }
                if (pieceMatrix[i][j] != 0 && pieceMatrix[i][j] != 9) {
                    board[pieceY - i][j + pieceX] = pieceMatrix[i][j]
                }
                if (pieceMatrix[i][j] == 9) {
                    if (board[pieceY - i][j] == 0) {
                        mini = true;
                    }
                }

                if (piece == "T") {
                    if ((i == 0 || i == 2 || j == 0 || j == 2) && board[pieceY - i][j] != 0) {
                        cornersFilled++;
                    }
                }
            }
        }
        if (cornersFilled >= 3) {
            tspin = true;
        }
        linesCleared = clearLines();
        lines_sent = sendLines(linesCleared, mini, tspin);
        console.log("Lines sent: " + lines_sent);
        spawnPiece();
        render();
    }

    function clearLines() {
        if (board.length == 0) {
            return 0;
        }
        var linesCleared = 0;
        for (let i = board.length - 1; i >= 0; i--) {
            if(board[i].every(column=>column != 0)){
                board.splice(i, 1);
                linesCleared++;
            }  
        }
        return linesCleared;        
    }

    function sendLines(linesCleared, mini, tspin) {
        
        if (linesCleared == 0) {
            combo = 0;
            return 0;
        }
        lines_sent = 0;

        if (linesCleared == 4) {
            lines_sent += 4;
        }

        if (tspin && !mini) {
            lines_sent += linesCleared * 2;
        }
        else if(linesCleared <=3){
            lines_sent += linesCleared - 1; 
        }

        if ( tspin || linesCleared == 4) {
            if (b2b) {
                lines_sent += 1
            }
            b2b = true;
        }
        else{
            b2b = false;
        }

        if (board.every(row => row.every(col => col == 0))) {
            lines_sent += 10;
        }

        lines_sent += combo_table[combo];
        combo++;

        return lines_sent;
    }

    function spawnPiece() {
        piece = queue.shift();
        initPiecePos();
        if (queue.length < 7) {
            queue.push(...generateQueue());
        }
        if (collide(piece, pieceX, pieceY, rotation)) {
            init();
        }
    }

    function move(key) {
        var keys = Object.keys(controls);
        for (var i = 0; i < keys.length; i++) {
            if (controls[keys[i]][0] == parseInt(key)) {
                move_type = keys[i];
                eval(move_type + "()");
                render();
            }
        }
    }
    
    function clockwise() {
        if (rotation < 3) {
            rotation++;
        } else {
            rotation = 0;
        }
    }

    function counterclockwise() {
        if (rotation > 0) {
            rotation--;
        } else {
            rotation = 3;
        }
    }

    function rotate_right() {
        if (collide(piece, pieceX, pieceY, (rotation+1) % 4)) {
            if (tryWallKicks(rotation, (rotation+1) % 4)) {
                clockwise();
                lastMoveRotate = true;
                if(collide(piece, pieceX, pieceY-1, rotation)){
                    gravity = 0;
                }
            }
        }
        else{
            clockwise();
            lastMoveRotate = true;
            if(collide(piece, pieceX, pieceY-1, rotation)){
                gravity = 0;
            }
        }
    }

    function rotate_left() {
        if (collide(piece, pieceX, pieceY, (rotation+3) % 4)) {
            if (tryWallKicks(rotation, (rotation+3) % 4)) {
                counterclockwise();
                lastMoveRotate = true;
                if(collide(piece, pieceX, pieceY-1, rotation)){
                    gravity = 0;
                }
            }
        }
        else{
            counterclockwise();
            lastMoveRotate = true;
            if(collide(piece, pieceX, pieceY-1, rotation)){
                gravity = 0;
            }
        }
    }

    function move_left() {
        if(!collide(piece, pieceX-1, pieceY, rotation)){
            pieceX--;
            lastMoveRotate = false;
            if(collide(piece, pieceX, pieceY-1, rotation)){
                gravity = 0;
            }
        }
    }

    function move_right() {
        if(!collide(piece, pieceX+1, pieceY, rotation)){
            pieceX++;
            lastMoveRotate = false;
            if(collide(piece, pieceX, pieceY-1, rotation)){
                gravity = 0;
            }
        }
    }

    function harddrop() {
        while (!collide(piece, pieceX, pieceY - 1, rotation)) {
            pieceY--;
        }
        placePiece();
        lastMoveRotate = false;
        gravity=0;
    }

    function softdrop() {
        if(!collide(piece, pieceX, pieceY-1, rotation)){
            pieceY--;
            lastMoveRotate = false;
            gravity = 0;
        }   
    }

    function hold() {
        if (held == null) {
            held = piece;
            spawnPiece();
        }
        else{
            [held, piece] = [piece,held]
            initPiecePos();
        }
    }

    function restart() {
        init();
    }

    init();

    var keyDict = {};

    $("body").on("keydown", function (key) {
        for (var testKey in controls) {
            if (controls.hasOwnProperty(testKey)) {
                if (key.which == controls[testKey][0]) {
                    key.preventDefault();
                    // console.log(key.key);
                }
            }
        }
        if (keyDict[key.which] === undefined) {
            var currentTime = new Date().getTime();
            keyDict[key.which] = [currentTime, 0];
        }
    });

    $("body").on("keyup", function (key) {
        delete keyDict[key.which];
    });
    const gravityDelay = 60;
    var gravity = 0;

    loop = setInterval(() => {
        var keys = Object.keys(keyDict);
        leftRight = 0;
        var prio;
        for (var i = 0; i < keys.length; i++) {
            if (keys[i] == controls["move_left"][0] || keys[i] == controls["move_right"][0]) {
                leftRight++;
                prio = keys[i];
            }
            if (leftRight == 2) {
                if (keyDict[keys[1]][0] > keyDict[keys[0]][0]) {
                    prio = keys[1];
                } else {
                    prio = keys[0];
                }
            }
        }
        for (var i = 0; i < keys.length; i++) {
            if (keyDict[keys[i]] === undefined) {
                continue;
            }
            if (keys[i] == controls["move_left"][0] || keys[i] == controls["move_right"][0]) {
                if (keys[i] == prio) {
                    if (
                        (new Date().getTime() - keyDict[keys[i]][0] >= controls.DAS &&
                            new Date().getTime() - keyDict[keys[i]][1] >= controls.ARR) ||
                        keyDict[keys[i]][1] == 0
                    ) {
                        if (controls.ARR == 0 && !keyDict[keys[i]][1] == 0) {
                            for (var mov = 0; mov < matrixWidth; mov++) {
                                move(keys[i]);
                            }
                        } else {
                            move(keys[i]);
                        }
                        keyDict[keys[i]][1] = new Date().getTime();
                    }
                }
            } else if (keys[i] != controls["softdrop"][0]) {
                // && keys[i] != controls["harddrop"][0]
                if (keyDict[keys[i]][1] == 0) {
                    move(keys[i]);
                    keyDict[keys[i]][1] = new Date().getTime();
                }
            } else if (keys[i] == controls["softdrop"][0]) {
                if (new Date().getTime() - keyDict[keys[i]][1] >= controls.grav_ARR) {
                    move(keys[i]);
                    keyDict[keys[i]][1] = new Date().getTime();
                }
            }
        }
        gravity++;
        if (gravity >= gravityDelay) {
            gravity = 0;
            pieceGravity();
        }
    }, 1000 / 60)

}







function startPuyo() {
    document.getElementById("selectionButtons").style.display = "none"

    const colors = [
        "#000000",
        "#555555",
        "#FF0100",
        "#FFFE02",
        "#00EA01",
        "#0000FF",
        "#AA00FE",
    ];
   
    const wallkicks={
        "0-1":[[-1,0]],
        "1-0":[[0,0]],
        "1-2":[[0,1]],
        "2-1":[[1,0]],
        "2-3":[[1,0]],
        "3-2":[[0,1]],
        "3-0":[[0,0]],
        "0-3":[[1,0]]
    }

    const chain_table = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 6];
    const empty_line = [0,0,0,0,0,0]
    var board
    var piece
    var held
    var queue
    var rotation
    var pieceX
    var pieceY
    var boardCanvas = document.getElementById("board");
    var boardWidth = boardCanvas.width;
    var boardHeight = boardCanvas.height;
    var boardContext = boardCanvas.getContext("2d")
    var holdCanvas = document.getElementById("hold");
    var holdWidth = holdCanvas.width;
    var holdHeight = holdCanvas.height;
    var holdContext = holdCanvas.getContext("2d")
    var queueCanvas = document.getElementById("queue");
    var queueWidth = queueCanvas.width;
    var queueHeight = queueCanvas.height;
    var queueContext = queueCanvas.getContext("2d")
    var controls = {"move_left":[37,"ArrowLeft"],"move_right":[39,"ArrowRight"],"rotate_left":[65,"a"],"rotate_right":[38,"ArrowUp"],"rotate_180":[16,"Shift"],"softdrop":[40,"ArrowDown"],"harddrop":[32,"Spacebar"],"hold":[68,"d"],"restart":[82,"r"], "DAS": 67, "ARR": 10, "grav_ARR":0}
    var allclear


    function init() {
        allclear= false
        board = [];
        queue = generateQueue();
        piece = queue.shift();
        held = null;
        rotation = 0;
        initPiecePos();
console.log(piece); 
    
render();
    }

    function shuffleArray(array) {
        let curId = array.length;
        // There remain elements to shuffle
        while (0 !== curId) {
            // Pick a remaining element
            let randId = Math.floor(Math.random() * curId);
            curId -= 1;
            // Swap it with the current element.
            let tmp = array[curId];
            array[curId] = array[randId];
            array[randId] = tmp;
        }
        return array;
    }
    function genPuyo(){

return [Math.floor(Math.random()*5)+2,Math.floor(Math.random()*5)+2]
    }

    function generateQueue() {
        bag = [];
        for (let i = 0; i < 7; i++) {
            bag.push(genPuyo())
        
            
        }
        return bag;
    }

    function initPiecePos() {
        rotation = 0;
        pieceX = 1;
        pieceY = 12;
    }

    function render() {
        boardContext.fillStyle = "#000000";
        boardContext.fillRect(0, 0, boardWidth, boardHeight)
        pieceMatrix = generatePieceMatrix(piece, rotation)
        
        for (let i = 0; i < pieceMatrix.length; i++) {
            for (let j = 0; j < pieceMatrix[i].length; j++) {
                if (pieceMatrix[i][j] != 0 && pieceMatrix[i][j] != 9) {
                    boardContext.fillStyle = colors[pieceMatrix[i][j]];
                    boardContext.fillRect((j + pieceX) * (640/12), 640 - (pieceY - i) * (640/12), (640/12), (640/12))
                }
            }
        }
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] != 0) {
                    boardContext.fillStyle = colors[board[i][j]];
                    boardContext.fillRect((j) * (640/12), 640 - (i) * (640/12), (640/12), (640/12))
                }
            }
        }
        if (held) {
                  holdContext.fillStyle = "#000000";
        holdContext.fillRect(0,0,holdWidth,holdHeight);
        holdMatrix = generatePieceMatrix(held, 0);
        for (let i = 0; i < holdMatrix.length; i++) {
            for (let j = 0; j < holdMatrix[i].length; j++) {
                if (holdMatrix[i][j] != 0) {
                    holdContext.fillStyle = colors[holdMatrix[i][j]];
                    holdContext.fillRect((j) * (640/12) + 12, (i) * (640/12) + 12, (640/12), (640/12))
                }
            }
        }  
        }


        queueContext.fillStyle = "#000000";
        queueContext.fillRect(0,0,queueWidth,queueHeight);
        for (let h = 0; h < queue.length; h++) {
            queueMatrix = generatePieceMatrix(queue[h])
        }

    }

    function collide(piece, x, y, rotation) {
        pieceMatrix = generatePieceMatrix(piece, rotation)
        for (let i = 0; i < pieceMatrix.length; i++) {
            for (let j = 0; j < pieceMatrix[i].length; j++) {
                if (pieceMatrix[i][j] == 0 ) {
                    continue;
                }
                if (j + x < 0 || j + x > 5) {
                    return true;
                }
                if (y - i <= 0) {
                    return true;
                }
                if (y - i < board.length) {
                    if (board[y - i][j + x] != 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function tryWallKicks(rotation1, rotation2){
       
            for (let i = 0; i < wallkicks[rotation1+"-"+rotation2].length; i++) {
                const coords = wallkicks[rotation1+"-"+rotation2][i];
                if (!collide(piece, pieceX+coords[0], pieceY-coords[1], rotation2)) {
                    pieceX += coords[0]
                    pieceY -= coords[1]
                    return true;
                }
            }
        
        return false;
    }

    function generatePieceMatrix(piece, rotation) {
        tempMatrix = [
            [0,piece[0],0],
            [0,piece[1],0],
            [0,0,0]
        ]
        for (let i = 0; i < rotation; i++) {
            rotateMatrix(tempMatrix);
        }
        return tempMatrix;
    }

    var rotateMatrix = function (matrix) {
        flipMajorDiagonal(matrix);
        reverseEachRow(matrix);
        return matrix;
    }

    var flipMajorDiagonal = function (matrix) {
        for (let i = 0; i < matrix.length; i++) {
            for (let j = i; j < matrix[0].length; j++) {
                let temp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = temp;
            }
        }
        return matrix;
    }

    var reverseEachRow = function (matrix) {
        for (let i = 0; i < matrix.length; i++) {
            matrix[i].reverse();
        }
        return matrix;
    }

    function pieceGravity() {
        if (collide(piece, pieceX, pieceY - 1, rotation)) {
            placePiece();
        }
        else {
            pieceY--;
            render();
            lastMoveRotate = false;
        }
    }

    function placePiece() {
        
        pieceMatrix = generatePieceMatrix(piece, rotation)
        for (let i = 0; i < pieceMatrix.length; i++) {
            for (let j = 0; j < pieceMatrix[i].length; j++) {
                while ((pieceY - i) >= board.length) {
                    board.push([...empty_line])
                }
                if (pieceMatrix[i][j] != 0 && pieceMatrix[i][j] != 9) {
                    board[pieceY - i][j + pieceX] = pieceMatrix[i][j]
                }
            }
        }
        
        applyGravity()

        //linesCleared = clearLines();
        //lines_sent = sendLines(linesCleared, mini, tspin);
        //console.log("Lines sent: " + lines_sent);
        spawnPiece();
        render();
    }
    function applyGravity(){
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j]!= 0 && i != 0) {
                    tempY=i
                    while (board[tempY-1][j] == 0 && tempY > 1) {
                        tempY--
                    }
                    if (tempY != i) {
                         board[tempY][j]=board[i][j]
                    board[i][j]=0
                    }
                   

                }
            }
        }
    }
    function clearLines() {
        if (board.length == 0) {
            return 0;
        }
        var linesCleared = 0;
        for (let i = board.length - 1; i >= 0; i--) {
            if(board[i].every(column=>column != 0)){
                board.splice(i, 1);
                linesCleared++;
            }  
        }
        return linesCleared;        
    }

    function sendLines(linesCleared, mini, tspin) {
        
        if (linesCleared == 0) {
            combo = 0;
            return 0;
        }
        lines_sent = 0;

        if (linesCleared == 4) {
            lines_sent += 4;
        }

        if (tspin && !mini) {
            lines_sent += linesCleared * 2;
        }
        else if(linesCleared <=3){
            lines_sent += linesCleared - 1; 
        }

        if ( tspin || linesCleared == 4) {
            if (b2b) {
                lines_sent += 1
            }
            b2b = true;
        }
        else{
            b2b = false;
        }

        if (board.every(row => row.every(col => col == 0))) {
            lines_sent += 10;
        }

        lines_sent += combo_table[combo];
        combo++;

        return lines_sent;
    }

    function spawnPiece() {
        piece = queue.shift();
        initPiecePos();
        if (queue.length < 7) {
            queue.push(...generateQueue());
        }
        if (collide(piece, pieceX, pieceY, rotation)) {
            init();
        }
    }

    function move(key) {
        var keys = Object.keys(controls);
        for (var i = 0; i < keys.length; i++) {
            if (controls[keys[i]][0] == parseInt(key)) {
                move_type = keys[i];
                eval(move_type + "()");
                render();
            }
        }
    }
    
    function clockwise() {
        if (rotation < 3) {
            rotation++;
        } else {
            rotation = 0;
        }
    }

    function counterclockwise() {
        if (rotation > 0) {
            rotation--;
        } else {
            rotation = 3;
        }
    }

    function rotate_right() {
        if (collide(piece, pieceX, pieceY, (rotation+1) % 4)) {
            if (tryWallKicks(rotation, (rotation+1) % 4)) {
                clockwise();

                if(collide(piece, pieceX, pieceY-1, rotation)){
                    gravity = 0;
                }
            }
        }
        else{
            clockwise();
            if(collide(piece, pieceX, pieceY-1, rotation)){
                gravity = 0;
            }
        }
    }

    function rotate_left() {
        if (collide(piece, pieceX, pieceY, (rotation+3) % 4)) {
            if (tryWallKicks(rotation, (rotation+3) % 4)) {
                counterclockwise();
                if(collide(piece, pieceX, pieceY-1, rotation)){
                    gravity = 0;
                }
            }
        }
        else{
            counterclockwise();
            if(collide(piece, pieceX, pieceY-1, rotation)){
                gravity = 0;
            }
        }
    }

    function move_left() {
        if(!collide(piece, pieceX-1, pieceY, rotation)){
            pieceX--;
            if(collide(piece, pieceX, pieceY-1, rotation)){
                gravity = 0;
            }
        }
    }

    function move_right() {
        if(!collide(piece, pieceX+1, pieceY, rotation)){
            pieceX++;
            if(collide(piece, pieceX, pieceY-1, rotation)){
                gravity = 0;
            }
        }
    }

    function harddrop() {
        while (!collide(piece, pieceX, pieceY - 1, rotation)) {
            pieceY--;
        }
        placePiece();
        gravity=0;
    }

    function softdrop() {
        if(!collide(piece, pieceX, pieceY-1, rotation)){
            pieceY--;
            gravity = 0;
        }   
    }

    function hold() {
        if (held == null) {
            held = piece;
            spawnPiece();
        }
        else{
            [held, piece] = [piece,held]
            initPiecePos();
        }
    }

    function restart() {
        init();
    }

    init();

    var keyDict = {};

    $("body").on("keydown", function (key) {
        for (var testKey in controls) {
            if (controls.hasOwnProperty(testKey)) {
                if (key.which == controls[testKey][0]) {
                    key.preventDefault();
                    // console.log(key.key);
                }
            }
        }
        if (keyDict[key.which] === undefined) {
            var currentTime = new Date().getTime();
            keyDict[key.which] = [currentTime, 0];
        }
    });

    $("body").on("keyup", function (key) {
        delete keyDict[key.which];
    });
    const gravityDelay = 60;
    var gravity = 0;

    loop = setInterval(() => {
        var keys = Object.keys(keyDict);
        leftRight = 0;
        var prio;
        for (var i = 0; i < keys.length; i++) {
            if (keys[i] == controls["move_left"][0] || keys[i] == controls["move_right"][0]) {
                leftRight++;
                prio = keys[i];
            }
            if (leftRight == 2) {
                if (keyDict[keys[1]][0] > keyDict[keys[0]][0]) {
                    prio = keys[1];
                } else {
                    prio = keys[0];
                }
            }
        }
        for (var i = 0; i < keys.length; i++) {
            if (keyDict[keys[i]] === undefined) {
                continue;
            }
            if (keys[i] == controls["move_left"][0] || keys[i] == controls["move_right"][0]) {
                if (keys[i] == prio) {
                    if (
                        (new Date().getTime() - keyDict[keys[i]][0] >= controls.DAS &&
                            new Date().getTime() - keyDict[keys[i]][1] >= controls.ARR) ||
                        keyDict[keys[i]][1] == 0
                    ) {
                        if (controls.ARR == 0 && !keyDict[keys[i]][1] == 0) {
                            for (var mov = 0; mov < matrixWidth; mov++) {
                                move(keys[i]);
                            }
                        } else {
                            move(keys[i]);
                        }
                        keyDict[keys[i]][1] = new Date().getTime();
                    }
                }
            } else if (keys[i] != controls["softdrop"][0]) {
                // && keys[i] != controls["harddrop"][0]
                if (keyDict[keys[i]][1] == 0) {
                    move(keys[i]);
                    keyDict[keys[i]][1] = new Date().getTime();
                }
            } else if (keys[i] == controls["softdrop"][0]) {
                if (new Date().getTime() - keyDict[keys[i]][1] >= controls.grav_ARR) {
                    move(keys[i]);
                    keyDict[keys[i]][1] = new Date().getTime();
                }
            }
        }
        gravity++;
        if (gravity >= gravityDelay) {
            gravity = 0;
            pieceGravity();
        }
    }, 1000 / 60)

}


