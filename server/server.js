/* eslint-disable no-underscore-dangle */
const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const {PythonShell} = require('python-shell');

const app = express();
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/snowConditions');

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

cron.schedule('0 0 * * *', () => {
  const updateTime = new Date();
  console.log('Cron Job getting Snow Data at', updateTime);
  getSnowData().then(
    (resortData) => {
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
    },
    (error) => {
      console.error('There was an error scraping the website');
      console.log(error);
    }
  );
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

app.get('/page-test', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

app.listen(process.env.PORT || 5000, () => {
  console.log('Server has started on port', process.env.PORT || 5000);
});
