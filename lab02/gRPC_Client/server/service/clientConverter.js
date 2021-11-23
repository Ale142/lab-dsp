const PROTO_PATH = "/Users/alessandrobacci/Github/lab-dsp/lab02/gRPC_Server/JavaServer/src/main/proto/conversion.proto";
const REMOTE_URL = "localhost:50051";
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const util = require('util');
const fs = require("fs");
const { chunk, reject } = require('lodash');
const { resolve } = require('path');
console.log('proto file:' + PROTO_PATH);
// Load protofile 
let packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
let protoD = grpc.loadPackageDefinition(packageDefinition);
let converter = protoD.conversion;


function main(pathFileOrigin, pathFileTarget, origin, target) {
    console.log('starting client');

    return new Promise((resolve, reject) => {
        let client = new converter.Converter(REMOTE_URL,
            grpc.credentials.createInsecure());

        const metaRequest = {
            meta: {
                file_type_origin: origin,
                file_type_target: target
            }
        }



        var request = client.fileConvert();
        console.log("target:", pathFileTarget)
        var wstream = fs.createWriteStream(pathFileTarget)
        request.on('data', function (data) {

            // Receive meta data 
            if (data.meta !== undefined) {
                if (!data.meta.success) {
                    reject(data.meta.error);
                }
            }

            // Receive file chunk
            if (data.file !== undefined) {
                wstream.write(data.file);
            }
        });

        request.on('end', () => {
            wstream.end();
        })

        // Write meta data information
        request.write(metaRequest);

        const maxChunkSize = 1024
        const image = fs.createReadStream(pathFileOrigin, { highWaterMark: maxChunkSize });

        image.on('data', chunk => {
            request.write({ "file": chunk });
        })

        image.on('end', () => {
            request.end();
        })

        wstream.on('close', () => {
            resolve();
        })

    })

}

module.exports = main;