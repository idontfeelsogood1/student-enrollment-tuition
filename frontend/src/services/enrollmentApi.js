import { api } from "./api";

export async function getSections(semesterId) {
  const response = await api.get("/enrollments/sections", { params: { semesterId } });
  return response.data.sections;
}

export async function enroll(studentId, sectionId) {
  const response = await api.post("/enrollments", { studentId, sectionId });
  return response.data;
}
