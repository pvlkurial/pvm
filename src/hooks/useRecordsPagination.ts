import { useState, useMemo } from 'react';
import { Record } from '@/types/mappack.types';

export function useRecordsPagination(records: Record[], itemsPerPage: number = 10) {
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<{
    column: string;
    direction: 'ascending' | 'descending';
  }>({
    column: 'position',
    direction: 'ascending',
  });

  const sortedRecords = useMemo(() => {
    if (!records) return [];
    return [...records].sort((a, b) => {
      let first: any = a[sortDescriptor.column as keyof Record];
      let second: any = b[sortDescriptor.column as keyof Record];

      // Handle nested player.name
      if (sortDescriptor.column === 'playerName') {
        first = a.player.name;
        second = b.player.name;
      }

      const cmp = (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;
      return sortDescriptor.direction === 'descending' ? cmp * -1 : cmp;
    });
  }, [records, sortDescriptor]);

  const pages = Math.ceil(sortedRecords.length / itemsPerPage);

  const paginatedRecords = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return sortedRecords.slice(start, end);
  }, [sortedRecords, page, itemsPerPage]);
    
  const totalRecordsPre = records ? records.length : 0;

  return {
    page,
    pages,
    setPage,
    sortDescriptor,
    setSortDescriptor,
    paginatedRecords,
    totalRecords: totalRecordsPre
  };
}