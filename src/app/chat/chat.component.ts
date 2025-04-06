import { Component, OnInit } from '@angular/core';
import { ChatService } from './chat.service';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  providers: [ChatService],
  selector: 'app-chat',
  templateUrl: './chat.component.html',
})
export class ChatComponent implements OnInit {
  inputMessage = '';

  constructor(public chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.connect();
  }

  sendMessage(): void {
    const message = this.inputMessage.trim();

    if (message) {
      this.chatService.send(message);
      this.inputMessage = '';
    }
  }
}