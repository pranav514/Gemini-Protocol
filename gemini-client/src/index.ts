import * as tls from "tls";
import fs from "fs"
const GEMINI_HOST = "localhost";
const GEMINI_PORT = 1965;
const GEMINI_URL = "gemini://localhost/index"; 


  const client = tls.connect(GEMINI_PORT, GEMINI_HOST, {
    ca: fs.readFileSync("certs/ca.crt"), 
  }, () => {
    console.log("Certificate verified");
    client.write(`${GEMINI_URL}\r\n`);
  });
client.on("data", (data) => {
  console.log("Server response:\n" + data.toString());
  client.end(); 
});
client.on("error", (err) => {
  console.error(`Connection error: ${err.message}`);
});
client.on("end", () => {
  console.log("Connection closed.");
});
