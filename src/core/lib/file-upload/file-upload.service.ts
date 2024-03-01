import { Injectable } from '@nestjs/common';
import { CloudinaryService } from './cloudinary/cloudinary.service';

@Injectable()
export class FileUploadService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  uploadProfilePicture(file: Express.Multer.File, userID: string) {
    return this.cloudinaryService.uploadProfilePictureForUser(file, userID, [
      'Image',
      'User',
      'ProfilePiceture',
    ]);
  }

  deleteResource(resourceID: unknown) {
    return this.cloudinaryService.deleteResource(resourceID);
  }
}
