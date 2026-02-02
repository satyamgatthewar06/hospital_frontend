// Ward and Room Management Service
const DISABLE_API = process.env.REACT_APP_DISABLE_API === 'true';

// Room type definitions with pricing
const ROOM_TYPES = {
  ICU: { label: 'ICU', dailyRate: 5000, color: '#dc2626' },
  GENERAL: { label: 'General Ward', dailyRate: 1500, color: '#3b82f6' },
  PRIVATE: { label: 'Private Room', dailyRate: 3000, color: '#8b5cf6' },
};

// Sample rooms data
const SAMPLE_ROOMS = [
  { id: 'ICU-001', roomNumber: '101', type: 'ICU', beds: 2, occupancy: 1, available: 1, status: 'partial' },
  { id: 'ICU-002', roomNumber: '102', type: 'ICU', beds: 2, occupancy: 0, available: 2, status: 'available' },
  { id: 'GEN-001', roomNumber: '201', type: 'GENERAL', beds: 4, occupancy: 2, available: 2, status: 'partial' },
  { id: 'GEN-002', roomNumber: '202', type: 'GENERAL', beds: 4, occupancy: 4, available: 0, status: 'full' },
  { id: 'GEN-003', roomNumber: '203', type: 'GENERAL', beds: 4, occupancy: 0, available: 4, status: 'available' },
  { id: 'PRI-001', roomNumber: '301', type: 'PRIVATE', beds: 1, occupancy: 1, available: 0, status: 'full' },
  { id: 'PRI-002', roomNumber: '302', type: 'PRIVATE', beds: 1, occupancy: 0, available: 1, status: 'available' },
  { id: 'PRI-003', roomNumber: '303', type: 'PRIVATE', beds: 1, occupancy: 0, available: 1, status: 'available' },
];

const loadLocal = () => {
  const data = localStorage.getItem('hms_ward_rooms_v1');
  return data ? JSON.parse(data) : SAMPLE_ROOMS;
};

const saveLocal = (data) => {
  localStorage.setItem('hms_ward_rooms_v1', JSON.stringify(data));
};

const loadAdmissionsLocal = () => {
  const data = localStorage.getItem('hms_admissions_v1');
  return data ? JSON.parse(data) : [];
};

const saveAdmissionsLocal = (data) => {
  localStorage.setItem('hms_admissions_v1', JSON.stringify(data));
};

// Create billing record for room admission
const createAdmissionBillingRecord = (admission) => {
  try {
    // Lazy load billingService to avoid circular dependencies
    const { addBillingRecord } = require('./billingService');
    
    const roomType = admission.roomType || 'GENERAL';
    const roomDetails = ROOM_TYPES[roomType];
    const dailyRate = roomDetails?.dailyRate || 1500;
    
    const billRecord = {
      patientId: admission.patientId,
      patientName: admission.patientName,
      billType: 'IPD', // Ward admissions are IPD
      type: 'IPD',
      paymentMethod: 'pending',
      billItems: [
        {
          code: `ROOM-${roomType}`,
          description: `${roomDetails?.label || roomType} - Room ${admission.roomId} (Initial Charge)`,
          amount: dailyRate,
          quantity: 1,
          unitPrice: dailyRate
        }
      ],
      roomId: admission.roomId,
      bedNumber: admission.bedNumber,
      admissionId: admission.id,
      description: `Room admission - ${admission.diagnosis}`,
      total: dailyRate,
      amount: dailyRate,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      source: 'ward-admission'
    };
    
    addBillingRecord(billRecord);
    return true;
  } catch (error) {
    console.error('Error creating admission billing record:', error);
    return false;
  }
};

// Create billing record for room discharge/charges
const createDischargeBillingRecord = (admission, daysStayed) => {
  try {
    // Lazy load billingService to avoid circular dependencies
    const { addBillingRecord } = require('./billingService');
    
    const roomType = admission.roomType || 'GENERAL';
    const roomDetails = ROOM_TYPES[roomType];
    const dailyRate = roomDetails?.dailyRate || 1500;
    const totalCharge = dailyRate * daysStayed;
    
    const billRecord = {
      patientId: admission.patientId,
      patientName: admission.patientName,
      billType: 'IPD',
      type: 'IPD',
      paymentMethod: 'pending',
      billItems: [
        {
          code: `ROOM-${roomType}-STAY`,
          description: `${roomDetails?.label || roomType} - ${daysStayed} days @ ₹${dailyRate}/day`,
          amount: totalCharge,
          quantity: daysStayed,
          unitPrice: dailyRate
        }
      ],
      roomId: admission.roomId,
      bedNumber: admission.bedNumber,
      admissionId: admission.id,
      description: `Room stay charges - ${admission.diagnosis}`,
      total: totalCharge,
      amount: totalCharge,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      source: 'ward-discharge'
    };
    
    addBillingRecord(billRecord);
    return true;
  } catch (error) {
    console.error('Error creating discharge billing record:', error);
    return false;
  }
};

// Room/Ward operations
export const wardService = {
  // Get all rooms
  getAllRooms: async () => {
    if (DISABLE_API) {
      return loadLocal();
    }
    try {
      const response = await fetch('/api/rooms');
      return response.json();
    } catch (error) {
      return loadLocal();
    }
  },

  // Get rooms by type
  getRoomsByType: async (type) => {
    const rooms = await wardService.getAllRooms();
    return rooms.filter(room => room.type === type);
  },

  // Get available rooms
  getAvailableRooms: async () => {
    const rooms = await wardService.getAllRooms();
    return rooms.filter(room => room.available > 0);
  },

  // Update room occupancy
  updateRoomOccupancy: (roomId, change) => {
    const rooms = loadLocal();
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      room.occupancy = Math.max(0, room.occupancy + change);
      room.available = room.beds - room.occupancy;
      room.status = room.available === 0 ? 'full' : room.available === room.beds ? 'available' : 'partial';
      saveLocal(rooms);
    }
    return room;
  },

  // Get room details
  getRoomDetails: (roomId) => {
    const rooms = loadLocal();
    return rooms.find(r => r.id === roomId);
  },

  // Admit patient - with billing integration
  admitPatient: (admission) => {
    const admissions = loadAdmissionsLocal();
    
    // Get room details to add room type
    const roomDetails = wardService.getRoomDetails(admission.roomId);
    
    const admissionRecord = {
      id: `ADM-${Date.now()}`,
      ...admission,
      roomType: roomDetails?.type || 'GENERAL',
      admissionDate: new Date().toISOString().split('T')[0],
      status: 'admitted',
    };
    admissions.push(admissionRecord);
    saveAdmissionsLocal(admissions);

    // Update room occupancy
    wardService.updateRoomOccupancy(admission.roomId, 1);

    // Create billing record for room admission
    createAdmissionBillingRecord(admissionRecord);

    return admissionRecord;
  },

  // Discharge patient - with billing integration
  dischargePatient: (admissionId) => {
    const admissions = loadAdmissionsLocal();
    const admission = admissions.find(a => a.id === admissionId);
    if (admission) {
      admission.status = 'discharged';
      admission.dischargeDate = new Date().toISOString().split('T')[0];
      
      // Calculate days stayed
      const admitDate = new Date(admission.admissionDate);
      const dischargeDate = new Date(admission.dischargeDate);
      const daysStayed = Math.max(1, Math.ceil((dischargeDate - admitDate) / (1000 * 60 * 60 * 24)));
      
      saveAdmissionsLocal(admissions);

      // Update room occupancy
      wardService.updateRoomOccupancy(admission.roomId, -1);

      // Create billing record for room stay charges
      createDischargeBillingRecord(admission, daysStayed);
    }
    return admission;
  },

  // Get all admissions
  getAllAdmissions: async () => {
    if (DISABLE_API) {
      return loadAdmissionsLocal();
    }
    try {
      const response = await fetch('/api/admissions');
      return response.json();
    } catch (error) {
      return loadAdmissionsLocal();
    }
  },

  // Get active admissions
  getActiveAdmissions: async () => {
    const admissions = await wardService.getAllAdmissions();
    return admissions.filter(a => a.status === 'admitted');
  },

  // Get admissions by room
  getAdmissionsByRoom: async (roomId) => {
    const admissions = await wardService.getAllAdmissions();
    return admissions.filter(a => a.roomId === roomId && a.status === 'admitted');
  },

  // Get room types
  getRoomTypes: () => ROOM_TYPES,

  // Get room type details
  getRoomTypeDetails: (type) => ROOM_TYPES[type] || {},
};

export default wardService;
