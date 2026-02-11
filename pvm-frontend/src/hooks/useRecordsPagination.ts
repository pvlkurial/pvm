// hooks/useRecordsPagination.ts
import { useState, useMemo } from 'react';
import { Record } from '@/types/mappack.types';

export function useRecordsPagination(records: Record[], itemsPerPage: number = 20) {
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<{
    column: string;
    direction: 'ascending' | 'descending';
  }>({
    column: 'score',
    direction: 'ascending', // Lower time is better
  });

  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => {
      let first: any = a[sortDescriptor.column as keyof Record];
      let second: any = b[sortDescriptor.column as keyof Record];

      // Handle nested player.name
      if (sortDescriptor.column === 'playerName') {
        first = a.player.name;
        second = b.player.name;
      }

      // For numeric values, compare directly
      if (typeof first === 'number' && typeof second === 'number') {
        const cmp = first < second ? -1 : first > second ? 1 : 0;
        return sortDescriptor.direction === 'descending' ? cmp * -1 : cmp;
      }

      // For strings, compare with fallback
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

  return {
    page,
    pages,
    setPage,
    sortDescriptor,
    setSortDescriptor,
    paginatedRecords,
    totalRecords: records.length,
  };
}