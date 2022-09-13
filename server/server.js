/* eslint-disable no-underscore-dangle */
const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const {PythonShell} = require('python-shell');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGODB_URI);

const resortSchema = {name: String, country: String, conditions: Array};
const Resort = mongoose.model('Resort', resortSchema);

const getSnowData = () => new Promise((resolve, reject) => {
  console.log('Crawl for Snow Data');
  const pyshell = new PythonShell(`${__dirname}/pythonScripts/crawler.py`);
  let dataString = '';
  pyshell.on('message', (message) => dataString += message);
  pyshell.end((err) => {
    if (err) {
      reject(err);
    } else {
      const result = JSON.parse(dataString);
      resolve(result);
    }
  });
});

const saveInDatabase = (resortData) => {
  const updateTime = new Date();
  resortData.forEach((resort) => {
    Resort.find({country: 'Austria', name: resort.name}, (err, existingResort) => {
      if (err) {
        console.error('error while finding resort');
        console.log(err);
        return;
      }
      if (existingResort.length) {
        Resort.findOneAndUpdate(
          {_id: existingResort[0]._id},
          {
            $push:
              {
                conditions: {
                  valley: resort.valley_snow_depth,
                  mountain: resort.mountain_snow_depth,
                  new_snow: resort.new_snow,
                  open_lifts: resort.open_lifts,
                  time: new Date(resort.time),
                  time_updated: updateTime
                }
              }
          },
          (error) => {
            if (error) {
              console.error('Error while updating existing resort condition data');
              console.log(error);
            }
          }
        );
      } else {
        const newResort = new Resort({
          name: resort.name,
          country: 'Austria',
          conditions: [
            {
              valley: resort.valley_snow_depth,
              mountain: resort.mountain_snow_depth,
              new_snow: resort.new_snow,
              open_lifts: resort.open_lifts,
              time: new Date(resort.time),
              time_updated: updateTime
            }
          ]
        });
        newResort.save((error) => {
          if (error) {
            console.error('Error while saving a resort!');
            console.log(err);
          }
        });
      }
    });
  });
};

cron.schedule('0 0 * * *', () => {
  console.log('Cron Job getting Snow Data at', new Date());
  getSnowData().then(
    (resortData) => saveInDatabase(resortData),
    (error) => {
      console.error('There was an error scraping the website');
      console.log(error);
    }
  );
});

cron.schedule('* * * * *', () => {
  console.log('Cron Job executed', new Date());
});

app.get('/', (req, res) => {
  console.log('website visit detected');
  res.send('all good fam');
});

app.get('/express-backend', (req, res) => {
  Resort.find({country: 'Austria'}, (err, result) => {
    if (err) {
      console.error('Error retrieving resort data');
      console.log(err);
      res.send({success: false, message: 'Error retrieving resort data', data: err});
    } else {
      res.send({success: true, data: result});
    }
  });
});

app.get('/run-crawler', (req, res) => {
  getSnowData().then(
    (resortData) => {
      res.send({success: true, data: resortData});
    },
    (error) => {
      res.send({success: false, message: 'Error retrieving resort data', data: error});
    }
  );
});

app.get('/database-test', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
  getSnowData().then(
    (resortData) => saveInDatabase(resortData),
    (error) => {
      console.error('There was an error scraping the website');
      console.log(error);
    }
  );
  res.send('Test Page :)');
});

app.listen(process.env.PORT, () => {
  console.log('Server has started on port', process.env.PORT);
});
