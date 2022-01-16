import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.Socket;
import java.nio.ByteBuffer;
import java.util.Arrays;

import javax.imageio.ImageIO;
import javax.imageio.stream.ImageOutputStream;

public class ImageConverterWorker implements Runnable {

    private InputStream in;
    private OutputStream out;

    /**
     * Message metadata:
     * 3 chars source file type
     * 3 chars dest file type
     * 4 bytes source file size
     */
    private final int METADATA_LENGTH = 3 + 3 + 4;
    private int BUFFER_SIZE = 1024;

    public ImageConverterWorker(Socket s) {
        this(s, 4096);
    }

    public ImageConverterWorker(Socket s, int bufferSize) {
        try {
            this.in = s.getInputStream();
            this.out = s.getOutputStream();
            this.BUFFER_SIZE = bufferSize;
        } catch (Exception e) {
            System.err.println("Problems while creating worker: " + e.getLocalizedMessage());
        }
    }

    @Override
    public void run() {
        long start = System.currentTimeMillis();
        byte[] buffer = new byte[BUFFER_SIZE];
        try {
            int totalBytesRead = 0;
            do {
                totalBytesRead += in.read(buffer, totalBytesRead, METADATA_LENGTH);
            } while (totalBytesRead < METADATA_LENGTH);

            String sourceType = new String(Arrays.copyOfRange(buffer, 0, 3));
            String destType = new String(Arrays.copyOfRange(buffer, 3, 6));
            int size = ByteBuffer.wrap(Arrays.copyOfRange(buffer, 6, 10)).getInt();

            System.out.printf("Received\n\tsource = %s\n\tdest = %s\n\tsize = %d\n", sourceType, destType, size);

            totalBytesRead = totalBytesRead - METADATA_LENGTH;
            ByteArrayOutputStream baos = new ByteArrayOutputStream(size);
            baos.write(buffer, METADATA_LENGTH, totalBytesRead);

            int bytesRead = 0;
            while (totalBytesRead < size && (bytesRead = in.read(buffer, 0, BUFFER_SIZE)) != -1) {
                baos.write(buffer, 0, bytesRead);
                totalBytesRead += bytesRead;
                // System.out.println("Received chunk (" + bytesRead + "), now got " +
                // totalBytesRead + "/" + size
                // + " bytes in total");
            }

            ByteArrayInputStream bais = new ByteArrayInputStream(baos.toByteArray());
            baos.reset();
            ImageIO.write(ImageIO.read(bais), sourceType, baos);
            out.write(ByteBuffer.allocate(1).put((byte) '0').array());
            out.write(ByteBuffer.allocate(4).putInt(baos.size()).array());
            out.write(baos.toByteArray());
        } catch (Exception e) {
            e.printStackTrace();
        }
        long end = System.currentTimeMillis();
        System.out.println("Worker took " + (end - start) + "ms");
    }
}
