(function(){
	var Pipe = window.Pipe = function(){
		this.h = parseInt(Math.random() * 220) + 100;
		this.space = 140;
		this.h2 = game.canvas.height - 112 - this.h - this.space;
		this.x = game.canvas.width;
		this.done = false;

		game.pipeArr.push(this);
	}
	Pipe.prototype.update = function(){
		this.x -= 2;

		if(this.x < -52){
			for (var i = 0; i < game.pipeArr.length; i++) {
				if(game.pipeArr[i] === this){
					game.pipeArr.splice(i,1);
				}
			};
		}

		this.x1 = this.x;
		this.x2 = this.x + 52;
		this.y1 = this.h;
		this.y2 = this.h + this.space;

		if(
			game.bird.x2 > this.x1 && game.bird.y1 < this.y1 && game.bird.x1 < this.x2
			||
			game.bird.x2 > this.x1 && game.bird.y2 > this.y2 && game.bird.x1 < this.x2
		){
			game.sm.enter(3);
		}

		if(!this.done && game.bird.x1 > this.x2){
			game.score++;
			this.done = true;
			document.getElementById("point").load();
			document.getElementById("point").play();
		}
	}
	Pipe.prototype.render = function(){
		game.ctx.drawImage(game.R["pipe_down"],0,320-this.h,52,this.h,this.x,0,52,this.h);
		game.ctx.drawImage(game.R["pipe_up"],0,0,52,this.h2, this.x , this.h + this.space , 52 , this.h2);

	}
})();

