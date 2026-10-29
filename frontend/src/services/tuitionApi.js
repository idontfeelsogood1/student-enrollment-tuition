import { api } from "./api";

export async function getInvoices(studentId) {
  const response = await api.get(`/tuition/students/${studentId}/invoices`);
  return response.data.invoices;
}
