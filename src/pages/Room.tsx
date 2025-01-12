import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import type { Room } from "../models/room";

const loader = async ({ params }: LoaderFunctionArgs) => {
  const resp = await fetch(`/api/rooms/${params.roomId}`);
  return (await resp.json()) as Room;
};

export const RoomPage = () => {
  const room = useLoaderData<typeof loader>();

  return (
    <div>
      <p>{room.id}</p>
      <p>created_at: {room.created_at}</p>
      <p>updated_at: {room.created_at}</p>
    </div>
  );
};

RoomPage.loader = loader;
