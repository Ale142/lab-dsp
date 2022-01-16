import java.io.IOException;
import java.net.Inet4Address;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.UnknownHostException;
import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * ImageConverterServer
 */
public class ImageConverterServer {

    public static void main(String[] args) throws Exception {

        ServerSocket ss = new ServerSocket(5000, 10, Inet4Address.getByName("localhost"));
        Executor executor = Executors.newCachedThreadPool();
        // System.out.println("Buffer size is " + args[0]);
        Socket s = null;
        while ((s = ss.accept()) != null) {
            executor.execute(new ImageConverterWorker(s));
        }

        ss.close();
    }
}