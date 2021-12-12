package Server;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.Socket;
import java.nio.ByteBuffer;
import java.util.Arrays;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.awt.image.BufferedImage;

import javax.imageio.ImageIO;

public class ConverterService implements Runnable {
    Socket socket;
    Logger logger;

    ConverterService(Socket socket, Logger logger) {
        this.socket = socket;
        this.logger = logger;
    }

    @Override
    public void run() {
        try {
            convert();
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Could not complete the conversion", e);
        }

    }

    public void convert() throws IOException {
        // BufferedReader in = new BufferedReader(new
        // InputStreamReader(socket.getInputStream()));
        // System.out.println(in.readLine());
        InputStream in = socket.getInputStream();
        OutputStream out = socket.getOutputStream();

        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        // baos.write(buffer, 0, in.read(buffer));

        // byte result[] = baos.toByteArray();

        // String res = new String(result);
        // System.out.println("Recieved from client : " + res);
        // int c;

        byte originalType[] = new byte[3];
        byte targetType[] = new byte[3];
        in.readNBytes(originalType, 0, 3);
        in.readNBytes(targetType, 0, 3);

        String oType = new String(originalType);
        String tType = new String(targetType);
        System.out.println("Received: " + oType);
        System.out.println("Received: " + tType);

        // Read file length
        byte length[] = new byte[4];
        in.readNBytes(length, 0, 4);
        int fileLength = ByteBuffer.wrap(length).getInt();

        // Read file bytes
        byte[] buffer = new byte[1024];
        int count = 0;
        while ((count += in.read(buffer)) < fileLength) {
            baos.write(buffer);
        }

        System.out.println("Count:" + count);
        logger.log(Level.INFO, "File received with length:" + fileLength);

        // Conversion
        try {
            ByteArrayOutputStream baosImageToSend = new ByteArrayOutputStream();
            byte[] bytes = baos.toByteArray();
            ByteArrayInputStream bais = new ByteArrayInputStream(bytes);
            BufferedImage imageReceived = ImageIO.read(bais);

            ImageIO.write(imageReceived, tType, new File("prova." + tType));
            ImageIO.write(imageReceived, tType, baosImageToSend);

            BufferedInputStream bisImageToSend = new BufferedInputStream(
                    new ByteArrayInputStream(baosImageToSend.toByteArray()));
            int bufferSize = 1 * 1024; // 1KB
            byte[] buffer2 = new byte[bufferSize];

            logger.log(Level.INFO, "File converted successfully");

            // Send 0 if conversion goes well
            out.write(ByteBuffer.allocate(4).putInt(0).array());

            try {

                // Send file Length
                int fileConvertedLength = baosImageToSend.toByteArray().length;
                logger.log(Level.INFO, "File converted length:" + fileConvertedLength);
                out.write(ByteBuffer.allocate(4).putInt(fileConvertedLength).array());
                count = 0;
                while ((bisImageToSend.read(buffer2, 0, bufferSize)) != -1) {
                    out.write(buffer2);
                }

                logger.log(Level.INFO, "File converted and sent to the client");
            } catch (IOException e) {
                e.printStackTrace();
            }
        } catch (Exception e) {
            String errorMessage = e.getMessage();
            out.write(ByteBuffer.allocate(4).putInt(1).array());
            // Send length of message
            int lengthErrorMessage = errorMessage.getBytes().length;
            out.write(ByteBuffer.allocate(4).putInt(lengthErrorMessage).array());
            out.write(errorMessage.getBytes());

        }
        // while ((c = in.read()) != -1) {
        // System.out.println("Received: " + (char) c);
        // }
        // logger.log(Level.INFO, "Received: " + rBuf);

    }

}
