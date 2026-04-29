import api from './api';

const normalizeEnum = (value) => {
  if (!value) return null;
  return String(value).trim().toUpperCase().replace(/\s+/g, '_');
};

const mapEscalationRules = (rules = []) => {
  return rules.map((rule, index) => ({
    level: rule.level ?? index + 1,
    afterValue: Number(rule.afterValue ?? rule.after?.value ?? 0),
    afterUnit: normalizeEnum(rule.afterUnit ?? rule.after?.unit),
    escalateTo: rule.escalateTo ?? '',
    increasePriority: Boolean(rule.increasePriority),
  }));
};

const mapPolicyToBackend = (policyData) => ({
  name: policyData.name ?? '',
  department: policyData.department ?? '',
  priority: normalizeEnum(policyData.priority),
  status: normalizeEnum(policyData.status),
  responseTimeValue: Number(
    policyData.responseTimeValue ?? policyData.responseTime?.value ?? 0
  ),
  responseTimeUnit: normalizeEnum(
    policyData.responseTimeUnit ?? policyData.responseTime?.unit
  ),
  resolutionTimeValue: Number(
    policyData.resolutionTimeValue ?? policyData.resolutionTime?.value ?? 0
  ),
  resolutionTimeUnit: normalizeEnum(
    policyData.resolutionTimeUnit ?? policyData.resolutionTime?.unit
  ),
  escalationRules: mapEscalationRules(policyData.escalationRules),
});

export const getPolicies = async () => {
  const res = await api.get('/sla');
  return res.data;
};

export const getPolicyById = async (id) => {
  const res = await api.get(`/sla/${id}`);
  return res.data;
};

export const createPolicy = async (policyData) => {
  const res = await api.post('/sla', mapPolicyToBackend(policyData));
  return res.data;
};

export const updatePolicy = async (id, policyData) => {
  const res = await api.put(`/sla/${id}`, mapPolicyToBackend(policyData));
  return res.data;
};

export const deletePolicy = async (id) => {
  const res = await api.delete(`/sla/${id}`);
  return res.data;
};