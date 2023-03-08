import { GetServerSideProps } from "next";
import Head from "next/head";
import AuthLayout from "@/layouts/auth";
import { APP_NAME } from "@/const";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import RoomNotFoundCard from "@/components/RoomNotFoundCard";
import $room, { addChat, getChat } from "@/store/room";
import { useEffect, useState } from "react";
import { Visibility } from "@prisma/client";
import { useRecoilState } from "recoil";
import PrivateRoomPasswordPrompt from "@/components/PrivateRoomPasswordPrompt";
import useUser from "@/hooks/useUser";
import initPusherClient, { pusherClientI } from "@/utils/room-pusher-handler";

import Header from "@/components/Header.Room";
import Body from "@/components/Body.Room";
import Footer from "@/components/Footer.Room";

/* -------------------------------------------------------------------------- */
/*                                    ROOM                                    */
/* -------------------------------------------------------------------------- */
export default function Room({ roomName, room, code }: any) {
  const router = useRouter();
  const [roomState, setRoomState] = useRecoilState($room);
  const client = api.useContext();
  const user = useUser();
  const [pusherClient, setPusherClient] = useState<null | pusherClientI>(null);

  useEffect(() => {
    setRoomState({
      isInside: true,
    });

    if (!room) return;

    setRoomState({
      ...roomState,
      isInside: true,
      roomName: roomName,
      chats: room.Chat,
      "room.visibility": room ? room.visibility : undefined,
      isAuthorized: room ? room.visibility === Visibility.PUBLIC : false,
    });
  }, []);

  useEffect(() => {
    if (user && !pusherClient && room) {
      const pc = initPusherClient({
        room,
        user,
        client,
      });

      setRoomState({
        ...roomState,
        pusherClient: pc,
      });

      pc.bindIfNotExist("MSG-SENT", (data: any) => {
        console.log(data);
        const message = data.message;
        if (getChat(message.id).chat !== null) {
          return;
        }
        addChat({
          ...data.message,
        });
      });

      setPusherClient(pc);
    }
  }, [user]);

  const title = `@${roomName} - ${APP_NAME}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={`${title}`} />
      </Head>
      <AuthLayout>
        <main className="min-h-dscreen bg-gradient-to-b from-[#4DABF7] to-[#1864AB] p-0 transition-all">
          {code === "ROOM_NOT_FOUND" && (
            <>
              <div className="h-dscreen flex items-center justify-center">
                <RoomNotFoundCard />
              </div>
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
                <Header router={router} user={user} room={room} />
                <div
                  className="u-fancy-scrollbar grow overflow-y-auto scroll-smooth"
                  id="room-body-main"
                >
                  <Body
                    roomState={roomState}
                    setRoomState={setRoomState}
                    room={room}
                    user={user}
                  />
                </div>
                <Footer
                  user={user}
                  roomState={roomState}
                  setRoomState={setRoomState}
                  room={room}
                  client={client}
                />
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
