package Client;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.Socket;
import java.net.UnknownHostException;
import java.nio.ByteBuffer;
import java.nio.file.Files;
import java.nio.file.OpenOption;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.Arrays;
import java.util.regex.Pattern;

import javax.imageio.ImageIO;

import java.awt.image.BufferedImage;

public class Client {
    Client(String server, int port, String originalType, String targetType, String imagePath)
            throws UnknownHostException, IOException, FileNotFoundException {
        Socket socket = new Socket(server, port);
        System.out.println("Connected to the server");
        OutputStream out = socket.getOutputStream();
        InputStream in = socket.getInputStream();
        // PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
        File imageToSend = new File(imagePath);
        if (!imageToSend.exists()) {
            socket.close();
            throw new FileNotFoundException("File " + imagePath + " not found");
        }
        BufferedInputStream fileIn = new BufferedInputStream(new FileInputStream(imageToSend));

        // Send originalType
        out.write(originalType.getBytes());

        // Send targetType
        out.write(targetType.getBytes());

        // Send file length
        System.out.println(ByteBuffer.wrap(ByteBuffer.allocate(4).putInt((int) imageToSend.length()).array()).getInt());
        out.write(ByteBuffer.allocate(4).putInt((int) imageToSend.length()).array());
        byte[] buffer = new byte[1024];

        while ((fileIn.read(buffer)) > 0) {
            out.write(buffer);
        }
        System.out.println("File sent");
        fileIn.close();

        // Read status code
        byte[] statusCodeBytes = new byte[4];
        in.readNBytes(statusCodeBytes, 0, 4);
        int statusCode = ByteBuffer.wrap(statusCodeBytes).getInt();

        // Read length of response (it could be length of the file or of the error)
        byte[] byteLengthResponse = new byte[4];
        in.readNBytes(byteLengthResponse, 0, 4);
        int lengthResponse = ByteBuffer.wrap(byteLengthResponse).getInt();
        System.out.println("Length of response: " + lengthResponse);

        // Check status code
        if (statusCode != 0) {
            byte[] error = new byte[lengthResponse];
            in.readNBytes(error, 0, lengthResponse);
            String errore = new String(error);
            socket.close();
            throw new Error(errore);
        }

        // Creation of converted file
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        byte[] fileConverted = new byte[1024];
        int count = 0;
        while ((count += in.read(fileConverted, 0, 1024)) > 0 && count < lengthResponse) {
            // TODO: create converted image;
            // HAndle errors
            baos.write(fileConverted);
        }
        System.out.println("Count:" + count);
        System.out.println("File received");

        byte[] data = baos.toByteArray();
        ByteArrayInputStream bis = new ByteArrayInputStream(data);
        // BufferedImage imageToCreate = ImageIO.read(bis);

        // ImageIO.write(imageToCreate, targetType, new
        // File(imagePath.split(Pattern.quote("."))[0] + "." + targetType));
        Files.write(Path.of("./images/output." + targetType), data, StandardOpenOption.CREATE);
        System.out.println("File created");

        out.close();
        in.close();
        socket.close();
    }

    public static void checkType(String type) throws IllegalArgumentException {
        String typeLowerCase = type.toLowerCase();
        String[] typeAllowed = { "png", "jpg", "gif" };
        boolean contains = Arrays.stream(typeAllowed).anyMatch(typeLowerCase::equals);
        if (!contains)
            throw new IllegalArgumentException("Wrong type inserted " + type);
    }

    public static void main(String[] args) {
        if ((args.length < 3) || args.length > 3)
            throw new IllegalArgumentException("Usage: java Client <original_type> <target_type> <image_path>");
        try {
            int port = 2001;
            String originalType = args[0];
            String targetType = args[1];
            checkType(originalType);
            checkType(targetType);
            String imagePath = args[2];
            new Client("localhost", port, originalType, targetType, imagePath);
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
            e.printStackTrace();
        } catch (UnknownHostException e) {
            System.out.println("Uknown host specified");
            e.printStackTrace();
        } catch (FileNotFoundException e) {
            System.out.println(e.getMessage());
            e.printStackTrace();
        } catch (IOException e) {
            System.out.println("IO Exception");
            e.printStackTrace();
        } catch (Exception e) {
            System.out.println("Errore");
            e.printStackTrace();
        }
    }
}