import { Card, CardHeader, Image } from "@heroui/react"
import { useRouter } from "next/navigation";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@heroui/react"
import { toTimeFromMilliseconds } from "../_utils/converters";
export default function RecordsTable({ records }) {
    const router = useRouter();
    return (
        <div>
            <Card className="h-50h dark">
              <Table isStriped removeWrapper className="dark">
                <TableHeader className="dark">
                    <TableColumn>#</TableColumn>
                    <TableColumn>ACCOUNT</TableColumn>
                    <TableColumn>TIME</TableColumn>
                    <TableColumn>TIME ACHIEVED</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No rows to display."} className="dark">
                    {records.map((records) => (
                        <TableRow key={records.mapRecordId} className="dark">
                            <TableCell>
                                {records.position}
                            </TableCell>
                            <TableCell>
                                {records.accountId}
                            </TableCell>
                            <TableCell>
                                {toTimeFromMilliseconds(records.score)}
                            </TableCell>
                            <TableCell>
                                NOT TRACKED
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Card>
        </div>
    );
}