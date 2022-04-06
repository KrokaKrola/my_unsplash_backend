import { PickType } from '@nestjs/swagger';
import { ImageEntity } from 'src/models/image/entities/image.entity';
import { PetEntity } from 'src/models/pets/entities/pet.entity';

class ImageDto extends PickType(ImageEntity, [
  'hash',
  'imageStatus',
  'originalDimensions',
]) {}

export class PetDto extends PickType(PetEntity, []) {
  image: ImageDto;
}
