import { Injectable,  signal } from '@angular/core';

export interface ChatMessage {
  nickname: string;
  text: string;
  type: 'message';
}

@Injectable()
export class ChatService {
  private nickname: string = '';
  private socket?: WebSocket;
  
  readonly connected = signal<boolean>(false)
  readonly error = signal<string | null>(null);
  readonly messages = signal<string[]>([]);

  connect(nickname: string): void {
    this.error.set(null); // NOTE: 기존 에러 메시지 제거
    this.nickname = nickname;

    this.socket = new WebSocket('ws://localhost:5247/chat');

    this.socket.onopen = () => {
      this.connected.set(true);
    };

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data) as ChatMessage;
      this.messages.update((prev) => [...prev, `[${message.nickname}] ${message.text}`]);
    };

    this.socket.onclose = () => {
      this.connected.set(false);
      this.nickname = '';
    };

    this.socket.onerror = () => {
      this.connected.set(false);
      this.error.set("서버에 연결할 수 없습니다.");
      this.nickname = '';
    };
  
  }

  send(message: string): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket이 아직 열리지 않았습니다.');
      return;
    }

    const payload: ChatMessage = {
      nickname: this.nickname,
      text: message,
      type: 'message'
    };

    this.socket.send(JSON.stringify(payload));
    this.messages.update((prev) => [...prev, `[나] ${message}`]);
  }
}