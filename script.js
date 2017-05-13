const MAX_NUMBER = 12;
const ANIMATION_DURATION = 350;

let intervalId;
let currentScore;
let currentTime;
let selectedItems;
let usedItems;
let boardItems;

let isBoardLocked = false;

$(document).ready(function () {
    let $board = $('#board-container');
    $board.hide();
    $board.removeClass("hide");

    $('#start_easy').click(function () {
        startGame(0);
    });
    $('#start_medium').click(function () {
        startGame(1);
    });
    $('#start_hard').click(function () {
        startGame(2);
    });

    $('#go-home').click(function () {
        endGame(false);
    });
});

function startGame(difficulty) {
    $('#board').children().each(function () {
        $(this).remove();
    });
    $('#menu').hide(ANIMATION_DURATION, function () {
        currentScore = 0;
        $('#score').html(currentScore);
        setupTiles(difficulty);
        setupTimer();
        $('#board-container').show(ANIMATION_DURATION);
    });

    function setupTiles(difficulty) {
        selectedItems = [];
        usedItems = [];
        boardItems = [];
        const numberList = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11];
        if (difficulty === 0) {
            numberList.splice(6, numberList.length - 6);
        } else if (difficulty === 1) {
            numberList.splice(9, numberList.length - 12);
        }

        const numberOfSwaps = 1000;
        for (let i = 0; i < numberOfSwaps; i++) {
            const first = parseInt(Math.random() * numberList.length);
            const second = parseInt(Math.random() * numberList.length);

            if (first !== second) {
                const temp = numberList[first];
                numberList[first] = numberList[second];
                numberList[second] = temp;
            }
        }

        let idCounter = 0;
        numberList.forEach(function (number) {
            boardItems.push({
                id: idCounter++,
                number: number,
                url: getImage(number),
                isFlipped: false,
                isUsed: false,
            });
        });

        boardItems.forEach(function (item) {
            let $cardWrapper = $('<div class="match-card-wrapper"></div>');
            $cardWrapper.attr("id", "card-" + item.id);
            $cardWrapper.click(function () {
                if (!isBoardLocked) {
                    $cardWrapper.toggleClass('flipped');

                    item.isFlipped = !item.isFlipped;
                    onCardClick(item);
                }
            });

            let $card = $('<div class="match-card"></div>');
            $cardWrapper.append($card);

            let $front = $('<div class="front indigo lighten-2"></div>');
            $card.append($front);

            let $back = $('<div class="back grey lighten-2"></div>');
            $back.append($('<img src="' + item.url + '"/>'));
            $card.append($back);

            $('#board').append($cardWrapper);
        });
    }

    function setupTimer() {
        currentScore = 0;
        currentTime = 180;
        intervalId = setInterval(() => {
            currentTime -= 1;
            $('#time').html(currentTime);

            if (currentTime === 0) {
                endGame(false);
                clearInterval(intervalId);
            }
        }, 1000);
    }

    function onCardClick(item) {
        if (item.isFlipped) {
            if (selectedItems.length >= 1) {
                selectedItems.push(item);

                if (selectedItems[0].number === item.number) {
                    // Mark the tiles as selected, increase the score
                    selectedItems.forEach((card) => {
                        boardItems.forEach((item) => {
                            if (card.id === item.id) {
                                usedItems.push(item);
                                $("#card-" + item.id).unbind('click');
                            }
                        });
                    });
                    selectedItems = [];

                    currentScore += 5;
                    $('#score').html(currentScore);

                    if (usedItems.length === boardItems.length) {
                        clearInterval(intervalId);
                        setTimeout(function () {
                            endGame(true);
                        }, 1000);
                    }
                } else {
                    // decrease the score
                    isBoardLocked = true;
                    currentScore -= 2;
                    $('#score').html(currentScore);

                    setTimeout(function () {
                        // Animate the cards back to their front state
                        selectedItems.forEach((card) => {
                            boardItems.forEach((item) => {
                                if (item.id === card.id) {
                                    item.isFlipped = !item.isFlipped;
                                    $("#card-" + item.id).toggleClass("flipped");
                                }
                            });
                        });

                        setTimeout(function () {
                            isBoardLocked = false;
                        }, ANIMATION_DURATION);

                        selectedItems = [];
                    }, 750);
                }
            }
            else {
                selectedItems.push(item);
            }
        } else {
            // the card was flipped back over
            selectedItems.forEach((card, index) => {
                if (item.id === card.id) {
                    selectedItems.splice(index, 1);
                }
            });
        }
    }

}

function endGame(didWin) {
    if (didWin) {
        Materialize.toast("Congrats, you won the game!", 5000);

        let highScore = localStorage.getItem("high-score");
        if (currentScore > parseInt(highScore)) {
            localStorage.setItem("high-score", currentScore);
            setTimeout(function () {
                Materialize.toast("You set a new high score!", 4000);
            }, 3000);
            $('#high-score').html(currentScore);
        }
    } else {
        Materialize.toast("You have lost the game and navigated to the home screen", 5000);
    }

    $('#time').html(0);

    clearInterval(intervalId);

    $('#board-container').hide(ANIMATION_DURATION, function () {
        $('#menu').show(ANIMATION_DURATION);
    });

}

function getImage(number) {
    if (typeof number !== 'number') {
        console.log("Error, invalid value");
        return null;
    } else if (number < 0 || number >= 12) {
        console.log("Number must be between 0 and 11, found " + number);
        return null;
    } else {
        switch (number) {
            case 0:
                return 'https://www.programiz.com/sites/tutorial2program/files/c-logo.png';
            case 1:
                return 'https://cdn.codementor.io/assets/tutors/c-sharp-tutors-online.png';
            case 2:
                return 'https://ignite.apache.org/images/cpp.png';
            case 3:
                return 'https://upload.wikimedia.org/wikipedia/en/thumb/3/30/Java_programming_language_logo.svg/1200px-Java_programming_language_logo.svg.png';
            case 4:
                return 'https://raw.githubusercontent.com/react-chunky/react-chunky/master/logo.png';
            case 5:
                return 'https://d21ii91i3y6o6h.cloudfront.net/gallery_images/from_proof/14939/small/1472226645/kotlin-logo.png';
            case 6:
                return 'http://en.webdreamlab.com/assets/images/technologies/JavaScript-logo.png';
            case 7:
                return 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/PHP-logo.svg/1200px-PHP-logo.svg.png';
            case 8:
                return 'https://www.python.org/static/opengraph-icon-200x200.png';
            case 9:
                return 'https://www.scala-lang.org/resources/img/smooth-spiral.png';
            case 10:
                return 'https://upload.wikimedia.org/wikipedia/en/thumb/6/68/Oracle_SQL_Developer_logo.svg/902px-Oracle_SQL_Developer_logo.svg.png';
            case 11:
                return 'https://developer.apple.com/swift/images/swift-og.png';
        }
    }
}