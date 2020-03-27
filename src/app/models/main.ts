export class Events {
  public static events = {
    JOIN: 'join',
    NEW_MESSAGE: 'newMessage',
    DEL_MESSAGE: 'deleteMessage',
    NEW_CLIENT: 'newClient',
    TYPING: 'typing',
    LEFT_CLIENT: 'clientLeft',
    LOCATION: 'sendLocation',
    LOADMSGS: 'loadMsgs',
    ACTIVE: 'active'
  };
}
export interface Message {
  id: string;
  msg: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}
export interface DateChange {
  datechange: string;
}
export interface Room {
  id: string;
  roomName?: string;
  directMessage?: boolean;
  members: string[];
  messages: Message[] | DateChange[];
  createdAt: string;
  updatedAt: string;
  lastMessage: Message;
}
