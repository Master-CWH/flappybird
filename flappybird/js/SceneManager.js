(function(){
	var SceneManager = window.SceneManager = function(){
		this.bindEvent();
	}
	SceneManager.prototype.enter = function(number){
		game.scene = number;

		switch(game.scene){
			case 0:
				this.titleY = 0;
				this.buttonX = (game.canvas.width - 116) / 2;
				this.buttonY = game.canvas.height;
				this.birdY = 250;
				this.birdDirection = 1;
				break;
			case 1:
				this.tutorialAlpha = 1;
				this.tutorialAlphaDirection = -1;
				break;
			case 2:
				game.background = new Background();
				game.land = new Land();
				game.bird = new Bird();
				game.pipeArr = [];
				game.score = 0;
				break;
			case 3:
				this.showbomb = false;
				this.boom = 1;
				document.getElementById("hit").load();
				document.getElementById("hit").play();
				document.getElementById("die").load();
				document.getElementById("die").play();
				break;
			case 4:
				this.gameoverY = -54;
				this.showjiangpai = false;

				var arr = JSON.parse(localStorage.getItem("flappybird"));
				arr = _.uniq(arr);
				arr = _.sortBy(arr,function(item){
					return item;
				});
				this.best = arr[arr.length - 1];
				if(game.score >= arr[arr.length - 1]){
					this.model = "medals_1";
					this.best = game.score;
				}else if(game.score >= arr[arr.length - 2]){
					this.model = "medals_2";
				}else if(game.score >= arr[arr.length - 2]){
					this.model = "medals_3";
				}else{
					this.model = "medals_0";
				}

				arr.push(game.score);
				localStorage.setItem("flappybird" , JSON.stringify(arr));

				this.score_panelY = game.canvas.height;
				break;
		}
	}
	SceneManager.prototype.updateAndRender = function(){
		switch(game.scene){
			case 0:
				game.ctx.fillStyle = "#4ec0ca";
				game.ctx.fillRect(0,0,game.canvas.width,game.canvas.height);
				game.ctx.drawImage(game.R["bg_day"] , 0 , game.canvas.height - 512);
				game.ctx.drawImage(game.R["bg_day"] , 288 , game.canvas.height - 512);
				game.ctx.drawImage(game.R["land"] , 0 , game.canvas.height - 112);
				game.ctx.drawImage(game.R["land"] , 336 , game.canvas.height - 112);
				this.titleY += 160 / 20;
				if(this.titleY > 160) this.titleY = 160;
				game.ctx.drawImage(game.R["title"] , (game.canvas.width - 178) / 2 , this.titleY);
				this.buttonY -= (game.canvas.height - 400) / 20;
				if(this.buttonY < 400) this.buttonY = 400;
				game.ctx.drawImage(game.R["button_play"],this.buttonX,this.buttonY);
				if(this.birdDirection == 1){
					this.birdY += 2;
					if(this.birdY > 330) this.birdDirection = -1;

				}else{
					this.birdY -= 2;
					if(this.birdY < 270) this.birdDirection = 1;
				}
				game.ctx.drawImage(game.R["bird0_0"],(game.canvas.width - 48) / 2,this.birdY)
				break;
			case 1:
				game.ctx.fillStyle = "#4ec0ca";
				game.ctx.fillRect(0,0,game.canvas.width,game.canvas.height);
				game.ctx.drawImage(game.R["bg_day"] , 0 , game.canvas.height - 512);
				game.ctx.drawImage(game.R["bg_day"] , 288 , game.canvas.height - 512);
				game.ctx.drawImage(game.R["land"] , 0 , game.canvas.height - 112);
				game.ctx.drawImage(game.R["land"] , 336 , game.canvas.height - 112);
				game.ctx.drawImage(game.R["bird0_0"],game.canvas.width * (1-0.618),100);
				game.ctx.save();
				if(this.tutorialAlphaDirection == 1){
					this.tutorialAlpha += 0.1;
					if(this.tutorialAlpha >= 1) this.tutorialAlphaDirection = -1;

				}else{
					this.tutorialAlpha -= 0.1;
					if(this.tutorialAlpha < 0){
						this.tutorialAlpha = 0;
						this.tutorialAlphaDirection = 1;
					}
				}
				game.ctx.globalAlpha = this.tutorialAlpha;
				game.ctx.drawImage(game.R["tutorial"],(game.canvas.width   - 114 ) /2,300);
				game.ctx.restore();
				break;
			case 2:
				game.background.update();
				game.background.render();
				game.land.update();
				game.land.render();
				game.bird.update();
				game.bird.render();

				if(game.frame % 120 == 0){
					new Pipe();
				}

				for(var i = 0 ; i < game.pipeArr.length ; i++){
					game.pipeArr[i].update();
					game.pipeArr[i] &&  game.pipeArr[i].render();
				}

				scoreRender();

				break;
			case 3:
				game.background.render();
				game.land.render();
				for(var i = 0 ; i < game.pipeArr.length ; i++){
					game.pipeArr[i].render();
				}

				if(!this.showbomb){
					game.bird.render();
					game.bird.y+=16;
					if(game.bird.y > game.canvas.height - 112){
						this.showbomb = true;
					}
				}else{
					game.ctx.drawImage(game.R["boom" + this.boom] , game.bird.x - 50, game.bird.y - 100, 100 ,100);
					game.frame % 3 == 0 && this.boom++;
					if(this.boom > 9){
						this.enter(4);
					}
				}

				scoreRender();

				break;
			case 4:
				game.background.render();
				game.land.render();
				for(var i = 0 ; i < game.pipeArr.length ; i++){
					game.pipeArr[i].render();
				}
				this.gameoverY += 10;
				if(this.gameoverY > 120){
					this.gameoverY = 120;
				}
				game.ctx.drawImage(game.R["text_game_over"],(game.canvas.width - 204) / 2,this.gameoverY)

				this.score_panelY -= 10;
				if(this.score_panelY < 270){
					this.score_panelY = 270;
					this.showjiangpai = true;
				}
				game.ctx.drawImage(game.R["score_panel"],(game.canvas.width - 238) / 2,this.score_panelY)
				if(this.showjiangpai){
					game.ctx.drawImage(game.R[this.model],(game.canvas.width / 2) - 88,this.score_panelY + 44)
					game.ctx.textAlign = "right";
					game.ctx.font = "20px consolas";
					game.ctx.fillStyle = "#333";
					game.ctx.fillText(game.score , (game.canvas.width / 2) + 93 , this.score_panelY + 50)
					game.ctx.fillText(this.best , (game.canvas.width / 2) + 93 , this.score_panelY + 96)
				}

		}
	}
	SceneManager.prototype.bindEvent = function(){
		var self = this;
		game.canvas.onclick = function(e){
			var x = e.offsetX;
			var y = e.offsetY;

			switch(game.scene){
				case 0:
					if(x > self.buttonX && y > self.buttonY && x < self.buttonX + 116 && y < self.buttonY + 70){
						self.enter(1);
					}
					break;
				case 1:
					self.enter(2);
					break;
				case 2:
					game.bird.fly();
					break;
				case 3:
					break;
				case 4:
					self.enter(0);
					break;
			}
		}
	}


	function scoreRender(){
		var score = game.score.toString();
		var baseX = game.canvas.width / 2 - (score.length / 2) * 30;
		for(var i = 0 ; i < score.length ; i++){
			var char = score[i];
			game.ctx.drawImage(game.R["shuzi" + char] , baseX + i * 30,100);
		}
	}
})();
