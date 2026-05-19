require("dotenv").config();
const ftp = require("basic-ftp");
const path = require("path");

const {
  FTP_HOST,
  FTP_PORT = "21",
  FTP_USER,
  FTP_PASSWORD,
  FTP_SECURE = "explicit",
  LOCAL_DIR = "./dist",
  REMOTE_DIR = "/public_html",
} = process.env;

async function upload() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    await client.access({
      host: FTP_HOST,
      port: parseInt(FTP_PORT, 10),
      user: FTP_USER,
      password: FTP_PASSWORD,
      // "explicit" = FTPS with AUTH TLS on port 21; set to false for plain FTP
      secure: FTP_SECURE === "false" ? false : FTP_SECURE,
    });

    console.log(`Connected to ${FTP_HOST}`);
    console.log(`Uploading ${path.resolve(LOCAL_DIR)} → ${REMOTE_DIR}`);

    await client.ensureDir(REMOTE_DIR);
    await client.clearWorkingDir();
    await client.uploadFromDir(LOCAL_DIR);

    console.log("Upload complete.");
  } catch (err) {
    console.error("FTP upload failed:", err.message);
    process.exit(1);
  } finally {
    client.close();
  }
}

upload();
