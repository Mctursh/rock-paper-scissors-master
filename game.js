function testAnim(x) {
  $('.modal .modal-dialog').attr('class', 'modal-dialog  ' + x + '  animated');
};
$('#myModal').on('show.bs.modal', function(e) {
  $('.modal .modal-dialog').attr('class', 'modal-dialog slideInUp animated');
})

$('#myModal').on('hide.bs.modal', function(e) {
  $('.modal .modal-dialog').attr('class', 'modal-dialog slideOutDown animated');
})



$(".paper.icon").on("click", function() {
  process("paper");
})

$(".scissors.icon").on("click", function() {
  process("scissors");
})
$(".rock.icon").on("click", function() {
  process("rock")
})

$("button.btn-light").on("click", function() {
  $(".house-text, .low-text").toggleClass("invisiblility");
  $(".bottom").toggleClass("invisiblility")
  $(".first-svg, .rock.icon").toggleClass("invisiblility");
  $("#you, #computer").text(0)
  yourScore = 0;
  computerScore = 0;
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


let yourScore = 0;
let computerScore = 0;




function process(arg) {
  if (arg === "paper") {
    processPaper()
  } else {
    let yourChosen = yourPick(arg);
    setTimeout(function() {
      let computerChosen = housePick();
      check(computerChosen, yourChosen);
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
              if (yourScore > computerScore) {
                winnerDisplay()
              } else {
                loserDisplay()
              }
            }
          } else {
            $(".scissors.icon, .rock.icon, .paper.icon").off()
            $(".house-text, .low-text").toggleClass("invisiblility");
            if (yourScore > computerScore) {
              winnerDisplay()
            } else {
              loserDisplay()
            }
        }
      },2500)
    }, 3000)}
  }



function processPaper() {
  $(".scissors.icon, .rock.icon, .paper.icon").toggleClass("icon").toggleClass("falseIcon").off();
  $(".paper.falseIcon").fadeOut(500).fadeIn(500)
  $(".first-svg, .rock.falseIcon, .low-text, .second-rock").toggleClass("invisiblility");
  $(".scissors.falseIcon").addClass("house-color");
  $(".second-scissors").toggleClass("invisiblility");
  let yourChosen = "paper"
  setTimeout(function() {
    let computerChosen = housePick();
    check(computerChosen, yourChosen)
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
          if (yourScore > computerScore) {
            winnerDisplay()
          } else {
            loserDisplay()
          }
        }
      } else {
        $(".scissors.icon, .rock.icon, .paper.icon").off()
        $(".house-text, .low-text").toggleClass("invisiblility");
        if (yourScore > computerScore) {
          winnerDisplay()
        } else {
          loserDisplay()
        }
      }
    }, 2500)
  }, 3000);

}


function winnerDisplay() {
  $(".first-svg, .rock.icon").toggleClass("invisiblility");
  $(".bottom").toggleClass("invisiblility")
}

function loserDisplay() {
  $(".first-svg, .rock.icon").toggleClass("invisiblility");
  $(".bottom").toggleClass("invisiblility");
  $(".bottom h1").text("YOU LOSE")
}

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

// $(".paper.icon").on("click", function() {
//   paperListner()
// })
// function paperListner() {
//   $(".paper.icon").on("click", function() {
//     processPaper();
//   })
// }
//
// $(".scissors.icon").on("click", function(){
//   scissorsListner()
// })
// function scissorsListner() {
//   $(".scissors.icon").on("click", function(){
//     process("scissors");
//   })
// }
//
// $(".rock.icon").on("click", function(){
//   rockListner();
// })
// function rockListner() {
//   $(".rock.icon").on("click", function(){
//     process("rock")
//   })
// }
