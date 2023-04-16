var isRotating = true;
var showTexts = true;
var msg = null;
var login = null;
var circles = [];
var parsedData;

const c_completed = "#00BABC";
const c_eval = "#2160ff";
const c_inprogress = "#ffa13d";
const c_circle_inprogress = "#FFFFFF";
const c_notstarted = "#9D9EA0";
const c_failed = "#CC6256";
const c_background = "#46464c";

var config = {
  0: {data: ["42cursus-libft"], offset: -90, speed: 2.2},
  1: {data: ["42cursus-ft_printf", "42cursus-get_next_line", "born2beroot"], offset: -90, speed: 2},
  2: {data: ["42cursus-push_swap", ["pipex", "minitalk"], "exam-rank-02", ["42cursus-fdf", "42cursus-fract-ol", "so_long"]], offset: -90, speed: 1.8},
  3: {data: ["exam-rank-03", "42cursus-philosophers", "42cursus-minishell"], offset: -90, speed: 1.6},
  4: {data: [["cub3d", "minirt"], "netpractice", "exam-rank-04", { type: "circle", config: {0: {data: ["cpp-module-04"], offset: -90, speed: 1}, 0.5: {data: ["cpp-module-00", "cpp-module-01", "cpp-module-02", "cpp-module-03"], offset: -90, speed: 3}} }], offset: -90, speed: 1.4},
  5: {data: ["exam-rank-05", ["webserv", "ft_irc"], { type: "circle", config: {0: {data: [["cpp-module-09", "ft_containers"]], offset: -90, speed: 1}, 0.5: {data: ["cpp-module-05", "cpp-module-06", "cpp-module-07", "cpp-module-08"], offset: -90, speed: 3}} }, "inception"], offset: -90, speed: 1.2},
  6: {data: ["ft_transcendence", "exam-rank-06"], offset: -90, speed: 1}
}

class Project {
  pos;
  name;
  slug;
  status;
  width;
  height;
  type;
  fill;
  outline;

  constructor(name, slug, status) {
    this.name = name;
    this.slug = slug;
    this.status = status;
    this.outline = c_notstarted;

    if (this.slug.startsWith("exam-rank-")) {
      this.type = "exam";
      this.width = 80, this.height = 40;
    } else {
      this.type = "default";
      if (this.slug == "ft_transcendence")
        this.width = 80, this.height = 80;
      else if (this.slug == "cpp-module-04" || this.slug == "cpp-module-09")
        this.width = 30, this.height = 30;
      else if (this.slug.startsWith("cpp-module-"))
        this.width = 20, this.height = 20;
      else
        this.width = 40, this.height = 40;
    }

    if (this.status == "finished")
      this.outline = c_completed;
    else if (this.status == "waiting_for_evaluation")
      this.outline = c_eval, this.fill = c_background;
    else if (this.status == "in_progress")
      this.outline = c_inprogress, this.fill = c_background;
    else if (this.status == "failed")
      this.outline = c_failed;
    if (this.fill == undefined)
      this.fill = darken(this.outline, 0.8);
  }

  draw() {
    fill(this.fill);
    stroke(this.outline);
    strokeWeight(2);
    if (this.type == "default")
      ellipse(this.pos.x, this.pos.y, this.width, this.height);
    else if (this.type == "exam")
      rect(this.pos.x - this.width / 2, this.pos.y - this.height / 2, this.width, this.height, 10);
    if (!showTexts)
      return;
    fill("#FFFFFF");
    noStroke();
    textSize(this.width / 8);
    textAlign(CENTER, CENTER);
    text(this.name, this.pos.x - this.width / 2, this.pos.y - this.height / 2, this.width, this.height);
  }
}

class Circle {
  index;
  pos;
  offset;
  speed;
  objs;
  radius;

  constructor(pos, index) {
    this.pos = pos;
    this.index = index;
    this.offset = -90;
    this.objs = [];
  }

  getColor() {
    if (this.objs.filter((x) => x instanceof Project).every((x) => x.status == "finished")) 
      return c_completed;
    if (this.objs.filter((x) => x instanceof Project).some((x) => x.status == "in_progress" || x.status == "waiting_for_evaluation")) 
      return c_circle_inprogress;
    return c_notstarted;
  }

  getPositions() {
    let count = this.objs.length;
    let angle = 360 / count;
    let output = [];
    
    if (isRotating)
      this.offset += this.speed * (deltaTime / 100);
    else
      this.offset = -90;

    for (let i = 0; i < count; i++) {
      const x = this.pos.x + this.radius / 2 * cos(angle * i + this.offset);
      const y = this.pos.y + this.radius / 2 * sin(angle * i + this.offset);
      output.push(createVector(x, y));
    }
    return output;
  }

  draw() {
    this.radius = height / 7 * this.index;
    noFill();
    strokeWeight(4);
    stroke(this.getColor());
    if (this.radius != 0)
      ellipse(this.pos.x, this.pos.y, this.radius, this.radius);
    
    let positions = this.getPositions();
    for (let i = 0; i < this.objs.length; i++) {
      this.objs[i].pos = positions[i];
      this.objs[i].draw();
    }
  }
}

class CircleNode {
  pos;
  objs;

  constructor(pos) {
    this.pos = pos;
    this.objs = [];
  }

  draw() {
    for (let i = 0; i < this.objs.length; i++) {
      this.objs[i].pos = this.pos;
      this.objs[i].draw();
    }
  }
}

async function setup() {
  let params = getURLParams();
  login = params.login;
  if (login == null || login == "")
    msg = "Please provide a login";
  else {
    parsedData = await parseJson();
  }

  createCanvas(windowWidth, windowHeight);

  if (login == null || login == "")
    askLogin();

  let output = loadConfig(config);
  for (let i of output)
    circles.push(i);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  drawGradient();

  angleMode(DEGREES);

  if (msg) {
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text(msg, width / 2, height / 2);
  }

  if (parsedData == undefined)
    return ;

  for (let circle of circles) {
    circle.pos = createVector(width / 2, height / 2);
    circle.draw();
  }
}

function keyPressed() {
  if (login == null || login == "")
    return;
  if (key === ' ')
    isRotating = !isRotating;
  if (key === 'f')
  {
    fullscreen(!fullscreen());
    resizeCanvas(windowWidth, windowHeight);
  }
  if (key === 'd')
  {
    let anim = isRotating;
    let texts = showTexts;
    isRotating = false;
    showTexts = false;
    resizeCanvas(window.screen.width, window.screen.height);
    draw();
    saveCanvas('wallpaper', 'png');
    isRotating = anim;
    showTexts = texts;
    resizeCanvas(windowWidth, windowHeight);
  }
  if (key === 't')
    showTexts = !showTexts;
}

async function parseJson() {
  let data = await fetch('/data?userId=' + login);
  if (!data.ok) {
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

function loadConfig(data) {
  let output = [];
  for (let i of Object.keys(data)) {
    let index = parseFloat(i);
    let circle = new Circle(createVector(width / 2, height / 2), index);
    circle.speed = data[i].speed;
    for (let d of data[i].data)
      loadElement(circle, d);
    output.push(circle);
  }
  return output;
}

function loadElement(circle, el) {
  if (typeof el === "string") {
    circle.objs.push(new Project(parsedData[el].name, el, parsedData[el].status));
  }
  
  else if (Array.isArray(el)) {
    for (let slug of el) {
      if (["finished", "waiting_for_correction", "in_progress", "failed"].includes(parsedData[slug].status))
        return circle.objs.push(new Project(parsedData[slug].name, slug, parsedData[slug].status));
      }
      return circle.objs.push(new Project(parsedData[el[0]].name, el[0], parsedData[el[0]].status));
  }
  
  else {
    let output = loadConfig(el.config);
    let node = new CircleNode(circle.pos);
    for (let i of output)
      node.objs.push(i);
    circle.objs.push(node);
  }
}

function darken(col, amount) {
  let c = color(col);
  return color(
    c.levels[0] * amount, c.levels[1] * amount, c.levels[2] * amount, c.levels[3]
  );
}

function askLogin() {
  let input = createInput();
  input.position(width / 2 - 110, height / 2 + 50);
  input.size(200);

  input.attribute('placeholder', 'login');

  input.value(login ?? "");
  let button = createButton('submit');
  button.position(width / 2 - button.width / 2, input.y + input.height + 10);
  button.mousePressed(() => {
    login = input.value().toString();
    document.location.href = `?login=${login}`;
  });
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
