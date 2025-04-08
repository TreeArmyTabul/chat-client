import { Component, OnInit } from '@angular/core';
import { ChatService } from './chat.service';
import { FormsModule } from '@angular/forms';
import { MessageComponent } from "./components/message.component";

@Component({
  imports: [FormsModule, MessageComponent],
  providers: [ChatService],
  selector: 'app-chat',
  templateUrl: './chat.component.html',
})
export class ChatComponent implements OnInit {
  inputMessage: string = '';

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