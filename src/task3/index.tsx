import type { ProColumns } from "@ant-design/pro-components";
import {
  Button,
  Card,
  Flex,
  notification as antdNotification,
  Typography,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";

export interface IResponse {
  token: string;
  data: number[];
  query: {
    type: string;
    range: number[];
  }[];
}

const TaskThreePage = () => {
  const [result, setResult] = useState<number[]>([]);
  const [token, setToken] = useState<string>();
  const [data, setData] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPostLoading, setIsPostLoading] = useState<boolean>(false);
  const [notification, notificationContext] =
    antdNotification.useNotification();

  const navigate = useNavigate();

  const onGetInputData = async () => {
    try {
      const response = await axios.get<IResponse>("/api/api/intern-test/input");

      setToken(response.data.token);
      await onCalculatingAlgorithms(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const onCalculatingAlgorithms = async (input: IResponse) => {
    setIsLoading(true);
    const { data, query } = input;

    const prefixSum = new Array(data.length + 1).fill(0);
    const evenPrefixSum = new Array(data.length + 1).fill(0);
    const oddPrefixSum = new Array(data.length + 1).fill(0);

    data.forEach((item, index) => {
      prefixSum[index + 1] = prefixSum[index] + item;

      if (index % 2 === 0) {
        evenPrefixSum[index + 1] = evenPrefixSum[index] + item;
        oddPrefixSum[index + 1] = oddPrefixSum[index];
      } else {
        evenPrefixSum[index + 1] = evenPrefixSum[index];
        oddPrefixSum[index + 1] = oddPrefixSum[index] + item;
      }
    });

    const results = query.map(({ type, range }) => {
      const [l, r] = range;
      if (type === "1") {
        return prefixSum[r + 1] - prefixSum[l];
      } else {
        return (
          evenPrefixSum[r + 1] -
          evenPrefixSum[l] -
          (oddPrefixSum[r] - oddPrefixSum[l])
        );
      }
    });

    setResult(results);

    const convertData = input.query.map((item, index) => ({
      id: index + 1,
      query: item,
      data: input.data.slice(item.range[0], item.range[1] + 1),
      result: result[index],
    }));

    setData(convertData);

    setIsLoading(false);
  };

  const onPostInputData = async () => {
    try {
      setIsPostLoading(true);
      await axios.post("/api/api/intern-test/output", result, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      notification.success({
        description: "Gửi đi thành công!",
        message: "Thành công",
      });
    } catch (error) {
      console.log(error);
    }
    setIsPostLoading(false);
  };

  useEffect(() => {
    onGetInputData();
  }, []);

  const columns: ProColumns[] = [
    {
      title: "STT",
      dataIndex: "id",
      onCell: (record) => ({
        rowSpan: record?.rowSpan,
      }),
      width: "5%",
    },
    {
      title: "Query",
      dataIndex: "query",

      children: [
        {
          render: (_value, record) => record.query.range[0],
          onCell: (record) => ({
            rowSpan: record?.rowSpan,
          }),
          title: "Bắt đầu",
          align: "center",
        },
        {
          title: "Kết thúc",
          align: "center",
          render: (_value, record) => record.query.range[1],
          onCell: (record) => ({
            rowSpan: record?.rowSpan,
          }),
        },
      ],
    },
    {
      title: "Data",
      align: "center",
      children: [
        {
          title: "Giá trị",
          align: "center",
          dataIndex: "data",
        },
      ],
    },
    {
      title: "Kết quả",
      dataIndex: "result",
      onCell: (record) => ({
        rowSpan: record?.rowSpan,
      }),
      width: "20%",
    },
  ];

  console.log(data);

  return (
    <div className="w-full h-full flex justify-center items-center px-16 py-8 overflow-hidden bg-[#FEFEFF]">
      {notificationContext}
      <Card
        style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
        styles={{
          header: { height: 100 },
          body: {
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          },
        }}
        title={
          <Flex vertical align="start" justify="center">
            <Button
              onClick={() => navigate("/")}
              className="p-0"
              icon={<ArrowLeftOutlined />}
              type="link"
            >
              Đóng
            </Button>
            <Typography.Title style={{ fontWeight: "bold" }} level={3}>
              Gửi đi kết quả truy vấn
            </Typography.Title>
          </Flex>
        }
        extra={
          <Button
            disabled={isLoading}
            loading={isPostLoading}
            onClick={async () => {
              await onPostInputData();
            }}
            type="primary"
          >
            Gửi kết quả
          </Button>
        }
      >
        <ProTable
          options={{
            search: false,
            setting: false,
            density: false,
            reload: false,
          }}
          loading={isLoading}
          bordered={true}
          pagination={false}
          scroll={{ y: "calc(100vh - 320px)" }}
          search={false}
          columns={columns}
          dataSource={data?.flatMap((item: any) =>
            item.data.map((it: any, index: number) => ({
              ...item,
              data: it,
              rowSpan: index === 0 ? item.data.length : 0,
            }))
          )}
        />
      </Card>
    </div>
  );
};

export default TaskThreePage;
