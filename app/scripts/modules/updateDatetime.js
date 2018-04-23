// FUNC: Show the current date and time
function updateDatetime() {
  var div = $('.navigation .datetime');

  var d = new Date();
  var days = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
  var months = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
  var time = checkZero(d.getHours()) + ':' + checkZero(d.getMinutes());

  var date = [d.getDate(), months[d.getMonth()], d.getFullYear()].join(' ');
  date = [days[d.getDay()], date].join(', ');
  div.html('<p>'+ [date, time].join(' / ') +'</p>');

  // Repeat function every second
  setTimeout(updateDatetime, 1000);

  // FUNC: Check if current digit is lower than 10, if so add a zero
  function checkZero(d) {
    if(d < 10) {
      d = '0' + d;
    }

    return d;
  }
}
