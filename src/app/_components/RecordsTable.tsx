import { Card, CardHeader, Image } from "@heroui/react"
import { useRouter } from "next/navigation";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@heroui/react"
export default function RecordsTable({ records }) {
    const router = useRouter();
    return (
        <div>
            <Card className="h-50h">
              <Table isStriped className="dark">
                <TableHeader>
                    <TableColumn>ACCOUNT</TableColumn>
                    <TableColumn>TIME</TableColumn>
                    <TableColumn>TIME ACHIEVED</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No rows to display."}>
                    {records.map((records) => (
                        <TableRow key={records.mapRecordId}>
                            <TableCell>
                                {records.accountId}
                            </TableCell>
                            <TableCell>
                                {records.score}
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