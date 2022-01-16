
import java.io.IOException;
import java.util.concurrent.TimeUnit;

import io.grpc.Server;
import io.grpc.ServerBuilder;

public class MyServer {

	public MyServer(int port) throws IOException, InterruptedException {
		final Server server = ServerBuilder.forPort(port)
				.addService(new ImageService()).build();
		server.start();

		System.out.println("Listening on port " + port);

		Runtime.getRuntime().addShutdownHook(new Thread() {
			@Override
			public void run() {
				System.err.println("*** shutting down gRPC server since JVM is shutting down");
				// Start graceful shutdown
				server.shutdown();
				try {
					// Wait for RPCs to complete processing
					if (!server.awaitTermination(30, TimeUnit.SECONDS)) {
						// That was plenty of time. Let's cancel the remaining RPCs
						server.shutdownNow();
						// shutdownNow isn't instantaneous, so give a bit of time to clean resources up
						// gracefully. Normally this will be well under a second.
						server.awaitTermination(5, TimeUnit.SECONDS);
					}
				} catch (InterruptedException ex) {
					server.shutdownNow();
				}
			}
		});
		server.awaitTermination();
	}

	public static void main(String[] args) throws InterruptedException {
		try {
			new MyServer(5000);
		} catch (IOException e) {
			System.out.println("Could not start server");
			e.printStackTrace();
		}

	}

}