import { $Iroom } from "@/store/room";
import { SetterOrUpdater } from "recoil";
import ChatBox from "@/components/ChatBox";
import { Status } from "@prisma/client";

function computeScrollBehavior(props: { chat: any; user: any }) {
  let scroll = false;

  if (
    props.chat.ownerId === props.user.id &&
    props.chat.status === Status.RECEIVED
  ) {
    scroll = false;
  }

  if (props.chat.status === Status.ON_CLIENT) {
    scroll = true;
  }

  if (props.chat.ownerId !== props.user.id) {
    scroll = true;
  }

  return scroll;
}

interface BodyProps {
  room: any;
  user: any;
  roomState: $Iroom;
  setRoomState: SetterOrUpdater<$Iroom>;
}
const Body = ({ room, user, roomState, setRoomState }: BodyProps) => {
  return (
    <>
      <div className="flex w-full flex-col gap-1 px-8 py-5">
        {user &&
          roomState.chats &&
          roomState.chats.map((chat: any, index) => {
            const scroll = computeScrollBehavior({ chat, user });
            return (
              <ChatBox scroll={scroll} key={chat.id} user={user} chat={chat} />
            );
          })}
      </div>
    </>
  );
};

export default Body;
