//event listner for the modals
$('#myModal').on('show.bs.modal', function(e) {
  $('.modal .modal-dialog').attr('class', 'modal-dialog slideInUp animated');
})

$('#myModal').on('hide.bs.modal', function(e) {
  $('.modal .modal-dialog').attr('class', 'modal-dialog slideOutDown animated');
})

$('#leaderboard').on('show.bs.modal', function(e) {
  $('.modal .modal-dialog').attr('class', 'modal-dialog slideInUp animated');
})

$('#leaderboard').on('hide.bs.modal', function(e) {
  $('.modal .modal-dialog').attr('class', 'modal-dialog slideOutDown animated');
})


//event listner for the icons
$(".paper.icon").on("click", function() {
  process("paper");
})

$(".scissors.icon").on("click", function() {
  process("scissors");
})

$(".rock.icon").on("click", function() {
  process("rock")
})

//this function restarts the game and set everything to default
function restart() {
  $("button.btn-light").on("click", function() {
    $(".house-text, .low-text").toggleClass("invisiblility");
    $(".bottom").toggleClass("invisiblility")
    $(".first-svg, .rock.icon").toggleClass("invisiblility");
    $("#you, #computer").text(0)

    //sets the score to default
    yourScore = 0;
    computerScore = 0;

    //re-assigns event listners to the icons
    $(".paper.icon").on("click", function() {
      process("paper");
    })

    $(".scissors.icon").on("click", function() {
      process("scissors");
    })
    $(".rock.icon").on("click", function() {
      process("rock")
    })
  })
}

let yourScore = 0;
let computerScore = 0;



//function that process the game
function process(arg) {
  if (arg === "paper") {
    //checks if the arg passed is paper and if yes, sends it to another function "processPaper"
    processPaper()
  } else {
    let yourChosen = yourPick(arg);    //this returns your pick to the "yourChosen" variable
    setTimeout(function() {
      let computerChosen = housePick();   //this returns a random chosen icon as the "computerChosen" variable
      check(computerChosen, yourChosen);   //checks and compile the logic and updates the scores
      setTimeout(function() {
        $(".second-" + computerChosen).addClass("hide");
        $(".second-scissors").removeClass("hide invisiblility")
        $(".scissors.falseIcon").toggleClass(computerChosen + "-span");
        if (yourChosen != "paper") {
          $(".first-" + yourChosen).attr("style", "display: none !important;");
          $(".first-paper").attr("style", "display: inline !important;");
        }

        $(".house-text").toggleClass("invisiblility");
        $(".paper.falseIcon").toggleClass(yourChosen + "-span");
        $(".first-svg, .rock.falseIcon, .low-text").toggleClass("invisiblility");
        $(".scissors.falseIcon, .rock.falseIcon, .paper.falseIcon").toggleClass("icon").toggleClass("falseIcon")
        //this checks to see if we have a winner else calls the calls the process function again to continue
        if (yourScore < 10) {
          if (computerScore < 10) {
            $(".paper.icon").on("click", function() {
              process("paper");
            })
            $(".scissors.icon").on("click", function() {
              process("scissors");
            })
            $(".rock.icon").on("click", function() {
              process("rock")
            })
          } else {
            $(".scissors.icon, .rock.icon, .paper.icon").off()
            $(".house-text, .low-text").toggleClass("invisiblility");
            //checks to see the winner of the game
            if (yourScore > computerScore) {
              //this displays if the player won
              winnerDisplay()
            } else {
              //this displays if the player lost
              loserDisplay()
            }
          }
        } else {
          $(".scissors.icon, .rock.icon, .paper.icon").off()
          $(".house-text, .low-text").toggleClass("invisiblility");
          //checks to see the winner of the game
          if (yourScore > computerScore) {
            //this displays if the player won
            winnerDisplay()
          } else {
            //this displays if the player lost
            loserDisplay()
          }
        }
      }, 2500)
    }, 3000)
  }
}


//this triggeres only if the user picked paper
function processPaper() {
  $(".scissors.icon, .rock.icon, .paper.icon").toggleClass("icon").toggleClass("falseIcon").off();
  $(".paper.falseIcon").fadeOut(500).fadeIn(500)
  $(".first-svg, .rock.falseIcon, .low-text, .second-rock").toggleClass("invisiblility");
  $(".scissors.falseIcon").addClass("house-color");
  $(".second-scissors").toggleClass("invisiblility");
  let yourChosen = "paper"
  setTimeout(function() {
    let computerChosen = housePick();      //this returns a random chosen icon as the "computerChosen" variable
    check(computerChosen, yourChosen)      //checks and compile the logic and updates the scores
    setTimeout(function() {
      $(".second-" + computerChosen).addClass("hide");
      $(".second-scissors").removeClass("hide invisiblility")
      $(".scissors.falseIcon").toggleClass(computerChosen + "-span");
      if (yourChosen != "paper") {
        $(".first-" + yourChosen).addClass("hide");
        $("#first-paper").attr("id", "hide");
      }
      $(".house-text").toggleClass("invisiblility");
      $(".paper.falseIcon").toggleClass(yourChosen + "-span");
      $(".first-svg, .rock.falseIcon, .low-text").toggleClass("invisiblility");
      $(".scissors.falseIcon, .rock.falseIcon, .paper.falseIcon").toggleClass("icon").toggleClass("falseIcon")
      //this checks to see if we have a winner else calls the calls the process function again to continue
      if (yourScore < 10) {
        if (computerScore < 10) {
          $(".paper.icon").on("click", function() {
            process("paper");
          })

          $(".scissors.icon").on("click", function() {
            process("scissors");
          })
          $(".rock.icon").on("click", function() {
            process("rock")
          })
        } else {
          $(".scissors.icon, .rock.icon, .paper.icon").off()
          $(".house-text, .low-text").toggleClass("invisiblility");
          //checks to see the winner of the game
          if (yourScore > computerScore) {
            //this displays if the player won
            winnerDisplay()
          } else {
            //this displays if the player lost
            loserDisplay()
          }
        }
      } else {
        $(".scissors.icon, .rock.icon, .paper.icon").off()
        $(".house-text, .low-text").toggleClass("invisiblility");
        //checks to see the winner of the game
        if (yourScore > computerScore) {
          //this displays if the player won
          winnerDisplay()
        } else {
          //this displays if the player lost
          loserDisplay()
        }
      }
    }, 2500)
  }, 3000);

}


function winnerDisplay() {
  $(".first-svg, .rock.icon").toggleClass("invisiblility");
  $(".bottom").toggleClass("invisiblility")
  $(".bottom h1").text("YOU WIN")
  $("#lose-button").addClass("hide")
  setTimeout(function() {
    $("button.btn-light").unbind()     //turns off event listener on the button
    $("#win")[0].click()     //triggers the click on the href with the "win" id
    restart()
  }, 3000)
}

function loserDisplay() {
  $(".first-svg, .rock.icon").toggleClass("invisiblility");
  $(".bottom").toggleClass("invisiblility");
  $(".bottom h1").text("YOU LOSE")
  $("#win-button").addClass("hide")
  setTimeout(function() {
    $("button.btn-light").unbind()     //turns off event listener on the button
    $("#lose")[0].click()             //triggers the click on the href with the "win" id
    restart()
  }, 3000);
}

//checks to see the winner of the round and updates the score board
function check(computerChosen, yourChosen) {
  setTimeout(function() {
    if (computerChosen === "scissors" && yourChosen === "rock") {
      yourScore += 1;
      $("#you").text(yourScore);
    } else if (computerChosen === "rock" && yourChosen === "paper") {
      yourScore += 1;
      $("#you").text(yourScore);
    } else if (computerChosen === "paper" && yourChosen === "scissors") {
      yourScore += 1;
      $("#you").text(yourScore);
    } else if (yourChosen === "scissors" && computerChosen === "rock") {
      computerScore += 1;
      $("#computer").text(computerScore);
    } else if (yourChosen === "rock" && computerChosen === "paper") {
      computerScore += 1;
      $("#computer").text(computerScore);
    } else if (yourChosen === "paper" && computerChosen === "scissors") {
      computerScore += 1;
      $("#computer").text(computerScore);
    }
  }, 1000)
}

//function that generates a random chosen icon as the computer chosen icon
function housePick() {
  let randNum = (Math.floor(Math.random() * 3));
  let svg = ["paper", "scissors", "rock"]

  $(".scissors.falseIcon").toggleClass("house-color");
  if (svg[randNum] === "scissors") {
    $(".scissors.falseIcon").toggleClass(svg[randNum] + "-span");
    $(".second-scissors").toggleClass("invisiblility");
  } else {
    $(".scissors.falseIcon").toggleClass(svg[randNum] + "-span");
    $(".second-scissors").toggleClass("hide")
    $(".second-" + svg[randNum]).toggleClass("hide").removeClass("invisiblility");
  }
  $(".house-text").toggleClass("invisiblility");

  return svg[randNum];
}


//this sets up the UI with respect to what the player chose
function yourPick(icon) {
  $(".scissors.icon, .rock.icon, .paper.icon").toggleClass("icon").toggleClass("falseIcon").off();
  $(".first-paper").fadeOut(2000).attr("style", "display: none !important;");
  $(".paper.falseIcon").toggleClass(icon + "-span");
  $(".first-" + icon).fadeIn(2000).attr("style", "display: inline !important;");
  $(".first-svg, .rock.falseIcon, .low-text").toggleClass("invisiblility");
  $(".scissors.falseIcon").toggleClass("house-color");
  $(".second-scissors").toggleClass("invisiblility");
  return icon;
}
