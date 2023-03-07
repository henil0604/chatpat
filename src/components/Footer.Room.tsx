import { $Iroom, addChat, updateChat } from "@/store/room";
import { api } from "@/utils/api";
import { randomString } from "@/utils/random";
import { ActionIcon, TextInput } from "@mantine/core";
import { Status } from "@prisma/client";
import { IconSend } from "@tabler/icons";
import { useState } from "react";
import { SetterOrUpdater } from "recoil";

interface FooterProps {
  room: any;
  user: any;
  roomState: $Iroom;
  setRoomState: SetterOrUpdater<$Iroom>;
  client: ReturnType<(typeof api)["useContext"]>;
}

const Footer = ({
  room,
  roomState,
  setRoomState,
  user,
  client,
}: FooterProps) => {
  const [msgValue, setMsgValue] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (sending || msgValue.trim().length === 0) {
      return false;
    }

    // setSending(true);

    const messageId = randomString(50);
    const message = msgValue;
    setMsgValue("");

    addChat({
      id: messageId,
      message: message,
      status: Status.ON_CLIENT,
      roomId: room.id,
      ownerId: user?.id,
      owner: user,
      createdAt: new Date(),
    });

    const res = await client.room.sendMessage.fetch({
      message: message,
      roomName: room.roomName,
      sentAt: Date.now(),
      messageId: messageId,
    });

    updateChat(messageId, {
      ...res.updates,
    });

    setSending(false);
  };

  return (
    <div className="flex w-full items-center justify-between gap-1 px-3 py-5 sm:gap-2 sm:px-8">
      <TextInput
        value={msgValue}
        placeholder="Type Here..."
        onKeyDown={(event: any) => {
          if (event.keyCode === 13 || event.which === 13) {
            handleSend();
            return false;
          }
        }}
        autoComplete="false"
        onChange={(event: any) => setMsgValue(event.currentTarget.value)}
        className="w-full"
      />
      <ActionIcon
        onClick={handleSend}
        loading={sending}
        color="blue"
        variant="light"
      >
        <IconSend size={16} />
      </ActionIcon>
    </div>
  );
};

export default Footer;
