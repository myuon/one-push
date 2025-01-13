import {
  Link,
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

  const search = new URLSearchParams(location.search);
  const focusedItem = data.find((item) => item.id === search.get("item"));

  return (
    <main>
      <h2>Files</h2>

      <div className="item-list">
        {data.map((item) => (
          <Link to={`.?item=${item.id}`} key={item.id} className="item">
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
                const ok = window.confirm("Area you sure to delete?");
                if (!ok) return;

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
          </Link>
        ))}
      </div>

      {focusedItem ? (
        <div className="sheet">
          <Link to="." className="close">
            Close
          </Link>

          <div className="focused-item">
            <div className="item">
              <div className="item-cover">
                {focusedItem.item_type === "image" ? (
                  <img
                    src={`/api/items/${focusedItem.id}/raw`}
                    loading="lazy"
                  />
                ) : (
                  <span>{focusedItem.item_type}</span>
                )}
              </div>
              <div className="item-content">
                <p>{focusedItem.summary}</p>
                <small>
                  {new Date(focusedItem.created_at * 1000).toLocaleString()}
                </small>
              </div>
            </div>
          </div>

          <ul>
            <li>
              {focusedItem.item_type === "link" ? (
                <a href={focusedItem.url}>Open</a>
              ) : (
                <a href={`/api/items/${focusedItem.id}/raw`}>Open</a>
              )}
            </li>
            <li>
              <button
                style={{ fontSize: "inherit", outline: "none", border: "none" }}
                onClick={() => {
                  navigator.share({
                    title: "One-push share",
                    text: focusedItem.summary,
                    url: `/api/items/${focusedItem.id}/raw`,
                  });
                }}
              >
                Share
              </button>
            </li>
            <li>
              <button
                style={{ fontSize: "inherit", outline: "none", border: "none" }}
                onClick={async () => {
                  const resp = await fetch(`/api/items/${focusedItem.id}/raw`);
                  const text = await resp.text();

                  await navigator.clipboard.writeText(text);
                }}
              >
                Copy to clipboard
              </button>
            </li>
          </ul>
        </div>
      ) : null}
    </main>
  );
};

RoomItemsPage.loader = loader;
