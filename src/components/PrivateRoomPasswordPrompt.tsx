import { setRoomProp } from "@/store/room";
import hash from "@/utils/hash";
import { Button, PasswordInput } from "@mantine/core";
import { Visibility } from "@prisma/client";
import { IconDoorEnter } from "@tabler/icons";

interface PrivateRoomPasswordPromptProps {
  room: any;
}

const PrivateRoomPasswordPrompt = ({
  room,
}: PrivateRoomPasswordPromptProps) => {
  const handleCheck = (password: string) => {
    if (room.password === hash(password)) {
      setRoomProp("isAuthorized", true);
      setRoomProp("room.password.unhashed", password);
    }
  };

  return (
    <>
      <div className="flex w-full items-center justify-center gap-3 rounded-md bg-white p-2 text-black sm:px-4 sm:py-3">
        {room.visibility === Visibility.PRIVATE && (
          <PasswordInput
            style={{
              minWidth: "300px",
            }}
            placeholder="Enter Room Password"
            onChange={(event) => handleCheck(event.currentTarget.value)}
          />
        )}
        {room.visibility === Visibility.PUBLIC && (
          <Button
            onClick={() => {
              setRoomProp("isAuthorized", true);
            }}
            variant="filled"
            color="green"
          >
            <IconDoorEnter size={25} />
          </Button>
        )}
      </div>
    </>
  );
};

export default PrivateRoomPasswordPrompt;
