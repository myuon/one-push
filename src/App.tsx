import { createBrowserRouter, RouterProvider } from "react-router";
import { IndexPage } from "./pages/_index";
import { RoomPage } from "./pages/room/$roomid/_index";
import { RoomUploadPage } from "./pages/room/$roomid/upload";
import { RoomItemsPage } from "./pages/room/$roomid/items";
import { useEffect } from "react";
import { ShareTargetPage } from "./pages/share_target";

const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexPage />,
    index: true,
  },
  {
    path: "/rooms/:roomId",
    element: <RoomPage />,
    loader: RoomPage.loader,
    children: [
      {
        path: "",
        element: <RoomItemsPage />,
        loader: RoomItemsPage.loader,
      },
      {
        path: "upload",
        element: <RoomUploadPage />,
      },
    ],
  },
  {
    path: "/share-target",
    element: <ShareTargetPage />,
  },
]);

export const App = () => {
  useEffect(() => {
    (async () => {
      if ("serviceWorker" in navigator) {
        let reg = await navigator.serviceWorker.getRegistration();
        console.log(reg);

        if (!reg?.active) {
          reg = await navigator.serviceWorker.register("/sw.js");
        }

        reg.addEventListener("updatefound", () => {
          const installingWorker = reg.installing;
          if (installingWorker != null) {
            installingWorker.onstatechange = (event) => {
              // @ts-ignore
              if (event.target?.state == "installed") {
                window.alert(
                  "更新がインストールされました。アプリを再起動してください。"
                );
              }
            };
          }
        });
      }
    })();
  }, []);

  return <RouterProvider router={router} />;
};
