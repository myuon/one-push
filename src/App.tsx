import { createBrowserRouter, RouterProvider } from "react-router";
import { IndexPage } from "./pages/_index";
import { RoomPage } from "./pages/room/$roomid/_index";
import { RoomUploadPage } from "./pages/room/$roomid/upload";
import { RoomItemsPage } from "./pages/room/$roomid/items";
import { useEffect } from "react";

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
]);

export const App = () => {
  useEffect(() => {
    (async () => {
      if ("serviceWorker" in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        console.log(reg);

        if (!reg?.active) {
          await navigator.serviceWorker.register("/sw.js");
        }
      }
    })();
  }, []);

  return <RouterProvider router={router} />;
};
