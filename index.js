const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const url = "https://www.formula1.com";
const urlAllResult1950 = "https://www.formula1.com/en/results.html/1950/races.html";
const urlAllResult1951 = "https://www.formula1.com/en/results.html/1951/races.html";
const urlAllResult1952 = "https://www.formula1.com/en/results.html/1952/races.html";
const urlAllDrivers = 'https://www.formula1.com/en/drivers.html';
const urlAllTeams = 'https://www.formula1.com/en/teams.html';

//SET UP
const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
dotenv.config();
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

//ROUTES

app.get("/result/1950", (req, resp) => {
  const titles = [];
  const results = [];
  try {
    axios(urlAllResult1950).then((res) => {
      const html = res.data;
      const $ = cheerio.load(html);
      $(".table-wrap", html).each(function () {
        $(this).find('table > thead > tr > th').each(function () {
          titles.push($(this).text().split(' ').join(''));
        })


        const rows = [...$('table > tbody > tr')].map(e => {
          const obj = {};
          const tempArr = [];
          [...$(e).find('td')].map(e => {
            tempArr.push($(e).text().trim().split('\n').join());
            for (let i = 0; i < titles.length; i++) {
              obj[titles[i].toLowerCase()] = tempArr[i];
              
            }
          })
          const firstName = $(e).find('span:first-child').text().trim();
          const lastName = $(e).find('span:nth-child(2)').text().trim();
          results.push({...obj, winner: firstName + ' ' + lastName});
        });
      });
      resp.status(200).json(results);
    });
  } catch (error) {
    resp.status(500).json(error);
  }
});

app.get("/result/1951", (req, resp) => {
  const titles = [];
  const results = [];
  try {
    axios(urlAllResult1951).then((res) => {
      const html = res.data;
      const $ = cheerio.load(html);
      $(".table-wrap", html).each(function () {
        $(this).find('table > thead > tr > th').each(function () {
          titles.push($(this).text().split(' ').join(''));
        })

        const rows = [...$('table > tbody > tr')].map(e => {
          const obj = {};
          const tempArr = [];
          [...$(e).find('td')].map(e => {
            tempArr.push($(e).text().trim().split('\n').join());
            for (let i = 0; i < titles.length; i++) {
              obj[titles[i].toLowerCase()] = tempArr[i];
            }
          })
          const firstName = $(e).find('span:first-child').text().trim();
          const lastName = $(e).find('span:nth-child(2)').text().trim();
          results.push({...obj, winner: firstName + ' ' + lastName});
        });
      });
      resp.status(200).json(results);
    });
  } catch (error) {
    resp.status(500).json(error);
  }
});

app.get("/result/1952", (req, resp) => {
  const titles = [];
  const results = [];
  try {
    axios(urlAllResult1952).then((res) => {
      const html = res.data;
      const $ = cheerio.load(html);
      $(".table-wrap", html).each(function () {
        $(this).find('table > thead > tr > th').each(function () {
          titles.push($(this).text().split(' ').join(''));
        })

        const rows = [...$('table > tbody > tr')].map(e => {
          const obj = {};
          const tempArr = [];
          [...$(e).find('td')].map(e => {
            tempArr.push($(e).text().trim().split('\n').join());
            for (let i = 0; i < titles.length; i++) {
              obj[titles[i].toLowerCase()] = tempArr[i];
            }
          })
          const firstName = $(e).find('span:first-child').text().trim();
          const lastName = $(e).find('span:nth-child(2)').text().trim();
          results.push({...obj, winner: firstName + ' ' + lastName});
        });
      });
      resp.status(200).json(results);
    });
  } catch (error) {
    resp.status(500).json(error);
  }
});

app.get("/drivers", (req, resp) => {
  const results = [];
  try {
    axios(urlAllDrivers).then((res) => {
      const html = res.data;
      const $ = cheerio.load(html);
      $('.listing-item--link').each(function () {
        const rank = $(this).find('.rank').text().trim();
        const points = $(this).find('.points > div:first-child').text().trim().split('\n').join();
        const firstName = $(this).find('.listing-item--name > span:first-child').text().trim().split('\n').join();
        const lastName = $(this).find('.listing-item--name > span:last-child').text().trim().split('\n').join();
        const team = $(this).find('.listing-item--team').text().trim();
        const flagImg = $(this).find('.coutnry-flag--photo > img').attr('data-src');
        const driverImg = $(this).find('.listing-item--photo > img').attr('data-src');
        const numberImg = $(this).find('.listing-item--number > img').attr('data-src');
        const obj = {
          rank,
          points,
          firstName,
          lastName,
          nameSlug: firstName.toLowerCase() + '-' + lastName.toLowerCase(),
          team,
          flagImg,
          driverImg,
          numberImg,
        }
        results.push(obj)
      })
      resp.status(200).json(results)
    })
  } catch (error) {
    resp.status(500).json(error);
  }
})

app.get("/teams", (req, resp) => {
  const results = [];
  try {
    axios(urlAllTeams).then((res) => {
      const html = res.data;
      const $ = cheerio.load(html);
      $('.listing-link').each(function () {
        const drivers = [];
        const rank = $(this).find('.rank').text().trim();
        const points = $(this).find('.points > div:first-child').text().trim().split('\n').join();
        const carBrand = $(this).find('.listing-info > .name > span:nth-child(2)').text().trim();
        const carSlug = carBrand.split(' ').join('-');
        const imgBrand = $(this).find('.listing-info > .logo > picture > img').attr('data-src');
        $(this).find('.listing-team-drivers').each(function () {
          $(this).find('.driver').each(function () {
            let driverObj = {};
            const firstName = $(this).find('.first-name').text().trim();
            const lastName = $(this).find('.last-name').text().trim();
            const imgDriver = $(this).find('img').attr('data-src');
            driverObj = {
              firstName,
              lastName,
              imgDriver
            }
            drivers.push(driverObj);
          })
        }); 
        const imgCar = $(this).find('.listing-image > img').attr('data-src');
        const teamsObj = {
          rank,
          points,
          carBrand,
          imgBrand,
          drivers: drivers,
          imgCar,
          carSlug,
        }
        results.push(teamsObj)
      })
      resp.status(200).json(results)
    })
  } catch (error) {
    resp.status(500).json(error);
  }
})

app.get("/driver/:driverName", (req, resp) => {
  const urlDriver = `https://www.formula1.com/en/drivers/${req.params.driverName}.html`;
  const listKey = [];
  const listValue = [];
  const listParagraph = [];
  const driverDetail = {};
  const dataResponse = {};
  try {
    axios(urlDriver).then((res) => {
      const html = res.data;
      const $ = cheerio.load(html);
      const driverImg = $('.inner-wrap').find('.profile > div > .driver-title > .driver-image-crop > .driver-image-crop-outer > .driver-image-crop-inner > .fom-adaptiveimage').attr('data-path');
      const driverNumber = $('.inner-wrap').find('.profile > div > .driver-title > .driver-details > .driver-number > span').text().trim();
      const driverFullName = $('.inner-wrap').find('.profile > div > .driver-title > .driver-details > h1').text().trim();
      $('.inner-wrap').each(function () {
        $(this).find('.stats > .stats-list-component > .stat-list > tbody > tr').each(function () {
          const key = $(this).find('th > span').text().trim().toLowerCase().split(' ').join('');
          const value = $(this).find('td').text().trim();
          listKey.push(key);
          listValue.push(value);
          for (let i = 0; i < key.length; i++) {
            driverDetail[listKey[i]] = listValue[i]
          }
        })
        $(this).find('.biography > .text > p').each(function () {
          listParagraph.push($(this).text())
        });
      })
      dataResponse['driverImg'] = driverImg;
      dataResponse['driverNumber'] = driverNumber;
      dataResponse['driverFullName'] = driverFullName;
      dataResponse['driverDetail'] = driverDetail;
      dataResponse['listParagraph'] = listParagraph;
      resp.status(200).json(dataResponse)
    })
  } catch (error) {
    resp.status(500).json(error);
  }
})

app.get("/team/:teamName", (req, resp) => {
  const urlTeam = `https://www.formula1.com/en/teams/${req.params.teamName}.html`;
  const listKey = [];
  const listValue = [];
  const listParagraph = [];
  const listYear = [];
  const listTeamMember = [];
  const teamDetail = {};
  const dataResponse = {};
  try {
    axios(urlTeam).then((res) => {
      const html = res.data;
      const $ = cheerio.load(html);
      $('.inner-wrap').each(function () {
        $(this).find('.stats > .stats-list-component > .stat-list > tbody > tr').each(function () {
          const key = $(this).find('th > span').text().trim().toLowerCase().split(' ').join('');
          const value = $(this).find('td').text().trim();
          listKey.push(key);
          listValue.push(value);
          for (let i = 0; i < key.length; i++) {
            teamDetail[listKey[i]] = listValue[i]
          }
        }) 
        $(this).find('.profile > .drivers > li').each(function () {
          const avatar = $(this).find('.fom-adaptiveimage').attr('data-path');
          const number = $(this).find('.driver-number > span').text().trim();
          const name = $(this).find('.driver-name').text().trim();
          const team = $(this).find('.driver-team > span').text().trim();
          const teamMember = {
            avatar,
            number,
            name,
            team,
          }
          listTeamMember.push(teamMember);
        })
        $(this).find('.information > .text > p').each(function () {
          listParagraph.push($(this).text().trim())
        });
        $(this).find('.information > .text > h4').each(function () {
          listYear.push($(this).text().trim());
        });
      })
      dataResponse['teamDetail'] = teamDetail;
      dataResponse['teamMember'] = listTeamMember;
      dataResponse['listParagraph'] = listParagraph;
      dataResponse['listYear'] = listYear;
      resp.status(200).json(dataResponse)
    })
  } catch (error) {
    resp.status(500).json(error);
  }
})


// RUN PORT
app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running ${process.env.PORT}`);
});