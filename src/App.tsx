import { createBrowserRouter, RouterProvider } from "react-router";
import { IndexPage } from "./pages/_index";
import { RoomPage } from "./pages/room/$roomid/_index";
import { RoomUploadPage } from "./pages/room/$roomid/upload";
import { RoomItemsPage } from "./pages/room/$roomid/items";

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
  return <RouterProvider router={router} />;
};
