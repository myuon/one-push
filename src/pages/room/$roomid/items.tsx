import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import type { Item } from "../../../models/item";
import "./items.modules.css";

const loader = async ({ params }: LoaderFunctionArgs) => {
  const resp = await fetch(`/api/rooms/${params.roomId}/items`, {
    method: "GET",
  });
  return (await resp.json()) as Item[];
};

export const RoomItemsPage = () => {
  const data = useLoaderData<typeof loader>();

  return (
    <main className="page">
      <h2>Files</h2>

      <div className="item-list">
        {data.map((item) => (
          <div key={item.id} className="item">
            <div className="item-cover">
              {item.item_type === "image" ? (
                <img src={`/api/items/${item.id}/raw`} loading="lazy" />
              ) : (
                <span>{item.item_type}</span>
              )}
            </div>
            <div className="item-content">
              <p>{item.summary}</p>
              <small>{new Date(item.created_at * 1000).toLocaleString()}</small>
            </div>
            <div>
              <button>削除</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

RoomItemsPage.loader = loader;
