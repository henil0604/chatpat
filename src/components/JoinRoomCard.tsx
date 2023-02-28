import { Button, Group, TextInput, useMantineTheme } from "@mantine/core";
import { openModal } from "@mantine/modals";
import { IconDoorEnter, IconHash } from "@tabler/icons";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { setLoading } from "@/store/loading";
import { showNotification } from "@mantine/notifications";

export const JoinRoomModal = () => {
  const router = useRouter();
  const { client } = api.useContext();

  const form = useForm({
    initialValues: {
      roomName: "",
    },

    validate: (values) => {
      return {
        roomName: values.roomName.length < 3 ? "Too Short" : null,
      };
    },
  });

  const handleFormSubmit = async (values: any) => {
    setLoading(true);

    const data = await client.room.getInfo.query({
      roomName: values.roomName,
    });

    if (data.error && data.code === "ROOM_NOT_FOUND") {
      showNotification({
        title: "Oops!",
        message: (
          <>
            {data.message}
            <br />
            (CODE: {data.code})
          </>
        ),
        color: "red",
        autoClose: 4000,
      });
      setLoading(false);
      return;
    }

    if (!data.error && data.code === "ROOM_FOUND") {
      showNotification({
        title: "Hurrey!",
        message: (
          <>
            {data.message}
            <br />
            You are being Redirected...
          </>
        ),
        color: "green",
        autoClose: 3000,
      });
      router.push(`/r/${values.roomName}`);
    }

    setLoading(false);
  };

  return (
    <>
      <div className="py-5">
        <form onSubmit={form.onSubmit(handleFormSubmit)}>
          <TextInput
            {...form.getInputProps("roomName")}
            icon={<IconHash />}
            placeholder="Room Name"
          />

          <Group position="right" mt="lg">
            <Button type="submit">Join</Button>
          </Group>
        </form>
      </div>
    </>
  );
};

const JoinRoomCard = () => {
  const theme = useMantineTheme();

  const handleJoinRoomClick = () => {
    const modal = openModal({
      title: "Join Room",
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
      children: (
        <>
          <JoinRoomModal />
        </>
      ),
    });
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        minWidth: "300px",
      }}
      className="cursor-pointer rounded-lg bg-white p-10 text-black shadow-xl transition sm:opacity-80 sm:shadow-sm sm:hover:-translate-y-3 sm:hover:opacity-100 sm:hover:shadow-xl"
      onClick={handleJoinRoomClick}
    >
      <h1 className="text-center text-xl font-extrabold sm:text-2xl">
        Join Room
      </h1>
      <hr className="my-5" />
      <p className="flex items-center justify-center text-base">
        <IconDoorEnter size={100} />
      </p>
    </div>
  );
};

export default JoinRoomCard;
