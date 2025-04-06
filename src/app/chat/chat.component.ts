import { Component } from '@angular/core';
import { ChatService } from './chat.service';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  providers: [ChatService],
  selector: 'app-chat',
  templateUrl: './chat.component.html',
})
export class ChatComponent {
  inputMessage: string = '';
  inputNickname: string = '';

  constructor(public chatService: ChatService) {}

  sendMessage(): void {
    const message = this.inputMessage.trim();

    if (message) {
      this.chatService.send(message);
      this.inputMessage = '';
    }
  }

  start(): void {
    const nickname = this.inputNickname.trim();

    if (nickname) {
      this.chatService.connect(nickname);
      this.inputNickname = '';
    }
  }
}