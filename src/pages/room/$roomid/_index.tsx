import {
  Link,
  Outlet,
  useLoaderData,
  type LoaderFunctionArgs,
} from "react-router";
import type { Room } from "../../../models/room";

const loader = async ({ params }: LoaderFunctionArgs) => {
  const resp = await fetch(`/api/rooms/${params.roomId}`);
  return (await resp.json()) as Room;
};

export const RoomPage = () => {
  const room = useLoaderData<typeof loader>();

  return (
    <div style={{ display: "grid" }}>
      <div>
        <p>Room: {room.id}</p>
      </div>

      <Link to="./upload">UPLOAD</Link>

      <Outlet />
    </div>
  );
};

RoomPage.loader = loader;
