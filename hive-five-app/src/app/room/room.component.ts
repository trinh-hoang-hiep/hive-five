import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Room } from '../models/room';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit, OnDestroy {
  @Input() room: Room;
  @Input() sender: string;
  currentMessage: string;
  messageSub: Subscription;
  typingSub: Subscription;

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.typingSub = this.chatService.messages.subscribe(typing => console.log(typing));

    this.messageSub = this.chatService.messages.subscribe(message => {
      this.room.messages.push(message);
      console.log(this.room.id + ' room recieved a new message from server ');
    });

    console.log('Initialised ' + this.room.id + ' room component from memory');
  }

  ngOnDestroy() {
    console.log('room has been destroyed');

    this.typingSub.unsubscribe();
    this.messageSub.unsubscribe();
  }

  sendMessage() {
    // Send message to server
    this.chatService.sendMessage(this.room.id, {sender: this.sender, content: this.currentMessage});
    // Clear input field
    this.currentMessage = '';

    console.log(this.sender + ' in ' + this.room.id + ' room sent message to server');
  }
}
