import * as tls from "tls";
import * as fs from "fs";
import * as path from "path";

const PORT = 1965;


const options = {
  key: fs.readFileSync("certs/server.key"), // private key only the server should use it for decripting the message
  cert: fs.readFileSync("certs/server.crt"), // server certificate  , used by client to verify whether the server is legit or not
};

// const PAGES_DIR = path.join(__dirname, "pages");?

const server = tls.createServer(options, (socket) => {
  console.log("Client connected");

  socket.once("data", (data) => {
    const request = data.toString().trim();
    console.log(`Received request: ${request}`);

    let urlPath: string;
    try {
      urlPath = new URL(request).pathname;
      console.log(urlPath);
    } catch (error) {
      console.error(`Invalid request format: ${error}`);
      socket.write("59 Invalid request\r\n");
      socket.end();
      return;
    }

    // Construct file path
    let filePath = path.join(path.join(__dirname , "pages"), urlPath === "/" ? "index.gmi" : urlPath + ".gmi");
    console.log(`Checking file: ${filePath}`);

    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      socket.write(`20 text/gemini\r\n${content}\r\n`);
    } else {
      socket.write("51 Not Found\r\nPage not found\r\n");
    }

    socket.end();
  });

  socket.on("error", (err) => console.error({error : err.message}));
});

server.listen(PORT,  () => {
  console.log(`Gemini server running on gemini://localhost:${PORT}`);
});
