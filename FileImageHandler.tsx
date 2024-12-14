// Hay que deserollar una componente que pueda cargar fotos desde el celu con la camara o la galeria de fotos
// Hay que ver donde guardamos las fotos (en la db o en la app y la db tiene los enlaces)


// require the module
var RNFS = require('react-native-fs');

var uploadUrl = 'http://requestb.in/XXXXXXX';  // For testing purposes, go to http://requestb.in/ and create your own link
// create an array of objects of the files you want to upload
var files = [
  {
    name: 'test1',
    filename: 'test1.w4a',
    filepath: RNFS.DocumentDirectoryPath + '/test1.w4a',
    filetype: 'audio/x-m4a'
  }, {
    name: 'test2',
    filename: 'test2.w4a',
    filepath: RNFS.DocumentDirectoryPath + '/test2.w4a',
    filetype: 'audio/x-m4a'
  }
];

var upload
= (response) => {
  var jobId = response.jobId;
  console.log('UPLOAD HAS BEGUN! JobId: ' + jobId);
};

var uploadProgress = (response) => {
  var percentage = Math.floor((response.totalBytesSent/response.totalBytesExpectedToSend) * 100);
  console.log('UPLOAD IS ' + percentage + '% DONE!');
};

// upload files
RNFS.uploadFiles({
  toUrl: uploadUrl,
  files: files,
  method: 'POST',
  headers: {
    'Accept': 'application/json',
  },
  fields: {
    'hello': 'world',
  },
  begin: uploadBegin,
  progress: uploadProgress
}).promise.then((response) => {
    if (response.statusCode == 200) {
      console.log('FILES UPLOADED!'); // response.statusCode, response.headers, response.body
    } else {
      console.log('SERVER ERROR');
    }
  })
  .catch((err) => {
    if(err.description === "cancelled") {
      // cancelled by user
    }
    console.log(err);
  });