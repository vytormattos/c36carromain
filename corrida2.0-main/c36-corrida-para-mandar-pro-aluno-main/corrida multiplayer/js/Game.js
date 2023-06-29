class Game {
  constructor() { }

  getState() {
    var gameStateRef = database.ref("gameState")
    gameStateRef.on("value", function (data) {
      gameState = data.val()
    })
  }

  update(state) {
    database.ref("/").update({
      gameState: state
    })
  }

  start() {
    player = new Player();
    playerCount = player.getCount()
    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100)
    car1.addImage("car1", carimg1)
    car1.scale = 0.07

    car2 = createSprite(width / 2 + 100, height - 100)
    car2.addImage("car2", carimg2)
    car2.scale = 0.07

    cars = [car1, car2]

    fuels = new Group()

    powerCoins = new Group()

    obstacles = new Group()

    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacleImg2 },
      { x: width / 2 - 150, y: height - 1300, image: obstacleImg1 },
      { x: width / 2 + 250, y: height - 1800, image: obstacleImg1 },
      { x: width / 2 - 180, y: height - 2300, image: obstacleImg2 },
      { x: width / 2, y: height - 2800, image: obstacleImg2 },
      { x: width / 2 - 180, y: height - 3300, image: obstacleImg1 },
      { x: width / 2 + 180, y: height - 3300, image: obstacleImg2 },
      { x: width / 2 + 250, y: height - 3800, image: obstacleImg2 },
      { x: width / 2 - 150, y: height - 4300, image: obstacleImg1 },
      { x: width / 2 + 250, y: height - 4800, image: obstacleImg2 },
      { x: width / 2, y: height - 5300, image: obstacleImg1 },
      { x: width / 2 - 180, y: height - 5500, image: obstacleImg2 }];

    this.addSprites(fuels, 4, fuelImg, 0.02)
    this.addSprites(powerCoins, 18, powerCoinImg, 0.09)
    this.addSprites(obstacles, obstaclesPositions.length, obstacleImg1, 0.04, obstaclesPositions)
  }

  addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []) {
    for (let i = 0; i < numberOfSprites; i++) {
      var x, y
      if (positions.length > 0) {
        x = positions[i].x
        y = positions[i].y
        spriteImage = positions[i].image
      } else {
        x = random(width / 2 + 150, width / 2 - 150)
        y = random(-height * 4.5, height - 400)
      }
      var sprite = createSprite(x, y)
      sprite.addImage("sprite", spriteImage)
      sprite.scale = scale
      spriteGroup.add(sprite)
    }
  }

  handleElements() {
    form.hide()
    form.titleImg.position(40, 50)
    form.titleImg.class("gameTitleAfterEffect");
  }

  play() {
    this.handleElements()
    Player.getPlayersInfo()

    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6)

      var index = 0
      for (var plr in allPlayers) {
        index = index + 1

        var x = allPlayers[plr].positionX
        var y = height - allPlayers[plr].positionY

        cars[index - 1].position.x = x
        cars[index - 1].position.y = y

        if (index === player.index) {
          stroke(10)
          fill("cyan")
          ellipse(x, y, 60, 60)
          
          this.handleFuel (index);
          this.handlePowerCoins (index);

          camera.position.y = cars[index - 1].position.y
        }
      }

      this.handlePlayerControls()
      drawSprites()
    }
  }

  handlePlayerControls() {
    if (keyIsDown(UP_ARROW) || keyDown("w")) {
      player.positionY += 10
      player.update()
    }
  }

  handleFuel(index) {
    cars[index - 1].overlap(fuels, function (collector, collected) {
      player.fuel = 185;
      collected.remove()
    })
  }

  handlePowerCoins(index) {
    cars[index - 1].overlap(powerCoins, function (collector, collected) {
      player.score += 21;
      player.update();
      collected.remove();
    })
  }

}
