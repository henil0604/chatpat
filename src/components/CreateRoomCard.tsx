import { useMantineTheme } from "@mantine/core";
import { openModal } from "@mantine/modals";

const CreateRoomCard = () => {
  const theme = useMantineTheme();

  const handleCreateRoomClick = () => {
    const modal = openModal({
      title: "Create Room",
      styles: {
        inner: {
          backgroundColor: "rgba(255, 255, 255, 0.99)",
        },
        modal: {
          backgroundColor: "white",
          color: "black",
        },
        title: {
          fontSize: "25px",
          fontWeight: "bolder",
        },
      },
      centered: true,
    });
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        minWidth: "300px",
      }}
      className="cursor-pointer rounded-lg bg-white p-10 text-black shadow-xl transition sm:opacity-80 sm:shadow-sm sm:hover:-translate-y-3 sm:hover:opacity-100 sm:hover:shadow-xl"
      onClick={handleCreateRoomClick}
    >
      <h1 className="text-center text-xl font-extrabold sm:text-2xl">
        Create Room
      </h1>
      <hr className="my-5" />
      <p className="text-base">
        Create a room where you can talk with your friends
      </p>
    </div>
  );
};

export default CreateRoomCard;
