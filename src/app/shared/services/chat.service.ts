import { Observable } from "rxjs/Observable";
import { log } from "util";
import { Router } from "@angular/router";
import { Message } from "./../models/message";
import { FbUser, Fbhalf } from "./../models/item";
import { ChatThread } from "./../models/thread";
import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  docChanges
} from "angularfire2/firestore";
import * as firebase from "firebase";
import { AngularFireAuth } from "angularfire2/auth";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
@Injectable()
export class ChatService {
  private halfDetails = new BehaviorSubject(new Fbhalf());
  userList = new BehaviorSubject([]);
  userId: string;
  halfId: string;
  msgCount: Observable<any>;
  unsubscribe;
  private activeUser: BehaviorSubject<string> = new BehaviorSubject("0");
  constructor(
    public afs: AngularFirestore,
    private afsAuth: AngularFireAuth,
    private route: Router
  ) {}

  setActiveUser(id: string) {
    // console.log(id);
    this.activeUser.next(id);
  }

  getUserList() {
    return this.userList.asObservable();
  }
  getUsers(mode?: string) {
    this.userList.next(null);
    const chatNodeQuery = this.afs.firestore
      .collection("users")
      .doc(this.userId)
      .collection("chat_node")
      .orderBy("lastModified", "desc");
    let users = [];
    this.unsubscribe = chatNodeQuery.onSnapshot(res => {
      res.docChanges.forEach(data => {
        if (data.type === "added") {
          // console.log("added");
          const stuff = data.doc.data();
          this.afs.firestore
            .collection("users")
            .doc(data.doc.id)
            .get()
            .then(res2 => {
              stuff.profile_pic = res2.data().photoURL;
              stuff.name = res2.data().displayName;
              // console.log(stuff + "stuff");
              if (res.docChanges.length > 1) {
                console.log("added" + stuff);
                // if (stuff.id == 2) {
                //   stuff.unreadCount = 1;
                // }
                users.push(stuff);
              } else {
                users.unshift(stuff);
              }
            });
        }
        if (data.type === "modified") {
          console.log("modified");
          const newData = data.doc.data();
          console.log(newData);
          // console.log(data.oldIndex + "old index");
          newData.profile_pic = users[data.oldIndex].profile_pic;
          newData.name = users[data.oldIndex].name;
          console.log(newData);
          if (newData.id == this.activeUser.value) {
            newData.unreadCount = 0;
            this.setUnreadNull();
          }
          console.log("old" + data.oldIndex, "new" + data.newIndex);
          users.splice(data.oldIndex, 1);
          users.unshift(newData);
        }
        if (data.type === "removed") {
          console.log("removed");
          users.splice(data.oldIndex, 1);
        }
      });
      this.userList.next(users);
    });
  }

  createChatNode(halfId) {
    const initNode = {
      lastModified: new Date(),
      lastMessage: "",
      unreadCount: 0,
      id: halfId
    };

    this.halfId = halfId;
    const chatRef = this.afs.firestore
      .collection("users")
      .doc(this.userId)
      .collection("chat_node");

    const msgRef = this.afs.firestore
      .collection("users")
      .doc(this.userId)
      .collection("messages");
    // Check if user exist
    chatRef
      .doc(halfId)
      .get()
      .then(res => {
        if (res.exists) {
          // Check receiver exist in messages else add in messages
          console.log("User exist in chat node");
          msgRef
            .doc(halfId)
            .get()
            .then(msg => {
              if (msg.exists) {
                console.log("Exist in msg node");
                this.route.navigate(["message/th-key", res.id]);
              } else {
                console.log("Does not exist in msg node");
                msg.ref.set({ total: 0 }).then(() => {
                  console.log("Created in msg node");
                  this.route.navigate(["message/th-key", res.id]);
                });
              }
            });
        } else {
          // User does not exist in chat node
          console.log("User does not exist in chat node");
          chatRef
            .doc(halfId)
            .set(initNode)
            .then(created => {
              console.log("Created chat node");
              // Create user in msg
              msgRef
                .doc(halfId)
                .set({ total: 0 })
                .then(() => {
                  console.log("User created in messages");
                  this.route.navigate(["message/th-key", res.id]);
                });
            });
        }
      });
  }

  sendMessage(halfId, Message) {
    // console.log(this.userId, halfId, Message);
    const batch = this.afs.firestore.batch();
    const messageData = {
      sender: this.userId,
      createdAt: new Date(),
      content: Message
    };

    const receiverRef = this.afs.firestore
      .collection("users")
      .doc(halfId)
      .collection("chat_node")
      .doc(this.userId);

    const senderRef = this.afs.firestore
      .collection("users")
      .doc(this.userId)
      .collection("chat_node")
      .doc(halfId);

    const receiverMsgRef = this.afs.firestore
      .collection("users")
      .doc(halfId)
      .collection("messages")
      .doc(this.userId);

    const senderMsgRef = this.afs.firestore
      .collection("users")
      .doc(this.userId)
      .collection("messages")
      .doc(halfId)
      .collection("data");

    // Update sender chat node
    batch.update(senderRef, {
      lastModified: new Date(),
      lastMessage: messageData.content
    });

    const initNode = {
      lastModified: firebase.firestore.FieldValue.serverTimestamp(),
      lastMessage: messageData.content,
      unreadCount: 1,
      id: this.userId
    };

    // Check if reciver has node
    receiverRef.get().then(res => {
      if (res.exists) {
        console.log("Receiver chat node present");
        // receiverRef.get().then(rNode => {
        batch.update(receiverRef, {
          lastModified: new Date(),
          lastMessage: messageData.content,
          unreadCount: res.data().unreadCount + 1
        });

        batch.commit().then(() => {
          console.log("Update user and reciever stuff");
          senderMsgRef.add(messageData);
          receiverMsgRef.collection("data").add(messageData);
        });
        // });
        // get total
        const senderTotalRef = this.afs.firestore
          .collection("users")
          .doc(this.userId)
          .collection("messages")
          .doc(halfId);
        const totalBatch = this.afs.firestore.batch();

        receiverMsgRef.get().then(rdata => {
          totalBatch.update(receiverMsgRef, { total: rdata.data().total + 1 });
          totalBatch.update(senderTotalRef, {
            total: rdata.data().total + 1
          });
          totalBatch.commit().then(() => {
            console.log("Total stuff updated");
          });
        });
      } else {
        console.log("Receiver doesn't have chat node");
        batch.set(receiverRef, initNode);
        batch.set(receiverMsgRef, { total: 1 });
        batch.commit().then(() => {
          console.log("Receiver stuff created");
          senderMsgRef.add(messageData);
          receiverMsgRef.collection("data").add(messageData);
        });
      }
    });
  }

  UpdateHalf(half: Fbhalf) {
    this.activeUser.next(half.id);
    this.halfDetails.next(half);
    if (half.unreadCount > 0) {
      this.setUnreadNull();
      console.log(half.unreadCount);
    }
  }

  setUnreadNull() {
    console.log(this.halfDetails.value.id + "set unread null");
    this.afs.firestore
      .collection("users")
      .doc(this.userId)
      .collection("chat_node")
      .doc(this.halfDetails.value.id)
      .update({ unreadCount: 0 })
      .then(() => {
        console.log("Unread set 0");
      });
  }

  getHalfDetails(): Fbhalf {
    return this.halfDetails.value;
  }

  deleteMsg(halfId) {
    console.log(halfId);
    const batch = this.afs.firestore.batch();
    const chatRef = this.afs.firestore
      .collection("users")
      .doc(this.userId)
      .collection("chat_node")
      .doc(halfId);

    const msgRef = this.afs.firestore
      .collection("users")
      .doc(this.userId)
      .collection("messages")
      .doc(halfId)
      .collection("data");

    const recDocRef = this.afs.firestore
      .collection("users")
      .doc(this.userId)
      .collection("messages")
      .doc(halfId);

    msgRef
      .get()
      .then(data => {
        data.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        batch.delete(chatRef);
        batch.update(recDocRef, { total: 0 });
      })
      .then(() => {
        batch.commit().then(() => {
          console.log("Deleted");
          this.route.navigate(["message/"]);
        });
      });
  }

  totalCount(userId) {
    userId = String(userId);
    this.msgCount = this.afs
      .collection("users")
      .doc(userId)
      .collection("chat_node", ref => ref.where("unreadCount", ">", 0))
      .valueChanges();
  }
}
