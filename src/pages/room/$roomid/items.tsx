import {
  useLoaderData,
  useNavigate,
  type LoaderFunctionArgs,
} from "react-router";
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
  const navigate = useNavigate();

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
            <button
              onClick={async () => {
                const resp = await fetch(`/api/items/${item.id}`, {
                  method: "DELETE",
                });
                if (!resp.ok) {
                  console.error(resp.statusText);
                  throw new Error("Failed to delete");
                }

                // revalidate
                await navigate(".", { replace: true });
              }}
            >
              削除
            </button>
          </div>
        ))}
      </div>
    </main>
  );
};

RoomItemsPage.loader = loader;
