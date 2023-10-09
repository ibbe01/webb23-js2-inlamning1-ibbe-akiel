const inputElement = document.querySelector("input");
const buttonElement = document.querySelector("button");
const computerResult = document.getElementById("computerResult");
const divWinner = document.getElementById("winner");
async function getPlayer() {
    const url = "http://localhost:3000/player";
    const response = await fetch(url);
    const player = response.json();
    console.log(player);
    return player;
}
const form = document.querySelector("form");
form.addEventListener("submit", async (event)=>{
    event.preventDefault();
    const playerName = document.querySelector("input").value;
    let playerScore = 0;
    const url = "http://localhost:3000/player";
    if (!playerName.trim()) {
        alert("Give us name pls xD");
        return;
    }
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: playerName,
            score: playerScore
        })
    }).then((response)=>response.json()).then((data)=>{
        gameDisplay(data.name, playerScore);
        console.log(data);
    });
    const res = await fetch("http://localhost:3000/highscores", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const output = await res.json();
    console.log(output);
    let computerChoice = [
        "sten",
        "sax",
        "p\xe5se"
    ];
    let randomIndex;
    let pick;
    const buttons = document.querySelectorAll("button[id]");
    buttons.forEach((button)=>button.style.display = "inline-block");
    buttons.forEach((button)=>{
        button.addEventListener("click", async (e)=>{
            e.preventDefault();
            // console.log("clicked a button")
            randomIndex = Math.floor(Math.random() * computerChoice.length);
            pick = computerChoice[randomIndex];
            computerResult.textContent = "Computer Result: " + pick;
            let result = calcResult(pick, button.id);
            playerScore = await updateScore(result, playerName, playerScore);
            gameDisplay(playerName, playerScore);
        });
    });
    const highscoreList1 = document.getElementById("highscoreList");
    highscoreList1.style = "border: 2px solid black";
    highscoreList1.style.height = "350px";
    highscoreList1.style.width = "150px";
    highscoreList1.innerHTML = "Highscore: \n" + output.map((player)=>player.name + " " + player.score + "\n");
    computerResult.style.display = "inline-block";
    divWinner.style.display = "block";
    inputElement.style.display = "none";
    buttonElement.style.display = "none";
});
function gameDisplay(playerName, playerScore) {
    const playerInfoElement = document.getElementById("playerInfo");
    playerInfoElement.innerHTML = `Name: ${playerName}, Score: ${playerScore}`;
}
async function updateScore(result, playerName, playerScore) {
    console.log(playerScore);
    if (result === 0) {
        divWinner.innerHTML = "ITS A DRAW";
        console.log("draw result:", playerScore);
        return playerScore;
    }
    if (result === 1) {
        // Uppdatera databasen
        divWinner.innerHTML = `WINNER ${playerName}`;
        return playerScore + 1;
    }
    if (result === -1) {
        // Börja om / visa highscore
        divWinner.innerHTML = "Computer WON";
        console.log("final result:", playerScore);
        const response = await fetch("http://localhost:3000/update/highscore", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: playerName,
                score: playerScore
            })
        });
        const res = await fetch("http://localhost:3000/highscores", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const output = await res.json();
        highscoreList.innerHTML = "Highscore: \n" + output.map((player)=>player.name + " " + player.score + "\n");
        // }
        return 0;
    }
}
function calcResult(pick, choice) {
    if (pick === choice) return 0;
    else if (pick === "sten" && choice === "sax") return -1;
    else if (pick === "sax" && choice === "sten") return 1;
    else if (pick === "p\xe5se" && choice === "sax") return 1;
    else if (pick === "sax" && choice === "p\xe5se") return -1;
    else if (pick === "sten" && choice === "p\xe5se") return 1;
    else if (pick === "p\xe5se" && choice === "sten") return -1;
}

//# sourceMappingURL=index.de158e3a.js.map
