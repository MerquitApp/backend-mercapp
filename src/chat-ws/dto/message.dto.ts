import { OmitType } from '@nestjs/swagger';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';

export class MessageDto extends OmitType(CreateMessageDto, ['user_id']) {}
