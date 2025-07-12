import { createBrowserRouter } from "react-router-dom";
import App from "../App";
// import Home from "../components/components2/Admin";
// import Login from "../components/components2/User";
// import User from "../components/components2/Doctor";
import Admin from "../components/components2/Admin";
import Doctor from "../components/components2/Doctor";
import User from "../components/components2/User";
import AppointmentBooking from "../components/components2/AppointmentBooking";
import HospitalDashboard from "../components/components2/HospitalDashboard";
import DoctorAlign from "../components/components2/DoctorAllign";
import Login from "../components/components2/Login";

export let routes1=createBrowserRouter([{
    path:"/",
    element:<App/>,
    children:[{
        index:true,
        element:<Login/>
    },{
        path:"/admin",
        element:<Admin/>
    },{
        path:"/user",
        element:<User/>
    },{
        path:"/doctor",
        element:<Doctor/>
    },{
        path:"/bookAppointment",
        element:<AppointmentBooking/>
    },{
        path:"/hospitalDashboard",
        element:<HospitalDashboard/>
    },{
        path:"/doctorAllign",
        element:<DoctorAlign/>
    }]
}])