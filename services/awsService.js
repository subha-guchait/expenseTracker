const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

exports.uploadFileToS3 = async (fileContent, key) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET, // S3 bucket name
      Key: `expense/${key}`, // File name and path in the bucket
      Body: fileContent, // File content
      ContentType: "application/pdf",
    };

    // Create the PutObjectCommand to upload the file
    const command = new PutObjectCommand(params);

    // Execute the command
    const response = await s3Client.send(command);

    // Return the S3 URL (manually construct it since Location is not directly returned in v3)
    const fileUrl = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/expense/${key}`;
    return fileUrl;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Failed to upload file to S3");
  }
};
