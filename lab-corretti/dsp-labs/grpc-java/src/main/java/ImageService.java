
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

import javax.imageio.ImageIO;

import com.google.protobuf.ByteString;

import conversion.ConversionRequest;
import conversion.ConversionResponse;
import conversion.MetadataResponse;
import conversion.ImageConverterGrpc.ImageConverterImplBase;
import io.grpc.stub.StreamObserver;

public class ImageService extends ImageConverterImplBase {

	@Override
	public StreamObserver<ConversionRequest> convert(final StreamObserver<ConversionResponse> responseObserver) {

		return new StreamObserver<ConversionRequest>() {
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			String sourceFileType, destFileType;

			@Override
			public void onNext(ConversionRequest conversionRequest) {

				if (conversionRequest.hasMetadata()) {
					sourceFileType = conversionRequest.getMetadata().getSourceFileType();
					destFileType = conversionRequest.getMetadata().getDestFileType();
					System.out.println("Got metadata: " + sourceFileType + " -> " + destFileType);
				} else {
					ByteString byteString = conversionRequest.getFile();

					System.out.println("Got bytes: " + byteString.size() + "bytes");
					try {
						baos.write(byteString.toByteArray());
					} catch (IOException e) {
						e.printStackTrace();
					}
				}
			}

			@Override
			public void onError(Throwable t) {
				System.err.println(t.getMessage());
			}

			@Override
			public void onCompleted() {
				System.out.println("ImageService::onCompleted(), received " + baos.size() + " bytes in total");

				ByteArrayInputStream bais = new ByteArrayInputStream(baos.toByteArray());
				baos.reset();
				try {
					ImageIO.write(ImageIO.read(bais), destFileType, baos);
				} catch (IOException e) {
					e.printStackTrace();
				}

				responseObserver.onNext(
						ConversionResponse.newBuilder()
								.setMetadata(
										MetadataResponse.newBuilder()
												.setSuccess(true)
												.setError("Sending back " + baos.size() + " bytes")
												.build())
								.build());

				byte[] fileContent = baos.toByteArray();
				int chunkSize = fileContent.length / 10;

				for (int i = 0; i < fileContent.length; i += chunkSize) {
					// Last chunk could be smaller than chunkSize
					int correctSize = Math.min(chunkSize, fileContent.length - i);
					responseObserver.onNext(
							ConversionResponse.newBuilder()
									.setFile(ByteString.copyFrom(fileContent, i, correctSize))
									.build());
					try {
						Thread.sleep(100);
					} catch (InterruptedException e) {
						e.printStackTrace();
					}
				}
				responseObserver.onCompleted();
			}

		};
	}

}
