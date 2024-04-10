import mongoose from "mongoose";

export async function populateField(
  fieldName: string,
  collectionName: string,
  documents: any[],
  model: mongoose.Model<any>
) {
  const populatedFields = await model.aggregate([
    {
      $match: {
        [fieldName]: { $in: documents.map((doc) => doc[fieldName]) },
      },
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

  const populatedDocuments = populatedFields.map((field) => field[fieldName]);
  return populatedDocuments;
}

export async function populateFieldObj(
  fieldName: string,
  collectionName: string,
  unwind: string,
  documents: any[],
  model: mongoose.Model<any>
) {
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
            stock: { $push: `$${unwind}` },
          },
        },
      ]);

      return populatedDoc[0];
    })
  );

  return populatedFields;
}
