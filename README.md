# Zero-dependency Web Server (Nodejs)

A Node.js command line program with zero dependencies (nothing except the UpLeveled ESLint config dependencies in `"dependencies"` or `"devDependencies"` in `package.json`) that will creates a web server that runs on localhost.

This server returns the content of all files in a directory called `public`.

For example, assume that you are running the server on `localhost:3000`, and you have the following file in the `public` folder:

```
memes/index.htm
memes/1.jpg
index.html
index.css
```

For this situation, the following behavior should be observable:

1. `http://localhost:3000` and `http://localhost:3000/index.html` should return the webpage in the `index.html` file
2. `http://localhost:3000/index.css` should return the text content of the file
3. `http://localhost:3000/memes` and `http://localhost:3000/memes/index.htm` should return the webpage in the `index.htm` file
4. `http://localhost:3000/1.jpg` should display the `1.jpg` image
5. `http://localhost:3000/non-existent-file.txt` should return a `404` status code and a message about the file not being found

Of course, these are just examples - the server should is able to handle any files and folders that anyone adds to the public folder.

- [x] Security: users cannot request files outside of the `public` directory
- [x] Returns the correct `Content-Type` header for the file type
