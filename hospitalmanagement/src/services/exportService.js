import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Papa from 'papaparse';

// PDF and Data Export Service

export const ExportService = {
  // Generate and download PDF bill
  downloadBillPDF: async (billData) => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 20;

      // Hospital Header
      doc.setFontSize(20);
      doc.text('Hospital Invoice', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Hospital Details
      doc.setFontSize(10);
      doc.text('Address: Hospital Street, City', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 5;
      doc.text('Phone: +91-XXXXXXXXXX | Email: hospital@example.com', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;

      // Bill Information
      doc.setFontSize(12);
      doc.text('Bill Details', 20, yPosition);
      yPosition += 8;

      doc.setFontSize(10);
      doc.text(`Bill ID: ${billData.billId || 'N/A'}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Date: ${billData.billDate || new Date().toLocaleDateString()}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Patient Name: ${billData.patientName || 'N/A'}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Patient ID: ${billData.patientId || 'N/A'}`, 20, yPosition);
      yPosition += 12;

      // Charges Table
      doc.setFontSize(11);
      doc.text('Charge Details', 20, yPosition);
      yPosition += 8;

      const charges = [
        ['Description', 'Amount (₹)'],
        billData.roomCharges ? ['Room Charges', billData.roomCharges] : null,
        billData.procedureCharges ? ['Procedure Charges', billData.procedureCharges] : null,
        billData.labCharges ? ['Lab Charges', billData.labCharges] : null,
        billData.medicineCharges ? ['Medicine Charges', billData.medicineCharges] : null,
        billData.doctorCharges ? ['Doctor Charges', billData.doctorCharges] : null,
        billData.otherCharges ? ['Other Charges', billData.otherCharges] : null,
      ].filter(Boolean);

      doc.autoTable({
        startY: yPosition,
        head: [charges[0]],
        body: charges.slice(1),
        theme: 'striped',
        columnStyles: {
          0: { cellWidth: 120 },
          1: { cellWidth: 50, halign: 'right' }
        }
      });

      yPosition = doc.lastAutoTable.finalY + 10;

      // Total Amount
      doc.setFontSize(12);
      doc.text(`Total Amount: ₹${billData.totalAmount || 0}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Discount: ₹${billData.discountAmount || 0}`, 20, yPosition);
      yPosition += 6;
      doc.setFont(undefined, 'bold');
      doc.text(`Final Amount: ₹${billData.finalAmount || billData.totalAmount || 0}`, 20, yPosition);
      yPosition += 12;

      // Payment Status
      doc.setFont(undefined, 'normal');
      doc.text(`Payment Status: ${billData.paymentStatus || 'Pending'}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Payment Method: ${billData.paymentMethod || 'N/A'}`, 20, yPosition);

      // Footer
      doc.setFontSize(9);
      doc.text('Thank you for using our Hospital Services', pageWidth / 2, pageHeight - 20, { align: 'center' });
      doc.text('This is an automated generated invoice', pageWidth / 2, pageHeight - 10, { align: 'center' });

      // Download PDF
      doc.save(`Bill_${billData.billId || 'Invoice'}_${new Date().getTime()}.pdf`);
      return { success: true, message: 'PDF downloaded successfully' };
    } catch (error) {
      console.error('PDF generation error:', error);
      throw error;
    }
  },

  // Download data as CSV
  downloadDataAsCSV: (data, filename = 'export') => {
    try {
      if (!data || data.length === 0) {
        throw new Error('No data to export');
      }

      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}_${new Date().getTime()}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return { success: true, message: 'CSV downloaded successfully' };
    } catch (error) {
      console.error('CSV export error:', error);
      throw error;
    }
  },

  // Export patients list
  exportPatients: (patients) => {
    const data = patients.map(p => ({
      'Patient ID': p.id,
      'Name': p.name,
      'Email': p.email,
      'Phone': p.phone,
      'Age': p.age,
      'Gender': p.gender,
      'Address': p.address,
      'Medical History': p.medicalHistory,
      'Status': p.status
    }));
    ExportService.downloadDataAsCSV(data, 'patients');
  },

  // Export bills list
  exportBills: (bills) => {
    const data = bills.map(b => ({
      'Bill ID': b.billId,
      'Patient Name': b.patientName,
      'Patient ID': b.patientId,
      'Bill Date': b.billDate,
      'Total Amount': b.totalAmount,
      'Final Amount': b.finalAmount,
      'Payment Status': b.paymentStatus,
      'Payment Method': b.paymentMethod
    }));
    ExportService.downloadDataAsCSV(data, 'bills');
  },

  // Export appointments list
  exportAppointments: (appointments) => {
    const data = appointments.map(a => ({
      'Appointment ID': a.id,
      'Patient Name': a.patientName,
      'Doctor Name': a.doctorName,
      'Date': a.date,
      'Time': a.time,
      'Status': a.status,
      'Department': a.department,
      'Reason': a.reason
    }));
    ExportService.downloadDataAsCSV(data, 'appointments');
  },

  // Export staff list
  exportStaff: (staff) => {
    const data = staff.map(s => ({
      'Staff ID': s.id,
      'Name': s.name,
      'Role': s.role,
      'Department': s.department,
      'Email': s.email,
      'Phone': s.contact,
      'Joining Date': s.joinDate,
      'Experience': s.experience,
      'Status': s.status
    }));
    ExportService.downloadDataAsCSV(data, 'staff');
  },

  // Export lab tests list
  exportLabTests: (tests) => {
    const data = tests.map(t => ({
      'Test ID': t.id,
      'Test Name': t.testName,
      'Patient Name': t.patientName,
      'Collection Date': t.collectionDate,
      'Report Date': t.reportDate,
      'Status': t.status,
      'Results': t.results
    }));
    ExportService.downloadDataAsCSV(data, 'lab_tests');
  },

  // Export rooms/wards list
  exportRooms: (rooms) => {
    const data = rooms.map(r => ({
      'Room Number': r.roomNumber,
      'Room Type': r.roomType,
      'Capacity': r.capacity,
      'Current Occupancy': r.currentOccupancy,
      'Status': r.status,
      'Charge Per Day': r.chargePerDay,
      'Amenities': r.amenities.join(', '),
      'Floor': r.floor
    }));
    ExportService.downloadDataAsCSV(data, 'rooms');
  },

  // Backup and restore data (localStorage)
  backupData: (dataObject, backupName = 'hospital_backup') => {
    try {
      const backup = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        data: dataObject
      };
      localStorage.setItem(backupName, JSON.stringify(backup));
      
      // Also create downloadable backup file
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${backupName}_${new Date().getTime()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return { success: true, message: 'Data backed up successfully' };
    } catch (error) {
      console.error('Backup error:', error);
      throw error;
    }
  },

  // Restore data from backup
  restoreData: (backupName = 'hospital_backup') => {
    try {
      const backup = localStorage.getItem(backupName);
      if (!backup) {
        throw new Error('No backup found');
      }
      const parsedBackup = JSON.parse(backup);
      return parsedBackup.data;
    } catch (error) {
      console.error('Restore error:', error);
      throw error;
    }
  },

  // Export all hospital data
  exportAllData: (allData) => {
    const data = {
      timestamp: new Date().toISOString(),
      patients: allData.patients || [],
      doctors: allData.doctors || [],
      appointments: allData.appointments || [],
      bills: allData.bills || [],
      staff: allData.staff || [],
      rooms: allData.wards || [],
      labTests: allData.labTests || [],
      tpa: allData.tpaRecords || []
    };
    ExportService.downloadDataAsCSV([data], 'complete_hospital_data');
  }
};

export default ExportService;
