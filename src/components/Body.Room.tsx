import { $Iroom } from "@/store/room";
import { SetterOrUpdater } from "recoil";
import ChatBox from "@/components/ChatBox";
import { Status } from "@prisma/client";

interface BodyProps {
  room: any;
  user: any;
  roomState: $Iroom;
  setRoomState: SetterOrUpdater<$Iroom>;
}
const Body = ({ room, user, roomState, setRoomState }: BodyProps) => {
  return (
    <>
      <div className="flex w-full flex-col gap-3 px-8 py-5">
        {user &&
          roomState.chats.map((chat: any, index) => {
            let scroll = false;

            if (chat.ownerId === user.id && chat.status === Status.RECEIVED) {
              scroll = false;
            }

            if (chat.status === Status.ON_CLIENT) {
              scroll = true;
            }

            if (chat.ownerId !== user.id) {
              scroll = true;
            }

            return (
              <ChatBox scroll={scroll} key={chat.id} user={user} chat={chat} />
            );
          })}
      </div>
    </>
  );
};

export default Body;
