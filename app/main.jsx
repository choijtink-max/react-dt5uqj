import * as React from 'react';
import { useEffect, useState, useCallback, useMemo } from 'react';
import DataCreator from './DataCreator';
import * as ReactDOM from 'react-dom';
import Grid from './Grid';
import { slice, size } from 'lodash';

const MAX_ITEMS = 1000;
const selectedField = '_selectedField';

const DATA = DataCreator.createRandomData(MAX_ITEMS);
const pageSize = 25;

function skipFetchNextPage(skip, pageSize, total) {
  return total > skip + pageSize;
}

function getSelected(item, dataItem) {
  if (item.id !== dataItem.id) {
    return false;
  }
  return !Boolean(item[selectedField] === true);
}

function getData(from = 0, till = pageSize) {
  return DATA.slice(from, from + till);
}

const App = () => {
  // const DATA = useMemo(() => DataCreator.createRandomData(MAX_ITEMS), []);
  const [data, setData] = useState(getData());
  // const [data, setData] = useState(DataCreator.createRandomData(pageSize));
  const skipped = size(data);
  const hasNext = skipped < MAX_ITEMS;

  useEffect(() => {
    console.log('[useEffect] data changed', { data });
    console.log('-----------------------');
    console.log('- - - - - - - - - - - -');
    console.log('-----------------------');
    // console.log('- - - - - - - - - - - -');
    // console.log('-----------------------');
  }, [data]);

  const fetchNextPage = useCallback(
    (skip, total) => {
      const props = { skip, total };
      console.log('[fetchNextPage] called', props);
      if (!skipFetchNextPage(skip, pageSize, total)) {
        // const newData = DataCreator.createRandomData(pageSize, skipped);
        const newData = getData(total);
        setData((currentData) => [...currentData, ...newData]);
        console.log('[fetchNextPage] new', { newData });
      }
    },
    // []
    []
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
