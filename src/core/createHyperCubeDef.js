export const createHyperCubeDef = ({ fields, type }) => {
  const qDimensions = fields?.map((field) => ({
    qDef: {
      qFieldDefs: [field],
      qSortCriterias: [
        {
          qSortByLoadOrder: 1,
          qSortByNumeric: 1,
          qSortByAscii: 1,
        },
      ],
    },
    qOtherTotalSpec: {},
    qAttributeExpressions: [],
    qAttributeDimensions: [],
  }));

  return {
    qInfo: {
      qType: type,
    },
    visualization: type,
    showTitles: true,
    qHyperCubeDef: {
      qDimensions,
      qMeasures: [],
      qInterColumnSortOrder: [0, 1],
      qInitialDataFetch: [],
      qColumnOrder: [],
      qExpansionState: [],
    },
  };
};
