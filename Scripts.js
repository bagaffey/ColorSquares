(function () {
    "use strict";

    const pieces = [...document.querySelectorAll(".game-board > .colorsquare")];
    const soundButton = document.getElementById("toggle-audio");
    const clickScore = document.getElementById("clicks");
    let shuffledPieces = pieces;
    let clickCount = 0;
    let audio = false;

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
        shuffledPieces.forEach((piece) => {
            piece.parentNode.appendChild(piece);
        });
    };

    const reset = function () {
        clickCount = 0;
        shuffledPieces = shuffle([...pieces]);
        updatePositions();
    };

    const updateToggleButtonText = function (audioText) {
        const e = soundButton.parentElement.querySelector("span");
        e.innerText = audioText;
    };

    const toggleAudio = function () {
        let audioText = "";
        switch (audio) {
            case true: {
                audio = false;
                audioText = "on";
                break;
            }
            default: {
                audio = true;
                audioText = "off";
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

    const currentState = function (requested) {
        let row1 = "Row1: ";
        let row2 = "Row2: ";

        shuffledPieces.forEach((piece, index) => {
            switch (true) {
                case (index <= 2): {
                    row1 += `${piece.getAttribute("aria-label")} `;
                    break;
                }
                case (index > 2 && index <= 5): {
                    row2 += `${piece.getAttribute("aria-label")} `;
                    break;
                }
                default: {
                    break;
                }
            }
        });

        if (requested) {
            say(row1);
            say(row2);
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

        ++clickCount;
        clickScore.textContent = clickCount;

        SoundMgr[SquareColor].play();
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
    soundButton.addEventListener("click", toggleAudio);

    soundButton.click();

    for (const piece of pieces) {
        piece.addEventListener("click", ActivateColorSquare);
        piece.addEventListener("keypress", ActivateColorSquare);
    }

    reset();
    updatePositions();
}());

console.log("Game scripts loaded.");
