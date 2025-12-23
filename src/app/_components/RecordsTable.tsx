import { Card, CardHeader, Image } from "@heroui/react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { toTimeFromMilliseconds } from "../_utils/converters";
import { useAsyncList } from "@react-stately/data";

export default function RecordsTable({ records }) {
  const list = useAsyncList({
    async load() {
      return {
        items: records,
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          let first = a[sortDescriptor.column];
          let second = b[sortDescriptor.column];
          let cmp =
            (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }

          return cmp;
        }),
      };
    },
  });
  const router = useRouter();
  return (
    <div>
      <Card className="h-50h dark">
        <Table
          isStriped
          removeWrapper
          className="dark"
          sortDescriptor={list.sortDescriptor}
          onSortChange={list.sort}
        >
          <TableHeader className="dark">
            <TableColumn key="position" allowsSorting align="center">
              #
            </TableColumn>
            <TableColumn key="playerName" allowsSorting align="center">
              ACCOUNT
            </TableColumn>
            <TableColumn key="score" allowsSorting align="center">
              TIME
            </TableColumn>
            <TableColumn align="center">TIME ACHIEVED</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No rows to display."} className="dark">
            {list.items.map((record) => (
              <TableRow key={record.mapRecordId} className="dark ">
                <TableCell className="text-lg font-bold">
                  {record.position}
                </TableCell>
                <TableCell className="text-lg font-bold">
                  {record.player.name}
                </TableCell>
                <TableCell className="text-lg font-bold">
                  {toTimeFromMilliseconds(record.score)}
                </TableCell>
                <TableCell className="text-lg font-bold">NOT TRACKED</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
