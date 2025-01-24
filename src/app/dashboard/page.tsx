import React from "react";
import AddPrescription from "@/components/AddPrescription";
import PrescriptionDashboard from "@/components/PrescriptionDashboard";
const Dashboard = () =>{
    return(
        <div>
            <h1>
                Welcome to dashboard
            </h1>
            <AddPrescription/>
            <PrescriptionDashboard/>
        </div>
    )
}
export default Dashboard;