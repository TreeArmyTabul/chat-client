import { Injectable,  signal } from '@angular/core';

const enum ChatMessageType {
  Gift = "Gift",
  Join = "Join",
  Leave = "Leave",
  Message = "Message",
  System = "System",
  Welcome = "Welcome"
}

export interface ChatMessage {
  nickname: string;
  text: string;
  type: ChatMessageType;
}

@Injectable()
export class ChatService {
  readonly nickname = signal<string>('');
  private socket?: WebSocket;
  
  readonly messages = signal<ChatMessage[]>([]);

  connect(): void {
    this.socket = new WebSocket('ws://localhost:5247/chat');

    this.socket.onopen = () => {};

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data) as ChatMessage;

      switch (message.type) {
        case ChatMessageType.Welcome:
          this.nickname.set(message.nickname);
          this.messages.update((prev) => [...prev, message]);
          break;
        default:
          this.messages.update((prev) => [...prev, message]);
          break;
      }
    };

    this.socket.onclose = () => {
      this.nickname.set('');
    };

    this.socket.onerror = () => {
      this.nickname.set('');
    };
  }

  send(message: string): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket이 아직 열리지 않았습니다.');
      return;
    }

    const payload: ChatMessage = {
      nickname: this.nickname(),
      text: message,
      type: ChatMessageType.Message
    };

    if (!message.startsWith("/gift")) {
      this.messages.update((prev) => [...prev, payload]);
    }
    this.socket.send(JSON.stringify(payload));
  }
}