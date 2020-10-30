function testAnim(x) {
    $('.modal .modal-dialog').attr('class', 'modal-dialog  ' + x + '  animated');
};
$('#myModal').on('show.bs.modal', function (e) {
  // var anim = $('#entrance').val();
  //     testAnim(anim);
  $('.modal .modal-dialog').attr('class', 'modal-dialog slideInUp animated');
})
$('#myModal').on('hide.bs.modal', function (e) {
  // var anim = $('#exit').val();
  //     testAnim(anim);
  $('.modal .modal-dialog').attr('class', 'modal-dialog slideOutDown animated');
})
