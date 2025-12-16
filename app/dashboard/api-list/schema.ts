import * as yup from "yup";

export const apiSchema = yup.object({
  name: yup.string().required("Name is required"),
  method: yup
    .string()
    .oneOf(["GET", "POST", "PUT", "DELETE", "PATCH"])
    .required("Method is required"),
  path: yup.string().required("Path is required"),
  version: yup.string().required("Version is required"),
  status: yup
    .string()
    .oneOf(["healthy", "degraded", "down"])
    .required("Status is required"),
  requests: yup
    .number()
    .typeError("Requests must be a number")
    .min(0, "Requests cannot be negative")
    .required("Requests is required"),
  errorRatePercent: yup
    .number()
    .typeError("Error % must be a number")
    .min(0, "Error % cannot be negative")
    .max(100, "Error % cannot exceed 100")
    .required("Error % is required"),
  p95LatencyMs: yup
    .number()
    .typeError("Latency must be a number")
    .min(0, "Latency cannot be negative")
    .required("Latency is required"),
  ownerTeam: yup.string().required("Owner team is required"),
  id: yup.string().nullable(),
});
