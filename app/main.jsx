import * as React from 'react';
import { useState, useCallback, useMemo } from 'react';
import DataCreator from './DataCreator';
import * as ReactDOM from 'react-dom';
import Grid from './Grid';
import { slice, size } from 'lodash';

const pageSize = 25;

function skipFetchNextPage(skip, pageSize, data) {
  return skip + pageSize < size(data);
}

function getSelected(item, dataItem) {
  if (item.id !== dataItem.id) {
    return false;
  }
  return !Boolean(item[selectedField] === true);
}

const MAX_ITEMS = 1000;
const selectedField = '_selectedField';

const App = () => {
  const DATA = useMemo(() => DataCreator.createRandomData(MAX_ITEMS), []);
  const [data, setData] = useState(DATA.slice(0, pageSize));
  const skipped = size(data);
  const hasNext = skipped < MAX_ITEMS;

  const fetchNextPage = useCallback(
    (skip, currentData) => {
      const total = size(currentData);
      const props = { skip, pageSize, total };
      console.log('[fetchNextPage] called', props);
      if (!skipFetchNextPage(skip, pageSize, currentData)) {
        // const newData = DataCreator.createRandomDat77a(pageSize, skipped);
        const newData = slice(DATA, total + 1, pageSize);
        setData([...currentData, ...newData]);
        console.log('[fetchNextPage] new', { data, newData });
      }
    },
    [DATA]
  );

  const selectRow = useCallback(
    ({ dataItem }) => {
      // const { index, [selectedField]: isSelected = false } = dataItem;
      // data[index][selectedField] = !isSelected;
      const newData = data.map((item) => {
        const isSelected = getSelected(item, dataItem);
        return { ...item, [selectedField]: isSelected };
      });
      setData(newData);
    },
    [data]
  );

  return (
    <Grid
      data={data}
      fetchNextPage={fetchNextPage}
      hasNext={hasNext}
      pageSize={pageSize}
      maxItems={MAX_ITEMS}
      selectRow={selectRow}
      selectedField={selectedField}
      skipped={skipped}
      isConfiguredLikeBizzstream={true}
    />
  );
};

ReactDOM.render(<App />, document.querySelector('my-app'));
