function Ambiviz(options)
{
  // this.options = options;
  // this.selector = options.selector;
  // this.location = options.location;
  // this.css = options.css;
  // this.
  get_data(options.selector, options.location, options.css);
}

function get_data(sel, loc, css)
{
  request = new XMLHttpRequest();
  request.open('GET', 'http://api.openweathermap.org/data/2.5/weather?q=' + loc + '&units=metric', true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400){
      process_weather(sel, JSON.parse(request.responseText), css);
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
  var start = Math.floor(new Date().setHours(0,0,0,0) / 1000);
  var now = ((Math.floor(new Date().getTime() / 1000))) - weather.sys.sunrise;

  if ((weather.sys.sunrise - start) > 86400)
  {
    now += 86400;
  }
  else if ((weather.sys.sunrise - start) < -86400)
  {
    now -= 86400;
  }

  var mid = parseInt(((weather.sys.sunset + weather.sys.sunrise) / 2) - weather.sys.sunrise);
  var intensity = (Math.abs(mid-now) <= mid) ? (mid - (Math.abs(mid-now))) / mid : 0;

  return '({"now" : ' + now
    + ', "mid" : ' + mid
    + ', "intensity" : ' + intensity
    + '})'
}

function process_weather(element, weather, css)
{
  var time = eval(process_time(weather));

  if (document.getElementById(element + "-footer"))
  {
    document.getElementById(element + "-footer").innerHTML = weather.main.temp + "&deg;C - " + weather.name + ", " + weather.sys.country;
  }

  var existing = eval(grab_existing(element, css));

  for (var key in css)
  {
    if (css.hasOwnProperty(key)) 
    {
      var new_val = interpolate(existing[key], css[key], time.intensity);
      console.log(existing, css, new_val)
      document.getElementById(element).style[key] = new_val + " !important";
    }
  }
}

function grab_existing(element, css)
{
  var el = document.getElementById(element);
  var style = window.getComputedStyle(el);
  var styles = "({";
  for (var key in css) 
  {
    if (css.hasOwnProperty(key)) 
    {
      styles += '"' + key + '" : "' + style.getPropertyValue(key) + '",';
    }
  }
  styles.slice(0, -1);
  styles += "})";
  return styles;
}

function interpolate(val1, val2, t)
{
  if (val1[0] == "#")
  {
    val1 = hex_disassemble(val1);
  }
  else if (val1[0] == "r")
  {
    val1 = val1.slice(4).slice(0,-1).split(", ");
  }

  if (val2[0] == "#")
  {
    val2 = hex_disassemble(val2);
  }
  else if (val2[0] == "r")
  {
    val2 = val2.slice(4).slice(0,-1).split(", ");
  }

  var r = lerp( val1[0], val2[0], t );
  var g = lerp( val1[1], val2[1], t );
  var b = lerp( val1[2], val2[2], t );

  return "rgb(" + r + "," + g + "," + b + ")";
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

function hex_disassemble(hex)
{
  r = hex[1] + hex[2];
  g = hex[3] + hex[4];
  b = hex[5] + hex[6];
  return [to_dec(r), to_dec(g), to_dec(b)];
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
