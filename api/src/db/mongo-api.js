// api\src\db\mongo-api.js

import { async } from 'q';
import mongoClient from './mongo-client';

const mongoApiWrapper = async () => {
  const { mdb } = await mongoClient();

  const mdbFindDocumentsByField = ({
    collectionName,
    fieldName,
    fieldValues,
  }) =>
    mdb
      .collection(collectionName)
      //   here, we only get those documents whose fields are in the values that we provide
      .find({ [fieldName]: { $in: fieldValues } })
      //   we use an array here, because I guess, data loader requires data to be an array?
      .toArray();

  //   now we return methods - batch loading functions
  return {
    mutators: {},
    detailList: async (approachIds) => {
      const mongoDocuments = await mdbFindDocumentsByField({
        collectionName: 'approachDetails',
        fieldName: 'pgId',
        fieldValues: approachIds,
      });

      return approachIds.map((approachId) => {
        //   this part will make sure that the order is the same as the order in which ids came in - needed for data loader
        const approachDoc = mongoDocuments.find(
          (doc) => approachId === doc.pgId
        );

        if (!approachDoc) {
          return [];
        }
        // note how it is fine to destructure after check if value exists
        const { explanations, notes, warnings } = approachDoc;

        const approachDetails = [];

        if (explanations) {
          approachDetails.push(
            // and now we create another array of objects
            // and then we destrucvture it
            // nice techique
            ...explanations.map((explanationText) => ({
              content: explanationText,
              category: 'EXPLANATION',
            }))
          );
        }

        if (notes) {
          approachDetails.push(
            ...notes.map((noteText) => ({
              content: noteText,
              category: 'NOTE',
            }))
          );
        }

        if (warnings) {
          approachDetails.push(
            ...warnings.map((warningText) => ({
              content: warningText,
              category: 'WARNING',
            }))
          );
        }

        return approachDetails;

        // something needs to be returned from here
      });
    },
  };
};

export default mongoApiWrapper;
