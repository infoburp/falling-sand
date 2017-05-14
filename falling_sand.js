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
    if (input_tick > 30000){
        input_tick = 0;
        pixel[10][75] = 1;
        pixel[10][225] = 3;
    }
    input_tick++;
    //is static particle
    if (pixel[y][x] != 1 && pixel[y][x] != 3)
        return false;
    
    if (pixel[y][x] == 1){
        // sand falling behavior
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
                pixel[y+1][x] = pixel[y][x];
                pixel[y][x] = 0;
                paused.push({x: x, y: y});
                return true;
            }
            if (isPaused){
                //return true;
            }
        }
        // test left and right supports under the particle 

        var left  = pixel[y+1][x+1];// != 0 ? true : false;
        var right = pixel[y+1][x-1];// != 0 ? true : false;
      
        // Hit a stable ground (left/right/underneath supports), return that the particle is finished
        if (left == 1 && right == 1)// && pixel[y][x] == 1)
            return false;

       // the right support is missing, tumble the particle towards it 

        if (left == 1 && right == 0 || left == 1 && right == 3)
        {
            var tempPixel = pixel[y+1][x-1];
            pixel[y+1][x-1] = pixel[y][x];
            pixel[y][x] = tempPixel;
        }

        // the left support is missing, tumble the particle towards it 

        if (left == 0 && right == 1 || left == 3 && right == 1)
        {
            var tempPixel = pixel[y+1][x+1];
            pixel[y+1][x+1] = pixel[y][x];
            pixel[y][x] = tempPixel;
        }

        // both supports missing, tumble the particle towards either side randomly 

        if (left == 0 && right == 0 || left == 3 && right == 3)
        {
            if (Math.random() > 0.5)
            {
                var tempPixel = pixel[y+1][x-1];
                pixel[y+1][x-1] = pixel[y][x];
                pixel[y][x] = tempPixel;
            } 
            else
            {
                var tempPixel = pixel[y+1][x+1];
                pixel[y+1][x+1] = pixel[y][x];
                pixel[y][x] = tempPixel;
            }
        }

        // particle still active

        return true;
    }

    if (pixel[y][x] == 3){
        // water falling behavior
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
                pixel[y+1][x] = pixel[y][x];
                pixel[y][x] = 0;
                paused.push({x: x, y: y});
                return true;
            }
            if (isPaused){
                //return true;
            }
        }
        // test left and right supports under the particle 

        var left  = pixel[y+1][x+1];// != 0 ? true : false;
        var right = pixel[y+1][x-1];// != 0 ? true : false;
        var straightleft = pixel[y][x+1];
        var straightright = pixel[y][x-1]
        // Hit a stable ground (left/right/underneath supports), return that the particle is finished
        if (left == 1 && right == 1)// && pixel[y][x] == 1)
            return false;

        if (straightleft == 0 && straightright != 0 && under == 3){
            var tempPixel = pixel[y][x+1];
            pixel[y][x+1] = pixel[y][x];
            pixel[y][x] = tempPixel;
        }
        if (straightleft != 0 && straightright == 0 && under == 3){
            var tempPixel = pixel[y][x-1];
            pixel[y][x-1] = pixel[y][x];
            pixel[y][x] = tempPixel;
        }
        if (straightleft == 0 && straightright == 0 && under == 3){
            if (Math.random >= 0.5){
                var tempPixel = pixel[y][x-1];
                pixel[y][x-1] = pixel[y][x];
                pixel[y][x] = tempPixel;
            } else {
                var tempPixel = pixel[y][x+1];
                pixel[y][x+1] = pixel[y][x];
                pixel[y][x] = tempPixel;        
            }
        }
        

       // the right support is missing, tumble the particle towards it 

        if (left == 1 && right == 0 || left == 3 && right == 0)
        {
            var tempPixel = pixel[y+1][x-1];
            pixel[y+1][x-1] = pixel[y][x];
            pixel[y][x] = tempPixel;
        }

        // the left support is missing, tumble the particle towards it 

        if (left == 0 && right == 1 || left == 0 && right == 3)
        {
            var tempPixel = pixel[y+1][x+1];
            pixel[y+1][x+1] = pixel[y][x];
            pixel[y][x] = tempPixel;
        }

        // both supports missing, tumble the particle towards either side randomly 

        if (left == 0 && right == 0)
        {
            if (Math.random() > 0.5)
            {
                var tempPixel = pixel[y+1][x-1];
                pixel[y+1][x-1] = pixel[y][x];
                pixel[y][x] = tempPixel;
            } 
            else
            {
                var tempPixel = pixel[y+1][x+1];
                pixel[y+1][x+1] = pixel[y][x];
                pixel[y][x] = tempPixel;
            }
        }

        // particle still active

        return true;
    }

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
                // sand
                ctx.fillStyle = 'orange';
                ctx.fillRect(x, y, 2, 2);
            }
            if ( pixel[y][x] == 2 ) {
                // wall
                ctx.fillStyle = 'grey';
                ctx.fillRect(x, y, 2, 2);
            }
            if ( pixel[y][x] == 3 ) {
                // water
                ctx.fillStyle = 'blue';
                ctx.fillRect(x, y, 2, 2);
            }
            if ( pixel[y][x] == 4 ) {
                // oil
                ctx.fillStyle = 'brown';
                ctx.fillRect(x, y, 2, 2);
            }
            UpdateParticle(y,x);
        }
    }
    if (count == 5){count = 0; paused = [];}
    count++;
    window.requestAnimationFrame(draw);

}
    count = 0;
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


    

    
