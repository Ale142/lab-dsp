
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;

import com.google.protobuf.ByteString;

import conversion.ConversionRequest;
import conversion.ConversionResponse;
import conversion.ImageConverterGrpc;
import conversion.MetadataRequest;
import conversion.ImageConverterGrpc.ImageConverterStub;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.stub.StreamObserver;

public class MyClient {

	public MyClient(String host, int port, final int type) throws InterruptedException, IOException {
		ManagedChannel channel = ManagedChannelBuilder.forAddress(host, port).usePlaintext().build();
		ImageConverterStub blockingStub = ImageConverterGrpc.newStub(channel);

		StreamObserver<ConversionResponse> responseObserver = new StreamObserver<ConversionResponse>() {
			int totalReceived = 0;
			FileOutputStream fout = new FileOutputStream("output" + type + ".png");

			@Override
			public void onNext(ConversionResponse value) {

				if (value.hasMetadata()) {
					System.out.println(
							"Got metadata: " + value.getMetadata().getSuccess() + " " + value.getMetadata().getError());
				} else {
					System.out.println("Got bytes: " + value.getFile().size());
					try {
						fout.write(value.getFile().toByteArray());
					} catch (IOException e) {
						e.printStackTrace();
					}
					totalReceived += value.getFile().size();
				}
			}

			@Override
			public void onCompleted() {
				System.out.println("Responses finished, received a total of " + totalReceived + " bytes");
				try {
					fout.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
				System.exit(0);
			}

			@Override
			public void onError(Throwable t) {
				System.err.println("Got errors: " + t.getMessage());
			}
		};

		StreamObserver<ConversionRequest> requestObserver = blockingStub.convert(responseObserver);
		requestObserver.onNext(ConversionRequest.newBuilder()
				.setMetadata(MetadataRequest.newBuilder().setSourceFileType("jpg").setDestFileType("png").build())
				.build());

		File fi = new File(
				"/home/luca/Documenti/uni/Distributed-system-programming/labs/todomanager/grpc-java/chicken_face.jpg");
		byte[] fileContent = Files.readAllBytes(fi.toPath());
		System.out.println("Sending file for " + fileContent.length + " bytes of content");

		int chunkSize = fileContent.length / 10;
		for (int i = 0; i < fileContent.length; i += chunkSize) {
			int correctSize = Math.min(chunkSize, fileContent.length - i);
			requestObserver.onNext(
					ConversionRequest
							.newBuilder()
							.setFile(ByteString.copyFrom(fileContent, i, correctSize))
							.build());
			Thread.sleep(100);
		}
		requestObserver.onCompleted();
		System.out.println("MyClient::onCompleted()");

	}

	public static void main(String[] args) {
		try {
			System.out.println("Launching MyClient");
			new MyClient("localhost", 5000, Integer.parseInt(args[0]));

		} catch (Exception e) {

			e.printStackTrace();
		}
	}

}