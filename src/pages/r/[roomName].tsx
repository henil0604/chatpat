import { GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import AuthLayout from "@/layouts/auth";
import { ActionIcon, Button, TextInput } from "@mantine/core";
import { APP_NAME } from "@/const";
import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import RoomNotFoundCard from "@/components/RoomNotFoundCard";
import { IconLogout, IconPower, IconSend } from "@tabler/icons";
import $room, { getRoomProp, setRoomProp } from "@/store/room";
import { useEffect, useState } from "react";
import { Visibility } from "@prisma/client";
import { useRecoilState } from "recoil";
import PrivateRoomPasswordPrompt from "@/components/PrivateRoomPasswordPrompt";

/* -------------------------------------------------------------------------- */
/*                                   HEADER                                   */
/* -------------------------------------------------------------------------- */
interface HeaderProps {
  room: any;
}

const Header = ({ room }: HeaderProps) => {
  const router = useRouter();

  const handleExit = () => {
    handleSignout();
    setRoomProp("isInside", false);
    void router.replace("/dashboard");
  };

  const handleSignout = () => {
    setRoomProp("isAuthorized", false);
    setRoomProp("room.password.unhashed", undefined);
  };

  return (
    <>
      <div className="flex w-full justify-between px-3 py-2 sm:px-8 sm:py-5">
        <div className="text-lg font-bold sm:text-2xl">@{room.roomName}</div>
        <div id="actions" className="flex gap-2">
          <>
            <ActionIcon onClick={handleSignout} variant="light" color="red">
              <IconPower size={16} />
            </ActionIcon>
          </>
          <ActionIcon onClick={handleExit} variant="filled" color="red">
            <IconLogout size={16} />
          </ActionIcon>
        </div>
      </div>
    </>
  );
};

/* -------------------------------------------------------------------------- */
/*                                    BODY                                    */
/* -------------------------------------------------------------------------- */
interface BodyProps {
  room: any;
}
const Body = ({ room }: BodyProps) => {
  const [roomState, setRoomState] = useRecoilState($room);

  return (
    <>
      <div className="flex w-full flex-col gap-3 px-8 py-5"></div>
    </>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   FOOTER                                   */
/* -------------------------------------------------------------------------- */
interface FooterProps {
  room: any;
}
const Footer = ({ room }: FooterProps) => {
  const [roomState, setRoomState] = useRecoilState($room);
  const [msgValue, setMsgValue] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = () => {
    if (sending) {
      return false;
    }

    setSending(true);
    setMsgValue("");
    // setSending(false);
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

/* -------------------------------------------------------------------------- */
/*                                    ROOM                                    */
/* -------------------------------------------------------------------------- */
export default function Room({ roomName, room, code }: any) {
  const router = useRouter();
  const [roomState, setRoomState] = useRecoilState($room);

  useEffect(() => {
    setRoomProp("isInside", true);
    setRoomProp("roomName", roomName);
    room && setRoomProp("room.visibility", room.visibility);
    room && setRoomProp("isAuthorized", room.visibility === Visibility.PUBLIC);

    return () => {
      setRoomProp("isInside", false);
    };
  }, []);

  return (
    <>
      <Head>
        <title>
          @{roomName} - {APP_NAME}
        </title>
        <meta name="description" content={`@${roomName} - ${APP_NAME}`} />
      </Head>
      <AuthLayout>
        <main className="min-h-dscreen bg-gradient-to-b from-[#4DABF7] to-[#1864AB] p-0 transition-all">
          {code === "ROOM_NOT_FOUND" && (
            <>
              <RoomNotFoundCard />
            </>
          )}
          {code === "ROOM_FOUND" && !roomState.isAuthorized && (
            <>
              <div className="h-dscreen flex items-center justify-center">
                <div className="bg-white text-black sm:rounded-xl">
                  <PrivateRoomPasswordPrompt room={room} />
                </div>
              </div>
            </>
          )}
          {code === "ROOM_FOUND" && roomState.isAuthorized && (
            <div className="max-h-dscreen flex flex-col overflow-y-auto sm:p-5">
              <div className="h-dscreen flex grow flex-col overflow-y-auto bg-white text-black sm:rounded-xl">
                <Header room={room} />
                <div className="grow overflow-y-auto">
                  <Body room={room} />
                </div>
                <Footer room={room} />
              </div>
            </div>
          )}
        </main>
      </AuthLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let roomName = context.query.roomName;
  roomName = Array.isArray(roomName) ? roomName[0] : roomName;

  if (!roomName) return { props: {} };

  const { client } = await import("@/utils/api");

  let { data, code } = await client.room.getInfo.query({ roomName });

  data = data ? JSON.parse(JSON.stringify(data)) : null;

  return { props: { roomName, room: data, code } };
};
