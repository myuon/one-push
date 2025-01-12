import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export const RoomUploadPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const [clipboard, setClipboard] = useState("");
  useEffect(() => {
    navigator.clipboard.readText().then((text) => {
      setClipboard(text);
    });
  }, []);

  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <form
        onSubmit={async (event) => {
          event.preventDefault();

          const formData = new FormData(event.currentTarget);
          const file = formData.get("file") as File;

          console.log(file);

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
        style={{ display: "grid", gap: "16px" }}
      >
        <label>
          From Files
          <input name="file" type="file"></input>
          <button type="submit">Submit</button>
        </label>
      </form>

      <label>
        <textarea name="clipboard" value={clipboard} readOnly></textarea>
        <button
          onClick={async () => {
            const resp = await fetch(`/api/rooms/${roomId}/upload`, {
              method: "POST",
              body: JSON.stringify({
                item_type: "text",
                summary: clipboard.slice(0, 100),
                mime_type: "text/plain",
              }),
            });
            if (!resp.ok) {
              console.error(resp.statusText);
              throw new Error("Failed to upload");
            }

            const { id: itemId } = (await resp.json()) as { id: string };

            const uploadResp = await fetch(`/api/items/${itemId}/upload`, {
              method: "POST",
              body: clipboard,
            });
            if (!uploadResp.ok) {
              console.error(uploadResp.statusText);
              throw new Error("Failed to upload");
            }

            console.log(await uploadResp.text());

            navigate(`/rooms/${roomId}`);
          }}
        >
          From Clipboard
        </button>
      </label>
    </div>
  );
};
