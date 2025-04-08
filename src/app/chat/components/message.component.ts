import { Component, input } from '@angular/core';

@Component({
  selector: 'chat-message',
  templateUrl: './message.component.html',
})
export class MessageComponent {
  message = input.required<string>()
}