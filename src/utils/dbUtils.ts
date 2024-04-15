import mongoose from "mongoose";

// TODO types in all functions

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

export function mapFields(
  mainData: any[][] | any[],
  relatedData: any[][],
  fieldName: string,
  nestedFieldName?: string
): any[][] {
  const idMap = new Map<string, any>();

  relatedData.forEach((item: any) => {
    if (Array.isArray(item)) {
      item.forEach((doc: any) => {
        idMap.set(doc._id.toString(), doc);
      });
    } else if (item && typeof item === "object") {
      idMap.set(item._id.toString(), item);
    }
  });

  if (Array.isArray(mainData[0])) {
    const mappedData = mainData.map((dataArray) => {
      return dataArray.map((data: any) => {
        return replaceField(data, fieldName, idMap);
      });
    });
    return mappedData;
  } else {
    const mappedData = mainData.map((data: any) => {
      return replaceField(data, fieldName, idMap, nestedFieldName);
    });
    return mappedData;
  }
}

function replaceField(
  data: any,
  fieldName: string,
  idMap: Map<string, any>,
  nestedFieldName?: string
): any {
  if (Array.isArray(data[fieldName]) && data[fieldName] && nestedFieldName) {
    const transformedField = data[fieldName].map((item: any) => {
      const nestedData = idMap.get(item[nestedFieldName].toString());
      return { ...item, [nestedFieldName]: nestedData };
    });
    return { ...data, [fieldName]: transformedField };
  }

  if (data[fieldName]) {
    let relatedDoc = idMap.get(data[fieldName].toString());
    relatedDoc = convertToPlainObject(relatedDoc);
    data = convertToPlainObject(data);

    return { ...data, [fieldName]: relatedDoc };
  }
  return data;
}

function convertToPlainObject(data: any): any {
  if (data instanceof mongoose.Document) {
    return data.toObject();
  }
  return data;
}