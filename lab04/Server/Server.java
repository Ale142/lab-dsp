package Server;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketAddress;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;
import java.util.logging.Level;
import java.util.logging.Logger;

public class Server {
    Logger logger;

    public Server(int port, Logger logger) throws IOException {
        this.logger = logger;

        ServerSocket ss = new ServerSocket(port);
        logger.log(Level.INFO, "Listening on port:" + port);
        Executor service = Executors.newCachedThreadPool();
        Socket s = null;
        while (true) {
            s = ss.accept();
            SocketAddress remoteAddress = s.getRemoteSocketAddress();
            logger.log(Level.INFO, "Accepted connection from " + remoteAddress);
            service.execute(new ConverterService(s, logger));
        }
    }

    public static void main(String[] args) {
        Logger logger = Logger.getLogger("Server.Server");
        int port = 2001;
        try {
            new Server(port, logger);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Server error", e);
        }
    }
}
