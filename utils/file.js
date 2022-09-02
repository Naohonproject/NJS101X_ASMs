const fs = require("fs");

exports.deleteFile = (filePath) => {
  // use the unlink func of fs package to delete a file from the filepath
  //   unlink receive the filePath as a pathLike
  fs.unlink(filePath, (err) => {
    if (err) {
      throw err;
    }
  });
};
