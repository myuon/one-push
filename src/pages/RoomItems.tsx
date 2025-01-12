import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import type { Item } from "../models/item";

const loader = async ({ params }: LoaderFunctionArgs) => {
  const resp = await fetch(`/api/rooms/${params.roomId}/items`, {
    method: "GET",
  });
  return (await resp.json()) as Item[];
};

export const RoomItemsPage = () => {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      {data.map((item) => (
        <ul key={item.id}>
          <li>{item.id}</li>
          <li>{item.summary}</li>
          <li>{item.mime_type}</li>
          <li>{item.item_type}</li>
          <li>{item.created_at}</li>
          <li>{item.updated_at}</li>
          {item.item_type === "image" ? (
            <img
              src={`/api/items/${item.id}/raw`}
              style={{ maxWidth: "100%" }}
              loading="lazy"
            />
          ) : null}
        </ul>
      ))}
    </div>
  );
};

RoomItemsPage.loader = loader;
