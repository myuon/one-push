import { Form, Link, useNavigate } from "react-router";

export const IndexPage = () => {
  const navigate = useNavigate();
  const roomId = localStorage.getItem("roomId");

  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <div>
        {roomId ? <Link to={`/rooms/${roomId}`}>RoomId: {roomId}</Link> : null}
      </div>

      <Form
        onSubmit={async (event) => {
          event.preventDefault();

          const formData = new FormData(event.currentTarget);
          const roomId = formData.get("roomId") as string;
          if (!roomId) return;

          await navigate(`/rooms/${roomId}`);
        }}
      >
        <input name="roomId" type="text"></input>
        <button type="submit">Join</button>
      </Form>
    </div>
  );
};
