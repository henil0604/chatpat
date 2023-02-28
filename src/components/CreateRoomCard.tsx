import {
  Button,
  Group,
  TextInput,
  useMantineTheme,
  SegmentedControl,
  PasswordInput,
} from "@mantine/core";
import { openModal } from "@mantine/modals";
import { IconHash } from "@tabler/icons";
import { useForm } from "@mantine/form";

export const CreateRoomModal = () => {
  const form = useForm({
    initialValues: {
      roomName: "",
      visibility: "public",
      password: "",
    },

    validate: (values) => {
      return {
        roomName: values.roomName.length < 3 ? "Too Short" : null,
        password:
          values.visibility === "private" && values.password.length < 4
            ? "Too Short"
            : null,
      };
    },
  });

  return (
    <>
      <div className="py-5">
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <TextInput
            {...form.getInputProps("roomName")}
            icon={<IconHash />}
            placeholder="Room Name"
          />

          <div className="my-5" />

          <Group spacing="xl">
            <p>Visibility:</p>
            <SegmentedControl
              data={[
                { value: "public", label: "Public" },
                { value: "private", label: "Private" },
              ]}
              {...form.getInputProps("visibility")}
            />
          </Group>

          <div className="my-5" />

          {form.values.visibility === "private" && (
            <>
              <PasswordInput
                placeholder="Password"
                label="Password"
                {...form.getInputProps("password")}
              />
            </>
          )}

          <Group position="right" mt="lg">
            <Button type="submit">Create</Button>
          </Group>
        </form>
      </div>
    </>
  );
};

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
      children: (
        <>
          <CreateRoomModal />
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
