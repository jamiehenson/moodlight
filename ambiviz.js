function ambiviz(selector, location){
  setInterval(get_weather, 600000);
  var start = new Date().setHours(0,0,0,0);
  var end = new Date().setHours(23,59,59,999);
  var noon = new Date().setHours(12,00,00,000);
  var now = new Date().getTime();
  var progress = 1-(Math.abs(noon-now) / (end - start));
  var p_lerp = parseInt(progress * 255);
  var col = hex_assemble(p_lerp,p_lerp,p_lerp);
  var anti_col = hex_assemble(255-p_lerp,255-p_lerp,255-p_lerp);
  get_weather(selector, location, progress);
}

function get_weather(sel, loc, progress)
{
  $.simpleWeather({
    location: loc,
    woeid: '',
    unit: 'c',
    success: function(weather)
    {
      $(sel + "-footer").html(weather.temp + "&deg;C - " + weather.city + ", " + weather.region);
      var title = weather.title.split(" ")
      var now = convert_time(title[title.length - 3] + title[title.length - 2]);
      if (now < convert_time(weather.sunset) && now > convert_time(weather.sunrise))
      {
        switch(weather.currently.toLowerCase())
        {
          case "mostly cloudy":
          case "fair":
            bg = hex_assemble(135*progress, 206*progress, 235*progress);
            col = hex_assemble(255*progress, 255*progress, 255*progress);
            break;
          default:
            bg = "#FFFFFF";
            col = hex_assemble(255*progress, 255*progress, 255*progress);
            break;
        }
      }
      else
      {
        bg = "#000011";
        col = "#FFFFFF";
      }
      $(sel).velocity({ 
        backgroundColor: bg,
        color: col 
      }, 3000); 
    }
  });
}

function convert_time(time)
{
  var split = time.split(/[\s:]+/)
  if (split[2] == "pm") { split[0] = parseInt(split[0]) + 12; }
  return new Date().setHours(parseInt(split[0]),parseInt(split[1]),0,0);
}

function hex_assemble(r,g,b)
{
  return "#" + to_hex(parseInt(r)) + to_hex(parseInt(g)) + to_hex(parseInt(b));
}

function to_hex(v) {
    var hex = v.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
