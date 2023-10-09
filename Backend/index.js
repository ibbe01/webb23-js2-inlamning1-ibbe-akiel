const express = require('express');
const app = express();
const fs = require('fs');

app.use(express.json());

app.use(function (req, res, next) {
    //Tillåt requests från alla origins
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });


app.listen(3000, ()=>{
    console.log("Listening to port 3000...")
})

app.post('/player', (req, res)=>{
    const playerName = req.body.name;
    const playerScore = req.body.score;

    // Läser in nuvarande highscore-data 
    const highscore = JSON.parse(fs.readFileSync('./data/highscore.json'))
    // const playerIndex = highscore.findIndex(player => player.name === playerName);
    

   
    fs.writeFileSync('./data/highscore.json', JSON.stringify(highscore))
    res.json({name: playerName, score: playerScore});

})


app.get('/highscores', (req, res)=>{

  const highscore = JSON.parse(fs.readFileSync('./data/highscore.json'));

  res.json(highscore);
  //res.json(highscore.sort((a, b) => b.score - a.score ).slice(0, 5));
})

// Här ska du uppdatera highscore listan xD 
app.post('/update/highscore', (req, res)=>{
  const playerName = req.body.name;
  const playerScore = req.body.score;

  const highscore = JSON.parse(fs.readFileSync('./data/highscore.json'));
  const listSize = highscore.length;

  highscore.every((player, index)=>{
    console.log('name:', player)
      if(player.score < playerScore) {
        highscore.splice(index, 0, {name: playerName, score: playerScore})
       console.log("Before highscore: ", highscore)
        if(highscore.length > 5 ){
          highscore.pop()
          console.log("afer highscore:", highscore)
        }
        
        // highscore[index] = {name: playerName, score: playerScore}
        fs.writeFileSync('./data/highscore.json', JSON.stringify(highscore));
        res.json({message: "Highscore list updated"});
        return;
        
      }
    return true;
  })
  if(highscore.length < 5 && listSize === highscore.length) {
      highscore.push({name: playerName, score: playerScore});
      fs.writeFileSync('./data/highscore.json', JSON.stringify(highscore));
      
  }
  console.log("Final highscore:", highscore)
  res.json({message: "No new highscore "})
})