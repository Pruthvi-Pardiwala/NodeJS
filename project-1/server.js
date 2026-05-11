const httpModule = require("http");
const fileSystem = require("fs");
const pathModule = require("path");

const serverPort = 8000;

const handleRequest = (request, response) => {
  let pagePath = "";

  switch (request.url) {
    case "/":
      pagePath = "./pages/index.html";
      break;

    case "/about":
      pagePath = "./pages/about.html";
      break;

    case "/service":
      pagePath = "./pages/service.html";
      break;

    case "/contact":
      pagePath = "./pages/contact.html";
      break;

    default:
      pagePath = "./pages/404-page.html";
      break;
  }

  fileSystem.readFile(
    pathModule.join(__dirname, pagePath),
    (error, fileData) => {
      if (error) {
        response.end("Internal Server Error");
        return;
      } else {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end(fileData);
      }
    }
  );
};

const appServer = httpModule.createServer(handleRequest);

appServer.listen(serverPort, (error) => {
  if (error) {
    console.log(error);
    return false;
  } else {
    console.log(`Server started on port ${serverPort}`);
    console.log("http://localhost:8000/");
  }
});