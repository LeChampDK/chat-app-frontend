import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ChatService} from './shared/chat.service';
import {Observable, Subject, Subscription} from 'rxjs';
import {debounceTime, take, takeUntil} from 'rxjs/operators';
import {ChatClient} from './shared/chat-client.model';
import {ChatMessage} from './shared/chat-message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  messageFc = new FormControl();
  nicknameFc = new FormControl();
  messages: ChatMessage[] = [];
  clientsTyping: ChatClient[] = [];
  unsubscribe$ = new Subject();
  clients$: Observable<ChatClient[]> | undefined;
  chatClient: ChatClient | undefined;
  error$: Observable<string> | undefined;

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.listenForMessages();
    this.clients$ = this.chatService.listenForClients();
    this.error$ = this.chatService.listenForError();
    this.chatService.listenForMessages()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(message => {
        this.messages.push(message);
      });
    this.chatService.listenForClientTyping()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((chatClient) => {
        if (chatClient.typing && !this.clientsTyping.find((c) => c.id === chatClient.id)) {
          this.clientsTyping.push(chatClient);
        }else {
          this.clientsTyping = this.clientsTyping.filter((c) => c.id !== chatClient.id);
        }
      });
    this.chatService.listenForWelcome()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(welcome => {
        this.messages = welcome.messages;
        this.chatClient = this.chatService.chatClient = welcome.client;
      });
    if (this.chatService.chatClient) {
      this.chatService.sendNickname(this.chatService.chatClient.nickname);
    }
  }

  ngOnDestroy(): void {
    console.log('Destroyed');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  sendMessage(): void {
    console.log(this.messageFc.value);
    this.chatService.sendMessage(this.messageFc.value);
    this.messageFc.reset();
    this.messageFc.patchValue('');
  }

  sendNickname(): void {
    if (this.nicknameFc.value){
      this.chatService.sendNickname(this.nicknameFc.value);
    }
  }

  listenForMessages(): void {
    this.messageFc.valueChanges
      .pipe(takeUntil(this.unsubscribe$), debounceTime(500)
      )
      .subscribe((value) => {
        this.chatService.sendTyping(value.length > 0);
      });
  }
}
