"use strict";
const fs = require("fs");
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = __dirname + "/proto/converter.proto";
const REMOTE_URL = "localhost:5000";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const grpcStub = grpc.loadPackageDefinition(packageDefinition).conversion;

exports.convertImage = async function convertImage(
  sourceFilePath,
  destFilePath,
  sourceFileType,
  destFileType
) {
  return new Promise((resolve, reject) => {
    const chunkSize = 4096;
    const imageReadStream = fs.createReadStream(sourceFilePath, {
      highWaterMark: chunkSize,
    });
    const imageWriteStream = fs.createWriteStream(destFilePath);

    const channel = new grpcStub.ImageConverter(
      REMOTE_URL,
      grpc.credentials.createInsecure()
    ).convert();

    channel.on("data", (data) => {
      if (data.metadata) {
        if (data.metadata.success === false) reject(data.metadata.error);
      } else {
        imageWriteStream.write(data.file);
      }
    });
    channel.on("end", () => {
      imageWriteStream.end();
      resolve();
    });

    // Write initial packet
    channel.write({ metadata: { sourceFileType, destFileType } });

    imageReadStream.on("data", (chunk) => channel.write({ file: chunk }));
    imageReadStream.on("end", () => channel.end());
  });
};
