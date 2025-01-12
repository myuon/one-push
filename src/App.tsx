import {
  BrowserRouter,
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from "react-router";
import { IndexPage } from "./pages/Index";
import { RoomPage } from "./pages/Room";
import { RoomUploadPage } from "./pages/RoomUpload";
import { RoomItemsPage } from "./pages/RoomItems";

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
    ],
  },
  {
    path: "/rooms/:roomId/upload",
    element: <RoomUploadPage />,
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
