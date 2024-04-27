import Condition from "../models/Condition";

async function getConditions() {
  try {
    const conditions = await Condition.find();
    return conditions;
  } catch (error) {
    throw error;
  }
}

export default {
  getConditions,
};
