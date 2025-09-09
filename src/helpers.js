import { diceCoefficient as dice } from 'dice-coefficient';

/**
 * Analyze reject reason string and categorize into document types
 * @param {string} reason
 * @returns {{registrationDoc: boolean, vehicleDoc: boolean, idCardDoc: boolean}}
 */
export function analyzeRejectReason(reason) {
  const result = {
    registrationDoc: false,
    vehicleDoc: false,
    idCardDoc: false,
  };

  if (!reason || typeof reason !== 'string') {
    return result;
  }

  const lower = reason.toLowerCase();

  // Patterns for Registration Documents (e.g., STNK, certificate, permit)
  const patternsRegistration = [
    'registration certificate not valid',
    'invalid registration document',
    'photo of registration document',
    'edited registration document',
    'scan of registration document',
    'mismatched registration data',
  ];

  // Patterns for Vehicle related photos
  const patternsVehicle = [
    'vehicle photo not valid',
    'vehicle does not match',
    'front view vehicle photo',
    'side view vehicle photo',
    'license plate number mismatch',
    'vehicle color mismatch',
    'vehicle wheel count mismatch',
    'vehicle photo already registered',
    'different vehicle photo',
  ];

  // Patterns for ID Card related issues
  const patternsIdCard = [
    'id card not valid',
    'photo of id card',
    'id card does not match',
    'id card expired',
    'id card scan not clear',
    'id card already used',
  ];

  const threshold = 0.6;

  // Check Registration Document patterns
  for (const pattern of patternsRegistration) {
    const score = dice(lower, pattern);
    if (score >= threshold || lower.includes(pattern)) {
      result.registrationDoc = true;
      break;
    }
  }

  // Check Vehicle patterns
  for (const pattern of patternsVehicle) {
    const score = dice(lower, pattern);
    if (score >= threshold || lower.includes(pattern)) {
      result.vehicleDoc = true;
      break;
    }
  }

  // Check ID Card patterns
  for (const pattern of patternsIdCard) {
    const score = dice(lower, pattern);
    if (score >= threshold || lower.includes(pattern)) {
      result.idCardDoc = true;
      break;
    }
  }

  return result;
}

/**
 * Get global conclusion from multiple reject reasons
 * @param {string[]} reasons
 * @returns {{registrationDoc: boolean, vehicleDoc: boolean, idCardDoc: boolean}}
 */
export function getRejectReasonConclusion(reasons = []) {
  return reasons.reduce(
    (acc, reason) => {
      const { registrationDoc, vehicleDoc, idCardDoc } =
        analyzeRejectReason(reason);
      return {
        registrationDoc: acc.registrationDoc || registrationDoc,
        vehicleDoc: acc.vehicleDoc || vehicleDoc,
        idCardDoc: acc.idCardDoc || idCardDoc,
      };
    },
    { registrationDoc: false, vehicleDoc: false, idCardDoc: false }
  );
}
