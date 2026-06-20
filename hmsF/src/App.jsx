import Home from "./pages/Home";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import AdminDashboard from "./pages/AdminDashboard.jsx";

const router = createBrowserRouter(
[
  {
    path: "/",
    element: <Home />,
  },
  {
    path:"/DoctorDashboard",
    element:<DoctorDashboard/>
  },
  {
    path:"/PatientDashboard",
    element:<PatientDashboard/>
  },
  {
    path:"/AdminDashboard",
    element:<AdminDashboard/>
  },
]
);

function App() {
  return (<>
  <RouterProvider router={router}/>
  </>
  );
}

export default App;