import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function TokenTransactionHistory() {
  // Mock transaction data
  const transactions = [
    {
      id: "tx1",
      type: "Transfer",
      from: "0x7a86...3e21",
      to: "0x3f12...9b54",
      amount: "1,000",
      timestamp: "2 hours ago",
    },
    {
      id: "tx2",
      type: "Mint",
      from: "0x0000...0000",
      to: "0x7a86...3e21",
      amount: "5,000",
      timestamp: "1 day ago",
    },
    {
      id: "tx3",
      type: "Transfer",
      from: "0x3f12...9b54",
      to: "0x9d45...7c32",
      amount: "250",
      timestamp: "2 days ago",
    },
    {
      id: "tx4",
      type: "Burn",
      from: "0x7a86...3e21",
      to: "0x0000...0000",
      amount: "100",
      timestamp: "3 days ago",
    },
    {
      id: "tx5",
      type: "Transfer",
      from: "0x2b67...4f19",
      to: "0x8c23...1a76",
      amount: "750",
      timestamp: "5 days ago",
    },
  ]

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="text-right">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell>
                <Badge variant={tx.type === "Transfer" ? "outline" : tx.type === "Mint" ? "secondary" : "destructive"}>
                  {tx.type}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-xs">{tx.from}</TableCell>
              <TableCell className="font-mono text-xs">{tx.to}</TableCell>
              <TableCell>{tx.amount}</TableCell>
              <TableCell className="text-right text-muted-foreground">{tx.timestamp}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

