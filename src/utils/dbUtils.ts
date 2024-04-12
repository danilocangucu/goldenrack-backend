import mongoose from "mongoose";

interface PopulateFieldOptions {
  fieldName: string;
  unwind?: string;
  extraMatch?: string;
}

export async function populateField(
  options: PopulateFieldOptions,
  documents: any[],
  model: mongoose.Model<any>
) {
  const { fieldName, unwind, extraMatch } = options;

  if (unwind) {
    return populateWithUnwind(fieldName, unwind, documents, model);
  } else {
    return populateWithoutUnwind(fieldName, documents, model, extraMatch);
  }
}

async function populateWithUnwind(
  fieldName: string,
  unwind: string,
  documents: any[],
  model: mongoose.Model<any>
) {
  const collectionName = fieldName + "s";
  const populatedFields = await Promise.all(
    documents.map(async (doc) => {
      const populatedDoc = await model.aggregate([
        {
          $match: {
            _id: doc._id,
          },
        },
        {
          $unwind: `$${unwind}`,
        },
        {
          $lookup: {
            from: collectionName,
            localField: `${unwind}.${fieldName}`,
            foreignField: "_id",
            as: `${fieldName}Data`,
          },
        },
        {
          $addFields: {
            [`${unwind}.${fieldName}`]: {
              $arrayElemAt: [`$${fieldName}Data`, 0],
            },
          },
        },
        {
          $group: {
            _id: "$_id",
            [unwind]: { $push: `$${unwind}` },
          },
        },
      ]);

      const populatedField = populatedDoc[0][unwind].map(
        (field: any) => field[`${fieldName}`]
      );

      return populatedField;
    })
  );
  return populatedFields;
}

async function populateWithoutUnwind(
  fieldName: string,
  documents: any[],
  model: mongoose.Model<any>,
  extraMatch?: string
) {
  const collectionName = fieldName + "s";

  const matchCriteria = {
    [fieldName]: { $in: documents.map((doc) => doc[fieldName]) },
  };

  if (extraMatch) {
    matchCriteria[extraMatch] = {
      $in: documents.map((doc) => doc[extraMatch]),
    };
  }

  const populatedFields = await model.aggregate([
    {
      $match: matchCriteria,
    },
    {
      $lookup: {
        from: collectionName,
        localField: fieldName,
        foreignField: "_id",
        as: `${fieldName}Data`,
      },
    },
    {
      $addFields: {
        [fieldName]: { $arrayElemAt: [`$${fieldName}Data`, 0] },
      },
    },
    {
      $project: {
        [`${fieldName}Data`]: 0,
      },
    },
  ]);

  const populatedDocuments = populatedFields.map(
    (field: any) => field[fieldName]
  );

  return populatedDocuments;
}