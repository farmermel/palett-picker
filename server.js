//import express
const express = require('express');
//call the express function to make app with all necessary methods
const app = express();
//import body parser to automatically use json
const bodyParser = require('body-parser');

const path = require('path');

//use environment variable set elsewhere (eg heroku/tests) or default development
const environment = process.env.NODE_ENV || 'development';
//use knex file and environment to set configuration
const configuration = require('./knexfile')[environment];
//connect to database using knex curry and configuration
const database = require('knex')(configuration);

//set port either as previously set environment variable or default 3006
app.set('port', process.env.PORT || 3006);

//use jquery in project
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

//actually use body parser to return json
app.use(bodyParser.json());
//serve static file
app.use(express.static('public'));

//have app listen at specified port and console log message
app.listen(app.get('port'), () => {
  console.log(`Server running on port ${app.get('port')}`)
});

//set up endpoint for palettes retrieval
//use knex to access database palettes table and send response or palettes
app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
    .then(palettes => {
      response.status(200).json(palettes);
    })
    //send error message for server error
    .catch(error => {
      response.status(500).json({ error });
    });
});

//set up endpoint for palette posting
app.post('/api/v1/palettes', (request, response) => {
  const palette = request.body;

//check request body for all required parameters
  for(let requiredParameter of ['palette', 'project_id', 'palette_name']) {
    //if a parameter is missing send an error that has missing parameters in it
    if(!palette[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: {palette: <array>, project_id: <number>, palette_name: <string>}. You're missing a "${requiredParameter}" property.`});
    }
  }
  //if all parameters are there use knex to insert a palette into palette table
  database('palettes').insert(palette, 'id')
  //send successful response with generated id 
    .then(paletteId => {
      response.status(201).json({ id: paletteId[0] })
    })
    //send error message for server error
    .catch(error => {
      response.status(500).json({ error })
    });
});

//set up endpoint for palette deletion
app.delete('/api/v1/palettes/:id', (request, response) => {
  //use knex to delete palette by id match from db
  database('palettes').where('id', request.params.id).del()
    //send successful deletion id back
    .then(something => {
      response.status(204).json(something);
    })
    //send error message for server error
    .catch(error => {
      response.status(500).json({ error });
    })
})

//set up endpoint for retrieving projects
app.get('/api/v1/projects', (request, response) => {
  //use knex to retrieve all projects from database
  database('projects').select()
  //send successful response with all projects
    .then(projects => {
      response.status(200).json(projects);
    })
    //send error message for server error
    .catch(error => {
      response.status(500).json({ error });
    });
});

//set up endpoint for getting a specific project by id
app.get('/api/v1/projects/:id', (request, response) => {
  //use knex to retrieve a specific project by id
  database('projects').where('id', request.params.id).select()
    //process successful response
    .then(project => {
      //if a project was found, send project
      if (project.length) {
        response.status(200).json(project);
      } else {
        //if no project was found, send error message with id that wasn't found
        response.status(404).json({
          error: `Could not find project with id ${request.params.id}`
        });
      }
    })
    //send error message for server error
    .catch(error => {
      response.status(500).json({ error });
    });
});

//set up endpoint for posting of a new project
app.post('/api/v1/projects', (request, response) => {
  const project = request.body;
  //check body of request for required parameters
  for (let requiredParameter of ['project']) {
    //if body is missing a parameter send a response with missing parameter
    if(!project[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { project: <string> }. You're missing a "${requiredParameter}" property.`});
    }
  }

  //if body has all parameters use knex to insert project into database
  database('projects').insert(project, 'id')
    //send success status with newly created project id
    .then(project => {
      response.status(201).json({ id: project[0] })
    })
    //send error on server error
    .catch(error => {
      response.status(500).json({ error });
    });
});

module.exports = app;