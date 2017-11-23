(function(){
	var Bird = window.Bird = function(){
		this.x = game.canvas.width * (1 - 0.618);
		this.y = 100;
		this.rotate = 0;
		this.dy = 0;
		this.ddy = 0.6;
		this.fsm = "下落";
		this.images = [game.R["bird0_0"] , game.R["bird0_1"] , game.R["bird0_2"]]
		this.wing = 0;
	}
	Bird.prototype.fly = function(){
		this.fsm = "上升";
		this.dy = 11.5;
		this.rotate = -1.4;
		document.getElementById("wing").load();
		document.getElementById("wing").play();
	}
	Bird.prototype.update = function(){
		if(this.fsm == "下落"){
			this.dy += this.ddy;
			this.y += this.dy;
		}else if(this.fsm == "上升"){
			this.dy -= this.ddy;
			if(this.dy < 0){
				this.fsm = "下落";

				return;
			}
			this.y -= this.dy;
			if(this.y < -12){
				this.y = -12;
			}
		}

		this.rotate+= 0.06;

		game.frame % 1 == 0 && this.wing ++;
		if(this.wing > 2){
			this.wing = 0;
		}

		this.x1 = this.x - 17;
		this.x2 = this.x + 17;
		this.y1 = this.y - 12;
		this.y2 = this.y - 12;

		if(this.y2 > game.canvas.height - 112){
			game.sm.enter(3);
		}
	}
	Bird.prototype.render = function(){
		game.ctx.save();
		game.ctx.translate(this.x , this.y);
		game.ctx.rotate(this.rotate);
		game.ctx.drawImage(this.images[this.wing],-24,-24);
		game.ctx.restore();

	}
})();

