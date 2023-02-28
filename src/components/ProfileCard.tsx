import useUser from "@/hooks/useUser";
import { Avatar, Button, Group } from "@mantine/core";
import { openModal } from "@mantine/modals";
import { IconLogout } from "@tabler/icons";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useState } from "react";

const ProfileModal = ({ user }: { user: Session["user"] | null }) => {
  const [logoutButtonLoading, setLogoutButtonLoading] = useState(false);

  return (
    <>
      <Avatar
        radius="xl"
        styles={{
          root: {
            width: "fit-content",
            height: "fit-content",
          },
          image: {
            width: "300px",
          },
        }}
        src={user?.image}
      />

      <div className="my-3" />

      <Group position="right" mt="lg">
        <Button
          loading={logoutButtonLoading}
          onClick={() => {
            setLogoutButtonLoading(true);
            signOut();
          }}
          color="red"
          leftIcon={<IconLogout />}
        >
          Logout
        </Button>
      </Group>
    </>
  );
};

const ProfileCard = () => {
  const user = useUser();

  const handleJoinRoomClick = () => {
    const modal = openModal({
      title: user?.name,
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
          <ProfileModal user={user} />
        </>
      ),
    });
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        minWidth: "100px",
      }}
      className="cursor-pointer rounded-lg bg-white p-3 text-black shadow-xl transition sm:opacity-80 sm:shadow-sm sm:hover:-translate-y-3 sm:hover:opacity-100 sm:hover:shadow-xl"
      onClick={handleJoinRoomClick}
    >
      <h1 className="flex items-center justify-center text-center text-xl font-extrabold sm:text-xl">
        <Avatar radius="xl" src={user?.image} />
        <div className="mx-1" />
        {user?.name}
      </h1>
    </div>
  );
};

export default ProfileCard;
