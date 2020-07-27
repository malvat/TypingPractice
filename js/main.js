var current = 0;
var color = "#3f51b5";
var content = "It's not enough to hire to fill a job. It's not even enough to hire on the basis of one's talents. You have to hire based upon a candidate's potential to grow and develop.";    
var words = content.split(" ");
var seconds = 0;
var start_game = false;
var timer;
var streak = 1;
var score = 0;
var score_posted = 0;
var speed = 0;
var end_game = false;
var score_speed = 100;
var score_update;

window.onload = async function() {
    document.getElementById('text-container').innerHTML = content;
    score_update = setInterval(updateScore, score_speed/(streak*10));
}

function updateScore() {
    console.log(score, speed);
    if(score_posted < score) {
        score_posted+= (streak * 2);
        document.getElementById('score').innerHTML = score_posted;
    } else {
        if(end_game) {
            clearInterval(score_update);
        }
    }
    if(end_game) {
        clearInterval(timer);
        document.getElementById('text-container').innerHTML = content;
    }
}

function wordTyped(event) {
    if(words[current].match("^" + event.target.value) == null && event.target.value !== "") {
        color="#e53935";
    } else {
        color="#3f51b5";
        streak=1;
    }
    changeText();
    if(event.target.value[event.target.value.length - 1] === " ") {
        // event.target.value = event.target.value.trim();
        color = "#3f51b5";
        spaceTyped();
    }
    if(current >= words.length - 1) {
        spaceTyped();
    }
    if(start_game == false) {
        start_game = true;
        timer = setInterval(tick, 1000);
    }
    calculateWPM();
}

function calculateWPM() {
    var characters = 0;
    for(var i = 0; i < current; i++) {
        characters += words[i].length;
    }
    characters += current;
    if(seconds < 1) {
        speed = 0;
    } else {
        speed = (characters * 60/(seconds * 5)).toFixed(2);
    }
    document.getElementById('speed_counter').innerHTML = speed;
}

function tick() {
    seconds++;
}

function spaceTyped() {
    console.log("space typed");
    var text = document.getElementById('text-container');
    var input = document.getElementById('type');
    console.log("word: " + input.value + words[current]);
    var match = false;
    if(current >= words.length - 1) {
        if(input.value === words[current]) {
            match = true;
        }
    }
    
    if(input.value.slice(0, input.value.length - 1) === words[current] || match) {
        console.log("matched");
        input.value = "";
        current++;
        changeText();
        streak++;
        score += speed * streak;
        if(current == words.length) {
            end_game = true;
        }
    } else {
        console.log("not matched");
    }
}

function changeText() {
    var text = document.getElementById('text-container');
    text.innerHTML = "";
    if(current >= words.length){
        return;
    }

    for(var i = 0; i < current; i++) {
        text.innerHTML += words[i];
        text.innerHTML += " ";
    }

    text.innerHTML += "<span style='background-color:"+ color +"';font-weight:800;>" + words[current] + " </span>";

    for(var i = current + 1; i < words.length; i++) {
        text.innerHTML += words[i];
        text.innerHTML += " ";
    }
}