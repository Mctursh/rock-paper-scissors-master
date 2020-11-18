function testAnim(x) {
  $('.modal .modal-dialog').attr('class', 'modal-dialog  ' + x + '  animated');
};
$('#myModal').on('show.bs.modal', function (e) {
  $('.modal .modal-dialog').attr('class', 'modal-dialog slideInUp animated');
})

$('#myModal').on('hide.bs.modal', function (e) {
  $('.modal .modal-dialog').attr('class', 'modal-dialog slideOutDown animated');
})


$(".paper.icon").on("click", function() {
  $(".scissors.icon, .rock.icon, .paper.icon").off()
  $(".paper.icon").fadeOut(500).fadeIn(500)
  $(".first-svg, .rock.icon, .low-text, .second-rock").toggleClass("invisible");
  $(".scissors.icon").addClass("house-color");
  $(".second-scissors").toggleClass("invisible");
  setTimeout(function(){
    housePick();
  },3000);
})

$(".scissors.icon").on("click", function(){
  yourPick("scissors");
  setTimeout(function(){
    housePick();
  },3000);
})

$(".rock.icon").on("click", function(){
  yourPick("rock");
  setTimeout(function(){
    housePick();
  },3000);
})

function housePick() {
  let randNum = (Math.floor(Math.random() * 3));
  let svg = ["paper", "scissors", "rock"]

  $(".scissors.icon").toggleClass("house-color");
  if (svg[randNum] === "scissors"){
    $(".scissors.icon").fadeOut(500).fadeIn(500);
    $(".second-scissors").toggleClass("invisible");
  } else {
    $(".scissors.icon").addClass("." + svg[randNum] + "-spam");
    $(".second-scissors").addClass("hide")
    $(".second-" + svg[randNum]).toggleClass("hide")
  }
}



function yourPick(icon) {
  $(".scissors.icon, .rock.icon, .paper.icon").off()
  $(".first-paper").fadeOut(2000).addClass("hide");
  $(".paper.icon").addClass(icon + "-span");
  $(".first-" + icon).fadeIn(2000).toggleClass("hide");
  $(".first-svg, .rock.icon, .low-text").toggleClass("invisible");
  $(".scissors.icon").toggleClass("house-color");
  $(".second-scissors").toggleClass("invisible");
}
