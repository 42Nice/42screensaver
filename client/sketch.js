function darken(c, amount) {
  return color(
    c.levels[0] * amount,
    c.levels[1] * amount,
    c.levels[2] * amount,
    c.levels[3]
  );
}

// Place evenly spaced points around a center point
function getPositions(center, circle, parentRadius) {
  // calculate the angle between each circle
  let count = circle.data.length;
  let angle = 360 / count;
  let output = [];
  
  if (animation)
    circle.offset += circle.speed * (deltaTime / 100);
  else
    circle.offset = -90;

  // loop through the points
  for (let i = 0; i < count; i++) {
    // calculate the x and y position of the point
    const x = center.x + parentRadius * cos(angle * i + circle.offset);
    const y = center.y + parentRadius * sin(angle * i + circle.offset);
    output.push({ x: x, y: y });
  }
  return output;
}

function drawCircle(index, circle, center) {
  noFill();
  strokeWeight(4);
  stroke(getCircleColor(circle));
  // Draw the circle ring
  if (index != 0)
    ellipse(center.x, center.y, (height / 7) * index, (height / 7) * index);
  // Calculate the positions of the features
  let pos = getPositions({x: center.x, y: center.y}, circle, (height / 7) * index / 2);
  for (let i = 0; i < circle.data.length; i++) {
    let f = circle.data[i];
    if (typeof f === "string" || Array.isArray(f))
      f = getHolyData(f);
    if (f.type === "ellipse") {
      // fill from f.fill with a darker outline
      fill(f.fill);
      strokeWeight(2);
      stroke(f.outline);
      ellipse(pos[i].x, pos[i].y, f.radius, f.radius);
      // draw a text that fits in the ellipse
      if (!showTexts)
        continue;
      fill("#FFFFFF");
      noStroke();
      textSize(f.radius / 8);
      textAlign(CENTER, CENTER);
      text(f.name, pos[i].x - f.radius / 2, pos[i].y - f.radius / 2, f.radius, f.radius);
    } else if (f.type === "rectangle") {
      // fill from f.fill with a darker outline
      fill(f.fill);
      strokeWeight(2);
      stroke(f.outline);
      rect(pos[i].x - f.width / 2, pos[i].y - f.height / 2, f.width, f.height, f.radius);
      // draw a text that fits in the rectangle
      if (!showTexts)
        continue;
      fill("#FFFFFF");
      noStroke();
      textSize(10);
      textAlign(CENTER, CENTER);
      text(f.name, pos[i].x - f.width / 2, pos[i].y - f.height / 2, f.width, f.height);
    } else if (f.type === "circle") {
      // call recursively for every feature in f.config
      for (let c of Object.keys(f.config)) {
        drawCircle(c, f.config[c], pos[i]);
      }
    }
  }
}

async function parseJson(login) {
  let data = await fetch('/data?userId=' + login);
  if (!data.ok) {
    console.log("Error " + data.status);
    msg = "Error " + data.status;
    if (data.status == 404)
      msg += " - User not found";
    else if (data.status == 429)
      msg += " - Too many requests";
    else if (data.status == 500)
      msg += " - Internal server error";
    else if (data.status == 503)
      msg += " - Service unavailable";
    else
      msg += "- Unknown error";
    login = null;
    return;
  }
  let json = await data.json();
  let output = {};
  for (let i of Object.keys(json)) {
    output[json[i].slug] = json[i];
  }
  return output;
}

function getHolyData(input) {
  let outline = c_notstarted;
  let fill = null;
  let radius = 40;
  if (typeof input === "string") {
    let entry = parsedData[input];
    if (entry.status == "finished")
      outline = c_completed;
    else if (entry.status == "in_progress")
    {
      outline = c_inprogress;
      fill = color("#46464c");
    }
    else if (entry.status == "waiting_for_correction")
    {
      outline = c_eval;
      fill = color("#46464c");
    }
    else if (entry.status == "failed")
      outline = c_failed;
    if (entry.slug == "ft_transcendence")
      radius = 80;
    else if (entry.slug == "cpp-module-04" || entry.slug == "cpp-module-09")
      radius = 30;
    else if (entry.slug.startsWith("cpp-module-0"))
      radius = 20;
    fill = fill ?? darken(outline, 0.8);
    if (entry.slug.startsWith("exam-rank-"))
      return { type: "rectangle", height: 40, width: 80, outline: outline, fill: fill, radius: 10, name: entry.name };
    return { type: "ellipse", radius: radius, outline: outline, fill: fill, name: entry.name };
  } else if (Array.isArray(input)) {
    // for each of the children, if one is finished, return it
    // else if one is in progress, return it
    // else return the first one
    for (let i = 0; i < input.length; i++) {
      if (["finished", "waiting_for_correction", "in_progress", "failed"]
          .includes(parsedData[input[i]].status))
        return getHolyData(input[i]);
    }
    return getHolyData(input[0]);
  } else if ((input.type === "circle")) {
    return getHolyData(input.config[0].data[0]);
  }
}

function getCircleColor(circle) {
  // if all are complete return c_completed
  // if one is in progress return c_inprogress
  // else return c_notstarted
  if (circle.data.every((x) => getHolyData(x).outline == c_completed)) return c_completed;
  if (circle.data.some((x) => getHolyData(x).outline == c_inprogress)) return c_circle_inprogress;
  return c_notstarted;
}

function getConfig() {
  return {
    0: {data: ["42cursus-libft"], offset: -90, speed: 2.2},
    1: {data: ["42cursus-ft_printf", "42cursus-get_next_line", "born2beroot"], offset: -90, speed: 2},
    2: {data: ["42cursus-push_swap", ["pipex", "minitalk"], "exam-rank-02", ["42cursus-fdf", "42cursus-fract-ol", "so_long"]], offset: -90, speed: 1.8},
    3: {data: ["exam-rank-03", "42cursus-philosophers", "42cursus-minishell"], offset: -90, speed: 1.6},
    4: {data: [["cub3d", "minirt"], "netpractice", "exam-rank-04", { type: "circle", config: {0: {data: ["cpp-module-04"], offset: -90, speed: 1}, 0.5: {data: ["cpp-module-00", "cpp-module-01", "cpp-module-02", "cpp-module-03"], offset: -90, speed: 3}} }], offset: -90, speed: 1.4},
    5: {data: ["exam-rank-05", ["webserv", "ft_irc"], { type: "circle", config: {0: {data: [["cpp-module-09", "ft_containers"]], offset: -90, speed: 1}, 0.5: {data: ["cpp-module-05", "cpp-module-06", "cpp-module-07", "cpp-module-08"], offset: -90, speed: 3}} }, "inception"], offset: -90, speed: 1.2},
    6: {data: ["ft_transcendence", "exam-rank-06"], offset: -90, speed: 1}
  }
}

function drawGradient() {
  background("#090a0f");
  noFill();
  for (let y = height; y > 0; y--) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color("#002534"), color("#090a0f"), inter);
    stroke(c);
    line(0, y, width, y);
  }
}

var parsedData;
var login;

async function setup() {
  let params = getURLParams();
  login = params.login;
  if (login == null || login == "")
    msg = "Please provide a login";
  else {
    parsedData = await parseJson(login);
    if (parsedData == null)
      login = null;
    print(parsedData);
  }
  c_completed = color("#00BABC");
  c_eval = color("#2160ff");
  c_inprogress = color("#ffa13d");
  c_circle_inprogress = color("#FFFFFF");
  c_notstarted = color("#9D9EA0");
  c_failed = color("#CC6256");
  c = createCanvas(windowWidth, windowHeight);
  if (login == null || login == "") {
    input = createInput();
    input.position(width / 2 - 110, height / 2 + 50);
    input.size(200);

    input.attribute('placeholder', 'login');

    input.value(login ?? "");
    button = createButton('submit');
    button.position(width / 2 - button.width / 2, input.y + input.height + 10);
    button.mousePressed(() => {
      login = input.value();
      document.location.href = `?login=${login}`;
    });
  }
  config = getConfig();
}

let animation = true;
let showTexts = true;
let msg = null;

function keyPressed() {
  if (login == null || login == "")
    return;
  if (key === ' ')
    animation = !animation;
  if (key === 'f')
  {
    fullscreen(!fullscreen());
    resizeCanvas(windowWidth, windowHeight);
  }
  if (key === 'd')
  {
    let anim = animation;
    let texts = showTexts;
    animation = false;
    showTexts = false;
    resizeCanvas(window.screen.width, window.screen.height);
    draw();
    saveCanvas(c, 'wallpaper', 'png');
    animation = anim;
    showTexts = texts;
    resizeCanvas(windowWidth, windowHeight);
  }
  if (key === 't')
    showTexts = !showTexts;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  drawGradient();
  // use cos and sin in degrees
  angleMode(DEGREES);

  if (msg) {
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text(msg, width / 2, height / 2);
  }

  if (parsedData == undefined)
    return ;

  for (let i = 0; i < 7; i++) {
    drawCircle(i, config[i], { x: width / 2, y: height / 2 });
  }
}
