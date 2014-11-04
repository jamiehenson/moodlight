function time_curve(weather){
  var start = new Date().setHours(0,0,0,0);
  var end = new Date().setHours(23,59,59,999);
  var now = new Date().getTime();
  var progress = 1-((now - start) / (end - start));
  var p_lerp = parseInt(progress * 255);

  var col = "#" + to_hex(p_lerp) + to_hex(p_lerp) + to_hex(p_lerp);
  var anti_col = "#" + to_hex(255-p_lerp) + to_hex(255-p_lerp) + to_hex(255-p_lerp);

  // var suncol = get_weather()
  console.log(col);

  $(document.body).velocity({ 
    backgroundColor: anti_col,
    color: col
  }, 3000); 
}

function get_weather(){
  var col = "#000000"
  $.simpleWeather({
    location: 'San Francisco, CA',
    woeid: '',
    unit: 'c',
    success: function(weather) {
      col = get_weather_colour(weather.thumbnail);
    }
  });
  return col;
}

function get_weather_colour(thumbnail) {
  var img = new Image();
  img.src = thumbnail;
  var col_hex = '#000000'
}

function to_hex(v) {
    var hex = v.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

$(document).ready(function() {
  document.body.style.backgroundColor = "rgb(100,100,100)";
  time_curve();
});

