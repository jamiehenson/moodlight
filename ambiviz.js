function ambiviz(selector, location, snip1, snip2){
  get_weather(selector, location, snip1, snip2);
}

function get_weather(sel, loc, snip1, snip2)
{
  request = new XMLHttpRequest();
  request.open('GET', 'http://api.openweathermap.org/data/2.5/weather?q=' + loc + '&units=metric', true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400){
      process_weather(sel, JSON.parse(request.responseText), snip1, snip2);
    } else {
      console.log('We reached our target server, but it returned an error');
    }
  };

  request.onerror = function() 
  {
    console.log('Couldnt connect to weather api');  
  };

  request.send();
}

function process_time(weather)
{
  var start = new Date().setHours(0,0,0,0);
  var end = new Date().setHours(23,59,59,999);
  var now = Math.floor(new Date().getTime() / 1000);
  var mid = parseInt((weather.sys.sunset + weather.sys.sunrise) / 2);
  var progress = 1-(Math.abs(mid-now) / (weather.sys.sunset - weather.sys.sunrise));

  var p_lerp = parseInt(progress * 255);
  var col = hex_assemble(p_lerp,p_lerp,p_lerp);
  var anti_col = hex_assemble(255-p_lerp,255-p_lerp,255-p_lerp);

  return '({"start" : ' + start
    + ', "end" : ' + end
    + ', "now" : ' + now
    + ', "progress" : ' + progress
    + '})'
}

function process_weather(sel, weather, snip1, snip2)
{
  time = eval(process_time(weather));

  $(sel + "-footer").html(weather.main.temp + "&deg;C - " + weather.name + ", " + weather.sys.country);
  if (time.now < weather.sys.sunset && time.now > weather.sys.sunrise)
  {
    for (var key in snip1) {
      if (snip1.hasOwnProperty(key)) {
        var new_val = interpolate(snip1[key], snip2[key], time.progress);
        console.log(new_val);
        document.getElementById(sel.slice(1)).style[key] = new_val;
      }
    }

    bg = hex_assemble(255*time.progress, 255*time.progress, 255*time.progress);
    col = hex_assemble(255-(255*time.progress), 255-(255*time.progress), 255-(255*time.progress));
  }
  else
  {
    bg = "#000011";
    col = "#FFFFFF";
  }

  // $(sel).velocity({ 
  //   backgroundColor: bg,
  //   color: col 
  // }, 3000); 
}

function interpolate(val1, val2, t)
{
  if (val1[0] == "#" && val2[0] == "#")
  {
    var r = lerp( to_dec(val1[1] + val1[2]), to_dec(val2[1] + val2[2]), t );
    var g = lerp( to_dec(val1[3] + val1[4]), to_dec(val2[3] + val2[4]), t );
    var b = lerp( to_dec(val1[5] + val1[6]), to_dec(val2[5] + val2[6]), t );
    return hex_assemble(r,g,b);
  }
  else if (val1[0] == "rgb" && val2[0] == "rgb")
  {

  }
}

function lerp(val1, val2, t)
{
  return parseInt(val1 - (t * (val1 - val2)));
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

function hex_disassemble(r,g,b)
{
  return [to_dec(parseInt(r)), to_dec(parseInt(g)), to_dec(parseInt(b))];
}

function to_hex(val) 
{
  var hex = val.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function to_dec(val)
{
  return parseInt(val,16);
}
