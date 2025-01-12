import { useNavigate, useParams } from "react-router";

export const RoomUploadPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <form
        onSubmit={async (event) => {
          event.preventDefault();

          const formData = new FormData(event.currentTarget);
          const file = formData.get("file") as File;

          const resp = await fetch(`/api/rooms/${roomId}/upload`, {
            method: "POST",
            body: JSON.stringify({
              item_type: "image",
              summary: file.name,
              mime_type: file.type,
            }),
          });
          if (!resp.ok) {
            console.error(resp.statusText);
            throw new Error("Failed to upload");
          }

          const { id: itemId } = (await resp.json()) as { id: string };

          const uploadResp = await fetch(`/api/items/${itemId}/upload`, {
            method: "POST",
            body: file,
          });
          if (!uploadResp.ok) {
            console.error(uploadResp.statusText);
            throw new Error("Failed to upload");
          }

          console.log(await uploadResp.text());

          navigate(`/rooms/${roomId}`);
        }}
      >
        <label>
          From Files
          <input name="file" type="file"></input>
        </label>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
