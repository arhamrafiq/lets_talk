"use client";

import { useEffect, useRef, useState } from "react";
import { fullMessageType } from "../../../Types";
import useConversation from "../../../hooks/useConversation";
import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "../../../libs/pusher";
import { find } from "lodash";

interface BodyProps {
  initialMessages: fullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversation/${conversationId}/seen`);
  }, [conversationId]);

  const messageHandler = (message: fullMessageType) => {
    setMessages((current) => {
      if (find(current, { id: message.id })) {
        return current;
      }

      return [...current, message];
    });

    bottomRef?.current?.scrollIntoView();
    axios.post(`/api/conversation/${conversationId}/seen`);
  };

  const updateMessageHandler = (newMessage: fullMessageType) => {
    setMessages((current) =>
      current.map((currentMessage) => {
        if (currentMessage.id === newMessage.id) {
          return newMessage;
        }
        return currentMessage;
      })
    );
  };

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();

    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("messages:update", updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("messages:update", updateMessageHandler);
    };
  }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
        />
      ))}
      <div ref={bottomRef} className="pt-4" />
    </div>
  );
};

export default Body;
