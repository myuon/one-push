import { Form, useNavigate } from "react-router";

export const ShareTargetPage = () => {
  const search = new URLSearchParams(location.search);
  const roomId = localStorage.getItem("roomId");
  const navigate = useNavigate();

  return (
    <Form
      onSubmit={async (event) => {
        event.preventDefault();

        const title = search.get("title");
        const text = search.get("text");
        const url = search.get("url");

        const resp = await fetch(`/api/rooms/${roomId}/upload`, {
          method: "POST",
          body: JSON.stringify({
            item_type: "link",
            summary: `${title}\n${text}\n${url}`,
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
          body: url,
        });
        if (!uploadResp.ok) {
          console.error(uploadResp.statusText);
          throw new Error("Failed to upload");
        }

        console.log(await uploadResp.text());

        navigate(`/rooms/${roomId}`);
      }}
    >
      <h2>Share Target</h2>
      <ul>
        <li>Room ID: {roomId}</li>
        <li>Title: {search.get("title")}</li>
        <li>Text: {search.get("text")}</li>
        <li>URL: {search.get("url")}</li>
      </ul>

      <button type="submit">Submit</button>
    </Form>
  );
};
