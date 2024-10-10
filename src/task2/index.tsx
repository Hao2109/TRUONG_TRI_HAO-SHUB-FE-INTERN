import {
  Button,
  Card,
  DatePicker,
  Flex,
  Form,
  Input,
  Select,
  Typography,
  notification as antdNotification,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import "./style.css";
import { useState } from "react";
import React from "react";

const { Title } = Typography;
const TaskTwoPage = () => {
  const [form] = Form.useForm();

  const navigate = useNavigate();

  const [notification, notificationContext] =
    antdNotification.useNotification();

  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false);
  const values = Form.useWatch([], form);

  React.useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setIsDisabledButton(false))
      .catch(() => setIsDisabledButton(true));
  }, [form, values]);

  return (
    <div className="w-full h-full flex justify-center items-center">
      {notificationContext}
      <Card
        styles={{
          header: { height: 100 },
        }}
        className="w-[30%]"
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
            <Title style={{ fontWeight: "bold" }} level={3}>
              Nhập giao dịch
            </Title>
          </Flex>
        }
        extra={
          <Button
            disabled={isDisabledButton}
            onClick={async () => {
              notification.success({
                description: "Cập nhật thành công",
                message: "Thành công",
              });
            }}
            type="primary"
          >
            Cập nhật
          </Button>
        }
      >
        <Form
          form={form}
          layout="vertical"
          className="w-full flex flex-col gap-4"
          requiredMark={false}
          labelCol={{
            style: {
              paddingBottom: 0,
            },
          }}
          wrapperCol={{ span: 24 }}
        >
          <Form.Item
            className="border rounded-lg p-1 px-4 mb-0"
            required
            rules={[{ required: true, message: "Vui lòng nhập thời gian" }]}
            name="time"
            label={<div className="text-[13px] text-[#708090]">Thời gian</div>}
          >
            <DatePicker
              allowClear
              variant="borderless"
              className="w-full p-0"
              showTime
              format="DD/MM/YYYY HH:mm:ss"
              placeholder="Nhập thời gian"
            />
          </Form.Item>
          <Form.Item
            className="border rounded-lg p-1 px-4 mb-0"
            required
            rules={[
              { required: true, message: "Vui lòng nhập số lượng" },
              {
                pattern: /^\d+(\.\d+)?$/,
                message: "Vui lòng nhập số lượng là một số thực hợp lệ",
              },
            ]}
            name="quantity"
            label={<div className="text-[13px] text-[#708090]">Số lượng</div>}
          >
            <Input
              allowClear
              variant="borderless"
              className="w-full p-0"
              placeholder="Nhập số lượng"
            />
          </Form.Item>
          <Form.Item
            className="border rounded-lg p-1 px-4 mb-0"
            required
            rules={[{ required: true, message: "Vui lòng chọn trụ" }]}
            name="order"
            label={<div className="text-[13px] text-[#708090]">Trụ</div>}
          >
            <Select
              allowClear
              variant="borderless"
              style={{ padding: 0 }}
              className="w-full pb-0"
              options={[
                { label: "một", value: 1 },
                { label: "hai", value: 2 },
                { label: "ba", value: 3 },
              ]}
              placeholder="Chọn trụ"
            />
          </Form.Item>
          <Form.Item
            className="border rounded-lg p-1 px-4 mb-0"
            required
            rules={[
              { required: true, message: "Vui lòng nhập doanh thu" },
              { pattern: /^\d+$/, message: "Vui lòng nhập số nguyên hợp lệ" },
            ]}
            name="price"
            label={<div className="text-[13px] text-[#708090]">Doanh thu</div>}
          >
            <Input
              allowClear
              variant="borderless"
              className="w-full p-0"
              placeholder="Nhập doanh thu"
            />
          </Form.Item>
          <Form.Item
            className="border rounded-lg p-1 px-4 mb-0"
            required
            rules={[
              { required: true, message: "Vui lòng nhập đơn giá" },
              { pattern: /^\d+$/, message: "Vui lòng nhập số nguyên hợp lệ" },
            ]}
            name="unit"
            label={<div className="text-[13px] text-[#708090]">Đơn giá</div>}
          >
            <Input
              allowClear
              variant="borderless"
              className="w-full p-0"
              placeholder="Nhập đơn giá"
            />
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default TaskTwoPage;
