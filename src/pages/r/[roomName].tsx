import { GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import AuthLayout from "@/layouts/auth";
import { ActionIcon, Button } from "@mantine/core";
import { APP_NAME, APP_TAGLINE } from "@/const";
import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import RoomNotFoundCard from "@/components/RoomNotFoundCard";
import { IconLogout } from "@tabler/icons";

interface HeaderProps {
  room: any;
}

const Header = ({ room }: HeaderProps) => {
  const handleExit = () => {};

  return (
    <>
      <div className="flex w-full justify-between px-8 py-5">
        <div className="text-2xl font-bold">@{room.roomName}</div>
        <div id="actions" className="">
          <ActionIcon onClick={handleExit} variant="filled" color="red">
            <IconLogout size={16} />
          </ActionIcon>
        </div>
      </div>
    </>
  );
};

export default function Room({ roomName, room, code }: any) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>
          @{roomName} - {APP_NAME}
        </title>
        <meta name="description" content={`@${roomName} - ${APP_NAME}`} />
      </Head>
      <AuthLayout>
        <main className="min-h-screen bg-gradient-to-b from-[#4DABF7] to-[#1864AB] p-0 transition-all sm:p-5">
          {code === "ROOM_NOT_FOUND" && (
            <>
              <RoomNotFoundCard />
            </>
          )}
          {code === "ROOM_FOUND" && (
            <div className="flex flex-col bg-white text-black sm:rounded-xl">
              <Header room={room} />
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
