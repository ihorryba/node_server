// var fs = require('fs');
// var vtpbf = require('vt-pbf');
// var geojsonVt = require('geojson-vt');

// var orig = JSON.parse(fs.readFileSync(__dirname + '/FRO_Topography_TOE_04ME.geojson'))
// var tileindex = geojsonVt(orig)
// var tile = tileindex.getTile(1, 0, 0)

// pass in an object mapping layername -> tile object
// var buff = vtpbf.fromGeojsonVt({ 'geojsonLayer': tile })
// fs.writeFileSync('my-tile.pbf', buff)

/*const tippecanoe = require('tippecanoe');

tippecanoe(['fro-road-network.geojson'], {
    zg: true,
    readParallel: true,
    simplification: 10,
    layer: 'road',
    output: 'road.mbtiles',
    description: 'road'
}, { echo: true });*/

const AWS = require('aws-sdk');
const axios = require('axios');
const fs = require('fs');

const mbxClient = require('@mapbox/mapbox-sdk');
const mbxTilesets = require('@mapbox/mapbox-sdk/services/tilesets');
const mbxUploads = require('@mapbox/mapbox-sdk/services/uploads');

const access_token = 'sk.eyJ1IjoiaWhvcnJ5YmEiLCJhIjoiY2s3ZDk1eWJ1MHQxaDNmbXNqOHVscmw0ZyJ9.9oHJqJX14vuNI1PzmlwDjw';

const baseClient = mbxClient({ accessToken: access_token });
const tilesetsService = mbxTilesets(baseClient);

const uploadsClient = mbxUploads(baseClient);

/*axios.post('https://api.mapbox.com/uploads/v1/ihorryba/credentials?access_token=' + access_token).then((response) => {
	console.log(response.data);
	putFileOnS3(response.data);
}, (err) => {
	console.log(err.response);
});

const putFileOnS3 = (credentials) => {
	const s3 = new AWS.S3({
		accessKeyId: credentials.accessKeyId,
		secretAccessKey: credentials.secretAccessKey,
		sessionToken: credentials.sessionToken,
		region: 'us-east-1'
	});
	return s3.putObject({
		Bucket: credentials.bucket,
		Key: credentials.key,
		Body: fs.createReadStream('fro-road-network-new.geojson')
	}).promise().then(() => {
		uploads.createUpload({
			mapId: 'ihorryba/new-road',
			url: credentials.url
		}).send().then(res => {
			console.log(res.body);
		}, err => {
			console.log(err);
		});
	});
}*/


const getCredentials = () => {
	return axios.post('https://api.mapbox.com/uploads/v1/ihorryba/credentials?access_token=' + access_token)
	 .then(res => res.data);
  /*return uploadsClient
    .createUploadCredentials()
    .send()
    .then(response => response.body);*/
}
const putFileOnS3 = (credentials) => {
  const s3 = new AWS.S3({
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey,
    sessionToken: credentials.sessionToken,
    region: 'us-east-1'
  });
  return s3.putObject({
    Bucket: credentials.bucket,
    Key: credentials.key,
    Body: fs.createReadStream('fro-cst-new.geojson')
  }).promise().then(() => {
	/*uploadsClient.createUpload({
	  mapId: `ihorryba/newTileForRoad`,
	  url: credentials.url
	}).send().then((res) => {
		console.log(res.body);
	}, (err) => {
		console.log(err);
	})*/
	console.log(credentials.url);
	axios.post('https://api.mapbox.com/uploads/v1/ihorryba?access_token=' + access_token, {
		tileset: 'ihorryba/newTileForRoad',
		url: credentials.url
	  }).then((res) => {
		  console.log(res);
	  }, (err) => {
		  console.log(err);
	  });
  });
};

getCredentials().then(putFileOnS3);

// sk.eyJ1IjoiaWhvcnJ5YmEiLCJhIjoiY2s3ZDk1eWJ1MHQxaDNmbXNqOHVscmw0ZyJ9.9oHJqJX14vuNI1PzmlwDjw
