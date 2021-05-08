(function () {
    "use strict";

    const Pieces = [...document.querySelectorAll(".game-board > .colorsquare")];
    const SoundButton = document.getElementById("toggle-audio");
    const ClickScore = document.getElementById("clicks");
    let ShuffledPieces = Pieces;
    let ClickCount = 0;
    let EnableSound = false;

    const SoundMgr = {
        blue: new Audio("./Blue.wav"),
        pink: new Audio("./Pink.wav"),
        white: new Audio("./White.wav"),
        red: new Audio("./Red.wav")
    };

    const shuffle = function (SquaresArray) {
        let CurrentIndex = SquaresArray.length, Temp, RandomIndex;

        while (CurrentIndex !== 0) {
            RandomIndex = Math.floor(Math.random() * CurrentIndex);
            CurrentIndex -= 1;

            Temp = SquaresArray[CurrentIndex];
            SquaresArray[CurrentIndex] = SquaresArray[RandomIndex];
            SquaresArray[RandomIndex] = Temp;
        }

        return (SquaresArray);
    };

    const updatePositions = function () {
        ShuffledPieces.forEach((P) => {
            P.parentNode.appendChild(P);
        });
    };

    const reset = function () {
        ClickCount = 0;
        ShuffledPieces = shuffle([...Pieces]);
        updatePositions();
    };

    const updateToggleButtonText = function (audioText) {
        const e = SoundButton.parentElement.querySelector("span");
        e.innerText = audioText;
    };

    const toggleAudio = function () {
        let AudioText = "";
        switch (EnableSound) {
            case true: {
                EnableSound = false;
                AudioText = "off";
                break;
            }
            default: {
                EnableSound = true;
                AudioText = "on";
                break;
            }
        }
        updateToggleButtonText(AudioText);
    };

    const say = function (statement) {
        if (window.speechSynthesis.speak) {
            window.speechSynthesis.speak(new SpeechSynthesisUtterance(statement));
        }
    };

    const ActivateColorSquare = function () {
        const ClickedPiece = this || null;
        ClickedPiece.focus();
        var SquareColor = null;

        var ClassList = ClickedPiece.classList;

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
        let IndexOfClickedPiece;

        switch (event.key) {
            case "c": {
                currentState(true);
                break;
            }
            case "1": case "2": case "3": case "4": {
                const clickedPiece = document.getElementById(`block-${parseInt(event.key)}`);
                IndexOfClickedPiece = Pieces.indexOf(clickedPiece);
                break;
            }
            default: {
                break;
            }
        }

        const ClickedPiece = Pieces[IndexOfClickedPiece];
        if (ClickedPiece) {
            ActivateColorSquare.call(ClickedPiece, event);
        }
    };

    const playAudio = function (AudioVar) {
        if (window.currentlyPlaying) {
            window.currentlyPlaying.pause();
        }
        window.currentlyPlaying = AudioVar.target;
    };

    addEventListener("keydown", handleKeyDown);
    addEventListener("play", playAudio, true);
    SoundButton.addEventListener("click", toggleAudio);

    SoundButton.click();

    for (const P of Pieces) {
        P.addEventListener("click", ActivateColorSquare);
        P.addEventListener("keypress", ActivateColorSquare);
    }

    reset();
    updatePositions();
}());

console.log("Game scripts loaded.");
