import { Link } from "react-router";

export const IndexPage = () => {
  const roomId = localStorage.getItem("roomId");

  return (
    <div>
      {roomId ? <Link to={`/rooms/${roomId}`}>RoomId: {roomId}</Link> : null}
    </div>
  );
};
