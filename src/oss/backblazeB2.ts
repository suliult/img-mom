import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { OSSProvider } from './interface';
import { genDateDirName } from '../utils';

class BackblazeB2 implements OSSProvider {
	private client: S3Client;

	constructor() {
		this.client = new S3Client({
			endpoint: `https://${self.B2_ENDPOINT}`,
			region: self.B2_ENDPOINT.split('.')[1],
			credentials: {
				accessKeyId: self.B2_KEY_ID || '',
				secretAccessKey: self.B2_SECRET_KEY || '',
			}
		});
	}

	async uploadImage(data: any, fileName: string, fileType: string) {
		const filePath = `${genDateDirName()}/${fileName}.${fileType}`;
		await this.client.send(new PutObjectCommand({
			Bucket: self.B2_BUCKET,
			Key: filePath,
			Body: data,
			ContentType: `image/${fileType}`
		}));
		return filePath;
	}

	getURL(filePath: string) {
		if (self.B2_CUSTOM_DOMAIN) {
			return `https://${self.B2_CUSTOM_DOMAIN}/${filePath}`;
		}
		return `https://${self.B2_BUCKET}.${self.B2_ENDPOINT}/${filePath}`;
	}
}

export default BackblazeB2;
