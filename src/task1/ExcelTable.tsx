import type { TableProps } from "antd";
import { Button, Card, DatePicker, Flex, Table, Tag } from "antd";
import { useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";

import "./index.css";
import { useNavigate } from "react-router-dom";

interface IRow {
  [key: string]: any;
}
interface IProps {
  excelFile: IRow[];
  sheetName: string[];
}
const { RangePicker } = DatePicker;

const ExcelTable = ({ excelFile, sheetName = [] }: IProps) => {
  const [timeRange, setTimeRange] = useState<any>();
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const navigate = useNavigate();
  const columns: TableProps["columns"] = [
    {
      title: "STT",
      dataIndex: "id",
    },
    ...sheetName.map((name) => ({
      title: name,
      dataIndex: `${name}`,
    })),
  ];

  const parseTime = (timeString: string) => {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const onCountTotalAmount = () => {
    try {
      const startTimeInSeconds = parseTime(timeRange[0]);
      const endTimeInSeconds = parseTime(timeRange[1]);

      const total = excelFile.reduce((sum, row) => {
        const rowTimeInSeconds = parseTime(row.Giờ);
        const amount = row["Thành tiền (VNĐ)"] || 0;

        if (
          rowTimeInSeconds < startTimeInSeconds ||
          rowTimeInSeconds > endTimeInSeconds
        ) {
          return sum;
        }

        return sum + amount;
      }, 0);

      setTotalAmount(total);
      return null;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden gap-4 px-16 py-8 bg-[#FEFEFF]">
      <Button
        onClick={() => navigate("/")}
        className="p-0 self-start"
        icon={<ArrowLeftOutlined />}
        type="link"
      >
        Đóng
      </Button>
      <Card
        styles={{
          body: {
            display: "flex",
            justifyContent: "space-between",
          },
        }}
        style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
      >
        <Flex gap={8}>
          <RangePicker
            className="w-full"
            picker="time"
            onChange={(_dates, dateStrings) => setTimeRange(dateStrings)}
          />
          <Button onClick={onCountTotalAmount} type="primary">
            Tính tiền
          </Button>
        </Flex>

        <Tag
          bordered={false}
          color="blue"
          className="flex justify-center items-center px-4 font-bold text-md"
        >{`Tổng số tiền cần tính: ${totalAmount ? totalAmount : 0}`}</Tag>
      </Card>

      <Card
        style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
        className="flex-1 w-full h-full overflow-hidden"
        styles={{
          body: { flex: 1, width: "100%", height: "100%", overflow: "hidden" },
        }}
      >
        <Table
          scroll={{ y: "calc(100vh - 440px)" }}
          className="flex-1"
          columns={columns}
          dataSource={excelFile}
        />
      </Card>
    </div>
  );
};

export default ExcelTable;
