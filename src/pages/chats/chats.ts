import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { Chat } from "api/models/ndeipi-models";
import { Chats, Messages } from "api/collections/ndeipi-collections";
import { NavController } from "ionic-angular";
import { MessagesPage } from "../messages/messages";

@Component({
  templateUrl: 'chats.html'
})
export class ChatsPage implements OnInit {
  chats;

  constructor(private navCtrl: NavController) {

  }

  ngOnInit() {
    this.chats = Chats
      .find({})
      .mergeMap((chats: Chat[]) =>
        Observable.combineLatest(
          ...chats.map((chat: Chat) =>
            Messages
              .find({chatId: chat._id})
              .startWith(null)
              .map(messages => {
                if (messages) chat.lastMessage = messages[0];
                return chat;
              })
          )
        )
      ).zone();
  }

  showMessages(chat): void {
    this.navCtrl.push(MessagesPage, {chat});
  }

  removeChat(chat: Chat): void {
    // TODO: Implement it later
  }
}
