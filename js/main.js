window.onload = async function() {
    document.getElementById('text-container').innerHTML = "";
    var content = "Lorem ipsum dolor sit amet consectetur</span>, adipisicing elit. Optio quia tenetur odit, magni hic beatae unde neque ipsam! Dolor adipisci illum possimus excepturi at iste explicabo deserunt amet odit ullam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam neque laudantium vel non expedita eum a nobis veniam impedit nam. Expedita, dolor corporis libero at ad quas autem veniam sapiente. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam blanditiis ipsa molestias unde quis! Fugiat eos maxime cum, necessitatibus perferendis architecto, recusandae est soluta, excepturi accusamus quidem qui fuga unde."
    var current = 0;
    var words = content.split(" ");

    var text = document.getElementById('text-container');
    for(var current = 0; current < words.length; current++) {
        text.innerHTML = "";
        for(var i = 0; i < current; i++) {
            text.innerHTML += words[i];
            text.innerHTML += " ";
        }

        text.innerHTML += "<span style='color:aqua';font-weight:800;>" + words[current] + " </span>";

        for(var i = current + 1; i < words.length; i++) {
            text.innerHTML += words[i];
            text.innerHTML += " ";
        }
        
        await sleep(300);        
    }
}

function sleep(time) {
    return new Promise((resolve, reject) => {
        console.log("time stopped");
        setTimeout(resolve, time);
    })
}