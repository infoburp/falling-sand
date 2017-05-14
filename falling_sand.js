function matrix( rows, cols, defaultValue) {
    var arr = [];
    // Creates all lines:
    for(var i=0; i < rows; i++){
        // Creates an empty line
        arr.push([]);
        // Adds cols to the empty line:
        arr[i].push( new Array(cols));
        for(var j=0; j < cols; j++){
            // Initializes:
            arr[i][j] = defaultValue;
        }
    }
    return arr;
}

function getPosition(event) {
    var x = new Number();
    var y = new Number();
    var canvas = document.getElementById("game");
    if (event.x != undefined && event.y != undefined)
    {
        x = event.x;
        y = event.y;
    }
    else // Firefox method to get the position
    {
        x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
    pixel[y][x] = 3;
}

function UpdateParticle(y, x) {
    // add sand every so often
    if (input_tick == 300 && pixel[10][75] == 0){
        input_tick = 0;
        pixel[10][75] = 1;
    }
    if (input_tick == 300 && pixel[10][75] != 0){
        input_tick = 0;
    }
    input_tick++;
    //is static particle
    if (pixel[y][x] != 1 && pixel[y][x] != 1)
        return false;
    // nothing under the particle, keep falling 
    var under = pixel[y+1][x];
    if (under == 0)
    {
        var isPaused = 0;
        for (var i = 0; i < paused.length; i++) {
            if (x == paused[i].x && y == paused[i].y){
                paused.splice(i,1);
                isPaused = 1;
            }
        } 
        if (!isPaused){
            pixel[y+1][x] = 1;//pixel[y][x];
            pixel[y][x] = 0;
            paused.push({x: x, y: y});
            return true;
        }
    }
    // test left and right supports under the particle 

    var left  = pixel[y+1][x+1] != 0 ? true : false;
    var right = pixel[y+1][x-1] != 0 ? true : false;
  
    // Hit a stable ground (left/right/underneath supports), return that the particle is finished
    if (left & right)
        return false;

   // the right support is missing, tumble the particle towards it 

    if (left && !right)
    {
        pixel[y+1][x-1] = pixel[y][x];
        pixel[y][x] = 0;
    }

    // the left support is missing, tumble the particle towards it 

    if (!left && right)
    {
        pixel[y+1][x+1] = pixel[y][x];
        pixel[y][x] = 0;
    }

    // both supports missing, tumble the particle towards either side randomly 

    if (!left && !right)
    {
        if (Math.random() > 0.5)
        {
            pixel[y+1][x-1] = pixel[y][x];
            pixel[y][x] = 0;
        } 
        else
        {
            pixel[y+1][x+1] = pixel[y][x];
            pixel[y][x] = 0;
        }
    }

    // particle still active

    return true;
}

function draw(){

    var canvas = document.getElementById('game');
    var ctx = canvas.getContext('2d');
    canvas.addEventListener("mousedown", getPosition, false);

    ctx.clearRect(0,0, gameHeight, gameWidth);

    for (var x = 0; x <= (gameWidth-2); x++){
            for (var y = (gameHeight-1); y >= 1; y--){

            /*if ( pixel[y][x] == 0 ) {
                ctx.fillStyle = 'black';
                ctx.fillRect(x, y, x+1, y+1);
            }*/
            if ( pixel[y][x] == 1 ) {

                ctx.fillStyle = 'orange';
                ctx.fillRect(x, y, 2, 2);
            }
            if ( pixel[y][x] == 2 ) {

                ctx.fillStyle = 'grey';
                ctx.fillRect(x, y, 2, 2);
            }
            if ( pixel[y][x] == 3 ) {

                ctx.fillStyle = 'red';
                ctx.fillRect(x, y, 2, 2);
            }
            UpdateParticle(y,x);
        }
    }

    window.requestAnimationFrame(draw);

}

    gameWidth = 300;
    gameHeight = 300;
    var canvas = document.getElementById("game");

    var pixel = matrix( gameHeight, gameWidth, 0);;

    var input_tick = 0;
    // build top and bottom walls
    for (var x = 0; x <= (gameWidth-2); x++){
        pixel[(gameWidth-2)][x] = 2;
        pixel[0][x] = 2;
    }
    // build side walls
    for (var y = 0; y <= (gameHeight-2); y++){
        pixel[y][(gameHeight-2)] = 2;
        pixel[y][0] = 2;
    }

    paused = [];
    // start render loop

    window.requestAnimationFrame(draw);


    

    
