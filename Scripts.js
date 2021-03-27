(function () {
    "use strict";

    const pieces = [...document.querySelectorAll(".game-board > .colorsquare")];
    const SoundButton = document.getElementById("toggle-audio");
    const ClickScore = document.getElementById("clicks");
    let ShuffledPieces = pieces;
    let ClickCount = 0;
    let EnableSound = false;

    const SoundMgr = {
        blue: new Audio("./Blue.wav"),
        pink: new Audio("./Pink.wav"),
        white: new Audio("./White.wav"),
        red: new Audio("./Red.wav")
    };

    const shuffle = function (array) {
        let currentIndex = array.length, temp, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temp = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temp;
        }

        return (array);
    };

    const updatePositions = function () {
        ShuffledPieces.forEach((piece) => {
            piece.parentNode.appendChild(piece);
        });
    };

    const reset = function () {
        ClickCount = 0;
        ShuffledPieces = shuffle([...pieces]);
        updatePositions();
    };

    const updateToggleButtonText = function (audioText) {
        const e = SoundButton.parentElement.querySelector("span");
        e.innerText = audioText;
    };

    const toggleAudio = function () {
        let audioText = "";
        switch (EnableSound) {
            case true: {
                EnableSound = false;
                audioText = "off";
                break;
            }
            default: {
                EnableSound = true;
                audioText = "on";
                break;
            }
        }
        updateToggleButtonText(audioText);
    };

    const say = function (statement) {
        if (window.speechSynthesis.speak) {
            window.speechSynthesis.speak(new SpeechSynthesisUtterance(statement));
        }
    };

    const ActivateColorSquare = function () {
        const clickedPiece = this || null;
        clickedPiece.focus();
        var SquareColor = null;

        var ClassList = clickedPiece.classList;

        for (let i = 0; i < ClassList.length; ++i) {
            if (SoundMgr.hasOwnProperty(ClassList[i])) {
                SquareColor = ClassList[i];
            }
        }

        ++ClickCount;
        ClickScore.textContent = ClickCount;

        if (EnableSound) {
            SoundMgr[SquareColor].play();
        }
    };

    const handleKeyDown = function (event) {
        let indexOfClickedPiece;

        switch (event.key) {
            case "c": {
                currentState(true);
                break;
            }
            case "1": case "2": case "3": case "4": {
                const clickedPiece = document.getElementById(`block-${parseInt(event.key)}`);
                indexOfClickedPiece = pieces.indexOf(clickedPiece);
                break;
            }
            default: {
                break;
            }
        }

        const clickedPiece = pieces[indexOfClickedPiece];
        if (clickedPiece) {
            ActivateColorSquare.call(clickedPiece, event);
        }
    };

    const playAudio = function (audioVar) {
        if (window.currentlyPlaying) {
            window.currentlyPlaying.pause();
        }
        window.currentlyPlaying = audioVar.target;
    };

    addEventListener("keydown", handleKeyDown);
    addEventListener("play", playAudio, true);
    SoundButton.addEventListener("click", toggleAudio);

    SoundButton.click();

    for (const piece of pieces) {
        piece.addEventListener("click", ActivateColorSquare);
        piece.addEventListener("keypress", ActivateColorSquare);
    }

    reset();
    updatePositions();
}());

console.log("Game scripts loaded.");
