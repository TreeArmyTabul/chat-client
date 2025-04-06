import { Injectable,  signal } from '@angular/core';

export interface ChatMessage {
  text: string;
  type: 'message';
}

@Injectable()
export class ChatService {
  private socket?: WebSocket;

  readonly messages = signal<string[]>([]);

  connect(): void {
    this.socket = new WebSocket('ws://localhost:5247/chat');

    this.socket.onopen = () => {
      console.log('[WebSocket] 연결됨');
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data) as ChatMessage;
      this.messages.update((prev) => [...prev, `[상대방] ${data.text}`]);
    };

    this.socket.onclose = () => {
      console.log('[WebSocket] 연결 종료');
    };

    this.socket.onerror = (error) => {
      console.error('[WebSocket] 오류 발생', error);
    };
  }

  send(message: string): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      const payload: ChatMessage = {
        text: message,
        type: 'message'
      };
      this.socket.send(JSON.stringify(payload));
      this.messages.update((prev) => [...prev, `[나] ${message}`]);
    } else {
      console.warn('WebSocket이 아직 열리지 않았습니다.');
    }
  }
}