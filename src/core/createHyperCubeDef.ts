export const createHyperCubeDef = ({fields, measures, type}: any) => {
  const qDimensions = fields?.map((field: any) => ({
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

  let qMeasures = [];
  if (measures) {
    qMeasures = measures.map((measure: string) => {
      return {
        qDef: {qDef: measure, autoSort: false},
        qSortBy: {qSortByNumeric: -1},
      };
    });
  }

  return {
    qInfo: {
      qType: type,
    },
    visualization: type,
    showTitles: true,
    qHyperCubeDef: {
      qDimensions,
      qMeasures,
      qInterColumnSortOrder: [0, 1],
      qInitialDataFetch: [
        {
          qTop: 0,
          qLeft: 0,
          qWidth: 100,
          qHeight: 100,
        },
      ],
      qColumnOrder: [],
      qExpansionState: [],
    },
  };
};
