import {
  Link,
  Outlet,
  useLoaderData,
  useParams,
  type LoaderFunctionArgs,
} from "react-router";
import type { Room } from "../../../models/room";
import "./_index.modules.css";
import { useEffect } from "react";

const loader = async ({ params }: LoaderFunctionArgs) => {
  const resp = await fetch(`/api/rooms/${params.roomId}`);
  return (await resp.json()) as Room;
};

export const RoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const room = useLoaderData<typeof loader>();

  useEffect(() => {
    localStorage.setItem("roomId", roomId ?? "");
  }, []);

  return (
    <div className="container">
      <header>
        <h2>Room: {room.id.slice(room.id.length - 5, room.id.length)}</h2>

        <Link to="./upload">UPLOAD</Link>
      </header>

      <Outlet />
    </div>
  );
};

RoomPage.loader = loader;
