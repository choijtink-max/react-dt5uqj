import React, { useMemo, useState, useCallback } from 'react';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { VirtualScrollFixed } from '@progress/kendo-react-grid/dist/npm/VirtualScrollFixed';
import { VirtualScroll } from '@progress/kendo-react-grid/dist/npm/VirtualScroll';
import { isFunction, size } from 'lodash';

// VirtualScrollFixed.prototype.reset = function () {
//   const { attendedSkip, propsSkip, realSkip, pageSize } = this;
//   const data = { attendedSkip, propsSkip, realSkip, pageSize };
//   console.log('[VirtualScrollFixed.reset] called', this);
// };

// VirtualScroll.prototype.reset = function () {
//   console.log('[VirtualScroll.reset] called', this);
// };

const GridControl = ({
  data,
  fetchNextPage,
  hasNext,
  maxItems,
  pageSize,
  selectRow,
  selectedField,
  skipped,
  isConfiguredLikeBizzstream,
}) => {
  const [skip, setSkip] = useState(0);

  const total = hasNext ? skipped + pageSize : skipped;

  const onPageChange = useCallback(
    (event) => {
      console.log('[onPageChange] called', event.page);
      const { skip: newSkip } = event.page;
      const numberToFetchNextPage = skipped - pageSize;

      if (newSkip >= numberToFetchNextPage && hasNext) {
        setSkip(newSkip);

        if (isFunction(fetchNextPage)) {
          fetchNextPage(newSkip, skipped);
        }
      } else {
        setSkip(newSkip);
      }
    },
    [data, fetchNextPage, hasNext, pageSize, skipped]
  );

  const columns = useMemo(
    () => [
      <Column field="id" title="ID" width="150px" />,
      <Column field="firstName" title="First Name" />,
      <Column field="lastName" title="Last Name" />,
      <Column field="city" title="City" width="120px" />,
      <Column field="title" title="Title" width="200px" />,
    ],
    []
  );

  const props = {
    style: { height: '440px' },
    rowHeight: 50,
    pageSize,
    scrollable: 'virtual',
    onPageChange,
    dataItemKey: 'id',
    selectedField,
    onRowClick: selectRow,
  };

  if (isConfiguredLikeBizzstream) {
    /**
     * When configured like this, it seems that the absoluteIndex gets incorrectly set.
     * It will constantly show the first items and when you inspect them you can see that
     * the dataIndex property has the correct value, but the value for the properties
     * absoluteIndex and ariaRowIndex are incorrect. They have a way higher value.
     * The value it has looks like the dataIndex plus the skip value.
     *
     * In the following situation you have the following state.
     *
     * Grid
     *  - skip: 144
     *  - pageSize: 25
     *  - total: 200
     *
     * GridRow [row 160]
     *  - dataIndex: 159
     *  - absoluteRowIndex: 303
     *  - ariaRowIndex: 305
     *
     * GridRow [row 175]
     *  - dataIndex: 174
     *  - absoluteRowIndex: 318
     *  - ariaRowIndex: 320
     */
    return (
      <Grid
        {...props}
        //
        skip={skip}
        data={data}
        fixedScroll={false}
      >
        {columns}
      </Grid>
    );
  }

  return (
    <Grid
      {...props}
      data={data.slice(skip, skip + pageSize)}
      fixedScroll={false}
      total={total}
    >
      {columns}
    </Grid>
  );
};

export default GridControl;
