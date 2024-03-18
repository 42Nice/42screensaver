const express = require('express');
const axios = require('axios');
const app = express();
const config = require('/app/static/config.json');

const API_UUID = process.env.API_UUID;
const API_SECRET = process.env.API_SECRET;
const PORT = 3000;

const ACCESS_TOKEN_URL = "https://api.intra.42.fr/oauth/token";

let PROJECT_IDS = "";

// get the project ids from the config
for (let i = 0; i < config.projects.length; i++) {
  PROJECT_IDS += config.projects[i].project_id;
  if (i < config.projects.length - 1) {
    PROJECT_IDS += ",";
  }
}

app.get('/', (req, res) => {
  res.sendFile('/app/client/index.html');
});

app.get('/data', async (req, res) => {
  // get the user id from the request
  const userId = req.query.userId;
  
  // get the access token
  const accessToken = await axios.post(ACCESS_TOKEN_URL, {
    grant_type: "client_credentials",
    client_id: API_UUID,
    client_secret: API_SECRET 
  }).then((response) => {
    return response.data.access_token;
  }).catch((error) => {
    console.log(error);
  });

  axios.get(`https://api.intra.42.fr/v2/users/${userId}/projects_users?page[size]=100&filter[project_id]=${PROJECT_IDS}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }).then((response) => {
    let out = [];
    // for each project in the config
    for (let i = 0; i < config.projects.length; i++) {
      let projectData = {...config.projects[i]};
      // check if the user has a project with this id
      let project = response.data.find((project) => {
        return project.project.id == projectData.project_id;
      });
      if (project) {
        // if the user has a project with this id, update the project status
        projectData.status = project.status;
        if (project['validated?'] == false)
          projectData.status = "failed";
      }
      // add the project to the output
      out.push(projectData);
    }
    // rend the output, add the cors header to allow cross origin requests
    res.header("Access-Control-Allow-Origin", "*");
    res.send(out);
  }).catch((error) => {
    // If an error occurred, send back the error code only
    res.header("Access-Control-Allow-Origin", "*");
    res.sendStatus(error.response.status);
  });
});

app.use(express.static('client'));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});


