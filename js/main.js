var current = 0; // current word from the content
var clr = "#3f51b5"; // theme color of the website
var content =
    content_lib[Math.floor((Math.random() * 100) % content_lib.length)]; // choosing random quote from the list
var words = content.split(" "); // array of words from the quote/content
var encourage_words = [
    // some words that appear as streak rises
    "Nice",
    "Good",
    "Great",
    "Excellent",
    "Awesome",
    "Unbelievable",
    "Outstanding",
    "Funky",
    "God Like",
];
var seconds = 0; // number of seconds passed to calculate speed
var start_game = false; // a variable to keep track of the game
var incorrent_words = 0; // number of words that are incorrect: for accuracy
var timer; // timer that keeps track of the tick: clock
var streak = 1; // streak that user maintains
var score = 0; // score calculated according to the streak and words
var score_posted = 0; // score that is currently being shown
var speed = 0; // typing speed of the user
var end_game = false; // keep track of end game
var score_speed = 100; // how fast the score is updated
var score_update; // the updated score
var audio = new Audio("../audio/background.mp3");
var timeouts = []; // the animations that are supposed to end
var mute = false; // is the sound playing or not
var dark = {
    // some colors when the game is in dark mode
    font_color: "white",
    theme_color: "#282828",
    primary_color: "#222",
};
var frenzy = {
    // color scheme when the game ends
    font_color: "black",
    theme_color: "#3f51b5",
    primary_color: "#1a237e",
};

// initialize the game by setting the content to the container and start updating the score as the game progresses
window.onload = async function () {
    document.getElementById("text-container").innerHTML = content;
    score_update = setInterval(updateScore, score_speed / (streak * 10));
    audio.loop = true; // looping the audio
};

// width of the streak bar
var bar_w = 0;

// increment the bar as the streak progress
function loading() {
    if (bar_w < 100) {
        bar_w += 10; // increment the bar by 10
        document.getElementById("loading-bar").style.width = bar_w + "%"; // increment the bar
    }
}

// play pause the music
function pausePlay(event) {
    if (audio.paused) {
        audio.play();
        // changing the sound icon to off
        document.getElementById("pause-image").src = "../icon/sound_off.png";
    } else {
        audio.pause();
        mute = true; // setting mute to true to keep track
        // changing the sound icon to on
        document.getElementById("pause-image").src = "../icon/sound_on.png";
    }
}

// update the score gradually animated
function updateScore() {
    // update the score until the posted score becomes the score
    if (score_posted < score) {
        // increment the score according to the streak
        score_posted += streak * 2;
        // update the score
        document.getElementById("score").innerHTML = score_posted;
    } else {
        // stop score update if the game ends
        if (end_game) {
            clearInterval(score_update);
        }
    }
    // stop timer if the game ends
    if (end_game) {
        clearInterval(timer);
        document.getElementById("text-container").innerHTML = content;
    }
}

// check the word that is typed for errors
function wordTyped(event) {
    var regmatch = words[current].match("^" + event.target.value);
    if (regmatch == null && event.target.value !== "") {
        // start of the word is not matched and therefore, highlighted with red
        clr = "#e53935";
    } else {
        // word is matched and therefore, highlighted with blue
        clr = "#3f51b5";
    }
    // move to the next word
    changeText();

    // as user enters space move to the next word if the word is correct
    if (event.target.value[event.target.value.length - 1] === " ") {
        clr = "#3f51b5";
        spaceTyped();
    }

    // check for the game end
    if (current >= words.length - 1) {
        spaceTyped();
    }

    // if game has not yet started mark the game as started
    if (start_game == false) {
        start_game = true; // game has started
        timer = setInterval(tick, 1000); // start the clock
        showMessage("Let's do this"); // indicate user that game has started
    }
    // calculate speed and accuracy to show to the user
    calculateWPM();
    calculateAccuracy();
}

// calculates the speed in wpm
function calculateWPM() {
    var characters = 0;
    // count the characters user has entered so far
    for (var i = 0; i < current; i++) {
        characters += words[i].length;
    }
    // add all the spaced that are in between the words : they are equal to the words written so far
    characters += current;

    // if seconds is near to zero avoid division by zero
    if (seconds < 1) {
        speed = 0;
    } else {
        speed = ((characters * 60) / (seconds * 5)).toFixed(2);
    }
    // update the speed to the html
    document.getElementById("speed_counter").innerHTML = speed;
}

// calculate the accuracy of the user
function calculateAccuracy() {
    // percentage of the correct words from total words
    var per = ((current - incorrent_words) / current) * 100;
    per = per.toFixed(2);
    // if it is negative avoid printing negative entry
    if (per <= 0) {
        document.getElementById("accuracy_counter").innerHTML = 0;
    } else {
        document.getElementById("accuracy_counter").innerHTML = per;
    }
}

// clock to keep track of how many seonds have passed
function tick() {
    seconds++;
}

// called when user enters 'space'
function spaceTyped() {
    var text = document.getElementById("text-container");
    var input = document.getElementById("type");
    var match = false;
    if (current >= words.length - 1) {
        if (input.value === words[current]) {
            match = true;
        }
    }

    // check the word after removing the space from it
    if (
        input.value.slice(0, input.value.length - 1) === words[current] ||
        match
    ) {
        // word entered is a match
        input.value = "";
        current++; // progress the word
        changeText(); // move to the next word
        streak = streak + 1; // increment the streak
        loading(); // progress the streak bar
        if (streak % 5 == 0) {
            // show progressive encouraging texts to user
            showMessage(encourage_words[streak / 5]);
        }
        // update the score according to the streak
        score += speed * streak;

        // if current word was the last word
        if (current == words.length) {
            end_game = true; // mark the game as finished
            reduce_volume_to_zero(); // gradually reduce the volume to zero
            // change the appereance to mark the end
            $(".main-container").css("background-color", frenzy.primary_color);
            $(".text-container").css("visibility", "hidden");
            $(".bonus-text").css("visibility", "visible");
            $("#type").css("background-color", frenzy.primary_color);
            $("body").css("background-color", frenzy.theme_color);
            $("body").css("color", "black");
            $("#canvas").css("visibility", "visible");
        }
    } else {
        // if the word is not matched reduce the streak
        streak = 0;
        incorrent_words++;
        bar_w = 0;
        loading();
    }
}

// move to the next word
// why do you name functions like this
function changeText() {
    var text = document.getElementById("text-container");
    text.innerHTML = "";

    // the game has ended
    if (current >= words.length) {
        return;
    }

    // iterate till the current word
    for (var i = 0; i < current; i++) {
        text.innerHTML += words[i];
        text.innerHTML += " ";
    }

    // set the styling
    text.innerHTML +=
        "<span style='background-color:" +
        clr +
        "';font-weight:800;>" +
        words[current] +
        " </span>";

    // iterate through rest of the words
    for (var i = current + 1; i < words.length; i++) {
        text.innerHTML += words[i];
        text.innerHTML += " ";
    }
}

// display the message with animation
function showMessage(message) {
    $(".encouraging-text").removeClass("encouraging-text-animated");
    for (var i = 0; i < timeouts.length; i++) {
        clearTimeout(i);
    }
    // make a list of timeouts to end them if they haven't before starting a new one
    timeouts = [];
    $(".encouraging-text").html(message);
    $(".encouraging-text").addClass("encouraging-text-animated");
    var timeout = setTimeout(
        () => $(".encouraging-text").removeClass("encouraging-text-animated"),
        4000
    );
    timeouts.push(timeout);
}

var volume = 1; // volume of the music
var timed; // reducing the volume
// reduce the volume gradually to zero
function reduce_volume_to_zero() {
    timed = setInterval(reduce_volume, 300);
    setTimeout(() => {
        clearInterval(timed);
        console.log("stopped");
    }, 4000);
}

// reduce the volume in a loop to 0
function reduce_volume() {
    volume -= 0.08;
    if (volume <= 0) {
        volume = 0;
    }
    audio.volume = volume;
}

// restart the game by reloading the page
function restart() {
    window.location = "./index.html";
}
