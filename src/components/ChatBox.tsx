import useUser from "@/hooks/useUser";
import scrollToEnd from "@/utils/scrollToEnd";
import { Avatar } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Status } from "@prisma/client";
import { IconCheck, IconClock } from "@tabler/icons";
import { useEffect } from "react";

interface ChatBoxProps {
  chat: any;
  user: any;
  scroll: boolean;
}

const formatTime = (date: Date) => {
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();
  const meridian = h >= 12 ? "PM" : "AM";
  h = h % 12;
  h = h ? h : 12;
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;
  const strTime = h + ":" + m + " " + meridian;
  return strTime;
};

interface MyChatBoxProps {
  chat: any;
  user: any;
}
const MyChatBox = ({ chat, user }: MyChatBoxProps) => {
  const matches = useMediaQuery("(max-width: 600px)");
  const createdAt = formatTime(new Date(chat.createdAt));

  return (
    <div className="flex w-full flex-row-reverse justify-between gap-2">
      <div className="">
        <Avatar src={chat.owner.image} />
      </div>
      <div className="flex grow flex-row-reverse items-end">
        <div
          className="flex h-fit flex-col gap-2 rounded bg-blue-500 px-2 pt-3 pl-3 pb-1 text-white"
          style={{ maxWidth: matches ? "500px" : "1000px" }}
        >
          <div>{chat.message}</div>
          <div className="flex w-full justify-end gap-1">
            <div className="timestamp text-xs text-gray-300">{createdAt}</div>
            <div className="status flex-all-center text-xs text-gray-300">
              {(!chat.status || chat.status === Status.RECEIVED) && (
                <>
                  <IconCheck size={14} />
                </>
              )}
              {chat.status === Status.ON_CLIENT && (
                <>
                  <IconClock size={14} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface OtherChatBoxProps {
  chat: any;
  user: any;
}
const OtherChatBox = ({ chat, user }: OtherChatBoxProps) => {
  const matches = useMediaQuery("(max-width: 600px)");

  return (
    <div className="flex w-full justify-between gap-2">
      <div className="">
        <Avatar src={chat.owner.image} />
      </div>
      <div className="flex grow items-start">
        <div
          className="flex h-fit flex-col gap-2 rounded bg-white px-2 pt-3 pl-3 pb-1 text-black shadow-md"
          style={{ maxWidth: matches ? "500px" : "1000px" }}
        >
          <div>{chat.message}</div>
          <div className="flex w-full justify-start gap-2">
            <div className="timestamp text-xs text-gray-800"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatBox = ({ chat, user, scroll }: ChatBoxProps) => {
  useEffect(() => {
    if (scroll) {
      scrollToEnd("#room-body-main");
    }
  }, []);

  return (
    <>
      <div key={chat.messageId} className="w-full py-2">
        {user.id === chat.ownerId && (
          <>
            <MyChatBox chat={chat} user={user} />
          </>
        )}
        {user.id !== chat.ownerId && (
          <>
            <OtherChatBox chat={chat} user={user} />
          </>
        )}
      </div>
    </>
  );
};

export default ChatBox;
