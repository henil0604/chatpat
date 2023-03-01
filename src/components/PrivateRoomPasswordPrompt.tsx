import { setRoomProp } from "@/store/room";
import { PasswordInput } from "@mantine/core";

interface PrivateRoomPasswordPromptProps {
  room: any;
}

const PrivateRoomPasswordPrompt = ({
  room,
}: PrivateRoomPasswordPromptProps) => {
  const handleCheck = (password: string) => {
    if (room.password === password) {
      setRoomProp("isAuthorized", true);
    }
  };

  return (
    <>
      <div className="flex w-full items-center justify-center gap-3 rounded-md bg-white p-2 text-black sm:px-4 sm:py-3">
        <PasswordInput
          style={{
            minWidth: "300px",
          }}
          placeholder="Enter Room Password"
          onChange={(event) => handleCheck(event.currentTarget.value)}
        />
      </div>
    </>
  );
};

export default PrivateRoomPasswordPrompt;
