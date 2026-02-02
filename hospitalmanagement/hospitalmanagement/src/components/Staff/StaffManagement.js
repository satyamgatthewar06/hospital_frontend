import React, { useState, useEffect } from 'react';
import { getStaff, addStaff, updateStaff, deleteStaff } from '../../services/staffService';

const StaffManagement = () => {
    const [staffList, setStaffList] = useState([]);
    const [staffName, setStaffName] = useState('');
    const [staffId, setStaffId] = useState(null);

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        const staffData = await getStaff();
        setStaffList(staffData);
    };

    const handleAddOrUpdate = async () => {
        if (staffId) {
            await updateStaff(staffId, { name: staffName });
        } else {
            await addStaff({ name: staffName });
        }
        setStaffName('');
        setStaffId(null);
        fetchStaff();
    };

    const handleEdit = (staff) => {
        setStaffName(staff.name);
        setStaffId(staff.id);
    };

    const handleDelete = async (id) => {
        await deleteStaff(id);
        fetchStaff();
    };

    return (
        <div>
            <h2>Staff Management</h2>
            <input
                type="text"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                placeholder="Enter staff name"
            />
            <button onClick={handleAddOrUpdate}>
                {staffId ? 'Update Staff' : 'Add Staff'}
            </button>
            <ul>
                {staffList.map((staff) => (
                    <li key={staff.id}>
                        {staff.name}
                        <button onClick={() => handleEdit(staff)}>Edit</button>
                        <button onClick={() => handleDelete(staff.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StaffManagement;