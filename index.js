import fs, { readdirSync } from 'node:fs';
import http from 'node:http';
import path, { resolve } from 'node:path';
import url from 'node:url';
import mimeTypes from './utilis/mimeTypes.js';

// It returns a promise that resolves to an array of all the files in a directory and its subdirectories
async function getFiles(dir) {
  const dirAndFiles = readdirSync(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirAndFiles.map((dirAndFile) => {
      const res = resolve(dir, dirAndFile.name);
      return dirAndFile.isDirectory() ? getFiles(res) : res;
    }),
  );
  return Array.prototype.concat(...files);
}

const files = await getFiles('./public');

/* Transforming an array of all the files in the public directory and its subdirectories. */
const newArr = files.map((item) =>
  item.split('public\\').pop().replace('\\', '/'),
);

/**
 * It takes an array of file names and a string (either a file extension or a file name) and returns
 * the first file name that matches the string.
 */
function findFile(arr, extOrPath) {
  const fileName = arr.find((item, index) =>
    item.includes(extOrPath) ? arr[index] : null,
  );
  return fileName;
}

/* Creating a server and listening for requests. */
const server = http.createServer(function (req, res) {
  const urlParts = url.parse(req.url);
  const pathObj = path.parse(urlParts.path);

  /* Checking if the url path is '/' or if the file exists in the public directory or if the file
  exists in the public directory and its subdirectories. */
  if (
    urlParts.path === '/' ||
    fs.existsSync(`public/${urlParts.pathname}`) ||
    findFile(newArr, urlParts.path)
  ) {
    /* Checking if the url path is '/' or if the file with a particular extension exists in the public directory  */
    if (
      urlParts.path === '/' ||
      (urlParts.path.includes(`/${pathObj.name}`) &&
        pathObj.ext.includes('.htm') &&
        pathObj.dir === '/')
    ) {
      res.writeHead(200, {
        'Content-Type': 'text/html',
      });
      const readMe = fs.readFileSync(`public/${findFile(newArr, 'htm')}`);
      res.write(readMe);
      res.end();
    } else if (pathObj.dir === '/' && pathObj.ext === '.jpg') {
      res.writeHead(200, {
        'Content-Type': mimeTypes[pathObj.ext.replace('.', '')],
      });
      const readMe = fs.readFileSync(
        `public/${findFile(newArr, pathObj.name)}`,
      );
      res.write(readMe);
      res.end();
    } else if (pathObj.dir === '/' && pathObj.ext) {
      res.writeHead(200, {
        'Content-Type': mimeTypes[pathObj.ext.replace('.', '')],
      });
      const readMe = fs.readFileSync(`public/${pathObj.base}`);
      res.write(readMe);
      res.end();
    } else if (!pathObj.ext) {
      let file = newArr.find((item) => {
        let fileFound = '';
        if (item.includes('htm') && item.includes(pathObj.base)) {
          fileFound = item;
        }
        return fileFound;
      });
      if (!file) {
        file = findFile(newArr, pathObj.base);
      }

      res.writeHead(200, {
        'Content-Type': mimeTypes[file.split('.').pop()],
      });

      const readMe = fs.readFileSync(`public/${file}`);
      res.write(readMe);
      res.end();
    } else if (pathObj.dir !== '/') {
      res.writeHead(200, {
        'Content-Type': mimeTypes[pathObj.ext.replace('.', '')],
      });
      const readMe = fs.readFileSync(`public${urlParts.path}`);
      res.write(readMe);
      res.end();
    } else {
      res.writeHead(200, {
        'Content-Type': 'text/html',
      });
      const readMe = fs.readFileSync('404.html');
      res.write(readMe);
    }
  } else {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });
    const readMe = fs.readFileSync('404.html');
    res.write(readMe);
    res.end();
  }
  res.end();
});

server.listen(3000);

console.log('Node.js web server at port 3000 is running..');
