const STORAGE_KEY = 'hms_lab_assignments_v1';

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const save = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const fetchAssignments = async () => {
  return load();
};

export const addAssignment = async (assignment) => {
  const items = load();
  const id = `LABASSIGN-${Date.now()}`;
  const item = { id, status: 'Assigned', createdAt: new Date().toISOString(), results: [], ...assignment };
  const next = [item, ...items];
  save(next);
  // When tests are assigned, create a billing record for the patient
  try {
    // lazy import to avoid circular issues
    const { addBillingRecord } = await import('./billingService');
    const billItems = (item.tests || []).map((t) => ({ code: t.id, description: t.name, amount: t.price }));
    const total = billItems.reduce((s, it) => s + (it.amount || 0), 0);
    const billingRecord = {
      patientId: item.patientId,
      patientName: item.patientName,
      items: billItems,
      total,
      source: 'Laboratory',
      referenceId: item.id,
    };
    const savedBill = await addBillingRecord(billingRecord);
    // attach billing reference to assignment
    const updated = { ...item, billingId: savedBill.id };
    const updatedNext = [updated, ...items];
    save(updatedNext);
    return updated;
  } catch (e) {
    return item;
  }
};

export const updateAssignment = async (id, patch) => {
  const items = load();
  const next = items.map((it) => (it.id === id ? { ...it, ...patch } : it));
  save(next);
  return next.find((i) => i.id === id);
};

export const deleteAssignment = async (id) => {
  const items = load();
  const next = items.filter((it) => it.id !== id);
  save(next);
};

export default { fetchAssignments, addAssignment, updateAssignment, deleteAssignment };
