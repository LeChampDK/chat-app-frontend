import {ChatClient} from './chat-client.model';
import DateTimeFormat = Intl.DateTimeFormat;

export interface ChatMessage {
  message: string;
  sender: ChatClient;
}
