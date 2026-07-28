export const checkModelValidity = (schemaData) => {
    let errors = [];
    let warnings = [];
  
    // 1. Check if stories exist
    if (!schemaData.stories || schemaData.stories.length === 0) {
      errors.push("Model has no stories defined.");
    }
  
    // 2. Check for missing supports
    if (!schemaData.supports || schemaData.supports.length === 0) {
      errors.push("Structure is unstable: No base supports assigned.");
    }
  
    // 3. Check for zero-length elements (Dummy logic for now)
    schemaData.elements?.beams?.forEach(beam => {
      if (beam.startNode === beam.endNode) {
        errors.push(`Beam ${beam.id} has zero length (Start and End nodes are the same).`);
      }
    });
  
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  };
