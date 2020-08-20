var current = 0;
var color = "#3f51b5";
var content = content_lib[Math.floor(Math.random() * content_lib.length)];
var words = content.split(" ");
var encourage_words = ['Nice', 'Good', 'Great', 'Excellent', 'Awesome', 'Unbelievable', 'Outstanding', 'Funky', 'God Like'];
var seconds = 0;
var start_game = false;
var incorrent_words = 0;
var timer;
var streak = 1;
var score = 0;
var score_posted = 0;
var speed = 0;
var end_game = false;
var score_speed = 100;
var score_update;
var audio = new Audio("../audio/background.mp3");
var timeouts = []
var mute = false;
var dark = {
    font_color: "white",
    theme_color: "#282828",
    primary_color: "#222",
};
var frenzy = {
    font_color: "black",
    theme_color: "#3f51b5",
    primary_color: "#1a237e"
};

window.onload = async function() {
    document.getElementById('text-container').innerHTML = content;
    score_update = setInterval(updateScore, score_speed/(streak*10));
    audio.loop = true;
    //setTimeout(()=>{audio.src="../audio/frenzy.mp3"; audio.play()}, 3000);
    // setInterval(loading, 100);
}

var bar_w = 0;

function loading() {
    if(bar_w < 100) {
        console.log('loading');
        bar_w+=10;
        document.getElementById('loading-bar').style.width = bar_w + "%";
    }
}

function pausePlay(event) {
    if(audio.paused) {
        audio.play();
        document.getElementById('pause-image').src = "../icon/sound_off.png";
    } else {
        audio.pause();
        mute = true;
        document.getElementById('pause-image').src = "../icon/sound_on.png";
    }
}

function onTextClick(event) {
    if(!mute) {
        //audio.play();
        //document.getElementById('pause-image').src = "../icon/sound_off.png";
    }
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
        console.log(words[current].match("^" + event.target.value))
    } else {
        color="#3f51b5";
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
        $(".encouraging-text").html("Let's do this");
        $(".encouraging-text").addClass("encouraging-text-animated");
        setTimeout(()=>$(".encouraging-text").removeClass("encouraging-text-animated"), 4000);
    }
    calculateWPM();
    calculateAccuracy();
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

function calculateAccuracy() {
    var per = (current - incorrent_words) / current * 100; 
    per = per.toFixed(2);
    if(per <= 0) {
        document.getElementById('accuracy_counter').innerHTML = 0;
    } else {
        document.getElementById('accuracy_counter').innerHTML = per;
    }
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
        streak = streak + 1;
        console.log("streak: ", streak);
        loading(); 
        if(streak % 5 == 0) {
            showMessage(encourage_words[streak / 5]);
        }
        score += speed * streak;
        if(current == words.length) {
            end_game = true;
            reduce_volume_to_zero();
            $('.main-container').css("background-color", frenzy.primary_color);
            $('.text-container').css("visibility", "hidden");
            $('.bonus-text').css("visibility", "visible");
            $('#type').css("background-color", frenzy.primary_color);
            $("body").css("background-color", frenzy.theme_color);
            $("body").css("color", "black");
            // toggleAnimation();
            $("#canvas").css("visibility", "visible");
        }
    } else {
        console.log("not matched");
        streak = 0;
        incorrent_words++;
        bar_w = 0;
        loading();
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

function showMessage(message) {
    $(".encouraging-text").removeClass("encouraging-text-animated");
    for(var i = 0; i < timeouts.length; i++) {
        clearTimeout(i);
    }
    timeouts = [];
    $(".encouraging-text").html(message);
    $(".encouraging-text").addClass("encouraging-text-animated");
    var timeout = setTimeout(()=>$(".encouraging-text").removeClass("encouraging-text-animated"), 4000);
    timeouts.push(timeout);
}

var volume = 1;
var timed;
function reduce_volume_to_zero() {
    timed = setInterval(reduce_volume, 300);
    setTimeout(()=>{clearInterval(timed); console.log("stopped")}, 4000);
}

function reduce_volume() {
    volume-= 0.08;
    if( volume <= 0) {
        volume = 0;
    }
    audio.volume = volume;
}

function restart() {
    window.location = "./index.html"
}