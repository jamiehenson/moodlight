function time_curve(weather){
  var start = new Date().setHours(0,0,0,0);
  var end = new Date().setHours(23,59,59,999);
  var noon = new Date().setHours(12,00,00,000);
  var now = new Date().getTime();
  var progress = 1-(Math.abs(noon-now) / (end - start));
  var p_lerp = parseInt(progress * 255);
  var col = hex_assemble(p_lerp,p_lerp,p_lerp);
  var anti_col = hex_assemble(255-p_lerp,255-p_lerp,255-p_lerp);
  var suncol = get_weather(progress);
}

function get_weather(day){
  $.simpleWeather({
    location: 'San Francisco, CA',
    woeid: '',
    unit: 'c',
    success: function(weather){
      switch(weather.currently.toLowerCase())
      {
        case "mostly cloudy":
          bg = hex_assemble(135*day, 206*day, 235*day);
          break;
        default:
          bg = "#FFFFFF";
          break;
      }
      $(document.body).velocity({ 
        backgroundColor: bg,
        color: hex_assemble(255*day, 255*day, 255*day)
      }, 3000); 
    }
  });
}

function hex_assemble(r,g,b)
{
  return "#" + to_hex(parseInt(r)) + to_hex(parseInt(g)) + to_hex(parseInt(b));
}

function to_hex(v) {
    var hex = v.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

$(document).ready(function() {
  document.body.style.backgroundColor = "rgb(100,100,100)";
  time_curve();
  setInterval(get_weather, 600000);
});

