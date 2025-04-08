import { Injectable,  signal } from '@angular/core';

const enum ChatMessageType {
  Join = "Join",
  Leave = "Leave",
  Message = "Message",
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
        case ChatMessageType.Join:
          this.messages.update((prev) => [...prev, message]);
          break;
        case ChatMessageType.Leave:
          this.messages.update((prev) => [...prev, message]);
          break;
        case ChatMessageType.Message:
          this.messages.update((prev) => [...prev, message]);
          break;
        case ChatMessageType.Welcome:
          this.nickname.set(message.nickname);
          this.messages.update((prev) => [...prev, message]);
          break;
        default:
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

    this.socket.send(JSON.stringify(payload));
    this.messages.update((prev) => [...prev, payload]);
  }
}