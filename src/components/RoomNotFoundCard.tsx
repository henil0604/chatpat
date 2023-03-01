const RoomNotFoundCard = () => {
  return (
    <>
      <div className="bg-white p-3 text-black sm:rounded-lg sm:p-10">
        <h1 className="text-3xl font-extrabold">Room Not Found</h1>
        <hr className="my-4" />
        The Room You are trying to join somehow does not exists.
      </div>
    </>
  );
};

export default RoomNotFoundCard;
