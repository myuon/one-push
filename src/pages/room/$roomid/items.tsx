import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import type { Item } from "../../../models/item";

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
        <div key={item.id}>
          <div>
            <div>{item.item_type}</div>
            {item.item_type === "image" ? (
              <img
                src={`/api/items/${item.id}/raw`}
                style={{ maxWidth: "100%" }}
                loading="lazy"
              />
            ) : null}
          </div>
          <div>
            <p>{item.summary}</p>
            <small>{new Date(item.created_at * 1000).toLocaleString()}</small>
          </div>
        </div>
      ))}
    </div>
  );
};

RoomItemsPage.loader = loader;
