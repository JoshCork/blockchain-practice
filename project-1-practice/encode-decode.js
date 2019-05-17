// Require file system access
fs = require('./node_modules/fs');

// Read file buffer 
imgReadBuffer = fs.readFileSync('grumpy.jpg');

// Encode image buffer to hex
imgHexEncode = new Buffer(imgReadBuffer).toString('hex');

// Output encoded data to console
console.log(imgHexEncode);

// Decode Hex
var imgHexDecode = new Buffer(imgHexEncode, 'hex');

// Save decoded file file system
fs.writeFileSync('decodedHexImage.jpg', imgHexDecode);