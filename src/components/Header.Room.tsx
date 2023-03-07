import { setRoomProp } from "@/store/room";
import { ActionIcon } from "@mantine/core";
import { IconLogout, IconPower } from "@tabler/icons";
import { NextRouter } from "next/router";

interface HeaderProps {
  room: any;
  router: NextRouter;
  user: any;
}

const Header = ({ room, router }: HeaderProps) => {
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

export default Header;
