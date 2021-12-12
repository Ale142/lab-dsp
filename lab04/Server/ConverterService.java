package Server;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
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
import javax.swing.text.StyledEditorKit;

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
        System.out.println("File's length:" + fileLength);

        // Read file bytes
        byte[] buffer = new byte[1024];
        int count = 0;
        while ((count += in.read(buffer)) > 0 && count < fileLength) {
            baos.write(buffer);
        }

        System.out.println("File received");
        ByteArrayOutputStream baosImageToSend = new ByteArrayOutputStream();
        byte[] bytes = baos.toByteArray();
        ByteArrayInputStream bais = new ByteArrayInputStream(bytes);
        BufferedImage imageReceived = ImageIO.read(bais);
        ImageIO.write(imageReceived, tType, baosImageToSend);

        BufferedInputStream bisImageToSend = new BufferedInputStream(
                new ByteArrayInputStream(baosImageToSend.toByteArray()));
        int bufferSize = 1 * 1024; // 1KB
        byte[] buffer2 = new byte[bufferSize];
        try {

            int fileConvertedLength = baosImageToSend.toByteArray().length;
            System.out.println("File Converted Length: " + fileConvertedLength);
            out.write(ByteBuffer.allocate(4).putInt(fileConvertedLength).array());

            while ((bisImageToSend.read(buffer2, 0, bufferSize)) != -1) {
                out.write(buffer2);
            }
            System.out.println("File converted and sent to the client");
        } catch (IOException e) {
            e.printStackTrace();
        }
        // while ((c = in.read()) != -1) {
        // System.out.println("Received: " + (char) c);
        // }
        // logger.log(Level.INFO, "Received: " + rBuf);

    }

}
