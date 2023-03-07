# ChatPat

> Flavour of Privacy

## Introduction

ChatPat is a messaging service focused on providing data privacy to users through its room-based messaging system. The name "ChatPat" is derived from the Indian word "chatpat" which means "tasty" and blends well with the word "chat." This blueprint will explain how ChatPat works and what the proper budget is for using sponsor money.

## Overview of Functions

ChatPat is a room-based messaging system that ensures data privacy for its users. When a user creates a room, they can choose to make it public or private. If a room is private, every message that is sent by a user is encrypted with a room password. If a room is public, messages will be encrypted with a secret password that will be stored privately.

Each room will have its own unique URL. For example, if a user creates a room named "my-room," people will be able to join that room by entering "my-room" in the "join room" input field or by opening "https://chatpat.henil.com/r/my-room".

## Creating a Room

To create a new room in ChatPat, follow these steps:

1. Open Dashboard (/dashboard).
2. Click on the "Create Room" button on the Dashboard page.
3. Enter a unique name for your room.
4. Choose whether you want the room to be public or private.
5. If you choose private, enter a password for the room.
6. Click "Create" to create the room.

Once your room is created, you can invite others to join by sharing the room name and, if applicable, the room password. Other users can join the room by entering the room name on the "Join Room" input field and, if applicable, the room password.

## Joining a Room

To join an existing room in ChatPat, follow these steps:

1. Open Dashboard (/dashboard).
2. Enter the name of the room you want to join in the "Join Room" input field.
3. Click "Join" to join the room.

Once you've joined the room, you can start chatting with other users in real-time. If you need to leave the room, simply click the "Leave" button on the top right to exit the room.

## Room

When User joins the room, last 30 messages will be fetched and rendered. When User sends the message, message will be sent to server along with other meta data such as createdAt, messageId, roomId, etc. When Message is finally stored in database (encrypted), the pusher event will be triggered by the server to everyone who is joined in the room. Triggered pusher event will contain message info. When The event is received by the client, client will render chat message.

## Data Privacy

Every message that user ever send will be encrypted by default. According to User Data Privacy Protocol, I can not give data if asked. AES Algorithm will be used to encrypt data. 


## Flowcharts

![Dashboard-flowchart](https://user-images.githubusercontent.com/62794871/223313928-76443668-6488-4432-b5af-9bfa76b5627b.png)

