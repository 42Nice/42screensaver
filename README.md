![Logo](https://i.imgur.com/J92HuPX.png)

# 42creensaver
42screensaver animates your 42 Holygraph in order to use it as a screensaver or wallpaper.

https://42screensaver.hevel.tech
## Author

- [@HevelMc](https://github.com/HevelMc) : [alopez](https://profile.intra.42.fr/users/alopez)


## Keybinds

| Key      | Description                                 |
| :------- | :------------------------------------------ |
| `F`      | Toggle full screen mode                     |
| `D`      | Download a screenshot version for wallpaper |
| `T`      | Toggle text rendering                       |
| `Space`  | Toggle animation (and reset position)       |



## Screenshots

#### Website animation
![App Screenshot](https://i.imgur.com/RLlFl6p.gif)

#### Exported wallpaper
You can use this wallpaper to place your project folders onto their respective circles.
![App Screenshot](https://i.imgur.com/K86Itzd.png)


## Installation

#### Screensaver mode
On macOS, you can use this website has screensaver using the [WebViewScreenSaver](https://github.com/liquidx/webviewscreensaver) *by liquidx*

You can download this package using brew
```bash
brew install --cask webviewscreensaver
```

Then configure it to use `https://42screensaver.hevel.tech/?login=YOUR_LOGIN`, with YOUR_LOGIN replaced by your 42 login on macOS screensaver settings.

#### Wallpaper mode
For now, there is no script to automate the update process.
By opening [this link](https://42screensaver.hevel.tech) and pressing `D`, the site will download an image. On finder, you can right click on this file and click on `Set Desktop Picture`.

*You may want to place your folders onto their circles once. The place of the circles should remain the same after updating.*


## Roadmap

- Add post common-core (Probably with physics simulation where the branches would be galaxy trails)

- Support more campuses

- Support old cursus
## Run Locally

Clone the project

```bash
  git clone https://github.com/42Nice/42screensaver
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Add your api credentials into the .env file

```env
API_UUID=u-xxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
API_SECRET = s-xxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PORT = 3000
```

Start the server

```bash
  npm run start
```


## Contributing

Contributions are always welcome! Do not hesitate to open pull requests.