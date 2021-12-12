package Client;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
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
import java.util.Arrays;

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

        // Read length of converted file
        byte[] byteLengthConvertedFile = new byte[4];
        in.readNBytes(byteLengthConvertedFile, 0, 4);
        int lengthConvertedFile = ByteBuffer.wrap(byteLengthConvertedFile).getInt();
        System.out.println("Length of converted File: " + lengthConvertedFile);
        byte[] fileConverted = new byte[1024];
        int count = 0;
        while ((count += in.read(fileConverted)) > 0 && count < lengthConvertedFile) {
            // TODO: create converted image;
            // HAndle errors
        }
        System.out.println("File received");

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