import {
  mapMealToFormData,
  mapStayToFormData,
  mapTransitToFormData,
  mapActivityToFormData,
  mapDayDescriptionToFormData,
} from "@/lib/services/organizer/trip/library/common/formDataMappers";

export function useHandleSave({
  organizationId,
  mutations,
  onClose,
}: {
  organizationId: string;
  mutations: {
    create: Record<string, any>;
    update: Record<string, any>;
  };
  onClose: () => void;
}) {
  return async function handleSave(stepKey: string, data: any, documents?: any[]) {
    try {
      let fd: FormData;
      switch (stepKey) {
        case "event":
          fd = mapDayDescriptionToFormData(data, documents);
          break;
        case "stay":
          fd = mapStayToFormData(data, documents);
          break;
        case "transit":
          fd = mapTransitToFormData(data, documents);
          break;
        case "meal":
          fd = mapMealToFormData(data, documents);
          break;
        case "activity":
          fd = mapActivityToFormData(data, documents);
          break;
        default:
          throw new Error(`Unknown step: ${stepKey}`);
      }

      const mutation =
        data.id || data.updateId
          ? mutations.update[stepKey]
          : mutations.create[stepKey];

      await mutation(fd);
      onClose();
    } catch (err) {
      console.error("Failed to save", stepKey, err);
      alert("Failed to save. See console for details.");
    }
  };
}
